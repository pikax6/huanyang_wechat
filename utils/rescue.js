// 场景急救包 - 丰富交互内容
// 每个场景包含 4 种交互模式：呼吸、决策树、立即行动、记录

const RESCUE_SCENARIOS = {
  // 深夜放毒防御
  foodDefense: {
    id: 'foodDefense',
    icon: '🛡️',
    name: '深夜放毒防御',
    desc: '想吃外卖时点这里',
    color: '#FF8B6E',
    // 交互式呼吸练习
    breathing: {
      title: '抵抗馋虫呼吸法',
      subtitle: '跟着节奏，把馋意呼出去',
      pattern: '478', // 吸气4秒-屏息7秒-呼气8秒
      rounds: 4,
      phases: [
        { name: '吸气', duration: 4, hint: '闻一闻，是真的饿吗？' },
        { name: '屏息', duration: 7, hint: '让身体判断一下' },
        { name: '呼气', duration: 8, hint: '把馋虫呼出去~' },
      ],
    },
    // 决策树引导
    decisionTree: {
      title: '先问自己几个问题',
      nodes: {
        start: {
          question: '现在是真饿了，还是嘴巴寂寞？',
          options: [
            { text: '肚子咕咕叫，真饿了', next: 'real_hungry' },
            { text: '就是想吃点啥', next: 'just_craving' },
            { text: '说不上来', next: 'drink_water' },
          ],
        },
        real_hungry: {
          question: '那要不要试试更健康的选择？',
          options: [
            { text: '好，给我推荐', next: 'healthy_choice' },
            { text: '不行，就要吃这个', next: 'wait_10min' },
          ],
        },
        just_craving: {
          question: '馋虫作祟！等10分钟试试？',
          options: [
            { text: '好，我等等', next: 'wait_10min' },
            { text: '等不了！', next: 'drink_water' },
          ],
        },
        drink_water: {
          answer: '💧 先喝一杯温水，很多时候身体是把渴当成了饿。等5分钟再看看。',
        },
        healthy_choice: {
          answer: '🍎 试试：一个苹果 / 一把坚果 / 一杯热牛奶 / 一根香蕉。比外卖香多了，而且不用等30分钟。',
        },
        wait_10min: {
          answer: '⏰ 设个10分钟闹钟。研究表明，馋意通常10分钟内会消退。这10分钟去刷个牙，牙膏味会让食物失去吸引力。',
        },
      },
    },
    // 立即行动（轮换文案，避免重复）
    actions: [
      { icon: '🥛', text: '立刻喝一大杯温水，馋意会减半' },
      { icon: '🪥', text: '去刷牙，牙膏味会让外卖失去吸引力' },
      { icon: '🚶', text: '下楼走5分钟，离开食物环境' },
      { icon: '📱', text: '把外卖App移到文件夹最深处' },
      { icon: '💤', text: '闭眼躺10分钟，馋意会自然消退' },
      { icon: '🍎', text: '如果真饿，吃个水果代替外卖' },
      { icon: '📝', text: '写下现在想吃的，明天白天再决定' },
      { icon: '🎶', text: '听一首喜欢的歌，转移注意力' },
    ],
    // 记录心情的引导文案
    recordPrompt: '现在最想吃什么？写下来，看看明天还馋不馋',
  },

  // emo熬夜拦截
  sleepIntercept: {
    id: 'sleepIntercept',
    icon: '🌙',
    name: 'emo熬夜拦截',
    desc: '深夜刷手机时点这里',
    color: '#6B7FD7',
    breathing: {
      title: '478助眠呼吸法',
      subtitle: '跟着节奏，慢慢进入梦乡',
      pattern: '478',
      rounds: 4,
      phases: [
        { name: '吸气', duration: 4, hint: '数着拍子，慢慢吸' },
        { name: '屏息', duration: 7, hint: '让氧气充满身体' },
        { name: '呼气', duration: 8, hint: '把今天的烦恼呼出去' },
      ],
    },
    decisionTree: {
      title: '深夜emo自检',
      nodes: {
        start: {
          question: '现在是什么状态？',
          options: [
            { text: '刷手机停不下来', next: 'scrolling' },
            { text: '胡思乱想睡不着', next: 'ruminating' },
            { text: '就是不想睡', next: 'revenge' },
          ],
        },
        scrolling: {
          question: '刷的内容让你开心吗？',
          options: [
            { text: '越刷越焦虑', next: 'put_down' },
            { text: '还行，挺爽的', next: 'time_check' },
          ],
        },
        ruminating: {
          question: '想的是过去的事还是未来的事？',
          options: [
            { text: '过去的事，后悔', next: 'let_go' },
            { text: '未来的事，焦虑', next: 'tomorrow_list' },
          ],
        },
        revenge: {
          question: '是不是觉得今天没属于自己的时间？',
          options: [
            { text: '是的！白天都在忙别人', next: 'revenge_explain' },
            { text: '不是，就是不想睡', next: 'put_down' },
          ],
        },
        put_down: {
          answer: '📵 把手机放到伸手够不到的地方。屏幕的蓝光会让大脑误以为还是白天。先闭眼躺5分钟，试试感受自己的呼吸。',
        },
        time_check: {
          answer: '⏰ 看看时间，再刷下去明天会更累。给自己定个"再刷3分钟就睡"的承诺，到点立刻关屏。',
        },
        let_go: {
          answer: '🌿 过去的事已经发生了，再想也改变不了。试试在心里说："我允许这件事发生，也允许自己放下。" 然后深呼吸3次。',
        },
        tomorrow_list: {
          answer: '📝 把担心的事写在纸上/备忘录，告诉自己"明天再处理"。大脑一旦觉得"已记录"，就会放松下来。',
        },
        revenge_explain: {
          answer: '💛 这是"报复性熬夜"，很常见。但用睡眠惩罚自己，明天会更没精神，恶性循环。试着明天白天给自己留15分钟"专属时间"。',
        },
      },
    },
    actions: [
      { icon: '📵', text: '把手机放到床头柜以外的地方' },
      { icon: '🛏️', text: '关掉主灯，只留小夜灯' },
      { icon: '🌡️', text: '房间温度调到20-22度，更易入睡' },
      { icon: '🎵', text: '听白噪音或雨声，屏蔽杂念' },
      { icon: '📝', text: '把脑子里的想法全写下来，清空大脑' },
      { icon: '🧘', text: '从脚趾到头顶，依次放松每块肌肉' },
      { icon: '📖', text: '看一本纸质书（不要小说）' },
      { icon: '💧', text: '泡脚10分钟，让身体放松' },
    ],
    recordPrompt: '现在脑子里在想什么？写下来，让大脑松口气',
  },

  // 摸鱼焦虑急救
  anxietyRescue: {
    id: 'anxietyRescue',
    icon: '😰',
    name: '摸鱼焦虑急救',
    desc: '工作焦虑想逃避时点这里',
    color: '#9B7EC8',
    breathing: {
      title: '方块呼吸法',
      subtitle: '稳住神经，找回专注',
      pattern: 'box', // 4-4-4-4
      rounds: 4,
      phases: [
        { name: '吸气', duration: 4, hint: '慢慢吸，数到4' },
        { name: '屏息', duration: 4, hint: '稳住' },
        { name: '呼气', duration: 4, hint: '慢慢呼，数到4' },
        { name: '屏息', duration: 4, hint: '再稳一下' },
      ],
    },
    decisionTree: {
      title: '焦虑拆解器',
      nodes: {
        start: {
          question: '现在的焦虑来自哪里？',
          options: [
            { text: '事情太多，不知从哪开始', next: 'overwhelmed' },
            { text: '担心做不好', next: 'fear_fail' },
            { text: '不想做，想逃避', next: 'procrastinate' },
          ],
        },
        overwhelmed: {
          question: '能列出最紧急的3件事吗？',
          options: [
            { text: '可以', next: 'pick_one' },
            { text: '脑子一团乱', next: 'brain_dump' },
          ],
        },
        fear_fail: {
          question: '最坏的结果是什么？能接受吗？',
          options: [
            { text: '能接受', next: 'accept_worst' },
            { text: '不能接受', next: 'break_down' },
          ],
        },
        procrastinate: {
          question: '是不想做，还是不会做？',
          options: [
            { text: '不想做，没动力', next: 'tiny_step' },
            { text: '不会做，卡住了', next: 'ask_help' },
          ],
        },
        pick_one: {
          answer: '🎯 从3件事里挑最难的那件，先做5分钟。只要开始，焦虑就会减半。',
        },
        brain_dump: {
          answer: '📝 拿张纸，把脑子里所有想法倒出来，不用排序。倒完后圈出最重要的1件，从它开始。',
        },
        accept_worst: {
          answer: '💪 既然最坏的结果都能接受，那就放手去做。完美主义是焦虑的温床，"做完"比"做好"重要。',
        },
        break_down: {
          answer: '🔧 把任务拆到"傻瓜都能做"的程度。比如"写报告"拆成"打开文档写标题"。先做这一步。',
        },
        tiny_step: {
          answer: '⏰ 设个5分钟计时器，告诉自己"只做5分钟"。5分钟后想停就停。通常开始后就会继续做下去。',
        },
        ask_help: {
          answer: '🤝 卡住不丢人。把问题写清楚，发给同事/朋友/搜索引擎。求助也是生产力。',
        },
      },
    },
    actions: [
      { icon: '🧊', text: '用冷水洗把脸，激活迷走神经' },
      { icon: '🚶', text: '离开工位走5分钟' },
      { icon: '📝', text: '把焦虑写下来，外化它' },
      { icon: '⏰', text: '番茄工作法：25分钟专注+5分钟休息' },
      { icon: '💧', text: '喝杯水，脱水会加重焦虑' },
      { icon: '🌳', text: '看窗外远处20秒，放松眼睛和神经' },
      { icon: '👃', text: '闻一闻薄荷/柑橘味，提神镇定' },
      { icon: '✅', text: '列今天已完成的事，找回掌控感' },
    ],
    recordPrompt: '现在最让你焦虑的是什么？写下来，它会变小',
  },
}

// 根据使用次数轮换行动建议（每次显示3条不重复的）
function getRotatingActions(scenarioId, useHistory) {
  const scenario = RESCUE_SCENARIOS[scenarioId]
  if (!scenario) return []
  const actions = scenario.actions
  const useCount = useHistory ? useHistory.length : 0
  // 根据使用次数轮换起始位置
  const startIdx = useCount % actions.length
  const result = []
  for (let i = 0; i < 3; i++) {
    result.push(actions[(startIdx + i) % actions.length])
  }
  return result
}

// 获取场景
function getScenario(id) {
  return RESCUE_SCENARIOS[id]
}

// 获取所有场景列表
function getScenarioList() {
  return Object.values(RESCUE_SCENARIOS).map(s => ({
    id: s.id,
    icon: s.icon,
    name: s.name,
    desc: s.desc,
    color: s.color,
  }))
}

module.exports = {
  RESCUE_SCENARIOS,
  getScenario,
  getScenarioList,
  getRotatingActions,
}
