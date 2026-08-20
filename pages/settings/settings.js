// 设置页逻辑：主题切换 / 提醒设置 / 数据管理
const app = getApp()
const { getThemeList } = require('../../themes/themes.js')

Page({
  data: {
    theme: null,
    themeList: [],          // 主题列表
    currentThemeId: '',     // 当前主题ID
    notify: true,           // 打卡提醒
    nightReminder: true,    // 深夜提醒
    nightReminderTime: '23:30', // 深夜提醒时间
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.refreshTheme()
  },

  // 加载主题列表和当前设置
  loadData() {
    const settings = app.globalData.settings
    this.setData({
      themeList: getThemeList(),
      currentThemeId: settings.themeId,
      notify: settings.notify,
      nightReminder: settings.nightReminder,
      nightReminderTime: settings.nightReminderTime,
    })
    this.refreshTheme()
  },

  // 刷新主题色（更新页面数据与导航栏颜色）
  refreshTheme() {
    const theme = app.globalData.theme
    this.setData({ theme: theme.colors })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: theme.colors.bg,
    })
  },

  // 切换主题
  switchTheme(e) {
    const themeId = e.currentTarget.dataset.id
    if (themeId === this.data.currentThemeId) return

    app.switchTheme(themeId)
    this.refreshTheme()
    this.setData({ currentThemeId: themeId })

    wx.vibrateShort({ type: 'medium' })
    wx.showToast({
      title: '主题已切换',
      icon: 'success',
    })
  },

  // 切换打卡提醒开关
  toggleNotify(e) {
    const value = e.detail.value
    app.globalData.settings.notify = value
    app.saveData()
    this.setData({ notify: value })
  },

  // 切换深夜提醒开关
  toggleNightReminder(e) {
    const value = e.detail.value
    app.globalData.settings.nightReminder = value
    app.saveData()
    this.setData({ nightReminder: value })
  },

  // 修改深夜提醒时间
  changeNightTime(e) {
    const value = e.detail.value
    app.globalData.settings.nightReminderTime = value
    app.saveData()
    this.setData({ nightReminderTime: value })
  },

  // 清除所有数据（带二次确认）
  clearData() {
    wx.showModal({
      title: '确认清除',
      content: '将清除所有打卡记录、情绪记录和设置，且无法恢复，确定继续吗？',
      confirmColor: '#FF8B6E',
      confirmText: '清除',
      success: (res) => {
        if (!res.confirm) return

        wx.clearStorageSync()
        // 重置 globalData
        app.globalData.theme = null
        app.globalData.character = null
        app.globalData.plans = []
        app.globalData.moods = []
        app.globalData.yangValue = 0
        app.globalData.yangLevel = 1
        app.globalData.ownedItems = []
        app.globalData.rescueHistory = []
        app.globalData.joinedGroups = []
        app.globalData.settings = {
          themeId: 'mint',
          notify: true,
          nightReminder: true,
          nightReminderTime: '23:30',
        }
        // 重新初始化（加载默认主题和默认小人）
        app.initData()

        wx.showToast({
          title: '数据已清除',
          icon: 'success',
        })
        // 重启到首页
        setTimeout(() => {
          wx.reLaunch({ url: '/pages/today/today' })
        }, 800)
      },
    })
  },
})
