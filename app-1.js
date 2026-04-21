const state = {
  activeGroup: "analysis",
  activeSection: "growth",
  selectedUserId: "U10028",
  sidebarCollapsed: false,
  liveTick: 0,
  liveUsers: 6680,
  liveOrders: 2860,
  liveRevenue: 116880,
  livePausedUntil: 0,
  pendingAction: "",
  liveEvents: [
    ["刚刚", "scan_machine_qr", "静安嘉里中心 C-07", "林可欣扫码开柜"],
    ["1 分钟前", "pay_order", "杭州大学城 D-03", "陈宇航完成新人首单"],
    ["3 分钟前", "coupon_receive", "深圳社区 E-12", "周明领取生鲜召回券"],
  ],
};

const navigation = {
  analysis: [
    { id: "growth", label: "增长分析" },
    { id: "events", label: "事件分析" },
    { id: "funnel", label: "漏斗分析" },
  ],
  assets: [
    { id: "profiles", label: "用户画像与标签" },
    { id: "segments", label: "人群分群" },
  ],
  activation: [
    { id: "campaigns", label: "触达活动" },
    { id: "attribution", label: "触达效果" },
  ],
  experimentation: [
    { id: "experiments", label: "A/B 实验" },
  ],
  ai: [
    { id: "ai", label: "AI 应用" },
  ],
  reports: [
    { id: "attribution", label: "效果归因" },
    { id: "growth", label: "经营看板" },
  ],
  settings: [
    { id: "settings", label: "平台管理" },
  ],
};

const sectionToGroup = Object.fromEntries(
  Object.entries(navigation).flatMap(([group, items]) => items.map((item) => [item.id, group])),
);

const days = ["04-08", "04-09", "04-10", "04-11", "04-12", "04-13", "04-14"];

const trend = {
  dau: [5280, 5520, 5718, 5890, 6130, 6418, 6680],
  payers: [1460, 1504, 1530, 1602, 1710, 1840, 1918],
  orders: [2080, 2186, 2270, 2410, 2564, 2722, 2860],
  revenue: [87600, 90240, 93510, 98280, 103420, 109660, 116880],
};

const channels = [
  { name: "地铁站扫码", value: 38, count: "18,420" },
  { name: "社区货柜复购", value: 25, count: "12,138" },
  { name: "写字楼会员", value: 18, count: "8,762" },
  { name: "校园新人券", value: 12, count: "5,842" },
  { name: "活动裂变", value: 7, count: "3,402" },
];

const eventRows = [
  ["scan_machine_qr", "扫码开柜", "78,420", "41,286", "2.6 次", "2.1%"],
  ["view_product", "浏览商品", "182,334", "49,720", "4.2 次", "6.8%"],
  ["add_to_cart", "加入购物车", "69,806", "28,113", "2.1 次", "8.4%"],
  ["pay_order", "支付订单", "42,568", "19,428", "1.8 次", "10.2%"],
  ["coupon_receive", "领取优惠券", "31,224", "16,002", "1.5 次", "-3.1%"],
  ["refund_request", "申请退款", "1,208", "936", "1.1 次", "-0.8%"],
];

const eventBreakdown = [
  { name: "饮料冷柜 A-01", value: 31, count: "24,312" },
  { name: "综合零食柜 B-19", value: 24, count: "18,860" },
  { name: "咖啡热饮柜 C-07", value: 18, count: "14,126" },
  { name: "校园轻食柜 D-03", value: 16, count: "12,546" },
  { name: "社区生鲜柜 E-12", value: 11, count: "8,576" },
];

const funnelSteps = [
  { name: "扫码开柜", count: 78240, rate: 100, pass: "100%" },
  { name: "浏览商品", count: 61182, rate: 78.2, pass: "78.2%" },
  { name: "加入购物车", count: 34906, rate: 44.6, pass: "57.1%" },
  { name: "提交订单", count: 26744, rate: 34.2, pass: "76.6%" },
  { name: "支付成功", count: 21438, rate: 27.4, pass: "80.2%" },
];

