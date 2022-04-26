const path = require(`path`);
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: `./lib/index.ts`,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, `dist`),
        filename: `boostpow.js`
    },
    plugins: [new NodePolyfillPlugin(),
    new CopyPlugin({
        patterns: [
            {from: `./lib/bsv`,to: path.resolve(__dirname, `dist/bsv`)}
        ]
    })]
};
