import jsonServerProvider from "ra-data-json-server";

export const jsonServerDataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL
);
