// 虚拟小人组件逻辑 - 增强版
const { getCharacterAppearance, getComplexionColor, getDialogue } = require('../../utils/character.js')

Component({
  properties: {
    character: {
      type: Object,
      value: {
        complexion: 50,
        energy: 50,
        body: 50,
        sleep: 50,
        level: 1,
        outfits: { hat: '', cloth: '', bg: '', accessory: '', shoes: '' },
      },
    },
    showDialogue: {
      type: Boolean,
      value: true,
    },
    context: {
      type: String,
      value: '',
    },
  },

  data: {
    dialogue: '',
    showBubble: false,
    headColor: '#F5DEB3',
    darkCircleClass: '',
    showDarkCircles: false,
    eyeClass: 'normal',
    eyeShine: false,
    showBlush: false,
    showPimples: false,
    showSparkles: false,
    mouthType: 'smile',
    bodyType: 'normal',
    postureClass: '',
    outfits: { hat: '', cloth: '', bg: '', accessory: '', shoes: '' },
  },

  lifetimes: {
    attached() {
      this.updateAppearance()
      if (this.properties.showDialogue) {
        this.updateDialogue()
      }
    },
  },

  observers: {
    'character'(val) {
      this.updateAppearance()
    },
    'context'(val) {
      if (this.properties.showDialogue) {
        this.updateDialogue()
      }
    },
  },

  methods: {
    updateAppearance() {
      const char = this.properties.character
      if (!char) return

      const app = getCharacterAppearance(char)
      const headColor = getComplexionColor(char.complexion)

      // 黑眼圈
      let darkCircleClass = ''
      let showDarkCircles = false
      if (app.complexion.darkCircles || char.sleep < 40) {
        showDarkCircles = true
        darkCircleClass = char.sleep < 20 ? 'heavy' : 'light'
      }

      // 眼睛状态
      let eyeClass = 'normal'
      let eyeShine = false
      if (char.energy < 20) {
        eyeClass = 'half-closed'
      } else if (char.energy > 80) {
        eyeClass = 'sparkle'
        eyeShine = true
      }

      // 腮红
      const showBlush = char.complexion >= 60

      // 痘痘
      const showPimples = char.complexion < 20

      // 粒子特效（状态很好时）
      const showSparkles = char.complexion >= 70 && char.energy >= 70

      // 嘴巴类型
      let mouthType = 'smile'
      const avgState = (char.complexion + char.energy + char.sleep) / 3
      if (avgState < 25) {
        mouthType = 'sad'
      } else if (avgState < 45) {
        mouthType = 'flat'
      } else if (avgState >= 75) {
        mouthType = 'smile'
      } else {
        mouthType = 'flat'
      }

      // 身体类型
      let bodyType = 'normal'
      if (char.body < 40) {
        bodyType = 'chubby'
      } else if (char.body > 70) {
        bodyType = 'fit'
      }

      // 姿态
      let postureClass = ''
      if (char.energy < 30) {
        postureClass = 'slump'
      } else if (char.energy > 80) {
        postureClass = 'energetic'
      }

      // 装扮
      const outfits = char.outfits || { hat: '', cloth: '', bg: '', accessory: '', shoes: '' }

      this.setData({
        headColor,
        darkCircleClass,
        showDarkCircles,
        eyeClass,
        eyeShine,
        showBlush,
        showPimples,
        showSparkles,
        mouthType,
        bodyType,
        postureClass,
        outfits,
      })
    },

    updateDialogue() {
      const char = this.properties.character
      const context = this.properties.context
      const dialogue = getDialogue(context, char)

      this.setData({ dialogue, showBubble: false })

      setTimeout(() => {
        this.setData({ showBubble: true })
      }, 300)
    },

    onTapCharacter() {
      this.updateDialogue()
      this.triggerEvent('tap')
    },
  },
})
