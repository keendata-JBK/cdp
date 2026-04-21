function renderAll() {
  renderGrowth();
  renderEvents();
  renderFunnel();
  renderProfiles();
  renderSegments();
  renderCampaigns();
  renderExperiments();
  renderAI();
  renderAttribution();
  renderSettings();
}

function renderTopNav() {
  const topNav = document.querySelector("#topNav");
  const items = navigation[state.activeGroup] || navigation.analysis;
  topNav.innerHTML = items.map((item) => `
    <button class="top-nav-item ${item.id === state.activeSection ? "active" : ""}" data-section="${item.id}">
      ${item.label}
    </button>
  `).join("");
}

function switchGroup(group) {
  state.activeGroup = group;
  const first = navigation[group]?.[0]?.id || "growth";
  switchSection(first, group);
}

function switchSection(section, group = state.activeGroup) {
  state.activeGroup = group;
  state.activeSection = section;
  document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.id === section));
  document.querySelectorAll("[data-group]").forEach((item) => item.classList.toggle("active", item.dataset.group === group));
  renderTopNav();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openModal(title, body) {
  state.pendingAction = title;
  document.querySelector("#modalTitle").textContent = title;
  document.querySelector("#modalBody").innerHTML = body;
  document.querySelector("#modalBackdrop").classList.add("show");
  document.querySelector("#modalBackdrop").setAttribute("aria-hidden", "false");
}

function closeModal() {
  document.querySelector("#modalBackdrop").classList.remove("show");
  document.querySelector("#modalBackdrop").setAttribute("aria-hidden", "true");
}

function openDrawer(title, body) {
  document.querySelector("#drawerTitle").textContent = title;
  document.querySelector("#drawerBody").innerHTML = body;
  document.querySelector("#detailDrawer").classList.add("show");
  document.querySelector("#detailDrawer").setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  document.querySelector("#detailDrawer").classList.remove("show");
  document.querySelector("#detailDrawer").setAttribute("aria-hidden", "true");
}

