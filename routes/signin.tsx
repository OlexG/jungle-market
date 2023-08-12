import Header from "../islands/Header.tsx";
import Footer from "../components/Footer.tsx";
import SigninPage from '../islands/Signin.tsx'
import { config } from "mod";
const { RED_URL } = config();

export default function Signin() {
  return (
    <>
      <Header/>
      <SigninPage
        redirect={RED_URL}
      />
    </>
  )
}