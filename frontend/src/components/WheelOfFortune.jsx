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
    const arc = 360 / inputs.length;

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

  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#e5e7eb";
  ctx.stroke();

  if (!inputs.length) return;

  const arc = (Math.PI * 2) / inputs.length;

  // separators
  ctx.save();
  ctx.translate(r, r);
  for (let i = 0; i < inputs.length; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r, 0);
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();
    ctx.rotate(arc);
  }
  ctx.restore();

  // labels
  ctx.save();
  ctx.translate(r, r);
  for (let i = 0; i < inputs.length; i++) {
    const angle = i * arc + arc / 2;
    const x = Math.cos(angle) * (r * 0.72);
    const y = Math.sin(angle) * (r * 0.72);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = "#111827";
    ctx.font = "600 14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(inputs[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}
