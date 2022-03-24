export class Snapshot {
  constructor(serialize, deserialize) {
    return (function* () {
      yield /** system for snapshot-ing at specific interval */ (ms) => {};
      yield /** get snapshot data */ () => {};
    })();
  }
}
