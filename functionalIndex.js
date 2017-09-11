const crypto = require("crypto");
const request = require("request-promise-native");
const WebSocket = require("ws");

const defaults = {
  host: "localhost",
  port: 20059,
  https: false,
};

module.exports = {
  createRequest: function () {
    return {
      add: add.bind(null, []),
      follow: () => {throw new Error("Must add something before making a request")},
      dispatch: () => {throw new Error("Must add something before making a request")},
    }
  },
  _: {
    add, dispatch, generateHttpURL, generateWsURL, generateKey,
  },
};

function add(requests, name, args = []) {
  const duplicatedRequests = requests.slice(0);
  duplicatedRequests.push({name, args});
  return {
    add: add.bind(null, duplicatedRequests),
    dispatch: dispatch.bind(null, duplicatedRequests),
    follow: follow.bind(null, duplicatedRequests),
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
      tag: "sampleTag",
    }));

  const requestOptions = {
    uri: `${generateHttpURL(optionsWithDefaults.host, optionsWithDefaults.port, optionsWithDefaults.https)}/api/2/call`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    json: true,
  };
  return request(requestOptions)
}

function generateHttpURL(host, port = 25565, ssl = false) {
  return `http${ssl ? "s" : ""}://${host}${port ? ":" : ""}${port}`;
}

function generateWsURL(host, port = 25565, ssl = false) {
  return `ws${ssl ? "s" : ""}://${host}${port ? ":" : ""}${port}`;
}

function generateKey(username, name, password) {
  return crypto.createHash("sha256").update(username + name + password, "utf-8").digest("hex")
}

function follow(requests, options, callback) {
  const optionsWithDefaults = Object.assign({}, defaults, options);

  const body = requests.map(({name, args}) => (
    {
      name,
      arguments: args,
      username: optionsWithDefaults.username,
      key: generateKey(optionsWithDefaults.username, name, optionsWithDefaults.password),
      tag: "sampleTag",
    }
  ));

  const ws = new WebSocket(
    `${
      generateWsURL(optionsWithDefaults.host, optionsWithDefaults.port, optionsWithDefaults.https)
      }/api/2/websocket`,
    {},
  );

  ws.on('open', () => {
    ws.send(`/api/2/subscribe?json=${encodeURIComponent(JSON.stringify(body))}\r\n`);
  });

  ws.on('message', (text) => callback(JSON.parse(text)));
  return ws;
}