- [ ] derive reactive/literal.js from opaque/default.js
- [ ] derive reactive/derivation.js from opaque/{incomplete,trait}.js with `trait.get`
- [ ] use reactive/{iterable,struct}.js `iterable(typedArray, struct)` in ecs
      archetype
- [ ] reactive/struct.js should be lazy, it means only create
      reactive/literal.js when the struct properties is accessed (e.g when
      property descriptor get/set is called)
