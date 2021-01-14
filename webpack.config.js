const path = require('path');
const webpack = require('webpack');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        publicPath: '/',
        filename: '[name].bundle.js'
    },
    // set to development to read .env.local variables
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx'],
        // Adding fallback polyfills due to a breaking change in Webpack 5
        // Alternatively could have added an empty polyfill like {http: false}
        fallback: {
            // Need fallbacks to implement Event Source API
            // "http": require.resolve("stream-http"),
            // "https": require.resolve("https-browserify"),
            // "path": require.resolve("path-browserify"),
            // "os": false,
            // "constants": require.resolve("constants-browserify"),
            // "crypto": require.resolve("crypto-browserify"),
            // "stream": require.resolve("stream-browserify"),
            // "zlib": require.resolve("browserify-zlib"),
            // https://stackoverflow.com/questions/54459442/module-not-found-error-cant-resolve-child-process-how-to-fix
            // "child_process": false,
            // "fs": false,
            // "net": false,
            // "tls": false,
            // "http2": false,
            // "zlib_bindings": false
        }
    },
    target: 'web',
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false,  // and __filename return blank or /
        global: true
    },
    // externals: [nodeExternals()], // Need this to avoid error when working with Express
    module: {
        rules: [
            {
                // Transpiles ES6-8 into ES5
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    }
};