### uho-admin 
> 该项目为游乎 管控台

#### 环境配置:
 * node v10.19.0
 * npm v6.13.4


#### 指令说明:
1. npm i
2. npm run start:dev  --> 运行应用 
3. npm run build:test --> 测试打包 生成文件为:uho_admin 
4. npm run build:production --> 生产打包 生成文件为:gadmin 



#### 测试部署 
1. npm run build:test
2. 把打包生成的文件 uho_admin  并压缩为 uho_admin.zip
3. 通过ssh工具 访问服务器: 47.111.22.80:22
4. cd /opt/web 上传压缩包 uho_admin.zip并解压
5. 覆盖原uho_admin文件
6. [查看效果访问](http://tadmin.fungoweb.com)
7. 测试账号:
   > 用户名: 18516321273
   > 密码:123456





#### 生成部署 
1. npm run build:production
2. 把打包生成的文件 gadmin 修改文件名为:gadmin.fungoweb.com 并压缩为 gadmin.fungoweb.com.zip
3. 通过ssh工具 访问服务器: 47.111.22.80:22
4. cd /opt/web 上传压缩包 gadmin.fungoweb.com.zip并解压
5. 覆盖原gadmin.fungoweb.com文件
6. [查看效果访问](http://gadmin.fungoweb.com/)
7. 测试账号:
   > 用户名: 18516321273
   > 密码:123456
