/**
 * 公共配置文件
 * vite相关的配置文件参考 https://cn.vitejs.dev/config/#define
 */

export const setting = {
    // 标题
    title: 'vite开发模板',
    // intelligence 前端控制路由 all 后端控制
    authentication: 'intelligence',
    //是否开启登录拦截
    loginInterception: true,
    //是否显示顶部进度条
    progressBar: true,
    // 路由白名单不经过token校验的路由
    routesWhiteList: ['/login', '/register', '/404', '/401'],
    //token失效回退到登录页时是否记录本次的路由
    recordRoute: true,
    //token名称
    tokenName: 'Token',
    // theme storage
    themeKey: 'theme',
    // 版权信息
    copyright: '泽辰开发模板专用，请勿商用',
    // vertical布局时是否只保持一个子菜单的展开
    uniqueOpened: false,
    // 菜单栏默认打开路由
    // defaultOpeneds: ['/comp', '/errorPage', '/chart'],
    defaultOpeneds: [],
    // default language
    lang: 'zh-cn',
    // lang storage
    langKey: 'i18nLang',
}