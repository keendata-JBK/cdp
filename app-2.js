function lineChart(seriesA, seriesB) {
  const max = Math.max(...seriesA, ...seriesB) * 1.08;
  const min = Math.min(...seriesA, ...seriesB) * 0.92;
  const width = 720;
  const height = 260;
  const left = 44;
  const right = 16;
  const top = 18;
  const bottom = 34;
  const innerW = width - left - right;
  const innerH = height - top - bottom;
  const point = (value, index) => {
    const x = left + (innerW / (seriesA.length - 1)) * index;
    const y = top + innerH - ((value - min) / (max - min)) * innerH;
    return [x, y];
  };
  const path = (series) => series.map((value, index) => `${index === 0 ? "M" : "L"} ${point(value, index).join(" ")}`).join(" ");
  const area = `${path(seriesA)} L ${left + innerW} ${top + innerH} L ${left} ${top + innerH} Z`;
  const grid = [0, 1, 2, 3].map((n) => {
    const y = top + (innerH / 3) * n;
    return `<line class="axis-line" x1="${left}" x2="${left + innerW}" y1="${y}" y2="${y}"></line>`;
  }).join("");
  const labels = days.map((day, index) => {
    const x = left + (innerW / (days.length - 1)) * index;
    return `<text class="chart-label" x="${x}" y="${height - 8}" text-anchor="middle">${day}</text>`;
  }).join("");
  return `
    <svg class="line-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      ${grid}
      <path class="chart-area" d="${area}"></path>
      <path class="chart-line" d="${path(seriesA)}"></path>
      <path class="chart-line secondary" d="${path(seriesB)}"></path>
      ${labels}
    </svg>
  `;
}

