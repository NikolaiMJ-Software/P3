import { useState } from "react";
import WheelOfFortune from "../components/WheelOfFortune.jsx";

export default function WheelOfFortunePage() {
  const [entriesText, setEntriesText] = useState(
    "Pirates\nThe Squad\n9/11 the movie\nGruppe 6"
  );

  const inputs = entriesText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleResult = (value, index) => {
    // do anything you want (toast/log/api)
    // console.log("Winner:", value, "index:", index);
  };

  return (
    <div className="p-6">
      <div className="flex gap-8 items-start">
        <WheelOfFortune inputs={inputs} size={380} onResult={handleResult} />

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


