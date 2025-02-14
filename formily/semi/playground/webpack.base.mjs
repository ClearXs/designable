import path from 'path'
import fs from 'fs-extra'
import { globSync } from 'glob'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getWorkspaceAlias = () => {
  const basePath = path.resolve(__dirname, '../../../')
  const pkg = fs.readJSONSync(path.resolve(basePath, 'package.json')) || {}
  const results = {}
  const workspaces = pkg.workspaces
  if (Array.isArray(workspaces)) {
    workspaces.forEach((pattern) => {
      const names = globSync(pattern, { cwd: basePath })
      names.forEach((name) => {
        const pkg = fs.readJSONSync(
          path.resolve(basePath, name, './package.json'),
        )
        results[pkg.name] = path.resolve(basePath, name, './src')
      })
    })
  }
  return results
}

export default {
  mode: 'development',
  devtool: 'inline-source-map', // 嵌入到源文件中
  stats: {
    entrypoints: false,
    children: false,
  },
  entry: {
    playground: path.resolve(__dirname, './main'),
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].[hash].bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: getWorkspaceAlias(),
  },
  externals: {
    moment: 'moment',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
            options: {
              // modifyVars: getThemeVariables({
              //   dark: true, // 开启暗黑模式
              // }),
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['url-loader'],
      },
      {
        test: /\.html?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
}
