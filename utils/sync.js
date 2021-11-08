export const insync = (orb) => orb.inherit?.effect.has(orb),
  sync = (orb) => orb.inherit?.effect.add(orb),
  unsync = (orb) => orb.inherit?.effect.delete(orb),
  resync = (orb) => {
    if (insync(orb)) unsync(orb);
    return sync(orb);
  };
