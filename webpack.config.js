const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: false,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
        },
      ],
    }),
  ],
  devtool: 'source-map',

  // --- TAMBAHKAN BLOK INI ---
  devServer: {
    static: ['.'], // Menginstruksikan server untuk membaca file index.html dari folder utama
    port: 8080,    // Memastikan port berjalan di 8080
    open: true,    // Otomatis membuka browser saat npm start dijalankan
    hot: true,     // Mengaktifkan Hot Module Replacement (HMR)
  },
};