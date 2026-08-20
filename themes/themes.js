// 多主题配色方案
const themes = {
  // 🌿 薄荷绿主题（默认）
  mint: {
    id: 'mint',
    name: '薄荷绿',
    icon: '🌿',
    desc: '清新自然，像清晨第一缕风',
    colors: {
      primary: '#7EC8A0',
      primaryLight: '#A8DDBE',
      primaryDark: '#5BA87E',
      accent: '#FF8B6E',
      accentLight: '#FFB4A0',
      bg: '#F5F9F5',
      card: '#FFFFFF',
      textPrimary: '#3A3A3A',
      textSecondary: '#8A8A8A',
      textLight: '#B8B8B8',
      border: '#E8F0E8',
      shadow: 'rgba(126, 200, 160, 0.15)',
      // 维度色
      complexion: '#FF8B6E',
      energy: '#F5C842',
      body: '#7EC8A0',
      sleep: '#9B8EC4',
      // 进度条
      progressBg: '#E8F0E8',
      progressFill: '#7EC8A0',
    }
  },

  // 💜 薰衣草紫主题
  lavender: {
    id: 'lavender',
    name: '薰衣草紫',
    icon: '💜',
    desc: '梦幻温柔，像傍晚的晚霞',
    colors: {
      primary: '#9B8EC4',
      primaryLight: '#C4B8DE',
      primaryDark: '#7B6BA8',
      accent: '#F5A623',
      accentLight: '#F8C468',
      bg: '#F8F6FB',
      card: '#FFFFFF',
      textPrimary: '#3A3548',
      textSecondary: '#8A8295',
      textLight: '#B8B2C4',
      border: '#EDE7F6',
      shadow: 'rgba(155, 142, 196, 0.15)',
      complexion: '#F5A623',
      energy: '#FF8B6E',
      body: '#9B8EC4',
      sleep: '#7BA7C7',
      progressBg: '#EDE7F6',
      progressFill: '#9B8EC4',
    }
  },

  // 🌊 雾霭蓝主题
  ocean: {
    id: 'ocean',
    name: '雾霭蓝',
    icon: '🌊',
    desc: '沉静辽阔，像海边的风',
    colors: {
      primary: '#7BA7C7',
      primaryLight: '#A8C5DB',
      primaryDark: '#5B87A7',
      accent: '#FFB347',
      accentLight: '#FFCD7A',
      bg: '#F5F8FA',
      card: '#FFFFFF',
      textPrimary: '#2A3A45',
      textSecondary: '#7A8A95',
      textLight: '#B0B8C0',
      border: '#E3F2FD',
      shadow: 'rgba(123, 167, 199, 0.15)',
      complexion: '#FFB347',
      energy: '#FF8B6E',
      body: '#7BA7C7',
      sleep: '#9B8EC4',
      progressBg: '#E3F2FD',
      progressFill: '#7BA7C7',
    }
  },

  // 🍂 焦糖棕主题
  caramel: {
    id: 'caramel',
    name: '焦糖棕',
    icon: '🍂',
    desc: '温暖治愈，像秋日的午后',
    colors: {
      primary: '#C4956C',
      primaryLight: '#DDB898',
      primaryDark: '#A4755C',
      accent: '#7EC8A0',
      accentLight: '#A8DDBE',
      bg: '#FAF7F2',
      card: '#FFFFFF',
      textPrimary: '#3D3328',
      textSecondary: '#8A7E70',
      textLight: '#B8AFA5',
      border: '#F0E8DC',
      shadow: 'rgba(196, 149, 108, 0.15)',
      complexion: '#E89B5C',
      energy: '#F5C842',
      body: '#C4956C',
      sleep: '#9B8EC4',
      progressBg: '#F0E8DC',
      progressFill: '#C4956C',
    }
  },

  // 🌸 樱花粉主题
  sakura: {
    id: 'sakura',
    name: '樱花粉',
    icon: '🌸',
    desc: '柔软浪漫，像春天的花瓣',
    colors: {
      primary: '#E8A0BF',
      primaryLight: '#F0C2D4',
      primaryDark: '#C8809F',
      accent: '#7EC8A0',
      accentLight: '#A8DDBE',
      bg: '#FDF5F7',
      card: '#FFFFFF',
      textPrimary: '#3D2D35',
      textSecondary: '#8A7278',
      textLight: '#C4ADB4',
      border: '#FCE4EC',
      shadow: 'rgba(232, 160, 191, 0.15)',
      complexion: '#E89B5C',
      energy: '#F5C842',
      body: '#E8A0BF',
      sleep: '#9B8EC4',
      progressBg: '#FCE4EC',
      progressFill: '#E8A0BF',
    }
  },

  // ☁️ 暖灰白主题
  cloud: {
    id: 'cloud',
    name: '暖灰白',
    icon: '☁️',
    desc: '极简干净，像棉花糖一样柔软',
    colors: {
      primary: '#A0A4B0',
      primaryLight: '#C8CCD4',
      primaryDark: '#808490',
      accent: '#FF8B6E',
      accentLight: '#FFB4A0',
      bg: '#FAFAFA',
      card: '#FFFFFF',
      textPrimary: '#333333',
      textSecondary: '#888888',
      textLight: '#BBBBBB',
      border: '#F0F0F0',
      shadow: 'rgba(160, 164, 176, 0.12)',
      complexion: '#FF8B6E',
      energy: '#F5C842',
      body: '#A0A4B0',
      sleep: '#9B8EC4',
      progressBg: '#F0F0F0',
      progressFill: '#A0A4B0',
    }
  },
}

// 获取主题列表
function getThemeList() {
  return Object.values(themes).map(t => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    desc: t.desc,
  }))
}

// 获取指定主题
function getTheme(themeId) {
  return themes[themeId] || themes.mint
}

// 获取默认主题
function getDefaultTheme() {
  return themes.mint
}

module.exports = {
  themes,
  getThemeList,
  getTheme,
  getDefaultTheme,
}
