function renderCampaigns() {
  document.querySelector("#campaigns").innerHTML = `
    ${sectionHeader("触达活动", "通过短信、订阅消息、企微、Push 和 Webhook 将人群转化为运营动作。", "新建活动")}
    ${filterPanel(`<button class="secondary-button" data-action="触达频控规则">触达频控规则</button>`)}
    <div class="grid-3">
      ${campaigns.map((item) => `
        <div class="campaign-card">
          <div class="campaign-head">
            <div>
              <div class="campaign-title">${item.name}</div>
              <div class="campaign-meta">${item.channel}</div>
            </div>
            <span class="status-pill ${item.status === "运行中" ? "info" : ""}">${item.status}</span>
          </div>
          <div class="profile-line"><span>目标人群</span><strong>${item.audience}</strong></div>
          <div class="profile-line"><span>发送人数</span><strong>${item.sent}</strong></div>
          <div class="profile-line"><span>点击率</span><strong>${item.click}</strong></div>
          <div class="profile-line"><span>转化率</span><strong>${item.conversion}</strong></div>
          <button class="secondary-button" data-action="查看活动效果">查看效果</button>
        </div>
      `).join("")}
    </div>
    <div class="panel">
      <div class="panel-header"><h2 class="panel-title">自动化触达旅程</h2><span class="panel-subtitle">加购未支付召回模板</span></div>
      <div class="panel-body">
        <div class="journey">
          <div class="journey-node"><strong>进入人群</strong><span>加购未支付</span></div>
          <div class="journey-node"><strong>等待</strong><span>2 小时</span></div>
          <div class="journey-node"><strong>条件判断</strong><span>是否支付</span></div>
          <div class="journey-node"><strong>消息触达</strong><span>短信 + 订阅消息</span></div>
          <div class="journey-node"><strong>转化追踪</strong><span>24 小时支付</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderExperiments() {
  document.querySelector("#experiments").innerHTML = `
    ${sectionHeader("A/B 实验", "通过对照组和实验组验证优惠券、文案、旅程策略对转化的真实贡献。", "新建实验")}
    ${filterPanel()}
    <div class="grid-2">
      ${experiments.map((item) => `
        <div class="experiment-card">
          <div class="campaign-head">
            <div>
              <div class="campaign-title">${item.name}</div>
              <div class="campaign-meta">${item.audience} · 目标：${item.goal}</div>
            </div>
            <span class="status-pill ${item.status === "显著" ? "" : "warn"}">${item.status}</span>
          </div>
          <div class="experiment-split">
            <div class="variant">
              <strong>A 组：${item.a}</strong>
              <span>转化率 ${item.aRate}</span>
            </div>
            <div class="variant">
              <strong>B 组：${item.b}</strong>
              <span>转化率 ${item.bRate}</span>
            </div>
          </div>
          <div class="profile-line"><span>提升幅度</span><strong class="lift">${item.lift}</strong></div>
          <button class="secondary-button" data-action="沉淀为运营策略">沉淀为运营策略</button>
        </div>
      `).join("")}
    </div>
    <div class="panel">
      <div class="panel-header"><h2 class="panel-title">实验指标趋势</h2><div class="legend"><span><i class="dot"></i>A 组</span><span><i class="dot cyan"></i>B 组</span></div></div>
      <div class="panel-body">${lineChart([12, 13, 13.4, 15.1, 16.2, 17.4, 18.4], [13, 14.1, 15.8, 17.2, 19.6, 21.1, 22.1])}</div>
    </div>
  `;
}

function renderAttribution() {
  const rows = attributionRows.map((row) => [
    `<span class="link">${row[0]}</span>`,
    row[1],
    row[2],
    row[3],
    row[4],
    row[5],
    `<span class="status-pill">${row[6]}</span>`,
  ]);
  document.querySelector("#attribution").innerHTML = `
    ${sectionHeader("效果归因", "衡量活动触达、人群策略、实验方案对支付转化和收入的贡献。", "生成复盘报告")}
    ${filterPanel()}
    <div class="metric-grid">
      ${metricCard("触达总人数", "23,026", "较上周 +11.8%")}
      ${metricCard("归因转化", "2,223", "较上周 +14.7%")}
      ${metricCard("归因收入", "¥92,376", "较上周 +17.5%")}
      ${metricCard("平均 ROI", "4.6", "较上周 +0.8")}
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">活动收入贡献趋势</h2><div class="legend"><span><i class="dot"></i>收入</span><span><i class="dot cyan"></i>转化人数</span></div></div>
        <div class="panel-body">${lineChart([680, 740, 812, 900, 1014, 1168, 1286], [210, 236, 256, 286, 310, 346, 392])}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">渠道 ROI</h2></div>
        <div class="panel-body">${barList([{name:"企业微信",value:82,count:"6.1"},{name:"小程序订阅",value:76,count:"5.7"},{name:"App Push",value:58,count:"4.3"},{name:"短信",value:42,count:"3.1"},{name:"Webhook",value:31,count:"2.4"}], "cyan")}</div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header"><h2 class="panel-title">活动归因明细</h2><button class="secondary-button" data-action="导出归因明细">${icon("export")}导出</button></div>
      ${dataTable(["活动名称", "渠道", "目标人群", "转化人数", "转化率", "归因收入", "ROI"], rows)}
    </div>
  `;
}

function renderAI() {
  document.querySelector("#ai").innerHTML = `
    ${sectionHeader("AI 应用", "借鉴主流 CDP 的 AI Assistant、Customer AI、Decisioning 和 Next Best Action 能力，面向无人售货机运营直接给出可执行动作。", "新建 AI 任务")}
    <div class="ai-hero">
      <div>
        <div class="ai-kicker">AI Copilot for Keen CDP</div>
        <h2>用自然语言从客户数据到运营动作</h2>
        <p>示例：找出“近 7 天在写字楼货柜加购咖啡但未支付，且优惠敏感度中高的用户”，并生成召回活动。</p>
        <div class="ai-prompt">
          <input value="近 7 天加购咖啡但未支付的写字楼用户，排除近 3 天已触达用户" aria-label="AI 指令" />
          <button class="primary-button" data-action="AI 生成">生成</button>
        </div>
      </div>
      <div class="ai-result">
        <div class="profile-line"><span>识别意图</span><strong>创建人群 + 推荐触达</strong></div>
        <div class="profile-line"><span>预估人数</span><strong>1,286</strong></div>
        <div class="profile-line"><span>推荐渠道</span><strong>小程序订阅 + Push</strong></div>
        <div class="profile-line"><span>预计转化提升</span><strong class="lift">+8.7%</strong></div>
      </div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">AI 能力场景</h2><span class="panel-subtitle">可逐步产品化</span></div>
        <div class="panel-body ai-grid">
          ${aiScenarios.map((item) => `
            <div class="ai-card">
              <div class="campaign-title">${item.name}</div>
              <p>${item.desc}</p>
              <div class="profile-line"><span>当前结果</span><strong>${item.result}</strong></div>
              <button class="secondary-button" data-action="${item.action}">${item.action}</button>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">异常归因解释</h2><button class="secondary-button" data-action="刷新 AI 洞察">${icon("sync")}刷新</button></div>
        <div class="panel-body">
          <div class="insight-list">
            <div class="insight-item">
              <strong>支付转化率下降 3.2%</strong>
              <span>主要由校园轻食柜 D-03 缺货和新人券核销失败贡献，占异常影响的 61%。</span>
            </div>
            <div class="insight-item">
              <strong>写字楼早餐时段 GMV 增长 12.4%</strong>
              <span>会员咖啡价实验 B 组显著更优，建议沉淀为默认策略。</span>
            </div>
            <div class="insight-item">
              <strong>社区生鲜召回 ROI 偏低</strong>
              <span>短信单渠道打开率不足，建议增加小程序订阅消息并避开 12:00-14:00。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header"><h2 class="panel-title">Next Best Action 推荐</h2><button class="primary-button" data-action="批量生成活动">批量生成活动</button></div>
      ${dataTable(["目标人群", "AI 分数", "建议动作", "预估收益"], aiRecommendations.map((row) => [row[0], `<span class="status-pill info">${row[1]}</span>`, row[2], row[3]]))}
    </div>
  `;
}

function renderSettings() {
  document.querySelector("#settings").innerHTML = `
    ${sectionHeader("平台管理", "管理 Keen Lakehouse 连接、组织权限、任务调度、审计日志和开放接口。", "新建连接")}
    <div class="settings-grid">
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">Keen Lakehouse 连接</h2><span class="status-pill">正常</span></div>
        <div class="panel-body">
          <div class="profile-line"><span>数据空间</span><strong>vending_lakehouse</strong></div>
          <div class="profile-line"><span>用户表</span><strong>dim_customer</strong></div>
          <div class="profile-line"><span>事件表</span><strong>dwd_event_stream</strong></div>
          <div class="profile-line"><span>订单表</span><strong>dwd_order</strong></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">权限与审批</h2></div>
        <div class="panel-body">
          <div class="switch-line"><span>人群导出审批</span><span class="switch"></span></div>
          <div class="switch-line"><span>手机号脱敏</span><span class="switch"></span></div>
          <div class="switch-line"><span>活动上线审批</span><span class="switch"></span></div>
          <div class="switch-line"><span>实验流量保护</span><span class="switch"></span></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2 class="panel-title">任务监控</h2><span class="status-pill warn">2 个告警</span></div>
        <div class="panel-body">
          <div class="segment-chip"><span>标签任务：价格敏感</span><strong>成功</strong></div>
          <div class="segment-chip"><span>人群同步：广告平台</span><strong class="link">重试中</strong></div>
          <div class="segment-chip"><span>活动回执：短信</span><strong class="link">延迟</strong></div>
        </div>
      </div>
    </div>
  `;
}

