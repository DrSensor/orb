import { batchImports } from "../utils/import.js";

const basePath = "/test/component/",
  tests = ["dom-element", "function"].map((it) => it + ".jsx"),
  params = ["", "jsx.runtime=automatic"];
// .flatMap((query) => [query, query + `${query ? "&" : ""}jsx.development`]);

const suites = await batchImports(basePath, tests, params, (as) => as.default);

for (const [{ runtime = "classic", development }, cases] of suites) {
  describe(
    `${runtime} JSX runtime${development ? " (DEV mode)" : ""}`,
    () => cases.forEach((test) => test()),
  );
}
