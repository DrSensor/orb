import archetype from "./archetype.js";

const $entity = Symbol();
/** spawn JSX Component as ECS entity with given ECS components */
export function* spawn(runtime, ...components) {
  const [id, addComponent, removeComponent] = runtime[$entity] ??= addEntity(),
    entity = (handler) => components.forEach(handler);
  // TODO: add component orbs in runtime.effect dependencies
  // i.e rutime.effect(componentOrbs).add(()=>{...})
  runtime.effect = () => {
    entity(addComponent);
    return () => {
      entity(removeComponent);
      removeEntity(id);
    };
  }; // 👇 in-place Array.prototype.map
  const { length } = components, at = length - 1, last = components[at];
  for (let i = 0; i < at; i++) {
    yield (components[(i == 0 ? length : i) - 1] = components[i])(id);
  }
  yield components[at] = last;
}

export let id = 0;
export function* addEntity() {
  archetype.entities.add(++id);
  yield id;

  yield /**addComponent*/ (component) => {
    let next = archetype.last ??= archetype.next ??= {
      entities: new Set([id]),
      components: new Set([component]),
      first: archetype,
    }; // 👇 traverse until end
    while (!next.components.has(component) && !next.last) { // mean next doesn't reference last archetype because it's last archetype
      next = next.last ??= next.next ??= {
        components: new Set(next.components).add(component),
        first: archetype,
      };
    }
    delete next.last;
  };

  yield /**removeComponent*/ (component) => {
    let prev = archetype.last.first ??= archetype.last.prev ??= {
      entities: new Set([id]),
      components: new Set([component]),
    };
    do { // traverse until end
    } while (!prev.first); // mean next doesn't reference first archetype because it's first archetype
  };
}

export const removeEntity = (id) => {
  archetype.entities.delete(id);
  let next;
  while (next = archetype.next) next.entities.delete(id);
};

export { addEntity as add, removeEntity as remove };
