const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
module.exports = {
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
      }),
    ],
  },
};
