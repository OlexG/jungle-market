import Homepage from "../islands/Homepage.tsx";
import Header from "../islands/Header.tsx";
import Footer from "../components/Footer.tsx";
import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Header/>
      <Homepage />
      <Footer />
    </>
  );
}
