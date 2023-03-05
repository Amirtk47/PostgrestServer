import { registerRest } from "./Rest.js";
// console.log("Hello CodeSandbox");
export function registerRoutes(app, localStorage) {
  registerRest(app, localStorage);
}
