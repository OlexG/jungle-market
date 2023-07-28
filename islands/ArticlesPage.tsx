import { useEffect, useState } from "preact/hooks";
import { generateRandomName } from "../generation/articles/executiveNameGeneration.ts";


export default function ArticlesPage() {
  const cursiveFontStyle = {
    fontFamily: "YourChosenCursiveFont, cursive",
  };

  return (
    <div className="bg-custom-light-main min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="w-2/5 h-full center bg-custom-dark-main absolute">
        <div className="text-white text-center text-6xl mt-10"style={cursiveFontStyle}>
          The Mon(k)ey Times
        </div>
        <div className="text-white text-center text-1xl mt-2">
           { generateRandomName() }
        </div>


      </div>
    </div>
  );
}
