const Minecraft = require("../functionalIndex.js");

let options = {
  host: "pvpcraft.ca/survival",
  port: "",
  https: true,
  username: process.env.username,
  password: process.env.password,
};

const minecraft = Minecraft.createRequest();

test("Checks hashing function", () => {
  expect(Minecraft._.generateKey("testUsername", "server.version", "testPassword")).toBe("784bf5c0437e0354c238f2400056745665160d57e307f9d6422f94da7d235794");
});

test("check url generation", () => {
  expect(Minecraft._.generateURL("pvpcraft.ca", 25565, false)).toBe("http://pvpcraft.ca:25565");
});

test("allow https url generation", () => {
  expect(Minecraft._.generateURL("pvpcraft.ca", 25565, true)).toBe("https://pvpcraft.ca:25565");
});

test("allow empty string as port", () => {
  expect(Minecraft._.generateURL("pvpcraft.ca", "", true)).toBe("https://pvpcraft.ca");
});

test("attempts to fetch info", () => {
  expect.assertions(1);
  return expect(minecraft.add("server.version").dispatch(options)).resolves.not.toEqual([]);
});

test("attempts to check server performance", () => {
  expect.assertions(1);
  return expect(minecraft.add("server.performance").dispatch(options)).resolves.not.toEqual([]);
});