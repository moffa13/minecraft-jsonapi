const crypto = require("crypto");
const request = require("request-promise-native");

const defaults = {
  host: "localhost",
  port: 20059,
  https: false,
};

module.exports = class Minecraft {
  constructor(options = {}) {
    this._options = Object.assign({}, defaults, options);
    if (!options.hasOwnProperty("password") || !options.hasOwnProperty("username")) {
      throw new Error("Username and Password are required to init options object")
    }
  }

  static generateURL(host, port = 25565, https = false) {
    return `http${https ? "s" : ""}://${host}${port ? ":" : ""}${port}`
  }

  static generateKey(username, name, password) {
    return crypto.createHash("sha256").update(username + name + password, "utf-8").digest("hex")
  }

  makePost(name, args = []) {
    const body = [{
      name,
      arguments: args,
      username: this._options.username,
      key: Minecraft.generateKey(this._options.username, name, this._options.password),
      tag: "sampleTag"
    }];
    const requestOptions = {
      uri: `${Minecraft.generateURL(this._options.host, this._options.port, this._options.https)}/api/2/call`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      json: true,
    };
    return request(requestOptions)
  }
};