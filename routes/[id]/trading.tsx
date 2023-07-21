import { PageProps } from "$fresh/server.ts";
import Header from '../../components/Header.tsx'
import Tradepage from '../../islands/Tradepage.tsx'
import Footer from "../../components/Footer.tsx";
import { Head, asset } from "$fresh/runtime.ts";

export default function TradePage(props: PageProps) {
  const { id } = props.params;
  return (
    <>
      <Header />
      <Tradepage 
        id={id}
      />
      <Footer />
    </>
  );
}