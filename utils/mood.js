// 情绪分析与习惯联动逻辑

// 情绪等级
const MOOD_LEVELS = [
  { value: 1, emoji: '😢', label: '很差', color: '#FF6B6B' },
  { value: 2, emoji: '😕', label: '不好', color: '#FFB347' },
  { value: 3, emoji: '😐', label: '一般', color: '#F5C842' },
  { value: 4, emoji: '🙂', label: '不错', color: '#7EC8A0' },
  { value: 5, emoji: '😄', label: '很好', color: '#5BA87E' },
]

// 场景标签
const SCENE_TAGS = [
  { id: 'overtime', label: '💻加班', desc: '加班后' },
  { id: 'alone', label: '🏠独处', desc: '一个人待着' },
  { id: 'social', label: '👥社交后', desc: '社交结束' },
  { id: 'lateNight', label: '🛏️深夜', desc: '深夜时分' },
  { id: 'empty', label: '☕空腹', desc: '没吃饭' },
  { id: 'phone', label: '📱刷手机后', desc: '刷完手机' },
  { id: 'wake', label: '🌅刚起床', desc: '早上起来' },
  { id: 'tired', label: '😮‍💨疲惫', desc: '很累' },
  { id: 'bored', label: '🥱无聊', desc: '无聊中' },
  { id: 'stressed', label: '😰焦虑', desc: '压力山大' },
]

// 坏习惯与场景的关联映射
const HABIT_SCENE_MAP = {
  '熬夜': ['lateNight', 'stressed', 'phone', 'bored'],
  '深夜外卖': ['lateNight', 'stressed', 'tired', 'empty'],
  '刷手机': ['alone', 'bored', 'lateNight', 'phone'],
  '情绪性进食': ['stressed', 'tired', 'overtime'],
  '久坐': ['overtime', 'bored'],
}

// 添加情绪记录
function addMoodRecord(moods, record) {
  const newRecord = {
    id: Date.now(),
    date: record.date,
    time: record.time,
    mood: record.mood,
    scenes: record.scenes || [],
    note: record.note || '',
    habits: record.habits || [], // 当日触发的坏习惯
    timestamp: Date.now(),
  }
  return [...moods, newRecord]
}

// 分析情绪×习惯关联
function analyzeInsights(moods, days) {
  const period = days || 7
  const now = Date.now()
  const recentMoods = moods.filter(m => (now - m.timestamp) < period * 86400000)

  if (recentMoods.length < 5) {
    return {
      ready: false,
      message: `还需 ${5 - recentMoods.length} 天数据才能生成洞察`,
      insights: [],
    }
  }

  const insights = []

  // 分析每个场景下触发坏习惯的概率
  for (const [habit, scenes] of Object.entries(HABIT_SCENE_MAP)) {
    for (const sceneId of scenes) {
      const sceneMoods = recentMoods.filter(m => m.scenes.includes(sceneId))
      if (sceneMoods.length < 2) continue

      const habitTriggered = sceneMoods.filter(m => m.habits && m.habits.includes(habit))
      const probability = Math.round((habitTriggered.length / sceneMoods.length) * 100)

      if (probability >= 50) {
        const scene = SCENE_TAGS.find(s => s.id === sceneId)
        insights.push({
          habit,
          scene: scene ? scene.desc : sceneId,
          sceneId,
          probability,
          count: sceneMoods.length,
          message: `你在「${scene ? scene.desc : sceneId}」时，${habit}概率达 ${probability}%`,
        })
      }
    }
  }

  // 按概率排序
  insights.sort((a, b) => b.probability - a.probability)

  return {
    ready: true,
    insights: insights.slice(0, 3), // 只展示前3条
  }
}

// 获取本周情绪趋势
function getWeeklyTrend(moods) {
  const now = new Date()
  const week = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const dayMoods = moods.filter(m => m.date === dateStr)
    const avgMood = dayMoods.length > 0
      ? dayMoods.reduce((sum, m) => sum + m.mood, 0) / dayMoods.length
      : 0
    week.push({
      date: dateStr,
      day: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      mood: Math.round(avgMood),
      hasData: dayMoods.length > 0,
    })
  }
  return week
}

// 获取情绪热力图数据（本月）
function getMoodHeatmap(moods) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const heatmap = []
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayMoods = moods.filter(m => m.date === dateStr)
    const avgMood = dayMoods.length > 0
      ? Math.round(dayMoods.reduce((sum, m) => sum + m.mood, 0) / dayMoods.length)
      : 0
    heatmap.push({
      date: d,
      mood: avgMood,
      hasData: dayMoods.length > 0,
    })
  }
  return heatmap
}

// 获取情绪等级信息
function getMoodLevel(value) {
  return MOOD_LEVELS.find(m => m.value === value) || MOOD_LEVELS[2]
}

module.exports = {
  MOOD_LEVELS,
  SCENE_TAGS,
  addMoodRecord,
  analyzeInsights,
  getWeeklyTrend,
  getMoodHeatmap,
  getMoodLevel,
}
