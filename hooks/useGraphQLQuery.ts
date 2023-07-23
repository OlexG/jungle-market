import { useCallback, useEffect, useState } from "preact/hooks";

export function useGraphQLQuery<T>(query: string, dontFetchFirst = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(dontFetchFirst ? 0 : 1);

  const refetch = useCallback(() => {
    setRefetchIndex((prevIndex) => prevIndex + 1);
  }, []);

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
    if (refetchIndex > 0) {
      fetchData();
    }
  }, [query, refetchIndex]);

  return { data, loading, error, refetch } as {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  };
}
