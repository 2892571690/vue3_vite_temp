//引入vue-i18n组件
import { createI18n } from 'vue-i18n'

import Cookie from '@/utils/auth.js'
import { setting } from '@/config/setting.js'
const { langKey } = setting

// 引入语言
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'//element-plus的语言
import elementEnLocale from "element-plus/lib/locale/lang/en";//element-plus的语言
import zh from './config/zh'//自己创建的语言
import en from './config/en'//自己创建的语言

const messages = {
    'zh-cn': {
        ...zh,
        ...elementZhLocale,
    },
    en: {
        ...en,
        ...elementEnLocale,
    }
}

export const getLocale = () => {
    const cookieLanguage = Cookie.getToken(langKey)//获取cooking储存的语言
    if (cookieLanguage) {
        return cookieLanguage;
    }
    const language = navigator.language.toLowerCase();//获取浏览器的语言
    const locales = Object.keys(messages);
    for (const locale of locales) {
        if (language.indexOf(locale) > -1) {
            return locale;
        }
    }

    return 'zh';
};

const i18n = createI18n({
    globalInjection: true, // 全局注册 $t方法
    locale: getLocale(),
    messages: messages,
})
export default i18n