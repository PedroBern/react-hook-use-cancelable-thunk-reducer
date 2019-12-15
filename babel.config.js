if (process.env.NODE_ENV === "test") {
  module.exports = {
    plugins: ["@babel/plugin-transform-runtime"],
    presets: [
      "@babel/preset-react",
      ["@babel/preset-env", { useBuiltIns: false }]
    ]
  };
} else {
  module.exports = {
    presets: [
      [
        "@babel/env",
        {
          targets: {
            ie: "11"
          }
        }
      ]
    ]
  };
}
