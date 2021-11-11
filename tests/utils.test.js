function* children(orb) {
  if (orb?.[Symbol.iterator]) {
    for (const effect of orb) if (!effect[Symbol.iterator]) yield effect;
  }
}

function* descendant(orb) {
  for (const child of orb) {
    if (child?.[Symbol.iterator]) yield* descendant(child);
    else yield child;
    // yield* descendant(child);
  }
}

for (const val of descendant([1, [2, 3, [4, 5]], 3, 4, 5])) console.log(val);
console.log([1, [2, 3, [4, 5]], 3, 4, 5].flat(Infinity))
