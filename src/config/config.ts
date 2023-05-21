export function endpoint(term: string) {
  const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/`;
  return API_URL + term;
}

export default endpoint;
