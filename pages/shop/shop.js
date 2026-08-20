// 装扮商店逻辑
const app = getApp()
const { getCategories, getItemsByCategory, getAllItems } = require('../../utils/shop.js')

const CATEGORY_BG = {
  bg_bedroom: 'linear-gradient(180deg, #FFE4C9 0%, #FFD4A3 100%)',
  bg_forest: 'linear-gradient(180deg, #C9E8C6 0%, #8EC889 100%)',
  bg_beach: 'linear-gradient(180deg, #B8E6F0 0%, #F5DEB3 100%)',
  bg_space: 'linear-gradient(180deg, #1E1B4B 0%, #4C4A8C 100%)',
  bg_cherry: 'linear-gradient(180deg, #FFD1DC 0%, #FFB6C1 100%)',
  bg_rainbow: 'linear-gradient(180deg, #FFB3BA 0%, #BAFFC9 50%, #BAE1FF 100%)',
}

// 默认装扮（卸下时使用）
const DEFAULT_OUTFITS = {
  hat: 'hat_none',
  cloth: 'cloth_none',
  bg: 'bg_none',
  accessory: 'acc_none',
  shoes: 'shoes_none',
}

Page({
  data: {
    theme: null,
    points: 0,
    character: null,
    categories: [],
    currentCat: 'hat',
    currentItems: [],
    ownedItems: [],
    ownedItemMap: {},      // 已拥有道具映射（WXML不支持includes）
    equippedId: '',
    stageBg: '#FFFFFF',
    ownedCount: 0,
    totalCount: 0,
    tryOnId: '',           // 当前试戴的道具ID
    previewCharacter: null, // 试戴预览用的小人数据
  },

  onShow() {
    this.refreshData()
  },

  refreshData() {
    const globalData = app.globalData
    const theme = globalData.theme
    const categories = getCategories()
    const currentItems = getItemsByCategory(this.data.currentCat)
    const allItems = getAllItems()
    // 已拥有的道具（包含默认 price=0 的）
    const ownedItems = globalData.ownedItems || []
    const defaultItems = allItems.filter(i => i.price === 0).map(i => i.id)
    const fullOwned = [...new Set([...ownedItems, ...defaultItems])]
    // 构建已拥有映射
    const ownedItemMap = {}
    fullOwned.forEach(id => { ownedItemMap[id] = true })

    // 当前装备的id
    const outfits = globalData.character?.outfits || {}
    const equippedId = outfits[this.data.currentCat] || ''

    this.setData({
      theme: theme.colors,
      points: globalData.points || 0,
      character: globalData.character,
      categories,
      currentItems,
      ownedItems: fullOwned,
      ownedItemMap,
      equippedId,
      ownedCount: fullOwned.length,
      totalCount: allItems.length,
    })
    // 更新预览（保留试戴状态）
    this.updatePreview(this.data.tryOnId)
  },

  // 更新预览（试戴效果）
  updatePreview(tryOnId) {
    const character = JSON.parse(JSON.stringify(app.globalData.character || {}))
    if (!character.outfits) {
      character.outfits = { hat: '', cloth: '', bg: '', accessory: '', shoes: '' }
    }
    // 试戴：临时替换当前分类的装扮
    if (tryOnId) {
      character.outfits[this.data.currentCat] = tryOnId
    }
    // 计算舞台背景（试戴bg分类时即时预览背景）
    let stageBg = '#FFFFFF'
    const bgId = character.outfits.bg || ''
    stageBg = CATEGORY_BG[bgId] || '#FFFFFF'

    this.setData({ tryOnId, previewCharacter: character, stageBg })
  },

  // 切换分类
  switchCat(e) {
    const cat = e.currentTarget.dataset.cat
    const currentItems = getItemsByCategory(cat)
    const outfits = app.globalData.character?.outfits || {}
    const equippedId = outfits[cat] || ''

    this.setData({
      currentCat: cat,
      currentItems,
      equippedId,
      tryOnId: '',  // 切换分类时清空试戴
    })
    this.updatePreview('')
  },

  // 点击道具卡片：试戴查看效果
  tryOnItem(e) {
    const item = e.currentTarget.dataset.item
    if (!item) return
    // 切换试戴状态（再次点击同一道具取消试戴）
    const tryOnId = this.data.tryOnId === item.id ? '' : item.id
    this.updatePreview(tryOnId)
    wx.vibrateShort({ type: 'light' })
  },

  // 兑换道具（积分足够才可点击）
  buyItem(e) {
    const item = e.currentTarget.dataset.item
    if (!item) return
    // 积分不足直接拦截
    if ((this.data.points || 0) < item.price) {
      wx.showToast({ title: '积分不足，去打卡赚积分吧～', icon: 'none' })
      return
    }
    wx.showModal({
      title: '确认兑换？',
      content: '将消耗 ' + item.price + ' 积分兑换「' + item.name + '」',
      confirmText: '兑换',
      confirmColor: this.data.theme.primary,
      success: (res) => {
        if (!res.confirm) return
        const result = app.buyItem(item.id, item.price)
        if (!result.success) {
          wx.showToast({ title: result.message, icon: 'none' })
          return
        }
        wx.vibrateShort({ type: 'medium' })
        // 兑换成功，询问是否立即佩戴
        wx.showModal({
          title: '兑换成功 🎉',
          content: '是否立即佩戴「' + item.name + '」？',
          confirmText: '立即佩戴',
          cancelText: '先收藏',
          confirmColor: this.data.theme.primary,
          success: (r) => {
            if (r.confirm) {
              app.equipItem(this.data.currentCat, item.id)
            }
            this.refreshData()
          }
        })
      }
    })
  },

  // 装备/卸下（已拥有的道具）
  equipItem(e) {
    const item = e.currentTarget.dataset.item
    if (!item) return
    const category = this.data.currentCat
    const currentEquipped = this.data.equippedId

    if (currentEquipped === item.id) {
      // 已装备，切换为默认（卸下）
      app.equipItem(category, DEFAULT_OUTFITS[category] || '')
    } else {
      app.equipItem(category, item.id)
    }
    wx.vibrateShort({ type: 'light' })
    // 清空试戴，因为已正式装备
    this.setData({ tryOnId: '' })
    this.refreshData()
  },
})
