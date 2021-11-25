/** Global decorator for built-ins binding. */
export let effect = (handler) => handler;
/** Set decorator on binding html attribute. */
export const effectIn = (newDecorator) => effect = newDecorator;
