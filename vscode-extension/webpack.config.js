const path = require('path');
const webpack = require('webpack');

/**
 * Configuration Webpack pour l'extension VS Code DevAI
 */
const config = {
  target: 'node',
  mode: 'production',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                module: 'es6'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimize: true
  },
  node: {
    __dirname: false,
    __filename: false
  }
};

/**
 * Configuration Webpack pour la WebView
 */
const webviewConfig = {
  target: 'web',
  mode: 'production',
  entry: './src/webview/main.tsx',
  output: {
    path: path.resolve(__dirname, 'out/webview'),
    filename: 'main.js',
    libraryTarget: 'umd', // Changer de commonjs2 à umd pour compatibilité navigateur
    globalObject: 'this' // Définit un objet global compatible avec les navigateurs
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                module: 'es6'
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimize: true
  }
};

module.exports = [config, webviewConfig];
