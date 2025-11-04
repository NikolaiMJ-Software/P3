import React from "react";
import { useState } from "react";
import WheelOfFortune from "../components/WheelOfFortune.jsx";

export default function WheelOfFortunePage() {
  const [entriesText, setEntriesText] = useState(
    "Pirates\nThe Squad\nGruppe 6"
  );

  const inputs = entriesText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleResult = (value, index) => {
    
  };
  const handleRemove = (index) => {
   setEntriesText(prev => {
     const current = prev.split("\n").map(s => s.trim()).filter(Boolean);
     const next = current.filter((_, i) => i !== index);
     return next.join("\n");
   });
  };

  return (
    <div className="p-6 flex items-center justify-center">
      <div className="flex gap-8 items-start">
        <WheelOfFortune inputs={inputs} size={516} onResult={handleResult} onRemove={handleRemove} />

        <div className="w-72">
          <div className="mb-2 text-sm text-gray-600">One entry per line</div>
          <textarea
            className="w-full h-72 p-3 rounded-lg border"
            value={entriesText}
            onChange={(e) => setEntriesText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}


