import React, { useState } from "react";

import { endpoint } from "../config/config";

import "./Search.css";

export default function Search() {
  const [input, setInput] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [definitions, setDefinitions] = useState<any[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      setIsLoading(true);
      setIsActive(false);
      setWord("");

      let definitionArray: string[] = [];

      const controller = new AbortController();
      const signal = controller.signal;
      const response = await fetch(endpoint(input), { signal });
      const rawData = await response.json();

      setInput("");

      rawData.map((entry: { word: string; meanings: Array<string> }) => {
        setWord(entry.word);
        entry.meanings.map((subject: any) => {
          subject.definitions.map((subjected: { definition: string }) => {
            definitionArray.push(
              `${[subject.partOfSpeech + ": " + subjected.definition]}`
            );
          });
        });
      });
      setIsError(false);
      setDefinitions(definitionArray);
      setIsLoading(false);
      setIsActive(true);
      return () => {
        controller.abort();
      };
    } catch (e) {
      setIsLoading(false);
      setIsActive(false);
      setWord("");
      setIsError(true);
    }
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky flex flex-col top-0 justify-center items-center h-fit w-screen p-4 border-b border-gray-600 bg-gray-200 gap-y-5 ">
        <h1 className="text-2xl">Word Lookup</h1>
        <form
          method="POST"
          className="border border-black bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-between p-0 m-0 w-full h-12 sm:w-3/4 focus-within:ring-1 focus-within:ring-gray-400 focus:shadow-2xl"
          onSubmit={handleSubmit}
          action="/"
          role="search"
        >
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-full w-full px-3 outline-none"
            name="term"
            id="term"
            required
            autoComplete="off"
            placeholder="Search..."
          />
          <button
            className="bg-blue-400 hover:bg-blue-300 text-white top-0 right-0 m-0 p-0 h-full w-12 border-l border-black"
            type="submit"
          >
            <img src="./Magnifying_glass_icon.svg" className="p-3 w-fit h-fit" />
          </button>
        </form>
      </div>

      <div className="flex flex-col justify-center items-center">
        {isActive ? (
          <div className="flex flex-col justify-center items-center w-full h-full py-4 shadow-2xl bg-gray-100">
            <div className="text-3xl font-medium pb-8">{word}</div>
            <ul className="list-disc list-inside w-full sm:w-3/4 h-full text-left">
              {definitions.map((definition: string, i: number) => {
                return (
                  <li
                    className="hover:text-red-500  text-md hover:text-lg duration-300 ease-in-out sm:text-xl sm:hover:text-2xl"
                    key={i}
                  >
                    {definition}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {isError ? <div className="text-red-600 text-2xl">Error!</div> : null}
      </div>
    </>
  );
}
