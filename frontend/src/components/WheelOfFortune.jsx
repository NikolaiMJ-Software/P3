import { useEffect, useRef, useState } from "react";

export default function WheelOfFortune({ inputs = [], size = 380, onResult }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);

  const radius = size / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawWheel(ctx, radius, inputs);
  }, [inputs, size]);

  const spin = () => {
    if (spinning || inputs.length === 0) return;
    setSpinning(true);
    setWinner(null);

    const idx = Math.floor(Math.random() * inputs.length);
    const n = inputs.length;
    const arc = 360 / n;

    // pointer is on the RIGHT (0deg) → align chosen center to 0deg
    const targetCenter = idx * arc + arc / 2;
    const current = rotation % 360;
    let delta = (0 - targetCenter - current);
    delta = ((delta % 360) + 360) % 360;

    const total = 360 * 5 + delta;
    const duration = 3000;
    const start = performance.now();
    const startRot = rotation;

    const animate = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setRotation(startRot + total * eased);
      if (p < 1) requestAnimationFrame(animate);
      else {
        setSpinning(false);
        setWinner(inputs[idx]);
        onResult?.(inputs[idx], idx);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* pointer on the right, pointing left */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-4"
        style={{
          width: 0, height: 0,
          borderTop: "10px solid transparent",
          borderBottom: "10px solid transparent",
          borderRight: "18px solid #000",
        }}
      />

      <div
        className="relative rounded-full shadow"
        style={{
          width: size,
          height: size,
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "none" : "transform 0.1s linear",
        }}
      >
        <canvas ref={canvasRef} className="block" />

        <button
          onClick={spin}
          disabled={spinning || inputs.length === 0}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     w-20 h-20 rounded-full flex items-center justify-center
                     bg-white text-black font-semibold shadow-md border-2 border-gray-400
                     hover:bg-gray-100 active:scale-95 transition-transform"
        >
          SPIN
        </button>
      </div>

      {/* local winner readout (optional; page can also handle via onResult) */}
      <div className="text-center mt-4 min-h-6">
        {winner && <>Result: <span className="font-semibold">{winner}</span></>}
      </div>
    </div>
  );
}

function drawWheel(ctx, r, inputs) {
  ctx.clearRect(0, 0, r * 2, r * 2);

  // base circle
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#e5e7eb";
  ctx.stroke();

  if (!inputs.length) return;

  const n = inputs.length;
  const arc = (Math.PI * 2) / n;

  ctx.save();
  ctx.beginPath();
  ctx.arc(r, r, r - 1.5, 0, Math.PI * 2); // -1.5 to stay inside stroke
  ctx.clip();

  // separators
  if (n>1){
      ctx.save();
      ctx.translate(r, r);
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(r, 0);
        ctx.strokeStyle = "#cbd5e1";
        ctx.stroke();
        ctx.rotate(arc);
      }
      ctx.restore();
  }

  // labels
  ctx.save();
  ctx.translate(r, r);

  for (let i = 0; i < n; i++) {
    const angle = n === 1 ? 0 : i * arc + arc / 2;
    const labelRadius = r * 0.57;
    const maxWidth = n === 1 ? labelRadius * 1.6 : Math.sin(arc / 2) * labelRadius * 2 * 0.86;

    // how much space we have OUTWARD along the radius
    const rimPad = 6;// padding to wheel edge
    const radialMax = Math.max(0, r - labelRadius - rimPad);

    const { fontSize, lines } = fitTextMultiline(ctx, inputs[i], radialMax, {
      maxLines: 2,
      startSize: 16,
      minSize: 7,
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial",
      fontWeight: 600,
    });

    ctx.save();
    ctx.translate(Math.cos(angle) * labelRadius, Math.sin(angle) * labelRadius);
    ctx.rotate(angle);

    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const xPad = 2;
    const lineHeight = fontSize * 1.1;
    const totalH = lineHeight * (lines.length - 1);
    for (let li = 0; li < lines.length; li++) {
      const y = -totalH / 2 + li * lineHeight;
      ctx.fillText(lines[li], xPad, y);
    }
    ctx.restore();
  }

  ctx.restore();
  ctx.restore();
}


function fitTextMultiline(ctx, text, maxWidth, opts = {}) {
  const {
    maxLines = 2,
    startSize = 16,
    minSize = 10,
    fontFamily = "Arial",
    fontWeight = 600,
  } = opts;

  let size = startSize;
  let lines = [];

  while (size >= minSize) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    lines = wrapToWidth(ctx, text, maxWidth, maxLines);
    if (lines.length <= maxLines) break;
    size -= 1;
  }

  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines - 1).concat(
      ellipsizeToWidth(ctx, lines.slice(maxLines - 1).join(" "), maxWidth)
    );
  }

  return { fontSize: Math.max(size, minSize), lines };
}


function wrapToWidth(ctx, text, maxWidth, maxLines) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines = [];
  let line = words[0];

  if (ctx.measureText(line).width > maxWidth) {
    return [ellipsizeToWidth(ctx, line, maxWidth)];
  }

  for (let i = 1; i < words.length; i++) {
    const test = line + " " + words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = words[i];

      if (maxLines && lines.length === maxLines - 1) {
        lines.push(ellipsizeToWidth(ctx, words.slice(i).join(" "), maxWidth));
        return lines;
      }
    }
  }
  lines.push(line);
  return lines;
}

function ellipsizeToWidth(ctx, text, maxWidth) {
  const ellipsis = "…";
  if (ctx.measureText(text).width <= maxWidth) return text;
  let lo = 0, hi = text.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    const candidate = text.slice(0, mid) + ellipsis;
    if (ctx.measureText(candidate).width <= maxWidth) lo = mid; else hi = mid - 1;
  }
  return text.slice(0, lo) + ellipsis;
}
