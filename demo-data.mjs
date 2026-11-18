export const relayLandingPageDefault = `Hero
Multilingual support clarity for Shopify teams
RelayChat AI is exploring a clearer way for Shopify merchants with multilingual customer conversations to evaluate AI support workflows.
CTA: Book a store-fit demo

Who this is for
Shopify merchants with 2-10 person support teams that handle customer questions across more than one language.

What we will help you evaluate
- Whether the support workflow and merchant context are a fit for RelayChat AI.
- Which customer questions and language needs should be clarified first.
- What product facts your team wants to validate before a broader rollout.

How the evaluation works
1. Share your store context and current multilingual support questions.
2. Review a store-fit demo with your team.
3. Decide what to validate next with your own product and workflow details.

FAQ
Does this promise a support outcome? No. The demo is a fit conversation, not a promise of results.
Can our team review product facts? Yes. Your team reviews product facts and page copy before use.
What should we bring? Your Shopify store context, support workflow, and multilingual customer-service questions.`;

const BASE_STATE = {
  activeStep: "candidates",
  candidates: [
    { id: "relaychat", name: "RelayChat AI", sector: "Shopify 多语言 AI 客服 B2B SaaS", contact: "Mia Chen, Growth lead（模拟联系人）", dimensions: { serviceFit: 5, internationalIntent: 5, marketingNeed: 4, reachability: 4 }, evidence: { serviceFit: "产品为 Shopify 商家的多语言 AI 客服；与两周英语获客试点匹配。", internationalIntent: "已有英文站、少量海外试用用户，明确在验证英语市场。", marketingNeed: "目标商家与价值表达不清，内容更新能力不足。", reachability: "预置的模拟增长负责人联系人记录可用于演示。" }, missing: ["审核负责人、审核时限与资料完整度待核实。"], manualPriority: "normal", manualReason: "" },
    { id: "shoppilot", name: "ShopPilot AI", sector: "电商运营助手", contact: "预置联系人（模拟）", dimensions: { serviceFit: 4, internationalIntent: 4, marketingNeed: 4, reachability: 4 }, evidence: { serviceFit: "电商 SaaS，有英文市场页。", internationalIntent: "公开模拟材料显示英语市场测试意向。", marketingNeed: "模拟需求记录含获客内容更新需求。", reachability: "模拟联系人记录完整。" }, missing: ["当前试点预算待核实。"], manualPriority: "normal", manualReason: "" },
    { id: "loopserve", name: "LoopServe", sector: "客服工作流 SaaS", contact: "预置联系人（模拟）", dimensions: { serviceFit: 4, internationalIntent: 4, marketingNeed: 3, reachability: 4 }, evidence: { serviceFit: "客服工作流产品与服务范围相关。", internationalIntent: "模拟资料显示国际站上线。", marketingNeed: "内容需求信号一般。", reachability: "模拟联系人记录完整。" }, missing: ["目标行业待核实。"], manualPriority: "normal", manualReason: "" },
    { id: "surveylayer", name: "SurveyLayer", sector: "用户反馈分析 SaaS", contact: "预置联系人（模拟）", dimensions: { serviceFit: 3, internationalIntent: 4, marketingNeed: 4, reachability: 4 }, evidence: { serviceFit: "服务匹配度中等。", internationalIntent: "模拟资料包含英语市场计划。", marketingNeed: "模拟资料包含定位调整需求。", reachability: "模拟联系人记录完整。" }, missing: ["产品事实待核实。"], manualPriority: "normal", manualReason: "" },
    { id: "fulfillfox", name: "FulfillFox", sector: "履约协同 SaaS", contact: "预置联系人（模拟）", dimensions: { serviceFit: 3, internationalIntent: 4, marketingNeed: 3, reachability: 4 }, evidence: { serviceFit: "服务匹配度中等。", internationalIntent: "模拟资料显示海外测试。", marketingNeed: "营销需求信号有限。", reachability: "模拟联系人记录完整。" }, missing: ["英语页面状态待核实。"], manualPriority: "normal", manualReason: "" },
    { id: "inboxorbit", name: "InboxOrbit", sector: "团队收件箱 SaaS", contact: "预置联系人（模拟）", dimensions: { serviceFit: 4, internationalIntent: 3, marketingNeed: 3, reachability: 3 }, evidence: { serviceFit: "产品场景相近。", internationalIntent: "出海意愿为模拟推断。", marketingNeed: "需求信号中等。", reachability: "联系人信息不完整。" }, missing: ["明确市场、负责人待核实。"], manualPriority: "normal", manualReason: "" },
    { id: "growthloom", name: "GrowthLoom", sector: "增长分析 SaaS", contact: "预置联系人（模拟）", dimensions: { serviceFit: 3, internationalIntent: 3, marketingNeed: 3, reachability: 3 }, evidence: { serviceFit: "服务匹配度中等。", internationalIntent: "模拟资料信号一般。", marketingNeed: "模拟资料信号一般。", reachability: "联系人信息不完整。" }, missing: ["预算和需求优先级待核实。"], manualPriority: "normal", manualReason: "" },
    { id: "marketspoke", name: "MarketSpoke", sector: "市场研究工具", contact: "预置联系人（模拟）", dimensions: { serviceFit: 2, internationalIntent: 3, marketingNeed: 3, reachability: 3 }, evidence: { serviceFit: "服务匹配较弱。", internationalIntent: "模拟资料信号一般。", marketingNeed: "模拟资料信号一般。", reachability: "联系人信息不完整。" }, missing: ["产品定位、市场预算待核实。"], manualPriority: "normal", manualReason: "" },
  ],
  project: {
    id: "relaychat-pilot",
    name: "RelayChat AI 英语市场获客试点",
    selectedCandidateId: null,
    outreach: {
      initial: { source: "预生成离线内容", sent: false, body: "Subject: A store-fit conversation for RelayChat AI\n\nHi Mia,\n\nI reviewed the simulated RelayChat AI brief: you have an English site and early overseas trials, while the target Shopify merchant and value story still need focus.\n\nFor a two-week English-market pilot, we would clarify the audience, draft an English landing page, prepare four LinkedIn posts, and measure qualified demo bookings without paid ads.\n\nWould a short conversation help you decide whether this scope fits the current validation stage?\n\nBest,\nMarketing advisor" },
      followUp: { source: "预生成离线内容", sent: false, body: "Subject: Follow-up: RelayChat AI English-market pilot\n\nHi Mia,\n\nFollowing up on the simulated two-week pilot outline. The focus is not broad exposure alone: it is learning whether the right Shopify support teams will book a store-fit demo.\n\nIf this is timely, we can confirm the audience, product-fact review process, and available materials before drafting the plan.\n\nBest,\nMarketing advisor" },
      sendLog: [],
    },
    simulatedReplyLoaded: false,
    requirementSummary: null,
    requirementsConfirmed: false,
    plan: null,
    formalPlanConfirmed: false,
    tasksNeedReview: false,
    landingPageReviewed: false,
    reviewDataLoaded: false,
    tasks: [],
    landingPage: null,
    retainedDrafts: [],
  },
};

