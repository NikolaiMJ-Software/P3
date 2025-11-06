import { useState } from "react";
import React from "react";

export default function FAQPage() {
  return (
    <main className="px-4 sm:px-6 ">
      <div className="max-w-3xl ">
        <h1 className="text-3xl font-semibold">Regler</h1>
        <hr className="my-4" />

        <p className="mt-4">
          Til F-kult er der nogle regler.
        </p>

        <h2 className="mt-6 text-xl font-medium">Følgende er generelle regler:</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 leading-relaxed">
          <li>
            Inden hver film vises der lydprøveforslag, man skal jo sikre at lyden virker
            (disse foreslås på #lydprøveforslag kanalen på discorden).
          </li>
          <li>
            Der må ikke vælges film som er konsekutive (f.eks. Die Hard 1 og Die Hard 2).
          </li>
          <li>
            Film som foreslås bør dele et tema (f.eks. samme instruktør eller noget mere obskurt).
          </li>
          <li>
            Ved afstemningen må der ikke vælges film som folk, der er til stede ved afstemningen,
            har set før til F-kult.
          </li>
          <li>
            Ved afstemningen skal personen, der har foreslået filmene, give et kort pitch. Hvis
            personen ikke er til stede, kan der ikke stemmes på de film.
          </li>
          <li>Filmene ses i rækkefølgen af ældste først.</li>
          <li>
            Efter afstemningen ses én film valgt ud fra dem, der var tættest på at blive stemt ind.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-medium">Under filmene skåles der ved følgende:</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 leading-relaxed">
          <li>Selvreference (filmens titel nævnes i filmen)</li>
          <li>Sang og dans</li>
          <li>UI/interface vises</li>
          <li>Delvis nøgenhed</li>
          <li>
            Danny <a href={"https://en.wikipedia.org/wiki/Danny_DeVito"} target="_blank" className="text-green-600">DeVito</a>
          </li>
          <li>Åbenlys product placement</li>
          <li>Åbenlys krom</li>
          <li>Slow motion</li>
          <li>Et antal regler bestemt af personen som foreslog filmene</li>
        </ul>
      </div>
    </main>
  );
}