function handleAction(action) {
  const messages = {
    查询: "已按当前条件刷新分析结果",
    重置: "筛选条件已重置",
    导出: "已生成导出任务，可在任务监控查看",
    "刷新 AI 洞察": "AI 洞察已基于最新事件流重新计算",
    帮助文档: "已打开当前页面的使用说明",
    账号设置: "已进入账号和权限设置",
    同步事件字典: "已从 Keen Lakehouse 元数据同步事件字典",
    标签计算任务: "已打开标签任务列表",
    添加人群规则: "已新增一条规则条件",
    保存人群: "人群已保存并进入实时更新",
    导出名单: "名单导出任务已提交",
    同步人群: "人群同步任务已提交",
    导出归因明细: "归因明细导出任务已提交",
    "交给 AI 处理": "AI 已生成异常处理方案草稿",
  };

  if (action === "暂停实时刷新") {
    state.livePausedUntil = Date.now() + 10000;
    renderGrowth();
    showToast("实时刷新已暂停 10 秒");
    return;
  }

  if (action === "任务中心") {
    openModal("任务中心", `
      ${dataTable(["任务", "类型", "状态", "最近执行"], [
        ["价格敏感标签计算", "标签任务", '<span class="status-pill">成功</span>', "17:48"],
        ["加购未支付人群更新", "人群任务", '<span class="status-pill info">运行中</span>', "17:50"],
        ["广告平台人群同步", "同步任务", '<span class="status-pill warn">重试中</span>', "17:42"],
      ])}
    `);
    return;
  }

  if (action === "告警中心") {
    openModal("告警中心", `
      <div class="insight-list">
        <div class="insight-item"><strong>校园轻食柜 D-03 库存低于 20%</strong><span>预计 48 分钟后影响午间转化，建议立即创建补货任务。</span></div>
        <div class="insight-item"><strong>新人券核销失败率异常</strong><span>近 1 小时失败率 8.4%，高于过去 7 天均值 3.1%。</span></div>
        <div class="insight-item"><strong>短信回执延迟</strong><span>社区生鲜召回活动回执延迟约 12 分钟，不影响发送。</span></div>
      </div>
    `);
    return;
  }

  if (action === "帮助文档") {
    openModal("帮助文档", `
      <div class="insight-list">
        <div class="insight-item"><strong>快速路径</strong><span>从左侧选择一级模块，再使用顶部二级菜单进入具体页面。</span></div>
        <div class="insight-item"><strong>闭环流程</strong><span>增长异常 → 下钻证据 → 生成人群 → 创建触达 → A/B 实验 → 效果归因。</span></div>
        <div class="insight-item"><strong>操作手册</strong><span>完整手册已生成在工作区 USER_MANUAL.md。</span></div>
      </div>
    `);
    return;
  }

  if (action === "账号设置") {
    openModal("账号设置", `
      <div class="form-grid">
        <label>当前用户<input class="input" value="test_admin" /></label>
        <label>角色<select class="select"><option>租户管理员</option><option>增长运营</option><option>数据分析师</option></select></label>
        <label>默认空间<select class="select"><option>vending_lakehouse</option><option>keen_demo</option></select></label>
        <label>消息通知<select class="select"><option>站内 + 邮件</option><option>仅站内</option></select></label>
      </div>
    `);
    return;
  }

  if (action === "同步事件字典") {
    openModal("同步事件字典", `
      ${dataTable(["事件名", "来源表", "状态", "字段数"], [
        ["scan_machine_qr", "dwd_event_stream", '<span class="status-pill">已同步</span>', "18"],
        ["coupon_redeem_failed", "dwd_event_stream", '<span class="status-pill info">新增</span>', "12"],
        ["machine_stock_low", "dwd_device_event", '<span class="status-pill info">新增</span>', "9"],
      ])}
    `);
    return;
  }

  if (action === "标签计算任务") {
    openModal("标签计算任务", `
      ${dataTable(["标签", "计算方式", "调度", "状态"], [
        ["高价值用户", "规则标签", "每日 02:00", '<span class="status-pill">成功</span>'],
        ["沉睡预警", "生命周期模型", "每小时", '<span class="status-pill info">运行中</span>'],
        ["价格敏感", "模型标签", "每日 03:00", '<span class="status-pill warn">等待资源</span>'],
      ])}
    `);
    return;
  }

  if (action === "触达频控规则") {
    openModal("触达频控规则", `
      <div class="form-grid">
        <label>单用户日触达上限<select class="select"><option>3 次</option><option>2 次</option><option>5 次</option></select></label>
        <label>短信周上限<select class="select"><option>2 次</option><option>1 次</option><option>3 次</option></select></label>
        <label>免打扰时段<select class="select"><option>22:00 - 08:00</option><option>21:00 - 09:00</option></select></label>
        <label>冲突策略<select class="select"><option>高优先级活动胜出</option><option>先创建活动胜出</option></select></label>
      </div>
    `);
    return;
  }

  if (action === "查看点位") {
    openDrawer("点位详情", `
      <div class="drawer-section">
        <h3>杭州大学城 D-03</h3>
        <div class="profile-line"><span>今日销售</span><strong>¥7,926</strong></div>
        <div class="profile-line"><span>库存健康度</span><strong>18%</strong></div>
        <div class="profile-line"><span>主要问题</span><strong>轻食缺货</strong></div>
        <div class="profile-line"><span>影响人群</span><strong>校园新客 1,286 人</strong></div>
      </div>
      <div class="drawer-actions">
        <button class="primary-button" data-action="创建补货任务">创建补货任务</button>
        <button class="secondary-button" data-action="生成活动">创建触达活动</button>
      </div>
    `);
    return;
  }

  if (action === "创建补货任务") {
    openModal("创建补货任务", `
      <div class="form-grid">
        <label>点位<select class="select"><option>杭州大学城 D-03</option><option>静安嘉里中心 C-07</option></select></label>
        <label>补货优先级<select class="select"><option>高</option><option>中</option><option>低</option></select></label>
        <label>建议商品<select class="select"><option>鸡胸肉轻食、三明治、无糖茶</option><option>拿铁咖啡、能量棒</option></select></label>
        <label>期望完成时间<input class="input" value="今日 12:00 前" /></label>
      </div>
      <div class="segment-chip"><span>预计挽回支付转化</span><strong class="link">+7.8%</strong></div>
    `);
    return;
  }

  if (["查看活动效果", "查看效果"].includes(action)) {
    openDrawer("活动效果", `
      <div class="drawer-section">
        <h3>加购未支付 2 小时召回</h3>
        <div class="profile-line"><span>发送人数</span><strong>4,812</strong></div>
        <div class="profile-line"><span>点击率</span><strong>18.6%</strong></div>
        <div class="profile-line"><span>转化率</span><strong>7.4%</strong></div>
        <div class="profile-line"><span>归因收入</span><strong>¥18,620</strong></div>
      </div>
      <div class="drawer-actions">
        <button class="primary-button" data-action="生成复盘报告">生成复盘报告</button>
        <button class="secondary-button" data-action="沉淀为运营策略">沉淀策略</button>
      </div>
    `);
    return;
  }

  if (action === "查看事件趋势") {
    openDrawer("事件趋势", `
      <div class="drawer-section">
        <h3>pay_order</h3>
        <p class="page-desc">过去 7 天整体上升，但校园 D-03 在午间时段出现明显下滑。</p>
        ${barList([{ name: "写字楼", value: 82, count: "18,420" }, { name: "社区", value: 56, count: "12,106" }, { name: "校园", value: 38, count: "8,062" }], "cyan")}
      </div>
    `);
    return;
  }

  if (action === "分析人群") {
    openDrawer("人群分析", `
      <div class="drawer-section">
        <h3>加购未支付召回</h3>
        <div class="profile-line"><span>人群规模</span><strong>5,216</strong></div>
        <div class="profile-line"><span>高意向占比</span><strong>42%</strong></div>
        <div class="profile-line"><span>推荐渠道</span><strong>小程序订阅 + Push</strong></div>
      </div>
      <div class="drawer-actions">
        <button class="primary-button" data-action="生成活动">创建触达</button>
        <button class="secondary-button" data-action="同步人群">同步渠道</button>
      </div>
    `);
    return;
  }

  if (["沉淀为运营策略", "生成策略"].includes(action)) {
    openModal("沉淀运营策略", `
      <div class="form-grid">
        <label>策略名称<input class="input" value="写字楼早餐咖啡会员价策略" /></label>
        <label>适用人群<select class="select"><option>写字楼咖啡高频用户</option><option>高价值用户</option></select></label>
        <label>触发条件<select class="select"><option>工作日 08:00-09:30</option><option>用户进入附近 500m</option></select></label>
        <label>执行动作<select class="select"><option>Push + 会员价</option><option>企微提醒</option></select></label>
      </div>
    `);
    return;
  }

  if (action === "查看模型") {
    openDrawer("Customer AI 模型", `
      <div class="drawer-section">
        <h3>模型概览</h3>
        <div class="profile-line"><span>流失 AUC</span><strong>0.87</strong></div>
        <div class="profile-line"><span>复购 AUC</span><strong>0.82</strong></div>
        <div class="profile-line"><span>特征数量</span><strong>126</strong></div>
        <div class="profile-line"><span>最近训练</span><strong>2026-04-21 03:00</strong></div>
      </div>
    `);
    return;
  }

  if (action === "追问原因") {
    openDrawer("AI 追问", `
      <div class="drawer-section">
        <h3>为什么支付转化下降？</h3>
        <p class="page-desc">AI 结合事件、库存、优惠券和点位数据判断：校园 D-03 的午间轻食库存不足导致用户浏览后无法加购，同时新人券服务在 11:20-11:42 出现核销失败峰值。</p>
      </div>
      <div class="drawer-actions">
        <button class="primary-button" data-action="生成人群">生成受影响人群</button>
        <button class="secondary-button" data-action="创建补货任务">补货</button>
      </div>
    `);
    return;
  }

  if (action === "AI 生成") {
    openModal("AI 生成结果", `
      <div class="drawer-section">
        <h3>已生成分群规则</h3>
        <div class="segment-chip"><span>近 7 天加购咖啡</span><strong>2,814</strong></div>
        <div class="segment-chip"><span>未支付</span><strong>1,692</strong></div>
        <div class="segment-chip"><span>写字楼用户且排除近 3 天已触达</span><strong class="link">1,286</strong></div>
      </div>
      <div class="campaign-preview">
        <strong>推荐触达</strong>
        <p>工作日 08:15 推送会员咖啡价，建议使用小程序订阅消息 + App Push。</p>
      </div>
    `);
    return;
  }

  if (["批量生成活动", "一键创建召回人群"].includes(action)) {
    openModal(action, `
      ${dataTable(["对象", "动作", "状态", "预估收益"], [
        ["加购未支付召回", "创建触达活动", '<span class="status-pill info">待审批</span>', "¥18,620"],
        ["校园新人异常", "创建人群 + 补券", '<span class="status-pill info">待审批</span>', "¥9,380"],
        ["社区生鲜沉睡", "召回短信 + 订阅", '<span class="status-pill info">待审批</span>', "¥7,210"],
      ])}
    `);
    return;
  }

  if (["下钻异常", "查看证据", "查看机会", "分析机会"].includes(action)) {
    openDrawer("异常下钻证据", `
      <div class="drawer-section">
        <h3>影响范围</h3>
        <div class="profile-line"><span>主要点位</span><strong>杭州大学城 D-03</strong></div>
        <div class="profile-line"><span>受影响人群</span><strong>新注册未首购用户 1,286 人</strong></div>
        <div class="profile-line"><span>关键事件</span><strong>coupon_redeem_failed</strong></div>
      </div>
      <div class="drawer-section">
        <h3>AI 归因</h3>
        <p class="page-desc">转化下降主要来自轻食缺货和新人券核销失败。若立即补货并向受影响人群发放替代券，预计可挽回 7.8% 的支付转化。</p>
      </div>
      <div class="drawer-actions">
        <button class="primary-button" data-action="生成人群">生成人群</button>
        <button class="secondary-button" data-action="创建补货任务">创建补货任务</button>
      </div>
    `);
    return;
  }

  if (["新建人群", "生成人群", "建人群", "生成分群", "保存为人群"].includes(action)) {
    openModal("创建人群", `
      <div class="wizard-steps"><span class="active">规则</span><span>预估</span><span>权限</span><span>保存</span></div>
      <div class="form-grid">
        <label>人群名称<input class="input" value="校园新人券核销失败未首购" /></label>
        <label>更新方式<select class="select"><option>实时更新</option><option>每小时</option><option>每日</option></select></label>
        <label>行为条件<select class="select"><option>近 24 小时 coupon_redeem_failed >= 1</option><option>近 7 天加购未支付</option></select></label>
        <label>排除条件<select class="select"><option>排除近 3 天已触达</option><option>排除退款风险高</option></select></label>
      </div>
      <div class="segment-chip"><span>预估可触达人群</span><strong class="link">1,286 人</strong></div>
    `);
    return;
  }

  if (["新建活动", "生成活动"].includes(action)) {
    openModal("创建触达活动", `
      <div class="wizard-steps"><span class="active">人群</span><span>渠道</span><span>内容</span><span>频控</span><span>审批</span></div>
      <div class="form-grid">
        <label>活动名称<input class="input" value="校园新人券异常挽回" /></label>
        <label>目标人群<select class="select"><option>校园新人券核销失败未首购</option><option>加购未支付召回</option></select></label>
        <label>触达渠道<select class="select"><option>小程序订阅消息 + App Push</option><option>短信</option><option>企业微信</option></select></label>
        <label>转化目标<select class="select"><option>24 小时内支付成功</option><option>领取优惠券</option></select></label>
      </div>
      <div class="campaign-preview">
        <strong>AI 推荐文案</strong>
        <p>刚刚的优惠券已为你重新发放，今天 23:59 前购买轻食组合可享 8 折。</p>
      </div>
    `);
    return;
  }

  if (["生成复盘报告", "设置复盘"].includes(action)) {
    openModal("复盘报告配置", `
      <div class="form-grid">
        <label>归因窗口<select class="select"><option>24 小时</option><option>48 小时</option><option>7 天</option></select></label>
        <label>核心指标<select class="select"><option>支付转化率</option><option>GMV</option><option>复购率</option></select></label>
        <label>对照口径<select class="select"><option>自然留存对照组</option><option>历史同期</option></select></label>
        <label>报告接收人<input class="input" value="增长运营组" /></label>
      </div>
    `);
    return;
  }

  if (action.includes("新建") || action.includes("生成") || action.includes("创建") || action.includes("保存")) {
    openModal(action, `
      <div class="form-grid">
        <label>名称<input class="input" value="${action} - 无人售货机场景" /></label>
        <label>负责人<select class="select"><option>增长运营</option><option>会员运营</option><option>数据分析师</option></select></label>
        <label>目标<select class="select"><option>提升支付转化</option><option>提高复购</option><option>降低流失</option></select></label>
        <label>执行方式<select class="select"><option>保存草稿</option><option>提交审批</option><option>立即运行</option></select></label>
      </div>
      <p class="page-desc">这是原型交互，后续可对接 Keen Lakehouse 元数据、任务调度和触达渠道。</p>
    `);
    return;
  }

  showToast(messages[action] || `已执行：${action}`);
}

