// 装扮商店数据 - 道具、鞋子、积分系统

// 装扮分类
const SHOP_CATEGORIES = [
  { id: 'hat', name: '帽子', icon: '👑' },
  { id: 'cloth', name: '服装', icon: '👕' },
  { id: 'accessory', name: '配饰', icon: '👓' },
  { id: 'bg', name: '背景', icon: '🌟' },
  { id: 'shoes', name: '鞋子', icon: '👟' },
]

// 装扮道具列表
const SHOP_ITEMS = [
  // === 帽子系列 ===
  { id: 'hat_none', category: 'hat', name: '不戴帽子', icon: '🚫', price: 0, desc: '清清爽爽' },
  { id: 'hat_cap', category: 'hat', name: '棒球帽', icon: '🧢', price: 50, desc: '运动风，元气满满' },
  { id: 'hat_crown', category: 'hat', name: '小皇冠', icon: '👑', price: 200, desc: '你是最靓的仔' },
  { id: 'hat_beanie', category: 'hat', name: '毛线帽', icon: '🧶', price: 80, desc: '冬日保暖神器' },
  { id: 'hat_straw', category: 'hat', name: '草帽', icon: '🌾', price: 60, desc: '田园风，适合晒太阳' },
  { id: 'hat_graduate', category: 'hat', name: '学士帽', icon: '🎓', price: 150, desc: '学霸专属' },
  { id: 'hat_party', category: 'hat', name: '派对帽', icon: '🥳', price: 100, desc: '今天是派对动物' },
  { id: 'hat_halo', category: 'hat', name: '光环', icon: '😇', price: 500, desc: '还阳成功者专属' },

  // === 服装系列 ===
  { id: 'cloth_none', category: 'cloth', name: '默认服装', icon: '🚫', price: 0, desc: '原装出厂' },
  { id: 'cloth_hoodie', category: 'cloth', name: '连帽衫', icon: '🧥', price: 80, desc: '居家必备，舒适第一' },
  { id: 'cloth_suit', category: 'cloth', name: '小西装', icon: '🤵', price: 200, desc: '职场精英范' },
  { id: 'cloth_pajama', category: 'cloth', name: '睡衣', icon: '🛌', price: 60, desc: '早睡人的标配' },
  { id: 'cloth_sport', category: 'cloth', name: '运动服', icon: '🏃', price: 100, desc: '随时准备开练' },
  { id: 'cloth_superhero', category: 'cloth', name: '超人披风', icon: '🦸', price: 300, desc: '今天是超级英雄' },
  { id: 'cloth_kimono', category: 'cloth', name: '和服', icon: '👘', price: 250, desc: '养生达人专属' },
  { id: 'cloth_rainbow', category: 'cloth', name: '彩虹衣', icon: '🌈', price: 400, desc: 'LGBTQ+友好，爱就是爱' },

  // === 配饰系列 ===
  { id: 'acc_none', category: 'accessory', name: '无配饰', icon: '🚫', price: 0, desc: '素颜朝天' },
  { id: 'acc_glasses', category: 'accessory', name: '圆框眼镜', icon: '👓', price: 70, desc: '文艺青年必备' },
  { id: 'acc_sunglasses', category: 'accessory', name: '墨镜', icon: '🕶️', price: 90, desc: '酷就一个字' },
  { id: 'acc_mask', category: 'accessory', name: '口罩', icon: '😷', price: 40, desc: '健康第一' },
  { id: 'acc_headphone', category: 'accessory', name: '耳机', icon: '🎧', price: 80, desc: '沉浸在自己的世界' },
  { id: 'acc_necklace', category: 'accessory', name: '项链', icon: '📿', price: 150, desc: '精致养生人' },
  { id: 'acc_scraf', category: 'accessory', name: '围巾', icon: '🧣', price: 70, desc: '暖呼呼' },

  // === 背景系列 ===
  { id: 'bg_none', category: 'bg', name: '默认背景', icon: '🚫', price: 0, desc: '白白净净' },
  { id: 'bg_bedroom', category: 'bg', name: '温馨卧室', icon: '🛏️', price: 100, desc: '宅家专属' },
  { id: 'bg_forest', category: 'bg', name: '森林', icon: '🌲', price: 120, desc: '呼吸新鲜空气' },
  { id: 'bg_beach', category: 'bg', name: '海滩', icon: '🏖️', price: 150, desc: '度假模式' },
  { id: 'bg_space', category: 'bg', name: '太空', icon: '🚀', price: 300, desc: '在宇宙中养生' },
  { id: 'bg_cherry', category: 'bg', name: '樱花树下', icon: '🌸', price: 200, desc: '浪漫满分' },
  { id: 'bg_rainbow', category: 'bg', name: '彩虹天空', icon: '🌈', price: 250, desc: '心情upup' },

  // === 鞋子系列 ===
  { id: 'shoes_none', category: 'shoes', name: '默认鞋子', icon: '🚫', price: 0, desc: '光脚不怕穿鞋的' },
  { id: 'shoes_sneakers', category: 'shoes', name: '运动鞋', icon: '👟', price: 80, desc: '百搭舒适，运动必备' },
  { id: 'shoes_boots', category: 'shoes', name: '马丁靴', icon: '🥾', price: 120, desc: '帅气硬朗，秋冬必备' },
  { id: 'shoes_slippers', category: 'shoes', name: '拖鞋', icon: '🩴', price: 40, desc: '居家养生人标配' },
  { id: 'shoes_heels', category: 'shoes', name: '高跟鞋', icon: '👠', price: 180, desc: '优雅精致，气场满分' },
  { id: 'shoes_flats', category: 'shoes', name: '乐福鞋', icon: '🥿', price: 90, desc: '文艺气质，懒人最爱' },
  { id: 'shoes_sandals', category: 'shoes', name: '凉鞋', icon: '👡', price: 60, desc: '夏日清凉，还阳不累' },
]

// 获取分类列表
function getCategories() {
  return SHOP_CATEGORIES
}

// 获取某分类下的道具
function getItemsByCategory(category) {
  return SHOP_ITEMS.filter(item => item.category === category)
}

// 获取所有道具
function getAllItems() {
  return SHOP_ITEMS
}

// 根据ID获取道具
function getItemById(id) {
  return SHOP_ITEMS.find(item => item.id === id)
}

// 计算等级提升时奖励的积分
function getLevelUpReward(newLevel) {
  const rewards = {
    2: 30, 3: 50, 4: 80, 5: 100, 6: 150,
    7: 200, 8: 300, 9: 400, 10: 500,
  }
  return rewards[newLevel] || 0
}

// 连续打卡奖励（每7天额外奖励）
function getStreakReward(streak) {
  if (streak > 0 && streak % 7 === 0) {
    return 20 + Math.floor(streak / 7) * 10
  }
  return 0
}

module.exports = {
  SHOP_CATEGORIES,
  SHOP_ITEMS,
  getCategories,
  getItemsByCategory,
  getAllItems,
  getItemById,
  getLevelUpReward,
  getStreakReward,
}
