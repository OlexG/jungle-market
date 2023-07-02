import { Head } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import Homepage from "../islands/Homepage.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <>
      <Homepage />
    </>
  );
}
