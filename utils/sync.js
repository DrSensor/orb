export const insync = (orb) => orb.inherit?.effect.has(orb);

export const sync = (orb) => orb.inherit?.effect.add(orb);

export const unsync = (orb) => orb.inherit?.effect.delete(orb);

export const resync = (orb) => {
  if (insync(orb)) unsync(orb);
  return sync(orb);
};

const eachother = (ops, list, callback) =>
  list[ops]((item, i) =>
    list[ops]((item$, i$) => i !== i$ && callback(item, item$))
  );

export const isLinked = (...orbs) =>
  eachother("every", orbs, (orb, orb$) => orb.effect.has(orb$));

export const link = (...orbs) =>
  eachother("forEach", orbs, (orb, orb$) => orb.effect.add(orb$));

export const unlink = (...orbs) =>
  eachother("forEach", orbs, (orb, orb$) => orb.effect.delete(orb$));
