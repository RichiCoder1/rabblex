const { readdirSync, lstatSync } = require('fs');
const { join } = require('path');
const merge = require('webpack-merge');

const baseConfig = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.wasm'],
    },
    module: {
        rules: [
            {
                test: /\.m?[t|j]sx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    mode: 'development',
};

const componentsConfig = merge(baseConfig, {
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React',
        },
        ['react-dom']: {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
            root: 'ReactDOM',
        },
        mobx: 'mobx',
    },
});

const componentsSrc = join(__dirname, 'src', 'components');
const components = readdirSync(componentsSrc).filter(name =>
    lstatSync(join(componentsSrc, name)).isDirectory()
);

module.exports = components
    .map(component => {
        return merge(componentsConfig, {
            output: {
                filename: component + '.js',
                library: component,
                libraryTarget: 'umd',
            },
            name: component,
            entry: join(componentsSrc, component, 'index.tsx'),
        });
    })
    .concat(
        merge(baseConfig, {
            entry: join(__dirname, 'src', 'index.tsx'),
            name: 'Preview',
            output: {
                path: join(__dirname, 'dist', 'preview'),
            },
        })
    );
