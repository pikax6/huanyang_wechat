// 今日首页逻辑
const app = getApp()
const { getToday, getNow, getHour } = require('../../utils/storage.js')
const { getLevelText, getDialogue, getYangLevel, applyHabitEffect } = require('../../utils/character.js')
const { MOOD_LEVELS } = require('../../utils/mood.js')

Page({
  data: {
    theme: null,
    character: null,
    greeting: '',
    greetingEmoji: '',
    dateText: '',
    dialogueContext: '',
    statusList: [],
    tasks: [],
    moodLevels: MOOD_LEVELS,
    selectedMood: 0,
    points: 0,
  },

  onLoad() {
    this.initPage()
  },

  onShow() {
    this.refreshData()
  },

  initPage() {
    // 设置问候语
    const hour = getHour()
    let greeting, emoji
    if (hour < 6) {
      greeting = '夜深了'; emoji = '🌙'
    } else if (hour < 11) {
      greeting = '早上好'; emoji = '☀️'
    } else if (hour < 14) {
      greeting = '中午好'; emoji = '🌤️'
    } else if (hour < 18) {
      greeting = '下午好'; emoji = '⛅'
    } else if (hour < 22) {
      greeting = '晚上好'; emoji = '🌆'
    } else {
      greeting = '夜深了'; emoji = '🌙'
      this.setData({ dialogueContext: 'lateNight' })
    }
    this.setData({ greeting, greetingEmoji: emoji })

    // 设置日期
    const now = new Date()
    const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()]
    this.setData({
      dateText: `${now.getMonth() + 1}月${now.getDate()}日 ${weekDay}`,
    })

    this.refreshData()
  },

  refreshData() {
    const globalData = app.globalData
    const theme = globalData.theme
    const character = globalData.character

    // 应用主题色到页面
    this.applyTheme(theme)

    // 构建状态列表
    const statusList = [
      { key: 'complexion', icon: '✨', name: '气色', value: character.complexion, color: theme.colors.complexion, text: getLevelText('complexion', character.complexion) },
      { key: 'energy', icon: '⚡', name: '精力', value: character.energy, color: theme.colors.energy, text: getLevelText('energy', character.energy) },
      { key: 'body', icon: '💪', name: '体型', value: character.body, color: theme.colors.body, text: getLevelText('body', character.body) },
      { key: 'sleep', icon: '😴', name: '睡眠', value: character.sleep, color: theme.colors.sleep, text: getLevelText('sleep', character.sleep) },
    ]

    // 构建今日任务（从戒断计划生成）
    const tasks = this.generateTasks(globalData.plans)

    // 检查今日已记录的情绪
    const today = getToday()
    const todayMoods = (globalData.moods || []).filter(m => m.date === today)
    const selectedMood = todayMoods.length > 0 ? todayMoods[todayMoods.length - 1].mood : 0

    this.setData({
      theme: theme.colors,
      character,
      statusList,
      tasks,
      selectedMood,
      points: globalData.points || 0,
    })
  },

  applyTheme(theme) {
    const colors = theme.colors
    // 动态设置CSS变量
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: colors.bg,
    })
  },

  generateTasks(plans) {
    const today = getToday()
    const tasks = []
    plans.forEach((plan, index) => {
      if (plan.status === 'active') {
        const todayCheckin = (plan.checkins || []).find(c => c.date === today)
        tasks.push({
          id: plan.id,
          text: plan.dailyTask || plan.name,
          done: todayCheckin ? todayCheckin.done : false,
          planIndex: index,
        })
      }
    })
    return tasks
  },

  // 切换任务完成状态
  toggleTask(e) {
    const index = e.currentTarget.dataset.index
    const tasks = this.data.tasks
    const task = tasks[index]
    const newDone = !task.done

    // 更新任务状态
    tasks[index].done = newDone
    this.setData({ tasks })

    // 更新戒断计划的打卡记录
    const plans = app.globalData.plans
    const plan = plans[task.planIndex]
    const today = getToday()

    if (!plan.checkins) plan.checkins = []
    const checkinIndex = plan.checkins.findIndex(c => c.date === today)
    
    if (checkinIndex >= 0) {
      plan.checkins[checkinIndex].done = newDone
    } else {
      plan.checkins.push({ date: today, done: newDone, time: getNow() })
    }

    // 更新连续天数和还阳值
    if (newDone) {
      plan.streak = (plan.streak || 0) + 1
      app.globalData.yangValue = (app.globalData.yangValue || 0) + 20
      
      // 应用习惯正面影响到小人
      app.globalData.character = applyHabitEffect(app.globalData.character, plan.positiveHabit || '早睡', true)
    } else {
      plan.streak = 0
      // 撤销影响（应用负面）
      app.globalData.character = applyHabitEffect(app.globalData.character, plan.habit, false)
    }

    // 更新等级
    const yangInfo = getYangLevel(app.globalData.yangValue)
    app.globalData.character.level = yangInfo.level

    // 检查等级提升并发放积分奖励
    const levelUpInfo = app.checkLevelUp(app.globalData.yangValue)
    if (levelUpInfo.leveledUp) {
      setTimeout(() => {
        wx.showToast({
          title: '升级！Lv.' + levelUpInfo.newLevel + ' 奖励' + levelUpInfo.reward + '积分',
          icon: 'none',
          duration: 2500,
        })
      }, 500)
    }

    app.saveData()
    this.refreshData()

    // 触感反馈
    wx.vibrateShort({ type: newDone ? 'medium' : 'light' })
  },

  // 快速记录心情
  quickMood(e) {
    const value = e.currentTarget.dataset.value
    const today = getToday()
    const moods = app.globalData.moods || []

    // 检查今日是否已有记录
    const existingIndex = moods.findIndex(m => m.date === today)
    if (existingIndex >= 0) {
      moods[existingIndex].mood = value
      moods[existingIndex].time = getNow()
    } else {
      moods.push({
        id: Date.now(),
        date: today,
        time: getNow(),
        mood: value,
        scenes: [],
        note: '',
        habits: [],
        timestamp: Date.now(),
      })
    }

    app.globalData.moods = moods
    app.saveData()
    this.setData({ selectedMood: value })

    wx.vibrateShort({ type: 'light' })
  },

  // 点击小人
  onCharacterTap() {
    // 刷新对话
    this.setData({ dialogueContext: 'tap' })
  },

  // 跳转商店
  goShop() {
    wx.navigateTo({ url: '/pages/shop/shop' })
  },

  // 跳转设置
  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },
})
