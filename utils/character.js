// 虚拟小人逻辑

// 四维状态配置
const DIMENSIONS = {
  complexion: { name: '气色', icon: '✨', key: 'complexion' },
  energy: { name: '精力', icon: '⚡', key: 'energy' },
  body: { name: '体型', icon: '💪', key: 'body' },
  sleep: { name: '睡眠', icon: '😴', key: 'sleep' },
}

// 每日衰减值
const DAILY_DECAY = {
  complexion: 3,
  energy: 2,
  body: 1,
  sleep: 5,
}

// 习惯对状态的影响
const HABIT_EFFECTS = {
  '熬夜': { sleep: -20, energy: -15, complexion: -5 },
  '深夜外卖': { body: -8, complexion: -5 },
  '不喝水': { complexion: -3 },
  '久坐': { energy: -5, body: -3 },
  '刷手机': { sleep: -10 },
  '不吃早餐': { complexion: -3, energy: -3 },
  '情绪性进食': { body: -5 },
  '早睡': { sleep: 15, energy: 10 },
  '运动': { energy: 10, body: 8 },
  '喝水': { complexion: 3 },
  '好好吃饭': { complexion: 5 },
}

// 获取状态等级 (0-4)
function getLevel(value) {
  if (value < 20) return 0
  if (value < 40) return 1
  if (value < 60) return 2
  if (value < 80) return 3
  return 4
}

// 状态等级文案
const LEVEL_TEXTS = {
  complexion: ['蜡黄痘痘', '偏黄倦容', '正常', '红润', '容光焕发'],
  energy: ['垂头丧气', '略显疲惫', '正常', '精神', '活力四射'],
  body: ['小肚子', '偏胖', '正常', '匀称', '健美'],
  sleep: ['重黑眼圈', '轻微黑眼圈', '正常', '清亮', '满血状态'],
}

// 获取状态文案
function getLevelText(dimension, value) {
  const level = getLevel(value)
  return LEVEL_TEXTS[dimension][level]
}

// 获取小人外观配置
function getCharacterAppearance(character) {
  return {
    complexion: {
      level: getLevel(character.complexion),
      text: getLevelText('complexion', character.complexion),
      color: getComplexionColor(character.complexion),
      darkCircles: character.sleep < 40,
      darkCircleIntensity: character.sleep < 20 ? 'heavy' : (character.sleep < 40 ? 'light' : 'none'),
    },
    energy: {
      level: getLevel(character.energy),
      text: getLevelText('energy', character.energy),
      posture: character.energy < 40 ? 'slump' : 'straight',
      eyeState: character.energy < 20 ? 'half' : (character.energy > 80 ? 'sparkle' : 'normal'),
    },
    body: {
      level: getLevel(character.body),
      text: getLevelText('body', character.body),
      bodyType: character.body < 40 ? 'chubby' : (character.body > 70 ? 'fit' : 'normal'),
    },
    sleep: {
      level: getLevel(character.sleep),
      text: getLevelText('sleep', character.sleep),
      darkCircles: character.sleep < 40,
    },
  }
}

// 获取气色颜色
function getComplexionColor(value) {
  if (value < 20) return '#D4A574' // 蜡黄
  if (value < 40) return '#E8C4A0' // 偏黄
  if (value < 60) return '#F5DEB3' // 正常
  if (value < 80) return '#FFB6A0' // 红润
  return '#FFAB91' // 容光焕发
}

// 应用习惯影响
function applyHabitEffect(character, habitName, isPositive) {
  const effect = HABIT_EFFECTS[habitName]
  if (!effect) return character

  const newChar = { ...character }
  for (const dim in effect) {
    newChar[dim] = Math.max(0, Math.min(100, newChar[dim] + effect[dim]))
  }
  return newChar
}

// 每日衰减
function applyDailyDecay(character) {
  const newChar = { ...character }
  for (const dim in DAILY_DECAY) {
    newChar[dim] = Math.max(0, newChar[dim] - DAILY_DECAY[dim])
  }
  return newChar
}

