///<binding ProjectOpened="default" />
"use strict";

/* Varibles */
var gulp = require("gulp"),
    path = require("path");

// Invalid settings: Rollup should show "A module cannot import itself" error message
// but cannot due to "TypeError: Cannot read property 'specifier' of undefined" error.
gulp.task("build-invalidSettings-buggy", function () {
    return build(true, true);
});

// Invalid settings with fixed version: Now rollup shows the correct error message.
gulp.task("build-invalidSettings-fixed", function () {
    return build(false, true);
});

// Valid settings: This is here just to show that rollup works as expected with the correct settings.
gulp.task("build-valid", function () {
    return build(true, false);
});

function build(useOriginalPackage, useInvalidSettings) {

    var rollup = useOriginalPackage
        ? require("rollup") // Original package with "TypeError: Cannot read property 'specifier' of undefined" error
        : require("./lib/rollup"), // Fixed version
        alias = require("rollup-plugin-alias"),
        commonjs = require("rollup-plugin-commonjs"),
        nodeResolve = require("rollup-plugin-node-resolve");

    // The error happens when the settings are "invalid" (no alias defined for "breeze" package)
    // And with correct "breeze" aliases, rollup works as expected
    var aliases = useInvalidSettings
        ? {}
        : {
            "breeze-client": path.resolve(__dirname, "node_modules", "breeze-client/breeze.base.debug.js"),
            "breeze.dataService.odata": path.resolve(__dirname, "node_modules", "breeze-client/breeze.dataService.odata.js"),
            "breeze.modelLibrary.backingStore": path.resolve(__dirname, "node_modules", "breeze-client/breeze.modelLibrary.backingStore.js"),
        };

    return rollup.rollup({
        entry: "./app/main.js",
        plugins: [
            alias(aliases),
          commonjs({
              namedExports: {
                  "node_modules/breeze-client/breeze.base.debug.js": [
                      "EntityManager"
                  ]
              }
          }),
          nodeResolve({ jsnext: true, module: true })
        ],
    })
      .then(function (bundle) {
          return bundle.write({
              format: "iife",
              moduleName: "app",
              dest: "./app/app.js"
          });
      });
}