export const SIMULATED_REPLY = {
  source: "模拟客户回复（已载入）",
  clientSaid: ["我们想先验证英语市场的 Shopify 商家。", "目标是客服团队约 2-10 人、有多语言客服需求的商家。", "两周试点预算按 15,000 元模拟，不做付费广告。", "我们更关注符合画像的演示预约，而不只是曝光。", "产品事实和文案需由客户审核，并配合发布与数据。"],
  existingMaterials: ["已有英文站和少量海外试用用户。", "现有站点功能较多，但目标商家和价值表达尚不清晰。", "内容更新能力不足。"],
  advisorSuggestion: ["先收窄到客服团队 2-10 人的 Shopify 商家。", "以清晰适用条件和 store-fit demo CTA 验证信息匹配。", "统一记录访问、去重留资、有效线索和演示预约。"],
  pending: ["客户侧审核负责人待确认。", "可提供的产品资料完整度待确认。", "文案与发布审核时限待确认。"],
};

export const PILOT_PLAN = {
  source: "预生成离线内容",
  scope: ["目标用户与卖点梳理", "英文落地页文案", "4 条 LinkedIn 内容", "留资字段/口径建议", "两周复盘"],
  cadence: ["第 1 周：确认目标用户、价值表达、产品事实审核边界；完成页面与内容初稿。", "第 2 周：客户审核、配合发布、按统一口径记录数据并完成复盘。"],
  boundaries: ["模拟预算 15,000 元。", "不做付费广告。", "不承诺成交收入或长期增长。"],
  goals: { impressions: 10000, visits: 1000, leads: 30, qualifiedLeads: 15, qualifiedLeadRate: 50, demoBookings: 5 },
};