// 对话文案库
const DIALOGUES = {
  lateNight: [
    '大人，修仙也要讲究基本法啊...',
    '这个点了，您是准备飞升吗？',
    '大人，我的黑眼圈已经比眼睛大了...',
  ],
  morningGood: [
    '哇！今天感觉灵魂归位了！',
    '大人昨晚居然早睡了？我不信，捏捏...',
    '早安！今天的小人元气满满！',
  ],
  morningBad: [
    '大人...你还好吗？我快碎了...',
    '昨晚修仙去了吧？我看得出来...',
    '咖啡续命的一天又开始了呢...',
  ],
  streak3: [
    '大人？你还活着吗？我快长蘑菇了',
    '三天了，你是不是把我忘了...',
    '再不回来，我就要去别的手机里住了',
  ],
  checkinSuccess: [
    '懂事！这才是我认识的大人',
    '漂亮！还阳值+1，我离满血又近了一步',
    '今天的大人，闪闪发光！',
  ],
  complexionLow: [
    '镜子里那个人...是我吗？😭',
    '大人，你的气色比我的代码还乱...',
    '该喝水了，嘴唇干得像撒哈拉',
  ],
  energyFull: [
    '今天能徒手劈砖！💪',
    '精力满格！感觉能跑个马拉松！',
    '元气爆棚！今天的大人是最棒的！',
  ],
  random: [
    '大人，今天也要好好养自己哦~',
    '别光看我，你也该动动了',
    '我饿...啊不是，是你该吃饭了',
    '今天的你，比昨天更棒了一点点',
  ],
}

// 获取对话
function getDialogue(context, character) {
  const hour = new Date().getHours()
  let pool

  if (context === 'lateNight' || hour >= 23 || hour < 5) {
    pool = DIALOGUES.lateNight
  } else if (context === 'checkin') {
    pool = DIALOGUES.checkinSuccess
  } else if (context === 'streak3') {
    pool = DIALOGUES.streak3
  } else if (character.complexion < 20) {
    pool = DIALOGUES.complexionLow
  } else if (character.energy >= 80) {
    pool = DIALOGUES.energyFull
  } else if (hour >= 6 && hour < 11) {
    pool = character.sleep > 50 ? DIALOGUES.morningGood : DIALOGUES.morningBad
  } else {
    pool = DIALOGUES.random
  }

  return pool[Math.floor(Math.random() * pool.length)]
}

// 计算还阳等级
function getYangLevel(yangValue) {
  const levels = [
    { level: 1, name: '初入还阳', min: 0 },
    { level: 2, name: '小有所成', min: 100 },
    { level: 3, name: '渐入佳境', min: 300 },
    { level: 4, name: '养有所成', min: 600 },
    { level: 5, name: '还阳中', min: 1000 },
    { level: 6, name: '养生达人', min: 1500 },
    { level: 7, name: '满血复活', min: 2200 },
    { level: 8, name: '养生宗师', min: 3000 },
    { level: 9, name: '天人合一', min: 4000 },
    { level: 10, name: '得道成仙', min: 5000 },
  ]

  let current = levels[0]
  let next = levels[1]
  for (let i = levels.length - 1; i >= 0; i--) {
    if (yangValue >= levels[i].min) {
      current = levels[i]
      next = levels[i + 1] || levels[i]
      break
    }
  }

  return {
    level: current.level,
    name: current.name,
    progress: next === current ? 100 : Math.floor(((yangValue - current.min) / (next.min - current.min)) * 100),
    nextLevelValue: next.min,
  }
}

module.exports = {
  DIMENSIONS,
  DAILY_DECAY,
  HABIT_EFFECTS,
  getLevel,
  getLevelText,
  getCharacterAppearance,
  getComplexionColor,
  applyHabitEffect,
  applyDailyDecay,
  getDialogue,
  getYangLevel,
}
