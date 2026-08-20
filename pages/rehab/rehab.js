// 还阳页逻辑 - 戒断打卡
const app = getApp()
const { getToday, getNow } = require('../../utils/storage.js')
const { getYangLevel, applyHabitEffect } = require('../../utils/character.js')
const { analyzeInsights } = require('../../utils/mood.js')

// 坏习惯选项
const HABIT_OPTIONS = [
  { id: 'lateNight', icon: '🌙', name: '熬夜修仙', category: '作息饮食', habit: '熬夜', positiveHabit: '早睡' },
  { id: 'takeout', icon: '🍔', name: '深夜外卖', category: '作息饮食', habit: '深夜外卖', positiveHabit: '好好吃饭' },
  { id: 'breakfast', icon: '🍳', name: '不吃早餐', category: '作息饮食', habit: '不吃早餐', positiveHabit: '好好吃饭' },
  { id: 'phone', icon: '📱', name: '刷手机停不下来', category: '数字成瘾', habit: '刷手机', positiveHabit: '运动' },
  { id: 'procrastinate', icon: '🐌', name: '拖延症', category: '数字成瘾', habit: '久坐', positiveHabit: '运动' },
  { id: 'water', icon: '💧', name: '不喝水', category: '生活习惯', habit: '不喝水', positiveHabit: '喝水' },
  { id: 'exercise', icon: '🏃', name: '不运动', category: '生活习惯', habit: '久坐', positiveHabit: '运动' },
  { id: 'sit', icon: '🪑', name: '久坐不动', category: '生活习惯', habit: '久坐', positiveHabit: '运动' },
  { id: 'emotionalEat', icon: '🍰', name: '情绪性进食', category: '情绪行为', habit: '情绪性进食', positiveHabit: '好好吃饭' },
  { id: 'emo', icon: '😢', name: '深夜emo', category: '情绪行为', habit: '熬夜', positiveHabit: '早睡' },
  { id: 'anxiety', icon: '😰', name: '内耗焦虑', category: '情绪行为', habit: '久坐', positiveHabit: '运动' },
  { id: 'infoOverload', icon: '📰', name: '信息焦虑', category: '数字成瘾', habit: '刷手机', positiveHabit: '运动' },
]

const DAY_OPTIONS = [7, 14, 21, 30, 60, 90]

const RESCUE_LIST = [
  { id: 'foodDefense', icon: '🛡️', name: '深夜放毒防御', desc: '想吃外卖时点这里' },
  { id: 'sleepIntercept', icon: '🌙', name: 'emo熬夜拦截', desc: '深夜刷手机时点这里' },
  { id: 'anxietyRescue', icon: '😰', name: '摸鱼焦虑急救', desc: '工作焦虑想逃避时点这里' },
]

