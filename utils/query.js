export const root = (orb) => Array.from(ancestor(orb)).at(-1);

export function* ancestor(orb) {
  let parent = orb.inherit;
  yield parent;
  while (parent = parent.inherit) yield parent;
}

export function* children(orb) {
  for (const effect of orb.effect) if (effect.inherit === orb) yield effect;
}

export function* descendant(orb) {
  // yield* descendant(yield* children); // TODO: check if recursive Generator `yield* self(yield* other)` works
  // TODO: replace 👇 if 👆 works!
  for (const child of children(orb)) {
    yield child;
    yield* descendant(child);
  }
}
