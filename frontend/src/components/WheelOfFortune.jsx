import React from "react";
import { useEffect, useRef, useState } from "react";

//colors to be added red, yellow, blue, green, beige 

export default function WheelOfFortune({ inputs = [], size = 380, onResult, onRemove }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [winnerValue, setWinnerValue] = useState(null);
  const [krestensLaw, setKrestensLaw] = useState(null);
  const [krestensLawAt, setKrestensLawAt] = useState(0);

  const SLICE_COLORS = [
  "#f87171", // soft red
  "#fde68a", // muted yellow
  "#93c5fd", // light blue
  "#86efac", // soft green
  "#f5e6c8", // beige
  ];

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
    drawWheel(ctx, radius, inputs, SLICE_COLORS);
  }, [inputs, size]);

  const onCanvasClick = (e) => {
    if (spinning) return;
    if (!canvasRef.current || inputs.length === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();

    // vector from canvas center (in screen coords)
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const vx = e.clientX - cx;
    const vy = e.clientY - cy;

    // un-rotate by current CSS rotation so we’re back in "wheel drawing" space
    const rad = (- (rotation % 360)) * Math.PI / 180;
    const ux = vx * Math.cos(rad) - vy * Math.sin(rad);
    const uy = vx * Math.sin(rad) + vy * Math.cos(rad);

    // angle in our unrotated space (0° = right, clockwise)
    const angleDeg = (Math.atan2(uy, ux) * 180 / Math.PI + 360) % 360;

    const arcDeg = 360 / inputs.length;
    const idx = Math.floor((angleDeg + 1e-6) / arcDeg) % inputs.length; // epsilon avoids boundary ties

    setKrestensLaw(idx);
    setKrestensLawAt(performance.now());
    console.log("Primed rig index:", idx);
  };


  const RIG_WINDOW_MS = 1500;

  const spin = () => {
    if (spinning || inputs.length === 0) return;
    setSpinning(true);
    setWinner(null);
    setWinnerValue(null);

    // --- pick index (keeps Krestens law intact) ---
    let idx;
    const now = performance.now();
    if (
      krestensLaw != null &&
      now - krestensLawAt < RIG_WINDOW_MS &&
      krestensLaw >= 0 &&
      krestensLaw < inputs.length
    ) {
      idx = krestensLaw;
      setKrestensLaw(null);
      setKrestensLawAt(0);
    } else {
      idx = Math.floor(Math.random() * inputs.length);
    }

    const n = inputs.length;
    const arcDeg = 360 / n;

    // --- logarithmic spintid & turns (only affects timing/feel) ---
    const baseMs = 2400;        // base duration
    const durK   = 650;         // duration grows with log(n)
    const logn   = Math.log1p(n);
    const duration = baseMs + durK * logn;

    const minTurns = 4;
    const turnsK   = 1.2;       // rotations grow slightly with log(n)
    const fullTurns = Math.max(minTurns, Math.round(minTurns + turnsK * logn));

    // --- target angle math (unchanged) ---
    const sliceHalf = arcDeg / 2;
    const CENTER_MARGIN_DEG = Math.min(8, sliceHalf * 0.4); 
    const maxBias = Math.max(0, sliceHalf - CENTER_MARGIN_DEG);
    const biasDeg = (Math.random() * 2 - 1) * maxBias;

    const targetCenter = idx * arcDeg + sliceHalf + biasDeg; // degrees
    const current = rotation % 360;                    // degrees
    let delta = 0 - targetCenter - current;           // degrees
    delta = ((delta % 360) + 360) % 360;              // normalize to [0,360)

    const total = 360 * fullTurns + delta;            // degrees
    const start = performance.now();
    const startRot = rotation;

    // --- logarithmic ease-out curve ---
    const easeOutExpo = (p) => (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)); 

    const animate = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = easeOutExpo(p);
      setRotation(startRot + total * eased);
      if (p < 1) requestAnimationFrame(animate);
      else {
        setSpinning(false);
        setWinner(inputs[idx]);
        setWinnerValue(idx);
        onResult?.(inputs[idx], idx);
      }
    };

    requestAnimationFrame(animate);
  };


  const handleRemove = () => {
    if (winnerValue == null) return;
    onRemove?.(winnerValue, winner);       // <— tell parent to remove
    setWinner(null);
    setWinnerValue(null);
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
        <canvas ref={canvasRef} className="block" onClick={onCanvasClick} />

        <button
          type="button"
          onClick={spin}
          disabled={spinning || inputs.length === 0}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     w-20 h-20 rounded-full flex items-center justify-center
                     bg-white text-text-primary font-semibold shadow-md border-2 border-text-secondary
                     hover:bg-btn-hover-secondary active:scale-95 transition-transform cursor-pointer"
        >
          SPIN
        </button>
      </div>

      {/* local winner readout (optional; page can also handle via onResult) */}
      <div className="text-center mt-4 min-h-6 z-50 relative">
        {winner && <>Result: <span className="font-semibold">{winner}</span></>}
      </div>
      <div className = "text-center">
        {winnerValue != null &&(<button onClick={handleRemove} className="btn-primary mt-2 z-50 relative">Remove</button>)}
      </div>
    </div>
  );
}

function drawWheel(ctx, r, inputs, colors = []) {
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

  // colored slices
  ctx.save();
  ctx.translate(r, r);
  if (n === 1) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = colors[0] || "#ddd";
    ctx.fill();
  } else {
    for (let i = 0; i < n; i++) {
      const start = i * arc;
      const end = start + arc;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length] || "#ddd";
      ctx.fill();
    }
  }
  ctx.restore();

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