Page({
  data: {
    theme: null,
    yangValue: 0,
    yangLevel: 1,
    yangName: '初入还阳',
    yangProgress: 0,
    yangNextNeed: 100,
    plans: [],
    rescueList: RESCUE_LIST,
    // 弹窗
    showModal: false,
    modalStep: 1,
    habitOptions: HABIT_OPTIONS,
    dayOptions: DAY_OPTIONS,
    selectedHabit: null,
    selectedMode: 'gradual',
    selectedDays: 21,
  },

  onShow() {
    this.refreshData()
  },

  refreshData() {
    const globalData = app.globalData
    const theme = globalData.theme
    const yangInfo = getYangLevel(globalData.yangValue || 0)
    const plans = this.formatPlans(globalData.plans || [], globalData.moods || [])

    this.setData({
      theme: theme.colors,
      yangValue: globalData.yangValue || 0,
      yangLevel: yangInfo.level,
      yangName: yangInfo.name,
      yangProgress: yangInfo.progress,
      yangNextNeed: yangInfo.nextLevelValue - (globalData.yangValue || 0),
      plans,
    })
  },

  // 格式化计划列表
  formatPlans(plans, moods) {
    const today = getToday()
    const insights = analyzeInsights(moods, 14)

    return plans.map(plan => {
      const todayCheckin = (plan.checkins || []).find(c => c.date === today)
      const progressPercent = Math.min(100, ((plan.streak || 0) / plan.targetDays) * 100)

      // 匹配情绪洞察
      let insight = ''
      if (insights.ready) {
        const match = insights.insights.find(i => i.habit === plan.habit)
        if (match) insight = match.message
      }

      // 找到习惯选项
      const habitOpt = HABIT_OPTIONS.find(h => h.id === plan.habitId)
      const iconBg = habitOpt ? habitOpt.icon + '22' : '#7EC8A022'

      return {
        ...plan,
        icon: plan.icon || habitOpt?.icon || '🎯',
        iconBg: iconBg,
        categoryText: plan.category,
        progressPercent,
        todayDone: todayCheckin ? todayCheckin.done : false,
        insight,
      }
    })
  },

  // 打卡
  checkinPlan(e) {
    const index = e.currentTarget.dataset.index
    const plans = app.globalData.plans
    const plan = plans[index]
    const today = getToday()

    if (!plan.checkins) plan.checkins = []
    const todayCheckin = plan.checkins.find(c => c.date === today)

    if (todayCheckin && todayCheckin.done) {
      // 今日已打卡，取消
      wx.showModal({
        title: '取消打卡？',
        content: '确定取消今日打卡吗？',
        success: (res) => {
          if (res.confirm) {
            todayCheckin.done = false
            plan.streak = Math.max(0, (plan.streak || 0) - 1)
            app.globalData.yangValue = Math.max(0, (app.globalData.yangValue || 0) - 20)
            app.saveData()
            this.refreshData()
          }
        }
      })
      return
    }

    // 打卡成功
    if (todayCheckin) {
      todayCheckin.done = true
      todayCheckin.time = getNow()
    } else {
      plan.checkins.push({ date: today, done: true, time: getNow() })
    }

    plan.streak = (plan.streak || 0) + 1
    const newYangValue = (app.globalData.yangValue || 0) + 20
    app.globalData.yangValue = newYangValue

    // 应用正面习惯影响
    app.globalData.character = applyHabitEffect(
      app.globalData.character,
      plan.positiveHabit || '早睡',
      true
    )

    // 更新等级
    const yangInfo = getYangLevel(newYangValue)
    app.globalData.character.level = yangInfo.level

    // 积分奖励：打卡本身 +5
    app.addPoints(5, '还阳打卡')
    // 积分奖励：连续打卡（3/7/14/30/60/90天）
    const streakReward = app.checkStreakReward(plan.streak)
    // 积分奖励：等级提升
    const levelUpInfo = app.checkLevelUp(newYangValue)

    app.saveData()
    wx.vibrateShort({ type: 'medium' })
    this.refreshData()

    // 展示奖励
    setTimeout(() => {
      let msg = '打卡成功 +20还阳值 +5积分'
      if (streakReward > 0) {
        msg += '\n连续' + plan.streak + '天！再+' + streakReward + '积分'
      }
      if (levelUpInfo.leveledUp) {
        msg += '\n升级 Lv.' + levelUpInfo.newLevel + '！奖励' + levelUpInfo.reward + '积分'
      }
      wx.showToast({ title: msg, icon: 'none', duration: 2500 })
    }, 200)

    // 检查是否达成目标
    if (plan.streak >= plan.targetDays) {
      const finishBonus = plan.targetDays * 2
      app.addPoints(finishBonus, '还阳计划完成')
      app.saveData()
      setTimeout(() => {
        wx.showToast({
          title: '还阳成功！🎉 +' + finishBonus + '积分',
          icon: 'none',
          duration: 2500,
        })
      }, 2800)
    }
  },

  // 新增计划弹窗
  showAddPlan() {
    this.setData({
      showModal: true,
      modalStep: 1,
      selectedHabit: null,
      selectedMode: 'gradual',
      selectedDays: 21,
    })
  },

  closeModal() {
    this.setData({ showModal: false })
  },

  selectHabit(e) {
    this.setData({ selectedHabit: e.currentTarget.dataset.id })
  },

  selectMode(e) {
    this.setData({ selectedMode: e.currentTarget.dataset.mode })
  },

  selectDays(e) {
    this.setData({ selectedDays: e.currentTarget.dataset.days })
  },

  nextStep() {
    const { modalStep, selectedHabit } = this.data
    if (modalStep === 1 && !selectedHabit) {
      wx.showToast({ title: '请选择一个坏习惯', icon: 'none' })
      return
    }
    if (modalStep < 3) {
      this.setData({ modalStep: modalStep + 1 })
    } else {
      this.createPlan()
    }
  },

  prevStep() {
    if (this.data.modalStep > 1) {
      this.setData({ modalStep: this.data.modalStep - 1 })
    }
  },

  createPlan() {
    const { selectedHabit, selectedMode, selectedDays } = this.data
    const habitOpt = HABIT_OPTIONS.find(h => h.id === selectedHabit)
    if (!habitOpt) return

    const plan = {
      id: Date.now(),
      habitId: habitOpt.id,
      name: `戒${habitOpt.name}`,
      icon: habitOpt.icon,
      category: habitOpt.category,
      habit: habitOpt.habit,
      positiveHabit: habitOpt.positiveHabit,
      mode: selectedMode,
      targetDays: selectedDays,
      streak: 0,
      status: 'active',
      checkins: [],
      createdAt: Date.now(),
    }

    app.globalData.plans = app.globalData.plans || []
    app.globalData.plans.push(plan)
    app.saveData()

    this.setData({ showModal: false })
    this.refreshData()

    wx.showToast({ title: '还阳计划已创建！', icon: 'success' })
  },

  // 空函数，防止点击弹窗内容时冒泡到mask关闭
  noop() {},

  // 场景急救包 - 跳转到独立页面
  openRescue(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/rescue/rescue?id=' + id,
    })
  },
})
