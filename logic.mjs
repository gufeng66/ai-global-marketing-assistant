export const SCORE_WEIGHTS = {
  serviceFit: 30,
  internationalIntent: 30,
  marketingNeed: 25,
  reachability: 15,
};

export const TASK_STATUSES = ["not_started", "in_progress", "pending_review", "done"];

export const STATUS_LABELS = {
  not_started: "待开始",
  in_progress: "进行中",
  pending_review: "待审核",
  done: "已完成",
};

export function calculateScore(dimensions) {
  return Math.round(
    Object.entries(SCORE_WEIGHTS).reduce(
      (total, [key, weight]) => total + (dimensions[key] / 5) * weight,
      0,
    ),
  );
}

export function calculateCompleteness(candidate) {
  const verified = Object.values(candidate.evidence).filter(Boolean).length;
  const total = Object.keys(SCORE_WEIGHTS).length;
  return { verified, total, percentage: Math.round((verified / total) * 100) };
}

export function priorityBucket(candidate) {
  if (candidate.manualPriority === "priority") return 0;
  if (candidate.manualPriority === "defer") return 2;
  return 1;
}

export function sortCandidates(candidates) {
  return [...candidates].sort((a, b) => {
    const bucketDifference = priorityBucket(a) - priorityBucket(b);
    return bucketDifference || calculateScore(b.dimensions) - calculateScore(a.dimensions);
  });
}

export function canConfirmRequirements(project) {
  return project.simulatedReplyLoaded;
}

export function canConfirmPlan(project) {
  return project.requirementsConfirmed && Boolean(project.plan);
}

export function nextTaskStatus(status) {
  const index = TASK_STATUSES.indexOf(status);
  return index < 0 || index === TASK_STATUSES.length - 1 ? null : TASK_STATUSES[index + 1];
}

export function canAdvanceTask(project, task) {
  if (!project.formalPlanConfirmed || project.tasksNeedReview || !nextTaskStatus(task.status)) return false;
  if (task.id === "landing-page" && task.status === "pending_review") {
    return Boolean(project.landingPage) && project.landingPageReviewed;
  }
  return true;
}

export function sumChannels(channels) {
  return channels.reduce(
    (total, channel) => ({
      visits: total.visits + channel.visits,
      leads: total.leads + channel.leads,
      qualifiedLeads: total.qualifiedLeads + channel.qualifiedLeads,
      demoBookings: total.demoBookings + channel.demoBookings,
    }),
    { visits: 0, leads: 0, qualifiedLeads: 0, demoBookings: 0 },
  );
}

export function percentage(numerator, denominator) {
  return denominator === 0 ? 0 : Number(((numerator / denominator) * 100).toFixed(1));
}

export function calculateFunnel(results) {
  return {
    visitToLead: percentage(results.leads, results.visits),
    qualifiedLeadRate: percentage(results.qualifiedLeads, results.leads),
    qualifiedToBooking: percentage(results.demoBookings, results.qualifiedLeads),
  };
}

export function compareGoals(results, goals) {
  const funnel = calculateFunnel(results);
  return [
    { id: "impressions", label: "LinkedIn 曝光", actual: results.impressions, target: goals.impressions, met: results.impressions >= goals.impressions },
    { id: "visits", label: "落地页访问", actual: results.visits, target: goals.visits, met: results.visits >= goals.visits },
    { id: "leads", label: "去重留资", actual: results.leads, target: goals.leads, met: results.leads >= goals.leads },
    { id: "qualifiedLeads", label: "有效线索", actual: results.qualifiedLeads, target: goals.qualifiedLeads, met: results.qualifiedLeads >= goals.qualifiedLeads },
    { id: "qualifiedLeadRate", label: "有效线索比例", actual: funnel.qualifiedLeadRate, target: goals.qualifiedLeadRate, met: funnel.qualifiedLeadRate >= goals.qualifiedLeadRate, isPercent: true },
    { id: "demoBookings", label: "演示预约", actual: results.demoBookings, target: goals.demoBookings, met: results.demoBookings >= goals.demoBookings },
  ];
}
