import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function useuserId() {
  const [userId, setuserId] = useState<string | null>(null);
  useEffect(() => {
    if (IS_BROWSER && localStorage.getItem("userData")) {
      const object = JSON.parse(localStorage.getItem("userData") as any);
      setuserId(object.id);
    }
  }, [IS_BROWSER]);
  return userId;
}