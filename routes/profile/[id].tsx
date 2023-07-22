import ProfilePage from "../../islands/ProfilePage.tsx";
import { PageProps } from "$fresh/server.ts";
import Header from '../../islands/Header.tsx'
import Footer from "../../components/Footer.tsx";

export default function Profile(props: PageProps) {
  const { id } = props.params;
  return (
    <>
      <Header/>
      <ProfilePage 
        id={id}
      />
      <Footer/>
    </>
  );
}