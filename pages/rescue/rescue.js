// 场景急救包 - 丰富交互逻辑
const app = getApp()
const { getScenario, getRotatingActions } = require('../../utils/rescue.js')
const { getToday } = require('../../utils/storage.js')

const MOOD_OPTIONS = ['😖', '😔', '😐', '🙂', '😌']

Page({
  data: {
    theme: null,
    scenarioId: '',
    scenario: {},
    useCount: 0,
    currentMode: 'breathing',

    // 呼吸
    breathingConfig: {},
    breathingActive: false,
    breathingDone: false,
    breathPhase: '', // inhale / hold / exhale / hold2
    breathPhaseName: '',
    breathCountdown: 0,
    breathHint: '',
    currentRound: 1,

    // 决策树
    decisionConfig: {},
    currentNode: {},

    // 立即行动
    actionList: [],
    actionOffset: 0,

    // 记录
    moodOptions: MOOD_OPTIONS,
    selectedMood: '',
    recordText: '',
    historyList: [],
  },

  onLoad(options) {
    const scenarioId = options.id || 'foodDefense'
    const scenario = getScenario(scenarioId)
    if (!scenario) {
      wx.showToast({ title: '场景不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1000)
      return
    }

    const globalData = app.globalData
    const theme = globalData.theme
    const rescueHistory = globalData.rescueHistory || []
    const scenarioHistory = rescueHistory.filter(r => r.scenarioId === scenarioId)
    const useCount = scenarioHistory.length

    // 行动建议（轮换）
    const actionList = getRotatingActions(scenarioId, scenarioHistory)

    this.setData({
      theme: theme.colors,
      scenarioId,
      scenario,
      useCount,
      breathingConfig: scenario.breathing,
      decisionConfig: scenario.decisionTree,
      currentNode: scenario.decisionTree.nodes.start,
      actionList,
      actionOffset: useCount % scenario.actions.length,
      historyList: this.formatHistory(scenarioHistory),
    })
  },

  // 格式化历史记录
  formatHistory(history) {
    return history.slice(-5).reverse().map(r => ({
      ...r,
      timeText: this.formatTime(r.time),
    }))
  },

  formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    const diff = now - date
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
    const m = (date.getMonth() + 1) + '/' + date.getDate()
    const h = date.getHours().toString().padStart(2, '0')
    const min = date.getMinutes().toString().padStart(2, '0')
    return m + ' ' + h + ':' + min
  },

  // 切换模式
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ currentMode: mode })
  },

  // ============ 呼吸练习 ============
  startBreathing() {
    this.setData({
      breathingActive: true,
      breathingDone: false,
      currentRound: 1,
    })
    this.runBreathPhase(0)
  },

  runBreathPhase(phaseIdx) {
    const phases = this.data.breathingConfig.phases
    if (phaseIdx >= phases.length) {
      // 进入下一轮
      const nextRound = this.data.currentRound + 1
      if (nextRound > this.data.breathingConfig.rounds) {
        // 完成
        this.finishBreathing()
        return
      }
      this.setData({ currentRound: nextRound })
      this.runBreathPhase(0)
      return
    }

    const phase = phases[phaseIdx]
    const phaseKey = ['inhale', 'hold', 'exhale', 'hold2'][phaseIdx] || 'inhale'

    this.setData({
      breathPhase: phaseKey,
      breathPhaseName: phase.name,
      breathCountdown: phase.duration,
      breathHint: phase.hint,
    })

    let remaining = phase.duration
    this.breathTimer = setInterval(() => {
      remaining--
      if (remaining <= 0) {
        clearInterval(this.breathTimer)
        this.runBreathPhase(phaseIdx + 1)
      } else {
        this.setData({ breathCountdown: remaining })
      }
    }, 1000)
  },

  stopBreathing() {
    if (this.breathTimer) clearInterval(this.breathTimer)
    this.setData({
      breathingActive: false,
      breathPhase: '',
      breathPhaseName: '',
      breathCountdown: 0,
    })
  },

  finishBreathing() {
    this.setData({
      breathingActive: false,
      breathingDone: true,
      breathPhase: '',
    })
    this.completeRescue()
  },

  // ============ 决策树 ============
  chooseOption(e) {
    const next = e.currentTarget.dataset.next
    const nextNode = this.data.decisionConfig.nodes[next]
    if (nextNode) {
      this.setData({ currentNode: nextNode })
    }
  },

  restartDecision() {
    this.setData({ currentNode: this.data.decisionConfig.nodes.start })
  },

  // ============ 立即行动 ============
  refreshActions() {
    const scenario = this.data.scenario
    const newOffset = (this.data.actionOffset + 3) % scenario.actions.length
    const actionList = []
    for (let i = 0; i < 3; i++) {
      actionList.push(scenario.actions[(newOffset + i) % scenario.actions.length])
    }
    this.setData({
      actionList,
      actionOffset: newOffset,
    })
    wx.vibrateShort({ type: 'light' })
  },

  // ============ 记录 ============
  selectMood(e) {
    this.setData({ selectedMood: e.currentTarget.dataset.mood })
  },

  onRecordInput(e) {
    this.setData({ recordText: e.detail.value })
  },

  saveRecord() {
    const { scenarioId, selectedMood, recordText } = this.data
    if (!selectedMood && !recordText) {
      wx.showToast({ title: '选个心情或写点啥吧', icon: 'none' })
      return
    }

    const record = {
      scenarioId,
      mood: selectedMood || '😐',
      text: recordText,
      time: Date.now(),
      date: getToday(),
    }

    app.globalData.rescueHistory = app.globalData.rescueHistory || []
    app.globalData.rescueHistory.push(record)
    app.saveData()

    // 更新历史列表
    const scenarioHistory = app.globalData.rescueHistory.filter(r => r.scenarioId === scenarioId)
    this.setData({
      historyList: this.formatHistory(scenarioHistory),
      useCount: this.data.useCount + 1,
      selectedMood: '',
      recordText: '',
    })

    wx.showToast({ title: '已记录，放过自己', icon: 'none' })
    this.completeRescue()
  },

  // ============ 完成急救 ============
  completeRescue() {
    // 奖励还阳值和积分（每次场景急救只奖励一次，通过标记控制）
    if (this._rewarded) return
    this._rewarded = true

    const yangReward = 5
    const pointsReward = 3

    app.globalData.yangValue = (app.globalData.yangValue || 0) + yangReward
    app.addPoints(pointsReward, '场景急救')

    // 检查等级提升
    const levelUpInfo = app.checkLevelUp(app.globalData.yangValue)
    // 同步角色等级
    if (app.globalData.character) {
      app.globalData.character.level = levelUpInfo.newLevel || app.globalData.yangLevel
    }
    app.saveData()

    setTimeout(() => {
      wx.showToast({
        title: '急救完成 +' + yangReward + '还阳值 +' + pointsReward + '积分',
        icon: 'none',
        duration: 2000,
      })
      if (levelUpInfo.leveledUp) {
        setTimeout(() => {
          wx.showToast({
            title: '升级！Lv.' + levelUpInfo.newLevel + ' 奖励' + levelUpInfo.reward + '积分',
            icon: 'none',
            duration: 2500,
          })
        }, 2100)
      }
    }, 500)
  },

  onUnload() {
    if (this.breathTimer) clearInterval(this.breathTimer)
  },
})
