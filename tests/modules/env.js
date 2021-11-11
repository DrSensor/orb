const { window, global } = globalThis;

export const isBrowser = window?.document instanceof window?.Document;

export const isNode = global?.process?.release.name === "node";

export const isDeno = !!window?.Deno?.version.deno;
