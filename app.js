// Passenger (cPanel "Setup Node.js App") startup shim.
//
// Some Passenger builds refuse an .mjs startup file. This loads the real ESM
// server entry via dynamic import(), which works whether Node treats this file
// as CommonJS or ESM — so it is safe with or without a package.json alongside it.
//
// Upload next to dist/, then set the host's startup/entry file to app.js.
// The specifier resolves relative to THIS file, not the working directory,
// so it holds regardless of where Passenger sets cwd.
import("./dist/server/index.mjs").catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
