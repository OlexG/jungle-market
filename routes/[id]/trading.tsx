import { PageProps } from "$fresh/server.ts";
import Header from '../../components/Header.tsx'
import Tradepage from '../../islands/Tradepage.tsx'

export default function GreetPage(props: PageProps) {
  const { id } = props.params;
  return (
    <>
      <Header />
      <Tradepage 
        id={id}
      />
    </>
  );
}