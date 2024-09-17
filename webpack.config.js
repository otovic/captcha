const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/server.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    target: 'node',
    externals: [
        nodeExternals(),
        // Explicitly include `canvas` as an external
        {
            canvas: 'commonjs2 canvas'
        }
    ],
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
        extensions: ['.ts', '.js'],
    },
};
