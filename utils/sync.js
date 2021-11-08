export const insync = (orb) => orb.inherit?.effect.has(orb);

export const sync = (orb) => orb.inherit?.effect.add(orb);

export const unsync = (orb) => orb.inherit?.effect.delete(orb);

export const resync = (orb) => {
  if (insync(orb)) unsync(orb);
  return sync(orb);
};
