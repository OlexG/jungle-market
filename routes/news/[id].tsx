import ArticlesPage from "../../islands/ArticlesPage.tsx";
import Header from "../../islands/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { PageProps } from "$fresh/server.ts";

export default function Articles(props: PageProps) {
  const { id } = props.params;
  return (
    <>
      <ArticlesPage
        id={id}
      />
    </>
  );
}