function barList(items, colorClass = "") {
  return `
    <div class="bar-list">
      ${items.map((item) => `
        <div class="bar-row">
          <span>${item.name}</span>
          <div class="bar-track"><div class="bar-fill ${colorClass}" style="width:${item.value}%"></div></div>
          <strong>${item.count}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function dataTable(headers, rows) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `
            <tr class="clickable-row">${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function stripHtml(value) {
  const div = document.createElement("div");
  div.innerHTML = value;
  return div.textContent || div.innerText || "";
}

function workflowPanel() {
  return `
    <div class="panel workflow-panel">
      <div class="panel-header">
        <h2 class="panel-title">增长异常闭环工作台</h2>
        <button class="secondary-button" data-action="交给 AI 处理">交给 AI 处理</button>
      </div>
      <div class="panel-body workflow-steps">
        ${operationFlow.map((item, index) => `
          <div class="workflow-step">
            <div class="step-index">${index + 1}</div>
            <div>
              <strong>${item.title}</strong>
              <p>${item.desc}</p>
              <span class="status-pill ${item.status === "待执行" || item.status === "待确认" ? "warn" : "info"}">${item.status}</span>
            </div>
            <button class="ghost-button" data-action="${item.action}">${item.action}</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function stationHealthPanel() {
  const rows = stationHealth.map((item) => [
    `<span class="link">${item.name}</span>`,
    item.status === "健康" ? `<span class="status-pill">${item.status}</span>` : `<span class="status-pill warn">${item.status}</span>`,
    item.sales,
    item.stock,
    item.issue,
    `<div class="table-action"><button data-action="查看点位">查看</button><button data-action="创建补货任务">补货</button></div>`,
  ]);
  return `
    <div class="panel">
      <div class="panel-header"><h2 class="panel-title">点位健康监控</h2><button class="secondary-button" data-action="创建补货任务">创建补货任务</button></div>
      ${dataTable(["点位", "状态", "今日销售", "库存健康度", "问题", "操作"], rows)}
    </div>
  `;
}

function renderGrowth() {
  document.querySelector("#growth").innerHTML = `
    ${sectionHeader("增长分析", "围绕无人售货机场景沉淀增长指标、渠道质量、留存和生命周期趋势。", "新建看板")}
    ${filterPanel(`<button class="secondary-button" data-action="导出">${icon("export")}导出</button><span class="live-badge">实时刷新 · ${new Date().toLocaleTimeString("zh-CN", { hour12: false })}</span>`)}
    <div class="metric-grid">
      ${metricCard("活跃用户 DAU", formatNumber(state.liveUsers), "较昨日 +4.1%")}
      ${metricCard("支付用户", "1,918", "较昨日 +4.2%")}
      ${metricCard("订单数", formatNumber(state.liveOrders), "较昨日 +5.1%")}
      ${metricCard("GMV", `¥${formatNumber(state.liveRevenue)}`, "较昨日 +6.6%")}
    </div>
    ${workflowPanel()}
    <div class="grid-2">
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">核心增长趋势</h2>
          <div class="legend"><span><i class="dot"></i>DAU</span><span><i class="dot cyan"></i>支付用户</span></div>
        </div>
        <div class="panel-body">${lineChart(trend.dau, trend.payers)}</div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">渠道贡献</h2>
          <span class="panel-subtitle">按新增会员数统计</span>
        </div>
        <div class="panel-body">${barList(channels)}</div>
      </div>
    </div>
    <div class="grid-3">
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">新客留存</h2><span class="status-pill info">最近 30 天</span></div>
        <div class="panel-body">${barList([{name:"次日留存",value:64,count:"64.2%"},{name:"7日留存",value:38,count:"38.5%"},{name:"14日留存",value:27,count:"27.1%"},{name:"30日留存",value:18,count:"18.7%"}], "cyan")}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">生命周期分布</h2></div>
        <div class="panel-body">
          <div class="donut"></div>
          <div class="legend-list">
            <div class="legend-row"><span><i class="dot"></i>新客</span><strong>44%</strong></div>
            <div class="legend-row"><span><i class="dot cyan"></i>成长期</span><strong>26%</strong></div>
            <div class="legend-row"><span><i class="dot warning"></i>成熟期</span><strong>18%</strong></div>
            <div class="legend-row"><span><i class="dot" style="background:#dfe5f1"></i>沉睡</span><strong>12%</strong></div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">增长机会</h2><span class="status-pill warn">3 条待处理</span></div>
        <div class="panel-body">
          <div class="segment-chip"><span>写字楼 08:00-09:00 咖啡缺货率偏高</span><button class="link" data-action="查看机会">查看</button></div>
          <div class="segment-chip"><span>校园新人券核销后复购不足</span><button class="link" data-action="建人群">建人群</button></div>
          <div class="segment-chip"><span>社区柜周末生鲜客单价下降</span><button class="link" data-action="分析机会">分析</button></div>
        </div>
      </div>
    </div>
    ${stationHealthPanel()}
    <div class="panel">
      <div class="panel-header"><h2 class="panel-title">实时事件流</h2><button class="secondary-button" data-action="暂停实时刷新">${Date.now() < state.livePausedUntil ? "已暂停" : "暂停刷新"}</button></div>
      ${dataTable(["时间", "事件", "设备/点位", "动态"], state.liveEvents.map((row) => [row[0], `<span class="link">${row[1]}</span>`, row[2], row[3]]))}
    </div>
  `;
}

function renderEvents() {
  const rows = eventRows.map((row) => [
    `<span class="link">${row[0]}</span>`,
    row[1],
    row[2],
    row[3],
    row[4],
    row[5].startsWith("-") ? `<span class="status-pill danger">${row[5]}</span>` : `<span class="status-pill">${row[5]}</span>`,
    `<div class="table-action"><button data-action="查看事件趋势">趋势</button><button data-action="建人群">建人群</button></div>`,
  ]);
  document.querySelector("#events").innerHTML = `
    ${sectionHeader("事件分析", "分析用户扫码、浏览、加购、支付、退款等行为事件，发现转化和运营机会。", "新建事件指标")}
    ${filterPanel()}
    <div class="grid-2">
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">事件趋势</h2>
          <div class="legend"><span><i class="dot"></i>订单</span><span><i class="dot cyan"></i>GMV</span></div>
        </div>
        <div class="panel-body">${lineChart(trend.orders, trend.revenue.map((v) => v / 40))}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">热门设备事件贡献</h2><span class="panel-subtitle">按扫码开柜次数</span></div>
        <div class="panel-body">${barList(eventBreakdown, "cyan")}</div>
      </div>
    </div>
    <div class="panel">
        <div class="panel-header"><h2 class="panel-title">事件明细</h2><button class="secondary-button" data-action="同步事件字典">${icon("sync")}同步事件字典</button></div>
      ${dataTable(["事件名", "显示名", "触发次数", "触发用户", "人均频次", "环比", "操作"], rows)}
    </div>
  `;
}

function renderFunnel() {
  const stepHtml = funnelSteps.map((step) => `
    <div class="funnel-step">
      <strong>${step.name}</strong>
      <div class="funnel-bar"><span style="width:${step.rate}%"></span></div>
      <span class="funnel-count">${formatNumber(step.count)}</span>
      <span>${step.pass}</span>
    </div>
  `).join("");
  document.querySelector("#funnel").innerHTML = `
    ${sectionHeader("漏斗分析", "把扫码开柜到支付成功的关键链路拆解为可运营的人群和问题点。", "新建漏斗")}
    ${filterPanel(`<button class="secondary-button" data-action="保存为人群">保存为人群</button>`)}
    <div class="metric-grid">
      ${metricCard("总体转化率", "27.4%", "较上周 +2.8%")}
      ${metricCard("最大流失步骤", "浏览商品 → 加购", "流失 42.9%", true)}
      ${metricCard("平均转化时长", "3分18秒", "缩短 12.6%")}
      ${metricCard("可召回用户", "13,468", "可触达 +9.7%")}
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">支付转化漏斗</h2><span class="panel-subtitle">访问首页 → 支付成功</span></div>
        <div class="panel-body"><div class="funnel-steps">${stepHtml}</div></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">流失用户拆解</h2><button class="ghost-button" data-action="一键创建召回人群">一键创建召回人群</button></div>
        <div class="panel-body">
          ${barList([
            {name:"价格敏感用户",value:46,count:"6,194"},
            {name:"货柜缺货影响",value:22,count:"2,962"},
            {name:"支付失败",value:18,count:"2,424"},
            {name:"新客未领券",value:14,count:"1,888"},
          ], "warning")}
        </div>
      </div>
    </div>
  `;
}

function renderProfiles() {
  const user = users.find((item) => item.id === state.selectedUserId) || users[0];
  const profileRows = users.map((item) => [
    `<button class="link user-link" data-user="${item.id}">${item.name}</button>`,
    item.phone,
    item.city,
    item.channel,
    item.level,
    item.value,
    item.lastActive,
  ]);
  document.querySelector("#profiles").innerHTML = `
    ${sectionHeader("用户画像与标签", "统一查看用户身份、行为时间线、交易价值、偏好标签和生命周期阶段。", "新建标签")}
    ${filterPanel()}
    <div class="profile-layout">
      <div class="profile-card">
        <div class="avatar">${user.name.slice(0, 1)}</div>
        <div class="profile-name">${user.name}</div>
        <div class="page-desc">${user.id} · ${user.phone}</div>
        <div class="profile-line"><span>城市</span><strong>${user.city}</strong></div>
        <div class="profile-line"><span>来源渠道</span><strong>${user.channel}</strong></div>
        <div class="profile-line"><span>会员等级</span><strong>${user.level}</strong></div>
        <div class="profile-line"><span>LTV</span><strong>¥${user.ltv}</strong></div>
        <div class="profile-line"><span>订单数</span><strong>${user.orders}</strong></div>
        <div class="profile-line"><span>最近活跃</span><strong>${user.lastActive}</strong></div>
        <div class="tag-list">${user.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">行为时间线</h2><span class="status-pill info">${user.value}</span></div>
        <div class="panel-body">
          <div class="timeline">
            ${user.timeline.map((item) => `
              <div class="timeline-item">
                <div class="timeline-time">${item[0]}</div>
                <div class="timeline-content">
                  <div class="timeline-title">${item[1]}</div>
                  <div class="timeline-meta">${item[2]}</div>
                </div>
                <strong>${item[3]}</strong>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
    <div class="grid-2" style="margin-top:16px">
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">标签体系</h2><button class="secondary-button" data-action="标签计算任务">标签计算任务</button></div>
        ${dataTable(["标签名称", "类型", "覆盖人数", "规则说明"], tags)}
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">用户列表</h2><span class="panel-subtitle">点击姓名切换画像</span></div>
        ${dataTable(["用户", "手机号", "城市", "来源", "等级", "价值", "最近活跃"], profileRows)}
      </div>
    </div>
  `;
  document.querySelectorAll(".user-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedUserId = button.dataset.user;
      renderProfiles();
    });
  });
}

function renderSegments() {
  const rows = segments.map((item) => [
    `<span class="link">${item.name}</span>`,
    item.count,
    item.update,
    item.owner,
    item.status === "同步中" ? `<span class="status-pill info">${item.status}</span>` : `<span class="status-pill">${item.status}</span>`,
    `<div class="table-action"><button data-action="分析人群">分析</button><button data-action="生成活动">触达</button><button data-action="同步人群">同步</button></div>`,
  ]);
  document.querySelector("#segments").innerHTML = `
    ${sectionHeader("人群分群", "把分析、画像、标签沉淀为可复用和可触达的人群资产。", "新建人群")}
    <div class="segment-builder">
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">可视化人群规则</h2><span class="panel-subtitle">实时预估 5,216 人</span></div>
        <div class="panel-body">
          <div class="rule-block">
            <strong>满足以下全部条件</strong>
            <div class="rule-row">
              <select class="select"><option>事件</option></select>
              <select class="select"><option>加入购物车</option></select>
              <select class="select"><option>近 24 小时</option></select>
              <button class="secondary-button" data-action="添加人群规则">+</button>
            </div>
            <div class="rule-row">
              <select class="select"><option>未发生事件</option></select>
              <select class="select"><option>支付订单</option></select>
              <select class="select"><option>近 24 小时</option></select>
              <button class="secondary-button" data-action="添加人群规则">+</button>
            </div>
            <div class="rule-row">
              <select class="select"><option>标签</option></select>
              <select class="select"><option>免打扰用户</option></select>
              <select class="select"><option>排除</option></select>
              <button class="secondary-button" data-action="添加人群规则">+</button>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">人群运算</h2><button class="primary-button" data-action="保存人群">保存人群</button></div>
        <div class="panel-body">
          <div class="segment-chip"><span>加购未支付召回</span><strong>5,216</strong></div>
          <div class="segment-chip"><span>排除：近7天已触达 3 次</span><strong>1,084</strong></div>
          <div class="segment-chip"><span>排除：退款风险高</span><strong>286</strong></div>
          <div class="segment-chip"><span>最终可触达人群</span><strong class="link">3,846</strong></div>
        </div>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <div class="panel-header"><h2 class="panel-title">人群资产</h2><button class="secondary-button" data-action="导出名单">${icon("export")}导出名单</button></div>
      ${dataTable(["人群名称", "人数", "更新方式", "负责人", "状态", "操作"], rows)}
    </div>
  `;
}