export const REVIEW_DATA = {
  source: "模拟营销数据（已载入）",
  results: { impressions: 12000, visits: 1100, leads: 33, qualifiedLeads: 10, demoBookings: 6 },
  channels: [
    { name: "LinkedIn", visits: 420, leads: 8, qualifiedLeads: 1, demoBookings: 1 },
    { name: "既有邮件", visits: 180, leads: 12, qualifiedLeads: 6, demoBookings: 3 },
    { name: "自然搜索及直接访问", visits: 500, leads: 13, qualifiedLeads: 3, demoBookings: 2 },
  ],
};

export function createRequirementSummary() {
  return {
    clientSaid: SIMULATED_REPLY.clientSaid.join("\n"),
    existingMaterials: SIMULATED_REPLY.existingMaterials.join("\n"),
    advisorSuggestion: SIMULATED_REPLY.advisorSuggestion.join("\n"),
    pending: SIMULATED_REPLY.pending.join("\n"),
    source: "模拟客户回复整理（顾问可编辑）",
  };
}

export function createOfflinePlan(summary) {
  return {
    source: "预生成离线内容（基于已保存需求）",
    confirmed: false,
    body: `Two-week English-market acquisition pilot for RelayChat AI\n\nConfirmed customer context\n${summary.clientSaid}\n\nExisting materials\n${summary.existingMaterials}\n\nConsultant working approach\n${summary.advisorSuggestion}\n\nScope\n- Clarify the target customer and value proposition.\n- Draft one English landing page, four LinkedIn posts, and lead-field guidance.\n- Review results after two weeks using the agreed funnel definitions.\n\nOperating constraints\n${summary.pending}\n- No paid advertising.\n- Do not promise closed revenue or long-term growth.\n\nSuccess measures\nLinkedIn impressions >= 10,000; landing-page visits >= 1,000; deduplicated leads >= 30; qualified leads >= 15; qualified-lead rate >= 50%; store-fit demo bookings >= 5.`,
  };
}

export function createTaskList() {
  return [
    { id: "positioning", name: "目标客户与价值主张说明", owner: "顾问", status: "not_started" },
    { id: "landing-page", name: "英文落地页文案", owner: "顾问 + 客户审核", status: "not_started" },
    { id: "linkedin", name: "4 条 LinkedIn 内容", owner: "顾问", status: "not_started" },
    { id: "measurement", name: "留资字段与统计口径建议", owner: "顾问", status: "not_started" },
    { id: "review", name: "两周复盘", owner: "顾问", status: "not_started" },
  ];
}

export function createOfflineLandingPage(summary) {
  return {
    source: "预生成离线内容（基于已保存需求）",
    body: `${relayLandingPageDefault}\n\nPilot context retained from the saved requirement summary\n${summary.clientSaid}`,
  };
}

export function createInitialState() {
  return JSON.parse(JSON.stringify(BASE_STATE));
}
