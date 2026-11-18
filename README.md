# AI 出海营销助手（离线 Demo）

这是一个供出海营销服务团队内部演示的客户开发与交付工作台。它以 **RelayChat AI** 为虚构案例：一个面向 Shopify 商家的多语言 AI 客服 B2B SaaS，已有英文站和少量海外试用用户，正在验证英语市场。

所有企业、联系人、客户回复、发送记录、任务、营销数据和结果都明确是模拟案例或模拟数据。它不发送真实邮件、不发布内容、不抓取客户、不投放广告、不连接 CRM 或部署到生产环境。

## 产品思路

一个营销顾问在同一项目上下文中完成六步工作：

1. 按服务匹配度、出海意愿、营销需求和联系可达性判断候选企业优先级。
2. 编辑首封英文联系邮件和一次跟进，并仅模拟发送。
3. 主动载入模拟客户回复，区分客户明确表达、已有资料、顾问建议和待确认项，再人工确认需求摘要。
4. 在需求摘要确认后，确认两周英语市场获客试点方案。
5. 将交付拆成任务，编辑、审核并推进完整英文落地页样例。
6. 主动载入模拟营销数据，按统一漏斗口径复盘并提出下一轮实验建议。

## 运营方式

候选企业初始按代码计算的系统分排序。RelayChat AI 的维度为 `5/5、5/5、4/5、4/5`，所以系统总分为：

```text
5/5 × 30 + 5/5 × 30 + 4/5 × 25 + 4/5 × 15 = 92
```

顾问可以置顶或降低某个候选企业，并必须填写理由。该操作只影响工作队列，不会篡改系统评分。评分表示跟进优先级，不代表购买概率。

关键操作受流程门禁约束：

```text
载入模拟客户回复 → 人工确认需求摘要 → 人工确认正式方案 → 推进交付任务
```

英文落地页从“待审核”推进到“已完成”前，还需勾选“已完成人工审核（模拟）”。任务状态固定按“待开始 → 进行中 → 待审核 → 已完成”前进。

## 技术实现

- 零依赖的静态 HTML、CSS 和浏览器原生 ES 模块。
- `logic.mjs` 只包含纯计算与状态门禁，便于由 Node 自检。
- `demo-data.mjs` 存放所有预置模拟案例、预生成内容、目标及复盘数据。
- `app.mjs` 处理页面渲染、编辑、状态推进和本地保存。
- Demo 状态存入当前浏览器的 `localStorage`；点击“重置 Demo”恢复预置数据。
- `server.py` 使用 Python 标准库同时提供静态文件和同源 `/api/generate`，不依赖 `file://` 行为。

## 模拟数据与离线边界

首封/跟进邮件、两周方案和英文落地页可由顾问编辑后保存。离线草稿必须由用户显式点击“载入离线草稿”写入，来源会标为“预生成离线内容”。需求摘要确认后，离线方案模板会把当前已保存的受众、预算/周期与约束写入正文；任务也只会在方案确认后显式生成。

`server.py` 已实现兼容 OpenAI Chat Completions 的真实生成接口，允许的生成类型固定为 `email`、`plan`、`landing_page`、`linkedin`。服务端只从环境变量读取配置，绝不会将密钥发给前端或写入仓库：

```powershell
$env:OPENAI_BASE_URL = "https://your-compatible-api.example/v1"
$env:OPENAI_MODEL = "your-model"
$env:OPENAI_API_KEY = "your-secret"
```

真实供应商调用在本项目中**未验证**，也没有使用真实凭据或执行外网请求。未配置上述变量时，`/api/generate` 返回明确的“AI 服务未配置”错误；前端不会自动伪造成功或悄悄回退。标准库假上游测试已验证本地成功、错误和超时分支。

模拟客户回复、模拟发送记录和模拟营销数据分别有自己的来源标识。模拟发送不会调用邮箱或网络。模拟营销结果为：

