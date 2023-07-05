// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

//BUILD_ENV 打包环境
const { REACT_APP_ENV, BUILD_ENV } = process.env;

let config = {
  //hash: true,
  // history: 'brower',

  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/', //默认跳转到 问题列表
          redirect: '/post/question/list',
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/post/question',
            },
            {
              path: '/post',
              name: '内容管理',
              icon: 'table',
              authority: ['admin'],
              routes: [
                {
                  path: '/post/question',
                  name: '问题',
                  icon: 'QuestionCircleOutlined',
                  authority: ['admin'],
                  routes: [
                    {
                      path: '/post/question',
                      redirect: '/post/question/list',
                    },
                    {
                      path: '/post/question/list',
                      name: '问题列表',
                      component: './post/question',
                    },
                    {
                      path: '/post/question/add',
                      name: '问题添加',
                      component: './post/question/CreateForm',
                    },
                    {
                      path: '/post/question/:id',
                      name: '问题详情',
                      hideInMenu: true,
                      component: './post/question/View',
                    },
                  ],
                },
                {
                  path: '/post/answer',
                  name: '回答',
                  icon: 'table',
                  authority: ['admin'],
                  routes: [
                    {
                      path: '/post/answer',
                      redirect: '/post/answer/list',
                    },
                    {
                      path: '/post/answer/list',
                      name: '回答列表',
                      component: './post/answer',
                    },
                    {
                      path: '/post/answer/:id',
                      name: '回答详情',
                      hideInMenu: true,
                      component: './post/answer/View',
                    },
                  ],
                },
                {
                  path: '/post/comment',
                  name: '评论',
                  icon: 'smile',
                  authority: ['admin'],
                  routes: [
                    {
                      path: '/post/comment',
                      redirect: '/post/comment/list',
                    },
                    {
                      path: '/post/comment/list',
                      name: '评论列表',
                      component: './post/comment',
                    },
                    {
                      path: '/post/comment/:id',
                      name: '评论详情',
                      hideInMenu: true,
                      component: './post/comment/View',
                    },
                  ],
                },
                {
                  path: '/post/recommend',
                  name: '推荐页',
                  icon: 'table',
                  authority: ['admin'],
                  routes: [
                    {
                      path: '/post/recommend',
                      redirect: '/post/recommend/banner/list',
                    },
                    {
                      path: '/post/recommend/banner',
                      redirect: '/post/recommend/banner/list',
                    },
                    {
                      path: '/post/recommend/banner/list',
                      name: 'banner列表',
                      component: './recommend/banner',
                    },
                    {
                      path: '/post/recommend/banner/:data',
                      name: '问题列表',
                      hideInMenu: true,
                      component: './recommend/banner/question',
                    },
                    {
                      path: '/post/recommend/list',
                      name: '问题列表',
                      component: './recommend/index',
                    },
                  ],
                },
              ],
            },
            {
              path: '/module',
              name: '模块管理',
              icon: 'table',
              authority: ['admin'],
              routes: [
                {
                  path: '/module/game',
                  name: '游戏',
                  icon: 'QuestionCircleOutlined',
                  authority: ['admin'],
                  routes: [
                    {
                      path: '/module/game',
                      redirect: '/module/game/list',
                    },
                    {
                      path: '/module/game/list',
                      name: '游戏列表',
                      component: './module/game',
                    },
                    {
                      path: '/module/game/:data',
                      name: '游戏组别列表',
                      hideInMenu: true,
                      component: './module/game/group',
                    },
                  ],
                },
                {
                  path: '/module/group',
                  name: '组别',
                  icon: 'QuestionCircleOutlined',
                  authority: ['admin'],
                  routes: [
                    {
                      path: '/module/group',
                      redirect: '/module/group/list',
                    },
                    {
                      path: '/module/group/list',
                      name: '组别列表',
                      component: './module/group',
                    },
                  ],
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
};

//uho_admin 测试路径
//gadmin -- gadmin.fungoweb.com 正式路径
//outputPath: BUILD_ENV === 'production' ? 'gadmin' : 'uho_admin',

//测试 or 调试
const testConfig = {
  outputPath: 'uho_admin',
  define: {
    OSS_FILE_NAME: 'uhoTest', //oss file 路径
  },
};

//生产
const proConfig = {
  outputPath: 'gadmin',
  define: {
    OSS_FILE_NAME: 'uho',
  },
};

config = Object.assign(config, BUILD_ENV === 'production' ? proConfig : testConfig);
export default defineConfig(config);