const users = [
  {
    id: "U10028",
    name: "林可欣",
    phone: "138****6821",
    city: "上海",
    channel: "地铁站扫码",
    level: "金卡会员",
    value: "高价值",
    ltv: "2,846",
    orders: 37,
    lastActive: "2026-04-21 08:42",
    tags: ["高频早餐", "咖啡偏好", "优惠敏感低", "近7天活跃", "写字楼用户"],
    timeline: [
      ["08:42", "支付订单", "拿铁咖啡 1 杯，能量棒 1 个", "¥25.8"],
      ["08:39", "扫码开柜", "静安嘉里中心 C-07", "成功"],
      ["04-20", "领取优惠券", "会员日 8 折券", "未使用"],
      ["04-18", "加入购物车", "无糖乌龙茶、鸡胸肉轻食", "2 件"],
      ["04-15", "完成复购", "社区生鲜柜 E-12", "¥42.5"],
    ],
  },
  {
    id: "U10043",
    name: "陈宇航",
    phone: "159****9102",
    city: "杭州",
    channel: "校园新人券",
    level: "普通会员",
    value: "潜力用户",
    ltv: "326",
    orders: 5,
    lastActive: "2026-04-20 22:18",
    tags: ["新客首购", "夜间消费", "价格敏感", "校园用户"],
    timeline: [
      ["04-20", "支付订单", "可乐、薯片", "¥13.9"],
      ["04-20", "领取优惠券", "新人立减 5 元", "已使用"],
      ["04-19", "浏览商品", "校园轻食柜 D-03", "12 件"],
      ["04-18", "注册会员", "手机号授权", "成功"],
    ],
  },
  {
    id: "U10106",
    name: "周明",
    phone: "186****2310",
    city: "深圳",
    channel: "社区货柜复购",
    level: "银卡会员",
    value: "流失预警",
    ltv: "1,128",
    orders: 19,
    lastActive: "2026-04-10 19:05",
    tags: ["近10天未购", "生鲜偏好", "社区用户", "召回人群"],
    timeline: [
      ["04-10", "浏览商品", "社区生鲜柜 E-12", "8 件"],
      ["04-08", "支付订单", "牛奶、鸡蛋", "¥35.6"],
      ["04-03", "客服反馈", "货柜缺货", "已处理"],
      ["03-29", "完成复购", "社区生鲜柜 E-12", "¥28.0"],
    ],
  },
];

const tags = [
  ["高价值用户", "规则标签", "8,420", "近30天消费金额 >= 300"],
  ["加购未支付", "行为标签", "5,216", "24小时内加购且未支付"],
  ["早餐咖啡偏好", "偏好标签", "12,904", "咖啡类商品购买占比 >= 40%"],
  ["沉睡预警", "生命周期", "3,886", "14天未活跃且历史订单 >= 3"],
  ["价格敏感", "模型标签", "9,115", "优惠券使用率 >= 60%"],
];

const segments = [
  { name: "近7天浏览未购买", count: "18,426", update: "每小时", owner: "增长运营", status: "同步中" },
  { name: "加购未支付召回", count: "5,216", update: "实时", owner: "交易运营", status: "可用" },
  { name: "写字楼高频咖啡用户", count: "7,804", update: "每日", owner: "会员运营", status: "可用" },
  { name: "社区生鲜流失预警", count: "3,886", update: "每日", owner: "留存运营", status: "可用" },
];

const campaigns = [
  {
    name: "加购未支付 2 小时召回",
    channel: "短信 + 小程序订阅消息",
    audience: "加购未支付召回",
    sent: "4,812",
    click: "18.6%",
    conversion: "7.4%",
    status: "运行中",
  },
  {
    name: "写字楼早餐咖啡会员日",
    channel: "企业微信 + App Push",
    audience: "写字楼高频咖啡用户",
    sent: "7,204",
    click: "24.8%",
    conversion: "11.2%",
    status: "已完成",
  },
  {
    name: "社区生鲜沉睡召回",
    channel: "短信",
    audience: "社区生鲜流失预警",
    sent: "3,512",
    click: "9.7%",
    conversion: "3.9%",
    status: "运行中",
  },
];

const experiments = [
  {
    name: "新人券面额实验",
    audience: "校园新注册用户",
    goal: "首单支付转化率",
    a: "立减 3 元",
    b: "满 15 减 5 元",
    aRate: "18.4%",
    bRate: "22.1%",
    lift: "+20.1%",
    status: "显著",
  },
  {
    name: "咖啡 Push 文案实验",
    audience: "写字楼咖啡偏好用户",
    goal: "Push 点击率",
    a: "今天也来一杯？",
    b: "8:30 前下单享会员价",
    aRate: "13.2%",
    bRate: "16.9%",
    lift: "+28.0%",
    status: "观察中",
  },
];

const attributionRows = [
  ["加购未支付 2 小时召回", "短信 + 订阅消息", "5,216", "386", "7.4%", "¥18,620", "3.8"],
  ["写字楼早餐咖啡会员日", "企微 + Push", "7,804", "874", "11.2%", "¥42,118", "6.1"],
  ["社区生鲜沉睡召回", "短信", "3,886", "151", "3.9%", "¥9,706", "2.4"],
  ["校园新人首单转化", "小程序订阅", "6,120", "812", "13.3%", "¥21,932", "5.7"],
];

