const path = require("path");

module.exports = {
    mode: 'development',
    entry: {
        background_scripts: "./background_scripts/background.js",
        options: "./options/options.js",
        highlighter: "./highlighter/highlighter.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name]/index.js"
    },
    module: {
        rules: [
          {
            test: /\.less$/i,
            loader: [
              // compiles Less to CSS
              "style-loader",
              "css-loader",
              "less-loader",
            ],
          },
        ],
      },
};
