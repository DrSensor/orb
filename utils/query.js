export const root = (orb) => Array.from(ancestor(orb)).at(-1);

export function* ancestor(orb) {
  let parent = orb.inherit;
  while (parent) {
    yield parent;
    parent = parent.inherit;
  }
}

export function* children(orb) {
  for (const effect of orb.effect) if (effect.inherit === orb) yield effect;
}

export function* descendant(orb) {
  for (const child of children(orb)) {
    yield child;
    yield* descendant(child);
  }
}
