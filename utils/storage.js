// 本地存储工具
const STORAGE_KEY = 'app_data'

// 获取所有数据
function getAllData() {
  return wx.getStorageSync(STORAGE_KEY) || {}
}

// 保存所有数据
function saveAllData(data) {
  wx.setStorageSync(STORAGE_KEY, data)
}

// 获取指定字段
function getData(key) {
  const data = getAllData()
  return data[key]
}

// 保存指定字段
function setData(key, value) {
  const data = getAllData()
  data[key] = value
  saveAllData(data)
}

// 获取今日日期字符串
function getToday() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 获取当前时间字符串
function getNow() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

// 获取当前小时
function getHour() {
  return new Date().getHours()
}

// 格式化时间差
function timeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

module.exports = {
  getAllData,
  saveAllData,
  getData,
  setData,
  getToday,
  getNow,
  getHour,
  timeAgo,
}
