import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nError, setNError] = useState();

  const activeHttpRequests = useRef([]);//incase user switches address while the page loads

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();//incase user send request then changes address so the request is aborted
    activeHttpRequests.current.pop(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          //signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl //this keeps every controller exept the one use in this request
        );

        if (!response.ok) {//ok en object tu respone
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setNError(err.message);
        console.log(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setNError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());//going through all the abortcontollers and abort them
    };
  }, []);

  return { isLoading, nError, sendRequest, clearError };
};
