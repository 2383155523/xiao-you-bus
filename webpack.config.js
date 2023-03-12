"use strict";
exports.__esModule = true;
var path = require("path");
var webpack = require("webpack");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var packageJson = require("./package.json");
var TerserPlugin = require("terser-webpack-plugin");
var webpackConfig = function (env, argv) {
    var mode = argv.mode || "development";
    var isProd = mode === "production";
    return {
        entry: "./src/index.ts",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: isProd ? "[name].[contenthash].js" : "index.js",
            library: packageJson.name,
            libraryTarget: "umd",
            umdNamedDefine: true,
            globalObject: "this"
        },
        devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
        resolve: {
            extensions: [".ts", ".js", ".json"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.json$/,
                    use: "json-loader",
                    type: "javascript/auto"
                },
            ]
        },
        plugins: [new webpack.ProgressPlugin(), new clean_webpack_plugin_1.CleanWebpackPlugin()],
        optimization: {
            minimize: isProd,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    }
                }),
            ]
        }
    };
};
exports["default"] = webpackConfig;
