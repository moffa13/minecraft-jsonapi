# Features

Simple yet powerful [minecraft JSONAPI](https://github.com/alecgorge/jsonapi) module

# Actual real life documentation

[Documentation](https://macdja38.github.io/minecraft-jsonapi)

# Method docs
[rest](http://mcjsonapi.com/apidocs/)

# Usage

### Import
```js
const Minecraft = require("minecraft-jsonapi");
```

### Options
```js
const options = {
  host: "127.0.0.1",
  port: "25565",
  https: false,
  username: "username",
  password: "password",
};
```

### Rest Call
```js
const minecraft = Minecraft.createRequest();

const resultPromise = minecraft.add("server.performance").dispatch(options);

resultPromise.then(console.log).catch(console.error);
```

### Streaming API
```js
const minecraft = Minecraft.createRequest();

minecraft.add("console", []).add("chat", []).follow(options, console.log)
```
