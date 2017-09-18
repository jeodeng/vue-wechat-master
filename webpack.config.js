var webpack=require('webpack');
var HtmlWebpackPlugin=require('html-webpack-plugin');
module.exports={
    entry:{
        index:'./src/index.js',
        chat:'./src/chat.js',
    },
    output:{
        path:__dirname+'/dist',
        filename:'[name].js',
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:['vue-loader'],
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader'],
                exclude:/node_modules/
            },
            {
                test:/\.(gif|png|svg|jpe?g)$/,
                loader:'url-loader',
                options:{
                    limit:20480,//小于8192字节相当于8kb就解析成64位编码，减少浏览器发送图片请求次数
                    name:'[name].[ext]', //配置图片输出的名字
                    outputPath:'/images/', //配置输出的路径 此处要给一个相对于output配置的path路径后加路径
                    publicPath:'./dist', // 配置页面图片文件的公共路径
                },
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({title:'test',template:'./views/wechat.html'}), 
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
              'process.env': {
                NODE_ENV: JSON.stringify('production')
              }
        }),
    ],
    devServer:{
        inline:true,
        hot:true
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
}