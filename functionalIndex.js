const crypto = require("crypto");
const request = require("request-promise-native");
const WebSocket = require("ws");

/**
 * Options involving which server to connect to and how to connect
 * @typedef {Object} Options
 * @property {string} [host=localhost] hostname of server to connect to
 * @property {number} [port=25565] port of minecraft server to connect to
 * @property {boolean} [https=false] use https to connect
 * @property {string} username username to connect with (for jsonapi defined in your server's config, not your minecraft account)
 * @property {string} password password to connect with.
 */
const defaults = {
  host: "localhost",
  port: 25565,
  https: false,
};

/**
 * The api
 * @typedef {Object} MinecraftJSONapi
 * @property {function} add {@link #add|add}
 * @property {function} follow {@link #follow|follow}
 * @property {function} dispatch {@link #dispatch|dispatch}
 */

module.exports = {
  /**
   * Creates a request object
   * @returns {MinecraftJSONapi} {@link #MinecraftJSONapi|MinecraftJSONapi}
   */
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

/**
 * Adds a parameter to the list of things to be fetched
 * @typedef {function} add
 * @param {String} name {@link http://mcjsonapi.com/apidocs/|Method Name}
 * @param {Array} args
 * @returns {MinecraftJSONapi} {@link #MinecraftJSONapi|MinecraftJSONapi}
 */
function add(requests, name, args = []) {
  const duplicatedRequests = requests.slice(0);
  duplicatedRequests.push({name, args});
  return {
    add: add.bind(null, duplicatedRequests),
    dispatch: dispatch.bind(null, duplicatedRequests),
    follow: follow.bind(null, duplicatedRequests),
  }
}

/**
 * Sends request to the api server
 * @typedef {function} dispatch
 * @param {Options} options {@link #Options|Options}
 * @returns {Array<Object>} Array of {@link http://mcjsonapi.com/#json-response-structure|JSONapi Responses}
 */
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

/**
 * Uses a websocket connection to monitor for changes in a request, only certain {@link https://github.com/alecgorge/jsonapi/wiki/Stream-sources|methods} are supported
 * @param {Options} options {@link #Options|Options}
 * @param {function} callback will be called with each event
 * @returns {WebSocket}
 */
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