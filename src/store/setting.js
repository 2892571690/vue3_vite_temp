import { defineStore } from 'pinia'
import Cookies from '@/utils/auth.js'
import { themeConfig } from '@/config/theme';
import { setting } from '@/config/setting';

const { themeKey, lang, langKey } = setting;
const { mode, theme, fixedHead, fullScreen, refresh, collapse, notice, isBreadcrumb, isLogo, tag } = themeConfig;

const getThemeKey = () => {
    const settings = Cookies.getToken(themeKey);
    return settings ? JSON.parse(settings) : null;
}

const getLanguage = () => {
    return Cookies.getToken(langKey);
}

const setLanguage = (lang) => {
    return Cookies.setToken(langKey, lang, 60 * 60 * 24 * 7);
}

const setSettings = (theme) => {
    return Cookies.setToken(themeKey, JSON.stringify(theme));
}

export const settingStore = defineStore('setting', {
    state: () => ({
        isMobile: false, // 是否为移动端
        isDrawer: false, // 是否展开移动端菜单
        routerView: true, // 是否显示路由
        isDrawerSetting: false, // 是否打开主题设置
        isFullScreen: false, // 是否显示全屏
        fixedHead,
        tag,
        fullScreen,
        refresh,
        notice,
        collapse,
        mode: getThemeKey() ? getThemeKey().mode : mode,
        isBreadcrumb,
        theme,
        isLogo,
        lang: getLanguage() || lang,
    }),
    getters: {
        getIsMobile: (state) => state.isMobile,
        getFixedHead: (state) => state.fixedHead,
        getTag: (state) => state.tag,
        getCollapse: (state) => state.collapse,
        getMode: (state) => state.mode,
        getIsDrawer: (state) => state.isDrawer,
        getIsBreadcrumb: (state) => state.isBreadcrumb,
        getSettings: (state) => state,
        getRouterView: (state) => state.routerView,
        getTheme: (state) => state.theme,
        getIsLogo: (state) => state.isLogo,
        getIsDrawerSetting: (state) => state.isDrawerSetting,
        getIsFullScreen: (state) => state.isFullScreen,
        getLang: (state) => state.lang,
        getFullScreen: (state) => state.fullScreen,
        getRefresh: (state) => state.refresh,
        getNotice: (state) => state.notice,
    },
    actions: {
        setIsMobile(flag) {
            this.isMobile = flag
        },
        setTag(flag) {
            this.tag = flag;
        },
        setCollapse() {
            this.collapse = !this.collapse;
        },
        /**
         * @description 切换布局
         * @param {string} mode 可选值：vertical|horizontal
        */
        setMode(mode) {
            this.mode = mode;
        },
        /**
         * @description 是否展开移动端菜单
         *  @param {boolean} flag true|false
        */
        setIsDrawer(flag) {
            this.isDrawer = flag;
        },
        /**
         * @description 是否显示面包导航
         * @param {boolean} flag true|false
        */
        setBreadcrumb(flag) {
            this.isBreadcrumb = flag;
        },
        /**
         * @description 是否刷新路由
         *  @param {boolean} flag true|false
        */
        setRouterView(flag) {
            this.routerView = !this.routerView;
        },
        /**
         * @description 是否打开主题设置
         * @param {boolean} flag true|false
         */
        setSettingDrawer(flag) {
            this.isDrawerSetting = flag;
        },
        /**
         * @description 切换是否全屏
         *  @param {boolean} flag true|false
         */
        changeFullScreen(flag) {
            this.isFullScreen = flag;
        },
        /**
         * @description 切换语言
         * @param {string} lang 语言 可选值： zh-cn|en
         */
        changeLanguage(lang) {
            setLanguage(lang);
            this.lang = lang;
        },
        /**
         * @description 设置主题配置信息
         * @param {object} options 配置项
         */
        setSettingOptions(options) {
            setSettings(options.value.$state);
            Object.assign(this, { ...options.value.$state });
        },
        /**
         * @description 设置主题
         * @param {strinng} theme 系统默认：blue|green|red|default
         */
        setTheme(theme) {
            this.theme = theme;
        },
    }
})