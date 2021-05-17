// @ts-nocheck
import "cross-fetch/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import plugins from "./plugins";
import { registerServiceWorker } from "./service-worker-register";

const render = module.hot ? ReactDOM.render : ReactDOM.hydrate;
render(<App />, document.getElementById("root"));

registerServiceWorker(plugins);
