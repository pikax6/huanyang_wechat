// 心情页逻辑 - 情绪记录
const app = getApp()
const { getToday, getNow } = require('../../utils/storage.js')
const { MOOD_LEVELS, SCENE_TAGS, analyzeInsights, getWeeklyTrend, getMoodHeatmap, getMoodLevel } = require('../../utils/mood.js')

// 洞察提示文案
const INSIGHT_TIPS = {
  '熬夜': '试试在此时提前设置提醒，做几分钟深呼吸',
  '深夜外卖': '备一些健康零食，或者喝杯温水替代',
  '刷手机': '试试把手机放远一点，做点别的事转移注意力',
  '情绪性进食': '先深呼吸3次，问问自己是饿了还是情绪化',
  '久坐': '站起来活动5分钟，拉伸一下身体',
}

Page({
  data: {
    theme: null,
    moodLevels: MOOD_LEVELS,
    sceneTags: SCENE_TAGS,
    selectedMood: 0,
    selectedScenes: [],
    selectedSceneMap: {},  // WXML不支持Array.includes，用对象映射
    noteText: '',
    weeklyTrend: [],
    insights: { ready: false, insights: [], message: '' },
    heatmapData: [],
  },

  onShow() {
    this.refreshData()
  },

  refreshData() {
    const globalData = app.globalData
    const theme = globalData.theme
    const moods = globalData.moods || []
    const today = getToday()

    // 检查今日是否已有记录
    const todayMood = moods.find(m => m.date === today)
    const selectedMood = todayMood ? todayMood.mood : 0
    const selectedScenes = todayMood ? todayMood.scenes : []
    // 同步对象映射
    const selectedSceneMap = {}
    selectedScenes.forEach(id => { selectedSceneMap[id] = true })
    const noteText = todayMood ? todayMood.note : ''

    // 本周趋势
    const weeklyTrend = getWeeklyTrend(moods).map(d => {
      const level = getMoodLevel(d.mood)
      return {
        ...d,
        emoji: d.hasData ? level.emoji : '',
        moodColor: d.hasData ? level.color : '',
        barHeight: d.hasData ? d.mood * 30 : 0,
      }
    })

    // 情绪洞察
    const insights = analyzeInsights(moods, 7)
    if (insights.ready) {
      insights.insights = insights.insights.map(i => ({
        ...i,
        tip: INSIGHT_TIPS[i.habit] || '注意观察自己的情绪模式',
      }))
    }

    // 热力图
    const heatmap = getMoodHeatmap(moods)
    const heatmapData = heatmap.map(d => {
      if (!d.hasData) return { date: d.date, hasData: false }
      const level = getMoodLevel(d.mood)
      return { date: d.date, hasData: true, color: level.color }
    })

    this.setData({
      theme: theme.colors,
      selectedMood,
      selectedScenes,
      selectedSceneMap,
      noteText,
      weeklyTrend,
      insights,
      heatmapData,
    })
  },

  // 选择心情
  selectMood(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ selectedMood: value })
  },

  // 切换场景标签
  toggleScene(e) {
    const id = e.currentTarget.dataset.id
    let scenes = [...this.data.selectedScenes]
    const sceneMap = { ...this.data.selectedSceneMap }
    const index = scenes.indexOf(id)
    if (index >= 0) {
      scenes.splice(index, 1)
      delete sceneMap[id]
    } else {
      scenes.push(id)
      sceneMap[id] = true
    }
    this.setData({ selectedScenes: scenes, selectedSceneMap: sceneMap })
  },

  // 输入文字
  onNoteInput(e) {
    this.setData({ noteText: e.detail.value })
  },

  // 保存心情
  saveMood() {
    const { selectedMood, selectedScenes, noteText } = this.data
    if (!selectedMood) {
      wx.showToast({ title: '请先选择心情', icon: 'none' })
      return
    }

    const today = getToday()
    const moods = app.globalData.moods || []

    // 查找今日已有记录
    const existingIndex = moods.findIndex(m => m.date === today)
    const record = {
      id: existingIndex >= 0 ? moods[existingIndex].id : Date.now(),
      date: today,
      time: getNow(),
      mood: selectedMood,
      scenes: selectedScenes,
      note: noteText,
      habits: [],
      timestamp: Date.now(),
    }

    // 关联今日打卡的坏习惯
    const plans = app.globalData.plans || []
    plans.forEach(plan => {
      const todayCheckin = (plan.checkins || []).find(c => c.date === today)
      if (todayCheckin && !todayCheckin.done) {
        record.habits.push(plan.habit)
      }
    })

    if (existingIndex >= 0) {
      moods[existingIndex] = record
    } else {
      moods.push(record)
    }

    app.globalData.moods = moods
    app.saveData()

    wx.showToast({ title: '心情已记录 💭', icon: 'none' })
    this.refreshData()
  },
})
