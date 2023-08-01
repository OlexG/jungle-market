import { useEffect, useState } from "preact/hooks";
import { generateRandomName } from "../generation/articles/executiveNameGeneration.ts";
import { generateRandomArticle } from "../generation/articles/articleGeneration.ts";
import { h } from "preact";
import ArticleFooter from "../components/ArticleFooter.tsx";

export default function ArticlesPage() {
  const cursiveFontStyle = {
    fontFamily: "'YourChosenCursiveFont', cursive",
  };  
  
  let testing = "";
  let i = 0;
  for (; i < 200; i++) {
    testing += "Testing here ";
  }

  const article = generateRandomArticle();

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="w-120 center bg-white absolute " style={{ overflow: "auto" }}>
        <div
          className="text-black text-center text-6xl mt-6 m-10"
          style={cursiveFontStyle}
        >
          The Monkey Times
        </div>
        <div
          className="text-black text-3xl ml-10"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          {article.Title}
        </div>
        <div
          className="text-black text-1xl ml-10"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          {article.Author}
        </div>
        <div
          className="text-gray-500 text-xs ml-10"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          {"Published on " + article.DateWritten}
        </div>
        <img
          class="w-60 h-60 m-10 mt-2 float-right"
          src="../art/TheMonkeyTimesLogo.jpg"
          alt="filler image"
        />
        <p className="text-black text-left text-xs mt-2 ml-10 w-110" style={{ fontFamily: "Times New Roman, serif" }}>
          {/* article.Body */ testing}
        </p>
      </div>
      <ArticleFooter/>
    </div>
  );
}
