export const reset = (orb) => orb(orb.initial);

export const useEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.onchange = effect);
