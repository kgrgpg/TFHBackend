const path = require('path');

module.exports = {
    entry: './src/services/retrieveNodeLambda.ts', // Entry point of your Lambda function
    target: 'node', // Target node because it's a Lambda function
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
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
    output: {
        filename: 'retrieveNodeLambda.js', // Output file
        path: path.resolve(__dirname, 'dist'), // Output directory
        libraryTarget: 'commonjs2', // Important for AWS Lambda
    },
    mode: 'production', // Can be 'development' for debugging
};
