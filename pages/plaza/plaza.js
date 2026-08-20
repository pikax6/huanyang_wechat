// 广场页逻辑：弱连接社区，匿名陪伴
const app = getApp()
const { timeAgo } = require('../../utils/storage.js')

Page({
  data: {
    theme: null,
    companionList: [],   // 实时陪伴状态
    checkinList: [],     // 匿名打卡信息流
    groupList: [],       // 主题小组
    joinedGroups: [],    // 已加入的小组id列表
    joinedGroupMap: {},  // 已加入小组映射（用于WXML查询）
    myGroupFeed: [],     // 我加入的小组相关feed
    showMyGroups: false, // 是否展示"我的小组"区块
    quote: '',           // 每日金句
  },

  onLoad() {
    this.initMockData()
  },

  onShow() {
    this.refreshTheme()
    // 每次返回页面时刷新小组状态
    this.loadJoinedGroups()
  },

  // 刷新主题色
  refreshTheme() {
    const theme = app.globalData.theme
    this.setData({ theme: theme.colors })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: theme.colors.bg,
    })
  },

  // 加载已加入的小组（持久化在globalData）
  loadJoinedGroups() {
    const joined = app.globalData.joinedGroups || []
    const joinedMap = {}
    joined.forEach(id => { joinedMap[id] = true })

    // 更新 groupList 的 joined 状态
    const groupList = this.data.groupList.map(g => ({
      ...g,
      joined: joinedMap[g.id] || false,
    }))

    // 更新我的小组feed
    const myGroupFeed = this.buildMyGroupFeed(joined)

    this.setData({
      joinedGroups: joined,
      joinedGroupMap: joinedMap,
      groupList,
      myGroupFeed,
      showMyGroups: joined.length > 0,
    })
  },

  // 构建我加入的小组的feed
  buildMyGroupFeed(joinedIds) {
    if (!joinedIds || joinedIds.length === 0) return []
    // 模拟：从 checkinList 中筛选匹配小组图标的打卡
    const groupIconMap = {
      night: '🌙',
      takeout: '🍔',
      water: '💧',
      phone: '📱',
      sport: '🏃',
    }
    const targetIcons = joinedIds.map(id => groupIconMap[id]).filter(Boolean)
    return this.data.checkinList.filter(c => targetIcons.includes(c.icon))
  },

  // 初始化模拟数据（MVP阶段）
  initMockData() {
    this.refreshTheme()

    // 实时陪伴状态条（随机生成合理数字）
    const companionList = [
      { icon: '🌙', text: `此刻有 ${this.randomNum(15, 40)} 人正在早睡` },
      { icon: '🍔', text: `今天有 ${this.randomNum(120, 200)} 人没点外卖` },
      { icon: '💧', text: `今天有 ${this.randomNum(60, 120)} 人喝够了水` },
    ]

    // 打卡广场匿名信息流
    const checkinList = [
      { nickname: '匿名小友', icon: '🌙', days: 7, text: '今天又早睡了，感觉自己棒棒的', timeText: timeAgo(this.mockTime(30)) },
      { nickname: '熬夜退订人', icon: '🍔', days: 12, text: '忍住没点外卖，自己煮了碗面', timeText: timeAgo(this.mockTime(120)) },
      { nickname: '保温杯战士', icon: '💧', days: 5, text: '喝了八杯水，跑厕所跑到腿软', timeText: timeAgo(this.mockTime(300)) },
      { nickname: '早睡仙人', icon: '🌙', days: 21, text: '连续三周早睡，皮肤都变好了', timeText: timeAgo(this.mockTime(600)) },
      { nickname: '手机绝缘体', icon: '📱', days: 3, text: '今天只看了两小时手机，眼睛舒服多了', timeText: timeAgo(this.mockTime(900)) },
      { nickname: '运动还阳人', icon: '🏃', days: 9, text: '跑了三公里，累但快乐着', timeText: timeAgo(this.mockTime(1500)) },
    ]

    // 主题小组（带描述和专属feed标识）
    const groupList = [
      { id: 'night', icon: '🌙', name: '熬夜修仙互助会', count: 234, joined: false, desc: '熬夜戒断互助，一起早睡' },
      { id: 'takeout', icon: '🍔', name: '外卖解毒所', count: 189, joined: false, desc: '戒外卖，回归厨房' },
      { id: 'water', icon: '💧', name: '喝水监督局', count: 567, joined: false, desc: '互相提醒喝水' },
      { id: 'phone', icon: '📱', name: '手机戒断联盟', count: 312, joined: false, desc: '放下手机，活在当下' },
      { id: 'sport', icon: '🏃', name: '运动还阳大队', count: 445, joined: false, desc: '一起动起来，告别久坐' },
    ]

    // 每日金句
    const quoteList = [
      '早睡早起，精神百倍——我奶奶说的',
      '你的身体不是出租屋，别老是造',
      '养生不是怕死，是怕死得难看',
      '今天不熬夜，明天不后悔',
      '多喝热水，少生气',
      '身体是革命的本钱，别提前花光',
    ]
    const quote = quoteList[Math.floor(Math.random() * quoteList.length)]

    this.setData({
      companionList,
      checkinList,
      groupList,
      quote,
    })

    // 加载已加入状态
    this.loadJoinedGroups()
  },

  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  mockTime(minutesAgo) {
    return Date.now() - minutesAgo * 60000
  },

  // 点击加入小组（带确认弹窗）
  joinGroup(e) {
    const id = e.currentTarget.dataset.id
    const group = this.data.groupList.find(g => g.id === id)
    if (!group) return
    if (group.joined) return  // 已加入不弹窗

    wx.showModal({
      title: '加入「' + group.name + '」',
      content: '加入后，广场页将展示该小组成员的打卡动态，陪你一起坚持。可随时退出。',
      confirmText: '确认加入',
      confirmColor: this.data.theme.primary,
      success: (res) => {
        if (res.confirm) {
          this.doJoinGroup(id)
        }
      }
    })
  },

  // 执行加入
  doJoinGroup(id) {
    const joined = app.globalData.joinedGroups || []
    if (!joined.includes(id)) {
      joined.push(id)
      app.globalData.joinedGroups = joined
      app.saveData()
    }
    this.loadJoinedGroups()
    wx.vibrateShort({ type: 'medium' })
    wx.showToast({ title: '加入成功 🎉', icon: 'none' })
  },

  // 退出小组（带确认弹窗）
  leaveGroup(e) {
    const id = e.currentTarget.dataset.id
    const group = this.data.groupList.find(g => g.id === id)
    if (!group) return

    wx.showModal({
      title: '退出「' + group.name + '」',
      content: '退出后将不再看到该小组的专属动态，确定退出吗？',
      confirmText: '退出',
      confirmColor: '#FF8B6E',
      success: (res) => {
        if (res.confirm) {
          const joined = (app.globalData.joinedGroups || []).filter(g => g !== id)
          app.globalData.joinedGroups = joined
          app.saveData()
          this.loadJoinedGroups()
          wx.vibrateShort({ type: 'light' })
          wx.showToast({ title: '已退出', icon: 'none' })
        }
      }
    })
  },
})
