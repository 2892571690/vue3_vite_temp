<template>
  <el-drawer
    title="主题设置"
    v-model="settings.isDrawerSetting"
    :direction="direction"
    :before-close="handleClose"
    destroy-on-close
    :size="320"
  >
    <div class="theme-wrapper">
      <el-scrollbar height="85vh">
        <div class="form">
          <el-form label-width="100px" label-position="left">
            <el-form-item label="布局">
              <el-select
                class="theme-select-width"
                v-model="settings.mode"
                size="small"
                placeholder="请选择"
                @change="handleChangeMode"
              >
                <el-option
                  v-for="item in setting.modeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主题">
              <el-select
                class="theme-select-width"
                v-model="settings.theme"
                size="small"
                placeholder="请选择"
                @change="handleChangeTheme"
              >
                <el-option
                  v-for="item in setting.colorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Logo">
              <el-switch v-model="settings.isLogo" />
            </el-form-item>
            <el-form-item label="标签">
              <el-switch @change="handleChangeTag" v-model="setting.tag" />
            </el-form-item>
            <el-form-item label="面包导航">
              <el-switch
                :disabled="settings.mode === 'horizontal'"
                @change="handleChangeBread"
                v-model="setting.isBreadcrumb"
              />
            </el-form-item>
            <el-form-item label="固定头部">
              <el-switch :disabled="isMobile" v-model="settings.fixedHead" />
            </el-form-item>
            <el-form-item label="全屏">
              <el-switch v-model="settings.fullScreen" />
            </el-form-item>
            <el-form-item label="刷新">
              <el-switch v-model="settings.refresh" />
            </el-form-item>
            <el-form-item label="通知">
              <el-switch v-model="settings.notice" />
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>

      <div class="drawer-footer">
        <el-button size="small" @click="replyDefault">恢复默认</el-button>
        <el-button type="primary" size="small" @click="handleToSave">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'ThemeSetting',
};
</script>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { settingStore } from '@/store/setting.js'

const ORIGINAL_THEME = '#409EFF';

import { themeConfig } from '@/config/theme';
const { themeOptions } = themeConfig;

const settingState = settingStore();

const setting = reactive({
  tag: true,
  chalk: '',
  isLogo: true,
  mode: 'vertical',
  isBreadcrumb: true,
  fixedHead: true,
  fullscreen: true,
  refresh: true,
  notice: true,
  modeOption: [
    {
      value: 'vertical',
      label: '纵向',
    },
    {
      value: 'horizontal',
      label: '横向',
    },
  ],
  colorOptions: [
    {
      value: 'theme1',
      label: '蓝白',
    },
    {
      value: 'theme2',
      label: '蓝黑',
    },
    {
      value: 'theme3',
      label: '绿白',
    },
    {
      value: 'theme4',
      label: '绿黑',
    },
    {
      value: 'theme5',
      label: '红白',
    },
    {
      value: 'theme6',
      label: '红黑',
    },
  ],
});

const direction = ref('rtl');

const settings = computed(() => {
  return settingState.getSettings
});

const isMobile = computed(() => {
  return settingState.getIsMobile
});

const replyDefault = () => {
  settingState.$reset()
}

const handleToSave = () => {
  settingState.setSettingOptions(settings)
  settingState.setSettingDrawer(false)
};

const handleChangeTag = (val) => {
  settingState.setTag(val)
};

const handleChangeBread = (val) => {
  settingState.setBreadcrumb(val)
};

const handleChangeMode = (val) => {
  settingState.setSettingOptions(settings)
  settingState.setMode(val)
};

const handleChangeTheme = (val) => {
  settingState.setTheme(val)
};

const getThemeCluster = (theme) => {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    if (tint === 0) {
      return [red, green, blue].join(',');
    } else {
      red += Math.round(tint * (255 - red));
      green += Math.round(tint * (255 - green));
      blue += Math.round(tint * (255 - blue));
      red = red.toString(16);
      green = green.toString(16);
      blue = blue.toString(16);
      return `#${red}${green}${blue}`;
    }
  };
  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);
    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);
    return `#${red}${green}${blue}`;
  };
  const clusters = [theme];
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1));
  return clusters;
};

const updateStyle = (style, oldCluster, newCluster) => {
  let newStyle = style;
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
  });
  return newStyle;
};

const getCSSString = (url, variable) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setting[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '');
        resolve();
      }
    };
    xhr.open('GET', url);
    xhr.send();
  });
};

watch(
  () => settings.value.theme,
  async (theme) => {
    const val = themeOptions[theme].primary;

    const oldVal = setting.chalk ? settings.value.theme : ORIGINAL_THEME;
    // console.log(val, oldVal);
    if (typeof val !== 'string') return;
    const themeCluster = getThemeCluster(val.replace('#', ''));
    const originalCluster = getThemeCluster(oldVal.replace('#', ''));
    // console.log(themeCluster, originalCluster)

    const getHandler = (variable, id) => {
      return () => {
        const originalCluster = getThemeCluster(ORIGINAL_THEME.replace('#', ''));
        const newStyle = updateStyle(setting[variable], originalCluster, themeCluster);
        let styleTag = document.getElementById(id);
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.setAttribute('id', id);
          document.head.appendChild(styleTag);
        }
        styleTag.innerText = newStyle;
      };
    };
    if (!setting.chalk) {
      const url = `https://cdn.jsdelivr.net/npm/element-plus@1.1.0-beta.10/dist/index.css`;
      await getCSSString(url, 'chalk');
    }
    const chalkHandler = getHandler('chalk', 'chalk-style');
    chalkHandler();
    const styles = [].slice.call(document.querySelectorAll('style')).filter((style) => {
      const text = style.innerText;
      // console.log(text);

      // console.log(new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text));
      return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text);
    });
    styles.forEach((style) => {
      const { innerText } = style;
      if (typeof innerText !== 'string') return;
      style.innerText = updateStyle(innerText, originalCluster, themeCluster);
    });
  },
  {
    immediate: true,
  }
);

const handleClose = () => {
  settingState.setSettingDrawer(false)
};
</script>

<style lang="scss" scoped>
.theme-wrapper {
  display: flex;
  flex-direction: column;
  height: $base-height;
  .form {
    flex: 1;
    padding: 0 20px;
  }
  :deep(.el-form-item__content) {
    text-align: right;
  }
  .theme-select-width {
    width: $base-select-width-small;
  }
  .drawer-footer {
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    align-content: center;
    justify-content: space-between;
    width: $base-drawer-width;
    height: $base-drawer-footer-height;
    padding: $base-padding-10-20;
    background-color: $base-color-white;
    border-top: 1px solid $base-border-color;
  }
}
</style>
