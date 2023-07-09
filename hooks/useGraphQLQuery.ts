import { useEffect, useState } from "preact/hooks";

export function useGraphQLQuery<T>(query: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          body: JSON.stringify({ query }),
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
    }
    fetchData();
  }, [query]);

  return { data, loading, error } as any as {
    data: T;
    loading: boolean;
    error: Error;
  };
}
