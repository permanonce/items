const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    entry:  {
      itemappvue: __dirname + "/app/javascript/itemappvue.js",
      vue: __dirname + "/app/javascript/vue.js",
    },

    output: {
      //path: __dirname + "/public",
      path: __dirname + "/build",
      filename: "[name].js"
    },
  //},
  module: {
    rules: [
      {
       test: /\.vue$/,
       loader: 'vue-loader' 
      },
      {
       test: /\.css$/,
       loader: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: './app/Users.vue', to: "Users.vue" },
      { from: './app/ItemDetails.vue', to: "ItemDetails.vue" },
      { from: './app/index.html', to: "index.html" },
      { from: './app/register.html', to: "register.html" },
      { from: './app/contact.html', to: "contact.html" },
      { from: './app/proveit.html', to: "proveit.html" },
      { from: './app/chainlink.png', to: "chainlink.png" },
      { from: './app/poofileexample.jpg', to: "poofileexample.jpg" },
      { from: './app/bikedeedlogo.png', to: "bikedeedlogo.png" },
      { from: './app/itemlogo.jpg', to: "itemlogo.jpg" },
      { from: './app/QR_icon.svg', to: "QR_icon.svg" },
      { from: './app/modal.css', to: "modal.css" },
      { from: './app/qrcode.css', to: "qrcode.css" }
    ])
  ],
}
