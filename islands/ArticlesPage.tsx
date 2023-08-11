import { useEffect, useState } from "preact/hooks";
import { generateRandomName } from "../generation/articles/executiveNameGeneration.ts";
import { generateRandomArticle } from "../generation/articles/articleGeneration.ts";

import ArticleFooter from "../components/ArticleFooter.tsx";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { NewsStory } from "../routes/models/newsStory.ts";

interface IProps {
  id: string;
}

function formatDateAndTime(time: string) {
  const date = new Date(parseInt(time));
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const hour = hours % 12;
  const minute = minutes < 10 ? `0${minutes}` : minutes;
  return `${hour}:${minute}${ampm} ${date.toLocaleDateString()}`;
}


export default function ArticlesPage(props: IProps) {
  const { data, error, loading } = useGraphQLQuery<{
    newsStory: NewsStory;
  } | null>(
    `{
      newsStory(id: "${props.id}") {
        title
        description
        author
        createdAt
      }
    }`
  );

  const cursiveFontStyle = {
    fontFamily: "'YourChosenCursiveFont', cursive",
  };

  let testing = "";
  let i = 0;
  for (; i < 200; i++) {
    testing += "Testing here ";
  }

  const article = generateRandomArticle();

  if (!data || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center relative">
      <div
        className="w-120 center bg-white min-h-screen overflow-auto pb-10"
        style={{ overflow: "auto" }}
      >
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
          {data.newsStory.title}
        </div>
        <div
          className="text-black text-1xl ml-10"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          {data.newsStory.author}
        </div>
        <div
          className="text-gray-500 text-xs ml-10"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          {formatDateAndTime(data.newsStory.createdAt)}
        </div>
        <img
          class="w-60 h-60 m-10 mt-2 float-right"
          src="../art/TheMonkeyTimesLogo.jpg"
          alt="filler image"
        />
        <p
          className="text-black text-left text-xs mt-2 ml-10 w-110"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          {/* article.Body */ data.newsStory.description}
        </p>
      </div>
      <ArticleFooter />
    </div>
  );
}
