import { PageProps } from "$fresh/server.ts";
import Header from "../../islands/Header.tsx";
import Tradepage from "../../islands/Tradepage.tsx";
import Footer from "../../components/Footer.tsx";
import { Head, asset } from "$fresh/runtime.ts";

export default function TradePage(props: PageProps) {
  const { id } = props.params;
  return (
    <>
      <Head>
        <style>
          {`
          @keyframes flashGreen {
            0% {background-color: transparent;}
            50% {background-color: #00FF00;}
            100% {background-color: transparent;}
          }
          
          .flash-green {
            animation-name: flashGreen;
            animation-duration: 1s;
            animation-timing-function: linear;
          }
          
          @keyframes flashRed {
            0% {background-color: transparent;}
            50% {background-color: #FF0000;}
            100% {background-color: transparent;}
          }
          
          .flash-red {
            animation-name: flashRed;
            animation-duration: 1s;
            animation-timing-function: linear;
          }
          `}
        </style>
      </Head>
      <Header />
      <Tradepage id={id} />
    </>
  );
}
