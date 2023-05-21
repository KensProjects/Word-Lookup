import Search from "./components/search/Search";

import "./App.css";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { errorAtom } from "./context/Error";
import ErrorComponent from "./components/Error";
import endpoint from "./config/config";

function App() {
  const [isError, setIsError] = useAtom(errorAtom);
  async function checkAPI() {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      const res = await fetch(endpoint("hello"), { signal });
      if (res.status === 404) setIsError(true);
      setTimeout(() => {
        setIsError(false)
      },3000)
      return () => {
        controller.abort();
      };
    } catch (error) {
      setIsError(true);
    }
  }

  useEffect(() => {
    checkAPI();
  }, []);

  if (isError) return <ErrorComponent />;

  return (
    <>
      <main className="w-auto h-auto">
        <Search />
      </main>
    </>
  );
}

export default App;
