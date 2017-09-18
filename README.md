
项目结构：

├─ /vue-resume-master/ ······················· 项目所在目录

└─┬─ /server/ ································ 服务器代码
  ├─ /dist/ ·································· webpack输出目录
  ├─ /src/ ··································· 自己写的资源文件
  ├─ /views/ ································· express渲染的页面
  ├─ /.babenIrc ····························· babel配置
  └─ /webpack.config.js ···················· webpack配置

项目说明：
 仿照web微信界面写的一个web聊天室
 功能：
  登录注册，进入以后会自动进入一个公聊频道，此频道不可关闭，同时可以向任意用户发起临时会话。可以查看目前加入公聊频道的所有在线用户，未读消息数量提醒。
 技术：
  运用socket实现消息传输，页面由vue构建，使用v-resource发送ajax,服务器用node.js+express构建，数据库采用mongodb数据库
 
此项目依托于数据库和服务器，所以暂时无法直接使用，需要自建数据库，仅供参考

下一步实现需求：
 1. 修改注册页面，添加头像，同时聊天页面获取用户头像，用户可自定义头像
 2. 清空聊天窗口记录
 3. 本地保存聊天记录和临时会话窗口，同时可以删除记录和会话窗口。
 4. 接受离线消息（已完成），处理离线消息

下载node.js

在当前目录下
 npm install

npm run server
浏览器输入localhost:8081即可

如果更新了代码
npm run build 再刷新页面

