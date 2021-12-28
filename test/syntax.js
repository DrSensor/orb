import expect from "unexpected";

import "orb/runtime/core/syntax.js";

describe("runtime syntax", () => {
  describe("core", () => {
    it("reactive number", () => {
      const [data] = 0;
      let test;

      expect(data, "to be a", Object);
      expect(+data, "to be", 0);

      data.set(1);

      expect(+data, "to be", 1);
      expect(test, "to be", undefined);

      data.effect = (data) => test = data;
      data.set(2);

      expect(+data, "to be", test);

      data.let += 10;

      expect(test, "to be", 12);

      test = data - 10;

      expect(test, "to be", 2);
      expect(+data, "to be", 12);

      test -= data.set(2);

      expect(`${data}`, "to be", "2");
      expect(test, "to be", 0);
    });

    it("reactive string", () => {
      const [data] = "", text = new Text(data);
      let test;

      expect(data, "to be a", Object);
      expect(text.data, "to be", "");
      expect(+data, "to be", +"").and("to be", 0);

      data.set("foo");
      text.data = data; // almost all Web API (including DOM API) will automatically do the convertion

      expect(text.data, "to be", "foo");
      expect(test, "to be", undefined);

      data.effect = (data) => test = data;
      data.set("bar");

      expect(`${data}`, "to be", test);

      data.let += "foo";

      expect(test, "to be", "barfoo");

      test = 10 + data + -Infinity;

      expect(test, "to be", "10barfoo-Infinity");
      expect(String(data), "to be", "barfoo");

      test += data.set("foobar");

      expect("" + data, "to be", "foobar");
      expect(test, "to be", "10barfoo-Infinityfoobar");
    });
  });
});
