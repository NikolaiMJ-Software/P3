import React, { useState, useEffect } from "react";
import WheelOfFortune from "../components/WheelOfFortune.jsx";
import { useTranslation } from "react-i18next";
import {isAdmin} from "../services/adminService.jsx"
import {useNavigate, useParams} from "react-router-dom";

export default function WheelOfFortunePage({entries = []}) {
  const initialText = entries.length
    ? entries.join("\n")
    : "Pirates\nThe Squad\nGruppe 6";

  const [entriesText, setEntriesText] = useState(initialText);
  const {t} = useTranslation();

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

  // Shuffle button handler
  const handleShuffle = () => {
    const lines = entriesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    // Fisher–Yates shuffle
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }

    setEntriesText(lines.join("\n"));
  };

  //is admind functionality
  const [isAdminUser, setIsAdminUser] = useState(undefined);
  const {username} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
      async function checkAdmin() {
          const result = await isAdmin(username);
          setIsAdminUser(result);
      }
      checkAdmin();
  }, [username]);

  console.log(isAdminUser)

  if(isAdminUser === 1){
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex gap-8 items-start">
          <WheelOfFortune inputs={inputs} size={516} onResult={handleResult} onRemove={handleRemove} />

          <div className="w-72">
            <div className="mb-2 text-sm text-text-secondary">{t("one entry per line")}</div>
            <textarea
              className="w-full h-72 p-3 rounded-lg border"
              value={entriesText}
              onChange={(e) => setEntriesText(e.target.value)}
            />
            <button
              onClick={handleShuffle}
              className="btn-primary mt-3 w-full active:scale-95 transition-transform">
              {t("shuffle entries")}
            </button>
          </div>
        </div>
      </div>
    );
  } else if (isAdminUser === 0){
    return(navigate(`/${username}`))
  }
}


