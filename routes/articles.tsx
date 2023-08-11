import ArticlesPage from "../islands/ArticlesPage.tsx";
import Header from "../islands/Header.tsx";
import Footer from "../components/Footer.tsx";
import generateRandomArticle from "../generation/articles/articleGeneration.ts";
import { useEffect, useState } from "preact/hooks";
import { RouteContext } from "$fresh/server.ts";


export default async function Page(_req: Request, ctx: RouteContext) {
  const article = await generateRandomArticle();

  return (
    <>
      <ArticlesPage
        article={article}
      />
    </>
  );
}
