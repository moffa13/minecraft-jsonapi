const crypto = require("crypto");
const request = require("request-promise-native");

const defaults = {
  host: "localhost",
  port: 20059,
  https: false,
};

module.exports = {
  createRequest: function() {
    return {
      add: add.bind(null, []),
      dispatch: dispatch.bind(null, []),
    }
  },
  _: {
    add, dispatch, generateURL, generateKey
  }
};

function add(requests, name, args = []) {
  const duplicatedRequests = requests.slice(0);
  duplicatedRequests.push({name, args});
  return {
    add: add.bind(null, duplicatedRequests),
    dispatch: dispatch.bind(null, duplicatedRequests),
  }
}

function dispatch(requests, options = {}) {
  const optionsWithDefaults = Object.assign({}, defaults, options);

  const body = requests.map(({name, args}) => (
    {
      name,
      arguments: args,
      username: optionsWithDefaults.username,
      key: generateKey(optionsWithDefaults.username, name, optionsWithDefaults.password),
      tag: "sampleTag"
    }));

  const requestOptions = {
    uri: `${generateURL(optionsWithDefaults.host, optionsWithDefaults.port, optionsWithDefaults.https)}/api/2/call`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    json: true,
  };
  return request(requestOptions)
}

function generateURL(host, port = 25565, https = false) {
  return `http${https ? "s" : ""}://${host}${port ? ":" : ""}${port}`
}

function generateKey(username, name, password) {
  return crypto.createHash("sha256").update(username + name + password, "utf-8").digest("hex")
}