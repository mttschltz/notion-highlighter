const path = require("path");

module.exports = {
    mode: 'production',
    entry: {
        background_scripts: "./background_scripts/background.js",
        options: "./options/options.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name]/index.js"
    }
};