const aiScenarios = [
  {
    name: "自然语言分群",
    desc: "输入“近 7 天加购咖啡但未支付的写字楼用户”，自动生成规则、人群规模和触达建议。",
    result: "预估 1,286 人",
    action: "生成分群",
  },
  {
    name: "Customer AI 预测分数",
    desc: "基于 Keen Lakehouse 行为、订单和会员数据，预测流失、复购、LTV 和优惠敏感度。",
    result: "沉睡风险高 3,886 人",
    action: "查看模型",
  },
  {
    name: "Next Best Action",
    desc: "为每个人群推荐下一步动作：发券、Push、补货、提高频控或转广告重定向。",
    result: "推荐 6 条策略",
    action: "生成策略",
  },
  {
    name: "AI 洞察助手",
    desc: "围绕指标波动自动解释原因，输出可追溯的事件、人群、货柜和渠道证据。",
    result: "发现 4 个异常",
    action: "追问原因",
  },
];

const aiRecommendations = [
  ["高流失社区生鲜用户", "流失概率 82%", "发送 12 元满减券 + 周末生鲜补货提醒", "预计唤醒 428 人"],
  ["写字楼咖啡高频用户", "复购概率 76%", "08:15 推送会员咖啡价，联动 C-07 货柜补货", "预计增收 ¥8,420"],
  ["校园新客首单后用户", "二购概率 31%", "第 2 天推轻食组合券，避免连续短信触达", "预计提升 6.8%"],
  ["价格敏感但高客单用户", "优惠敏感 69%", "用阶梯券替代无门槛券，提高毛利保护", "预计 ROI 5.2"],
];

const operationFlow = [
  { title: "发现异常", desc: "支付转化率较昨日下降 3.2%", status: "已识别", action: "下钻异常" },
  { title: "定位原因", desc: "校园 D-03 缺货 + 新人券核销失败", status: "已定位", action: "查看证据" },
  { title: "圈选人群", desc: "受影响新客 1,286 人", status: "待确认", action: "生成人群" },
  { title: "触达挽回", desc: "订阅消息 + 轻食组合券", status: "待执行", action: "生成活动" },
  { title: "效果复盘", desc: "24 小时后自动归因", status: "未开始", action: "设置复盘" },
];

const stationHealth = [
  { name: "静安嘉里中心 C-07", status: "健康", sales: "¥12,640", stock: "92%", issue: "无" },
  { name: "杭州大学城 D-03", status: "预警", sales: "¥7,926", stock: "18%", issue: "轻食缺货" },
  { name: "深圳社区 E-12", status: "关注", sales: "¥6,514", stock: "44%", issue: "周末转化低" },
  { name: "陆家嘴写字楼 A-01", status: "健康", sales: "¥15,408", stock: "81%", issue: "无" },
];

function formatNumber(value) {
  return value.toLocaleString("zh-CN");
}

function sectionHeader(title, desc, actionText) {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">${title}</h1>
        <p class="page-desc">${desc}</p>
      </div>
      ${actionText ? `<button class="primary-button" data-action="${actionText}">${icon("plus")}${actionText}</button>` : ""}
    </div>
  `;
}

function icon(name) {
  const paths = {
    plus: "M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z",
    search: "M10.5 4a6.5 6.5 0 0 1 5.2 10.4l4 4-1.4 1.4-4-4A6.5 6.5 0 1 1 10.5 4Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z",
    sync: "M7 7h8.2L13 4.8 14.4 3 20 8.5 14.4 14 13 12.2 15.2 10H7V7Zm10 10H8.8l2.2 2.2L9.6 21 4 15.5 9.6 10 11 11.8 8.8 14H17v3Z",
    export: "M11 4h2v8l3-3 1.4 1.4L12 15.8l-5.4-5.4L8 9l3 3V4Zm-6 13h14v3H5v-3Z",
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.plus}"/></svg>`;
}

function filterPanel(extra = "") {
  return `
    <div class="filter-panel">
      <div class="filter-row">
        <span class="filter-label">分析对象</span>
        <select class="select"><option>全部无人售货机</option><option>写字楼货柜</option><option>社区货柜</option><option>校园货柜</option></select>
        <span class="filter-label">时间范围</span>
        <select class="select"><option>最近 7 天</option><option>最近 30 天</option><option>本月</option></select>
        <input class="input" placeholder="搜索事件、用户、人群或活动" />
        <button class="primary-button" data-action="查询">${icon("search")}查询</button>
        <button class="secondary-button" data-action="重置">重置</button>
        ${extra}
      </div>
    </div>
  `;
}

function metricCard(label, value, delta, down = false) {
  return `
    <div class="metric-card">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
      <div class="metric-delta ${down ? "down" : ""}">
        <span>${down ? "↓" : "↑"}</span>
        <span>${delta}</span>
      </div>
    </div>
  `;
}