function mutateLiveData() {
  if (Date.now() < state.livePausedUntil) return;
  state.liveTick += 1;
  state.liveUsers += Math.floor(Math.random() * 9) + 2;
  state.liveOrders += Math.floor(Math.random() * 6) + 1;
  state.liveRevenue += Math.floor(Math.random() * 380) + 80;
  const eventPool = [
    ["刚刚", "pay_order", "静安嘉里中心 C-07", "用户完成咖啡组合订单"],
    ["刚刚", "add_to_cart", "深圳社区 E-12", "用户加购牛奶和鸡蛋"],
    ["刚刚", "scan_machine_qr", "杭州大学城 D-03", "新用户扫码开柜"],
    ["刚刚", "coupon_receive", "陆家嘴写字楼 A-01", "会员领取早餐券"],
    ["刚刚", "refund_request", "虹桥枢纽 B-19", "用户提交退款申请"],
  ];
  state.liveEvents.unshift(eventPool[state.liveTick % eventPool.length]);
  state.liveEvents = state.liveEvents.slice(0, 5);
  if (state.activeSection === "growth") {
    renderGrowth();
  }
}

function bindNavigation() {
  document.querySelectorAll("[data-group]").forEach((item) => {
    item.addEventListener("click", () => switchGroup(item.dataset.group));
  });

  document.querySelector("#topNav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-section]");
    if (button) {
      switchSection(button.dataset.section, state.activeGroup);
    }
  });

  document.querySelector("#sidebarToggle").addEventListener("click", () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    document.querySelector("#appShell").classList.toggle("sidebar-collapsed", state.sidebarCollapsed);
    showToast(state.sidebarCollapsed ? "左侧菜单已隐藏" : "左侧菜单已显示");
  });

  document.querySelector("#collapseButton").addEventListener("click", () => {
    state.sidebarCollapsed = true;
    document.querySelector("#appShell").classList.add("sidebar-collapsed");
    showToast("左侧菜单已隐藏，可点击左上角九宫格恢复");
  });

  document.body.addEventListener("click", (event) => {
    const switchLine = event.target.closest(".switch-line");
    if (switchLine) {
      const control = switchLine.querySelector(".switch");
      control?.classList.toggle("off");
      showToast(`${switchLine.querySelector("span")?.textContent || "开关"}已${control?.classList.contains("off") ? "关闭" : "开启"}`);
      return;
    }
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      handleAction(actionTarget.dataset.action || actionTarget.textContent.trim());
      return;
    }
    const button = event.target.closest("button");
    if (button?.classList.contains("user-link")) return;
    if (button && !button.closest("#topNav") && !button.closest(".sidebar") && !button.id) {
      const label = button.textContent.trim();
      if (label) handleAction(label);
      return;
    }
    const row = event.target.closest(".clickable-row");
    if (row && !event.target.closest("button")) {
      const cells = [...row.querySelectorAll("td")].map((cell) => cell.textContent.trim()).filter(Boolean);
      if (cells.length) {
        openDrawer(cells[0], `
          <div class="drawer-section">
            <h3>记录详情</h3>
            ${cells.slice(0, 6).map((cell, index) => `<div class="profile-line"><span>字段 ${index + 1}</span><strong>${cell}</strong></div>`).join("")}
          </div>
          <div class="drawer-section">
            <h3>可执行动作</h3>
            <div class="drawer-actions">
              <button class="primary-button" data-action="建人群">保存为人群</button>
              <button class="secondary-button" data-action="生成活动">创建触达</button>
              <button class="secondary-button" data-action="生成复盘报告">生成报告</button>
            </div>
          </div>
        `);
      }
    }
  });

  document.querySelector("#modalClose").addEventListener("click", closeModal);
  document.querySelector("#modalCancel").addEventListener("click", closeModal);
  document.querySelector("#modalConfirm").addEventListener("click", () => {
    const submitted = state.pendingAction || "操作";
    closeModal();
    showToast(`${submitted}已提交，后台任务开始执行`);
  });
  document.querySelector("#modalBackdrop").addEventListener("click", (event) => {
    if (event.target.id === "modalBackdrop") closeModal();
  });
  document.querySelector("#drawerClose").addEventListener("click", closeDrawer);
}

renderAll();
bindNavigation();
switchSection(state.activeSection, state.activeGroup);
setInterval(mutateLiveData, 4000);