| 指标 | 模拟结果 | 目标 |
|---|---:|---:|
| LinkedIn 曝光 | 12,000 | ≥10,000 |
| 落地页访问 | 1,100 | ≥1,000 |
| 去重留资 | 33 | ≥30 |
| 有效线索 | 10 | ≥15 |
| 有效线索比例 | 30.3% | ≥50% |
| 演示预约 | 6 | ≥5 |

渠道合计为访问 `1,100`、去重留资 `33`、有效线索 `10`、演示预约 `6`。统一口径为：

```text
访问到留资 = 留资 / 访问 = 3.0%
有效线索比例 = 有效线索 / 留资 = 30.3%
有效线索到预约 = 预约 / 有效线索 = 60.0%
```

因此复盘会指出：量化目标部分达成，但有效线索质量不足；两周小样本且多个来源不能证明因果或长期收入提升。

## 流程约束与复盘结论

已确认方案被编辑后，系统要求重新确认方案，并显式执行“复核并恢复交付任务”；任务恢复后保留既有落地页正文，但需重新审核，复盘才重新可用。任务记录会保留当前方案正文的简短依据，避免把任务表述成与方案无关的自动产物。

候选评分属于本工作台自身的客户开发口径（服务匹配、出海意愿、营销需求、联系可达性）；复盘属于 RelayChat AI 的模拟客户营销漏斗（曝光、访问、留资、有效线索、演示预约），两者不混用。

交付页还提供一条预生成 LinkedIn 辅助样例；它只是与落地页配套的模拟文案，不代表已发布内容。

关键状态由 `workflow.mjs` 统一管理：编辑已批准邮件会撤销批准，修改已确认方案会要求重新确认并复核任务，修改落地页会撤销审核。AI 生成内容只有在顾问明确接受后才会替换当前草稿，失败或取消时保留原文。

## 启动命令

在项目根目录启动本地 HTTP 服务：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; python .\server.py --port 4176"
```

随后在浏览器中打开：`http://127.0.0.1:4176/`

## 验证命令

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; node --check .\logic.mjs"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; node --check .\app.mjs"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; node .\self-check.mjs"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; python -m unittest -v .\test_server.py"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Invoke-WebRequest http://127.0.0.1:4176/ -UseBasicParsing | Select-Object StatusCode"
```

`self-check.mjs` 覆盖 RelayChat AI 的 92 分、初始排序、人工优先级不改分、需求与方案门禁、任务门禁、渠道合计、漏斗公式和达标判断。

## 7 分钟演示步骤

1. 点击“重置 Demo”，在“候选企业”确认 RelayChat AI 为 92 分且排名第一；展开证据，点击“选择 RelayChat AI 跟进”。
2. 对 RelayChat AI 填写人工优先级理由并保存，确认提示系统分数未变。
3. 在“客户触达”编辑并保存首封邮件，模拟发送首封，再模拟发送跟进；查看本地模拟发送记录。
4. 在“需求确认”主动载入原始模拟客户回复，编辑并保存四类摘要，然后人工确认需求摘要。
5. 在“两周方案”显式载入离线方案草稿（或配置后请求真实 AI），编辑并保存，再确认正式方案。
6. 在“交付任务”显式生成任务，载入落地页草稿，编辑并保存文案，勾选模拟人工审核后完成任务。
7. 在“模拟复盘”载入模拟营销数据，确认渠道合计、漏斗计算、达标/未达标结论与下一轮建议；最后点击“重置 Demo”验证恢复初始状态。

## 六项验收标准

1. 从重置状态可在本地 HTTP 服务中完成上述六步交互。
2. RelayChat AI 初始为最高优先级，92 分和每项评分证据可展开查看。
3. 需求摘要确认是方案生成/确认的硬前置，方案确认是任务生成和推进的硬前置；修改上游会撤销下游有效状态但保留旧正文。
4. 邮件、方案、任务、落地页与复盘共享 RelayChat AI 模拟项目上下文，且来源清楚。
5. 指标、转换率、渠道合计与达标判断均由代码计算，结果和预置数据一致。
6. 编辑、保存、刷新、重置、模拟发送、模拟数据载入和任务状态推进都可在离线浏览器中运行。
