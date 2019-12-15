const webpack = require("webpack");
const path = require("path");

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
  })
];

const filename = `use-cancelable-thunk-reducer{NODE_ENV === 'production' ? '.min' : ''}.js`;

module.exports = {
  mode: NODE_ENV === "production" ? "production" : "development",

  module: {
    rules: [{ test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ }]
  },

  entry: ["./src/index"],

  optimization: {
    minimize: NODE_ENV === "production"
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename,
    library: "useCancelableThunkReducer",
    libraryTarget: "umd"
  },

  plugins
};
