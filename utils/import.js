import { parseURLSearchParams as parse } from "../utils/config.js";

export const batchImports = async (basePath, filename, queries, mapModule) => {
  filename = queries
    .map((query_url) => [query_url, parse(new URLSearchParams(query_url))])
    .flatMap(([query_url, { jsx = {} }]) =>
      filename.map((filename) => [
        basePath + filename + (query_url ? `?${query_url}` : ""),
        jsx,
      ])
    );

  let suites = await Promise.all(filename.map(([url]) => import(url)));
  if (mapModule) suites = suites.map(mapModule);

  for (
    let start = 0, i = 0, { length } = queries;
    start < suites.length;
    start += length, i++
  ) {
    filename.splice(i, length, [
      filename[start][1],
      suites.slice(start, start + length),
    ]);
  }

  return filename;
};
