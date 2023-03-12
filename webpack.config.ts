import * as path from "path"
import * as webpack from "webpack"
import type * as terserPlugin from "terser-webpack-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
const packageJson = require("./package.json")
const TerserPlugin = require("terser-webpack-plugin")

interface WebpackConfig extends webpack.Configuration {
  devtool: string
  optimization: {
    minimize: boolean
    minimizer: terserPlugin[]
  }
}

const webpackConfig = (env: any, argv: any): WebpackConfig => {
  const mode = argv.mode || "development"
  const isProd = mode === "production"

  return {
    entry: "./src/index.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name].[contenthash].js" : "index.js",
      library: packageJson.name,
      libraryTarget: "umd",
      umdNamedDefine: true,
      globalObject: "this",
    },
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    resolve: {
      extensions: [".ts", ".js", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.json$/,
          use: "json-loader",
          type: "javascript/auto",
        },
      ],
    },
    plugins: [new webpack.ProgressPlugin(), new CleanWebpackPlugin()],
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    },
  }
}

export default webpackConfig
