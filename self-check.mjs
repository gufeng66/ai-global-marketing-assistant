import assert from "node:assert/strict";
import { createInitialState, createOfflinePlan, createTaskList } from "./demo-data.mjs";
import { acceptAiCandidate, approveAndSendMail, confirmPlan, confirmRequirements, generateTasks, restoreTasks, saveLandingPage, savePlan, sendMail } from "./workflow.mjs";
const s=createInitialState(), p=s.project; p.simulatedReplyLoaded=true; p.requirementSummary={clientSaid:"edited audience RMB 15000",existingMaterials:"site",advisorSuggestion:"demo",pending:"no ads"};
assert(confirmRequirements(s,p.requirementSummary)); p.plan=createOfflinePlan(p.requirementSummary); assert(confirmPlan(s,"edited confirmed plan")); assert.equal(p.plan.body,"edited confirmed plan"); assert(generateTasks(s,createTaskList()));
p.landingPage={body:"approved copy",source:"test"}; p.landingPageReviewed=true; p.tasks.find(x=>x.id==="landing-page").status="done"; assert(saveLandingPage(s,"edited copy")); assert.equal(p.landingPageReviewed,false); assert.equal(p.tasks.find(x=>x.id==="landing-page").status,"pending_review");
assert(savePlan(s,"changed plan")); assert.equal(p.tasksNeedReview,true); assert(confirmPlan(s,"changed plan")); assert(restoreTasks(s)); assert.equal(p.tasksNeedReview,false);
const body="approved email"; assert(approveAndSendMail(s,"initial",body)); assert.equal(sendMail(s,"initial",body),true); p.outreach.followUp.approved=true; p.outreach.followUp.body="old"; assert.equal(sendMail(s,"followUp","changed"),false);
const candidate={kind:"plan",content:"AI plan",source:"AI",snapshot:"same",planBody:p.plan.body}; assert(acceptAiCandidate(s,candidate,"same")); assert.equal(p.tasksNeedReview,true); console.log("self-check passed: page workflow transitions and invalidations.");
