import { useEffect, useState } from "react";

const useFetch = <T, U = unknown>(
  fetchFunction: () => Promise<T>,
  options?: { onSuccess?: (value: T) => void; onError?: (reason: U) => void },
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchFunction()
      .then((value) => {
        setData(value);
        if (options?.onSuccess) options?.onSuccess(value);
        setLoading(false);
      })
      .catch((reason: U) => {
        if (options?.onError) options.onError(reason);
      });
  }, []);

  return {
    isLoading,
    data,
  };
};

export default useFetch;
