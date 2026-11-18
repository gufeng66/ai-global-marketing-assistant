export function saveRequirements(state, summary) {
  const p = state.project;
  const changed = JSON.stringify(summary) !== JSON.stringify(p.requirementSummary);
  p.requirementSummary = summary;
  if (changed && p.requirementsConfirmed) {
    retain(p, "方案", p.plan?.body, "需求摘要修改"); retain(p, "落地页", p.landingPage?.body, "需求摘要修改");
    p.requirementsConfirmed = false; p.plan = null; p.formalPlanConfirmed = false; p.tasks = []; p.tasksNeedReview = false; p.landingPage = null; p.landingPageReviewed = false; p.reviewDataLoaded = false;
  }
  clearAi(p); return changed;
}
export function confirmRequirements(state, summary) { saveRequirements(state, summary); if (!state.project.simulatedReplyLoaded) return false; state.project.requirementsConfirmed = true; return true; }
export function savePlan(state, body) {
  const p = state.project; if (!p.plan || body === p.plan.body) return false;
  retain(p, "方案", p.plan.body, "顾问编辑前版本"); p.plan.body = body; p.plan.source = "顾问编辑";
  if (p.formalPlanConfirmed) invalidatePlan(p); clearAi(p); return true;
}
export function confirmPlan(state, body) { const p = state.project; if (!p.requirementsConfirmed || !p.plan) return false; savePlan(state, body); p.plan.confirmed = true; p.formalPlanConfirmed = true; return true; }
export function generateTasks(state, tasks) { const p = state.project; if (!p.formalPlanConfirmed || !p.plan?.confirmed) return false; p.tasks = tasks.map((task) => ({ ...task, planBasis: p.plan.body.slice(0, 240) })); p.tasksNeedReview = false; p.reviewDataLoaded = false; return true; }
export function restoreTasks(state) { const p = state.project; if (!p.formalPlanConfirmed || !p.plan?.confirmed || !p.tasks.length) return false; p.tasks = p.tasks.map((task) => ({ ...task, planBasis: p.plan.body.slice(0, 240) })); const landing = p.tasks.find((task) => task.id === "landing-page"); if (landing?.status === "done") landing.status = "pending_review"; p.tasksNeedReview = false; p.landingPageReviewed = false; p.reviewDataLoaded = false; return true; }
export function approveAndSendMail(state, id, body) { const mail = state.project.outreach[id]; if (!mail || !body.trim()) return false; mail.body = body; mail.source = "顾问编辑"; mail.approved = true; return true; }
export function sendMail(state, id, body) { const p = state.project, mail = p.outreach[id]; if (!mail || !mail.approved || mail.body !== body || mail.sent) return false; mail.sent = true; mail.source = "顾问编辑（模拟发送）"; p.outreach.sendLog.push({ label: id === "initial" ? "首次联系已模拟发送" : "跟进已模拟发送", note: "人工确认的正文仅记入本地模拟发送记录。" }); return true; }
export function editMail(state, id, body) { const mail = state.project.outreach[id]; if (!mail) return false; if (mail.body !== body) { mail.body = body; mail.approved = false; mail.source = "顾问编辑"; clearAi(state.project); return true; } return false; }
export function saveLandingPage(state, body) { const p = state.project; if (!p.landingPage || body === p.landingPage.body) return false; retain(p, "落地页", p.landingPage.body, "顾问编辑前版本"); p.landingPage.body = body; p.landingPage.source = "顾问编辑"; p.landingPageReviewed = false; const task = p.tasks.find((item) => item.id === "landing-page"); if (task?.status === "done") task.status = "pending_review"; clearAi(p); return true; }
export function approveLandingPage(state) { if (!state.project.landingPage) return false; state.project.landingPageReviewed = true; return true; }
export function acceptAiCandidate(state, candidate, snapshot) {
  const p = state.project; if (!candidate || candidate.snapshot !== snapshot) return false;
  if (candidate.kind === "email") { const mail = p.outreach[candidate.target]; if (!mail || candidate.targetBody !== mail.body) return false; retain(p, `邮件 ${candidate.target}`, mail.body, "AI 草稿替换前版本"); mail.body = candidate.content; mail.source = candidate.source; }
  else if (candidate.kind === "plan") { if (candidate.planBody !== (p.plan?.body ?? null)) return false; retain(p, "方案", p.plan?.body, "AI 草稿替换前版本"); if (p.formalPlanConfirmed) invalidatePlan(p); p.plan = { body: candidate.content, source: candidate.source, confirmed: false }; p.formalPlanConfirmed = false; }
  else { if (candidate.landingBody !== (p.landingPage?.body ?? null)) return false; retain(p, "落地页", p.landingPage?.body, "AI 草稿替换前版本"); p.landingPage = { body: candidate.content, source: candidate.source }; p.landingPageReviewed = false; const task = p.tasks.find((item) => item.id === "landing-page"); if (task?.status === "done") task.status = "pending_review"; }
  p.pendingAi = null; return true;
}
export function priorityWithReason(candidate, priority, reason) { if (priority !== "normal" && !reason.trim()) return false; candidate.manualPriority = priority; candidate.manualReason = reason.trim(); return true; }
export function clearAi(project) { project.pendingAi = null; }
function invalidatePlan(p) { p.plan.confirmed = false; p.formalPlanConfirmed = false; p.tasksNeedReview = p.tasks.length > 0; p.landingPageReviewed = false; p.reviewDataLoaded = false; const t = p.tasks.find((item) => item.id === "landing-page"); if (t?.status === "done") t.status = "pending_review"; }
function retain(p, type, body, reason) { if (body) p.retainedDrafts.push({ type, body, reason }); }
