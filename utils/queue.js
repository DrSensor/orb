const queue$ = [];

export const queue = (effect) =>
  function () {
    const defer = () => effect.apply(this, arguments);
    queue$.unshift(defer);
    return defer;
  };

export const flush = () => {
  while (queue$.length) queue$.pop()();
};
