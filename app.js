const { getTheme } = require('./themes/themes.js')
const { getLevelUpReward, getStreakReward } = require('./utils/shop.js')

App({
  globalData: {
    theme: null,
    character: null,
    plans: [],
    moods: [],
    yangValue: 0,
    yangLevel: 1,
    // 积分系统
    points: 0,
    // 已购买的装扮
    ownedItems: [],
    // 急救包使用记录
    rescueHistory: [],
    // 已加入的主题小组
    joinedGroups: [],
    settings: {
      themeId: 'mint',
      notify: true,
      nightReminder: true,
      nightReminderTime: '23:30',
    },
  },

  onLaunch() {
    this.initData()
  },

  initData() {
    const storage = wx.getStorageSync('app_data')
    if (storage) {
      this.globalData = { ...this.globalData, ...storage }
    }

    const themeId = this.globalData.settings.themeId
    this.globalData.theme = getTheme(themeId)

    if (!this.globalData.character) {
      this.globalData.character = {
        complexion: 50,
        energy: 50,
        body: 50,
        sleep: 50,
        level: 1,
        outfits: { hat: '', cloth: '', bg: '', accessory: '', shoes: '' },
      }
    }

    // 确保字段存在
    if (this.globalData.points === undefined || this.globalData.points === null) this.globalData.points = 0
    if (!this.globalData.ownedItems) this.globalData.ownedItems = []
    if (!this.globalData.rescueHistory) this.globalData.rescueHistory = []
    if (!this.globalData.joinedGroups) this.globalData.joinedGroups = []

    // 新用户首次启动赠送初始积分100
    if (!storage) {
      this.globalData.points = 100
      this.saveData()
    }
  },

  saveData() {
    wx.setStorageSync('app_data', this.globalData)
  },

  switchTheme(themeId) {
    this.globalData.theme = getTheme(themeId)
    this.globalData.settings.themeId = themeId
    this.saveData()
  },

  // 添加积分
  addPoints(amount, reason) {
    this.globalData.points = (this.globalData.points || 0) + amount
    this.saveData()
  },

  // 消费积分
  spendPoints(amount) {
    if ((this.globalData.points || 0) < amount) return false
    this.globalData.points -= amount
    this.saveData()
    return true
  },

  // 检查等级提升并奖励积分
  checkLevelUp(newYangValue) {
    const oldLevel = this.globalData.yangLevel || 1
    const levels = [
      { level: 1, min: 0 }, { level: 2, min: 100 }, { level: 3, min: 300 },
      { level: 4, min: 600 }, { level: 5, min: 1000 }, { level: 6, min: 1500 },
      { level: 7, min: 2200 }, { level: 8, min: 3000 }, { level: 9, min: 4000 }, { level: 10, min: 5000 },
    ]
    let newLevel = 1
    for (let i = levels.length - 1; i >= 0; i--) {
      if (newYangValue >= levels[i].min) {
        newLevel = levels[i].level
        break
      }
    }

    if (newLevel > oldLevel) {
      const reward = getLevelUpReward(newLevel)
      this.globalData.points = (this.globalData.points || 0) + reward
      this.globalData.yangLevel = newLevel
      this.saveData()
      return { leveledUp: true, newLevel, reward }
    }
    return { leveledUp: false }
  },

  // 连续打卡奖励
  checkStreakReward(streak) {
    const reward = getStreakReward(streak)
    if (reward > 0) {
      this.globalData.points = (this.globalData.points || 0) + reward
      this.saveData()
    }
    return reward
  },

  // 购买装扮
  buyItem(itemId, price) {
    if (this.globalData.ownedItems && this.globalData.ownedItems.includes(itemId)) {
      return { success: false, message: '已拥有该道具' }
    }
    if (!this.spendPoints(price)) {
      return { success: false, message: '积分不足' }
    }
    this.globalData.ownedItems = this.globalData.ownedItems || []
    this.globalData.ownedItems.push(itemId)
    this.saveData()
    return { success: true, message: '购买成功！' }
  },

  // 装备/卸下装扮
  equipItem(category, itemId) {
    if (!this.globalData.character) return
    if (!this.globalData.character.outfits) {
      this.globalData.character.outfits = { hat: '', cloth: '', bg: '', accessory: '', shoes: '' }
    }
    // 切换装备（再次点击同一个则卸下）
    if (this.globalData.character.outfits[category] === itemId) {
      // 卸下（恢复默认）
      const defaults = { hat: 'hat_none', cloth: 'cloth_none', bg: 'bg_none', accessory: 'acc_none', shoes: 'shoes_none' }
      this.globalData.character.outfits[category] = defaults[category] || ''
    } else {
      this.globalData.character.outfits[category] = itemId
    }
    this.saveData()
  },
})
