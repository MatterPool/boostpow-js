const path = require(`path`);
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
        fallback: { "crypto": require.resolve("crypto-browserify"),  "stream": require.resolve("stream-browserify"), "vm": require.resolve("vm-browserify")  }
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, `dist`),
        filename: `boostpow.js`
    }
};
