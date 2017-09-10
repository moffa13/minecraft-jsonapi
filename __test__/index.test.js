const Minecraft = require("../objectIndex.js");

const minecraft = new Minecraft({
  host: "pvpcraft.ca/survival",
  port: "",
  https: true,
  username: process.env.username,
  password: process.env.password,
});

test("Checks hashing function", () => {
  expect(Minecraft.generateKey("testUsername", "server.version", "testPassword")).toBe("784bf5c0437e0354c238f2400056745665160d57e307f9d6422f94da7d235794");
});

test("attempts to fetch info", () => {
  expect.assertions(1);
  return expect(minecraft.makePost("server.version")).resolves.not.toEqual([]);
});

test("attempts to check server performance", () => {
  expect.assertions(1);
  return expect(minecraft.makePost("server.performance")).resolves.not.toEqual([]);
});