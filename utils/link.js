const eachother = (list, callback) =>
  list.forEach((item, i) =>
    list.forEach((item$, i$) => i !== i$ && callback(item, item$))
  );

export const links = (...orbs) =>
    eachother(orbs, (orb, orb$) => orb.effect.add(orb$)),
  unlinks = (...orbs) =>
    eachother(orbs, (orb, orb$) => orb.effect.delete(orb$));
