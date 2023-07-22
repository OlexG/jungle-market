import Homepage from "../islands/Homepage.tsx";
import Header from "../islands/Header.tsx";
import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Header/>
      <Homepage />
    </>
  );
}
