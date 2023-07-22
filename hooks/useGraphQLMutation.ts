import { useState } from "preact/hooks";

export function useGraphQLMutation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (mutation: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        body: JSON.stringify({ query: mutation }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      setData(json.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return { mutate, data, loading, error };
}
