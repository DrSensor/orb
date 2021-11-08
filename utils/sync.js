export const insync = (orb) => orb.inherit?.effect.has(orb);

export const sync = (orb) => orb.inherit?.effect.add(orb);

export const unsync = (orb) => orb.inherit?.effect.delete(orb);

export const resync = (orb) => {
  if (insync(orb)) unsync(orb);
  return sync(orb);
};

const eachother = (list, callback) =>
  list.forEach((item, i) =>
    list.forEach((item$, i$) => i !== i$ && callback(item, item$))
  );

export const links = (...orbs) =>
  eachother(orbs, (orb, orb$) => orb.effect.add(orb$));

export const unlinks = (...orbs) =>
  eachother(orbs, (orb, orb$) => orb.effect.delete(orb$));
