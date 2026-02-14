import { Env } from '../types';
import { StorageService } from '../services/storage';
import { htmlResponse } from '../utils/response';
import { JwtSecretState } from './setupPages';

function renderRegisterPageHTML(jwtState: JwtSecretState | null): string {
  const jwtStateJson = JSON.stringify(jwtState);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NodeWarden</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f3f4f6;
      --card: #ffffff;
      --border: #d0d5dd;
      --text: #101828;
      --muted: #475467;
      --muted2: #667085;
      --danger: #b42318;
      --ok: #027a48;
      --shadow: 0 16px 44px rgba(16, 24, 40, 0.08);
      --radius: 20px;
      --radius2: 16px;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
    }

    .shell {
      width: min(980px, 100%);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .panel {
      border: 1px solid var(--border);
      background: var(--card);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 34px 34px 24px;
      min-height: 720px;
      display: flex;
      flex-direction: column;
    }

    .top {
      display: flex;
      gap: 14px;
      align-items: center;
      margin-bottom: 12px;
      flex-shrink: 0;
    }

    .mark {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: #111418;
      border: 1px solid #111418;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.6px;
      color: #ffffff;
      text-transform: uppercase;
      user-select: none;
    }

    .title { display: flex; flex-direction: column; gap: 4px; }
    .title h1 { font-size: 30px; margin: 0; letter-spacing: -0.6px; }
    .title p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.6; }

    .message {
      display: none;
      border-radius: 12px;
      padding: 14px;
      margin: 0 0 12px 0;
      font-size: 15px;
      line-height: 1.45;
      border: 1px solid var(--border);
      background: #fafbfc;
      flex-shrink: 0;
    }
    .message.error {
      display: block;
      border-color: #fecdca;
      background: #fff6f5;
      color: var(--danger);
    }
    .message.success {
      display: block;
      border-color: #abefc6;
      background: #f0fdf4;
      color: var(--ok);
    }

    .stage {
      position: relative;
      min-height: 500px;
      flex: 1;
      overflow: hidden;
    }

    .step {
      position: absolute;
      inset: 0;
      opacity: 0;
      transform: translateX(16px);
      pointer-events: none;
      transition: opacity 180ms ease, transform 180ms ease;
      overflow: auto;
      padding-right: 4px;
    }
    .step.active {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }

    h2 { font-size: 22px; margin: 8px 0 14px; letter-spacing: -0.3px; }
    h3 { font-size: 17px; margin: 0 0 10px; color: #1d2939; }
    .lead { margin: 0; color: #344054; font-size: 16px; line-height: 1.75; }

    .kv {
      border-radius: var(--radius2);
      border: 1px solid var(--border);
      background: #fafbfc;
      padding: 18px;
      margin-top: 14px;
    }
    .kv p { margin: 0; font-size: 15px; line-height: 1.65; color: var(--muted); }
    .kv ul, .kv ol { margin: 8px 0 0 20px; padding: 0; color: var(--muted); line-height: 1.72; }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-top: 14px;
    }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }

    .field { display: flex; flex-direction: column; gap: 7px; margin-top: 10px; }
    label { font-size: 14px; color: var(--muted); letter-spacing: 0.1px; }
    input {
      height: 50px;
      padding: 0 14px;
      border-radius: 14px;
      border: 1px solid #d5dae1;
      background: #ffffff;
      color: var(--text);
      outline: none;
      font-size: 16px;
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }
    input::placeholder { color: #98a2b3; }
    input:focus {
      border-color: #111418;
      box-shadow: 0 0 0 5px rgba(17, 20, 24, 0.08);
    }

    .hint { margin: 0; color: var(--muted2); font-size: 14px; line-height: 1.6; }

    .btn {
      height: 46px;
      min-width: 100px;
      padding: 0 16px;
      border-radius: 14px;
      border: 1px solid #d5dae1;
      background: #ffffff;
      color: #111418;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      line-height: 1;
      white-space: nowrap;
      transition: filter 120ms ease;
    }
    .btn:hover { filter: brightness(0.99); }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; filter: none; }
    .btn.primary {
      border-color: #111418;
      background: #111418;
      color: #ffffff;
    }

    .server, .code {
      margin-top: 10px;
      font-family: var(--mono);
      font-size: 14px;
      padding: 12px 14px;
      border-radius: 14px;
      background: #ffffff;
      border: 1px solid #d5dae1;
      color: #111418;
      word-break: break-word;
      white-space: pre-wrap;
    }

    .mode-tabs {
      display: inline-flex;
      border: 1px solid #d5dae1;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .mode-tab {
      border: none;
      background: #fff;
      color: #111418;
      padding: 9px 12px;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
    }
    .mode-tab.active { background: #111418; color: #fff; }

    .mode-panel { display: none; }
    .mode-panel.active { display: block; }

    .flow-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 48px;
      padding: 0 4px;
    }

    .flow-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 200px;
    }

    .flow-actions.right {
      justify-content: flex-end;
    }

    .dots {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 26px;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: #cfd5de;
      transition: all 120ms ease;
    }
    .dot.active {
      width: 24px;
      height: 10px;
      background: #111418;
    }

    .footer {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 14px;
      color: var(--muted2);
      flex-shrink: 0;
    }

    a { color: #175cd3; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="shell">
    <aside class="panel">
      <div class="top">
        <div class="mark" aria-label="NodeWarden">NW</div>
        <div class="title">
          <h1 id="t_app">NodeWarden</h1>
          <p id="t_tag">Minimal Bitwarden-compatible server on Cloudflare Workers.</p>
        </div>
      </div>

      <div id="message" class="message"></div>

      <div class="stage">
        <section id="step1" class="step active">
          <h2 id="t_s1_title">Welcome</h2>
          <p class="lead" id="t_s1_desc"></p>
          <div class="kv">
            <h3 id="t_s1_adv_title">Highlights</h3>
            <ul>
              <li id="t_s1_adv_1"></li>
              <li id="t_s1_adv_2"></li>
              <li id="t_s1_adv_3"></li>
            </ul>
          </div>
        </section>

        <section id="step2" class="step">
          <h2 id="t_s2_title">JWT secret check</h2>
          <p class="lead" id="t_s2_desc"></p>

          <div class="grid">
            <div class="kv">
              <h3 id="t_s2_fix_title">Fix steps</h3>
              <ol id="s2_steps_list"></ol>
            </div>
            <div class="kv">
              <h3 id="t_s2_gen_title">Random JWT_SECRET</h3>
              <p id="t_s2_gen_desc"></p>
              <div class="server" id="secret"></div>
              <div style="height:10px"></div>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="btn primary" type="button" id="refreshSecretBtn" onclick="refreshSecret()">Refresh</button>
                <button class="btn" type="button" id="copySecretBtn" onclick="copySecret()">Copy</button>
              </div>
            </div>
          </div>
        </section>

        <section id="step3" class="step">
          <h2 id="t_s3_title">Create account</h2>
          <p class="lead" id="t_s3_desc"></p>

          <div id="setup-form">
            <form id="form" onsubmit="handleSubmit(event)">
              <div class="grid">
                <div class="field">
                  <label for="name" id="t_name_label">Name</label>
                  <input type="text" id="name" name="name" required placeholder="Your name" />
                </div>
                <div class="field">
                  <label for="email" id="t_email_label">Email</label>
                  <input type="email" id="email" name="email" required placeholder="you@example.com" autocomplete="email" />
                </div>
              </div>

              <div class="field">
                <label for="password" id="t_pw_label">Master password</label>
                <input type="password" id="password" name="password" required minlength="12" placeholder="At least 12 characters" autocomplete="new-password" />
                <p class="hint" id="t_pw_hint">Choose a strong password you can remember. The server cannot recover it.</p>
              </div>

              <div class="field">
                <label for="confirmPassword" id="t_pw2_label">Confirm password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm password" autocomplete="new-password" />
              </div>

              <div style="margin-top: 14px;">
                <button type="submit" id="submitBtn" class="btn primary" style="width:100%; height:52px;">Create account</button>
              </div>
            </form>
          </div>

          <div id="registered-inline" class="kv" style="display:none;">
            <h3 id="t_registered_inline_title">Account already created</h3>
            <p id="t_registered_inline_desc"></p>
          </div>
        </section>

        <section id="step4" class="step">
          <h2 id="t_s4_title">Sync setup</h2>
          <p class="lead" id="t_s4_desc"></p>

          <div class="kv">
            <h3 id="t_s4_common_title">Common required steps</h3>
            <ol>
              <li id="t_s4_common_1"></li>
              <li id="t_s4_common_2"></li>
              <li id="t_s4_common_3"></li>
            </ol>
          </div>

          <div class="kv">
            <div class="mode-tabs">
              <button class="mode-tab active" id="manualTab" onclick="setSyncMode('manual')">Manual sync</button>
              <button class="mode-tab" id="autoTab" onclick="setSyncMode('auto')">Auto sync</button>
            </div>

            <div id="manualPanel" class="mode-panel active">
              <p id="t_s4_manual_text"></p>
              <ol>
                <li id="t_s4_manual_1"></li>
                <li id="t_s4_manual_2"></li>
              </ol>
            </div>

            <div id="autoPanel" class="mode-panel">
              <p id="t_s4_auto_text"></p>
              <ol>
                <li id="t_s4_auto_1"></li>
                <li id="t_s4_auto_2"></li>
                <li id="t_s4_auto_3"></li>
              </ol>
            </div>
          </div>

          <p class="hint" id="t_s4_hint"></p>
        </section>

        <section id="step5" class="step">
          <h2 id="t_s5_title">Done</h2>
          <p class="lead" id="t_s5_desc"></p>

          <div class="kv">
            <h3 id="t_server_title">Server URL</h3>
            <div class="server" id="serverUrl"></div>
          </div>

          <div class="kv">
            <h3 id="t_limit_title">Important</h3>
            <p id="t_limit_text"></p>
          </div>

          <div class="kv">
            <h3 id="t_hide_title">Hide setup page</h3>
            <p id="t_hide_desc"></p>
            <div style="margin-top:10px;">
              <button type="button" id="hideBtn" class="btn primary" onclick="disableSetupPage()">Hide setup page</button>
            </div>
          </div>
        </section>
      </div>

      <div class="footer">
        <div><span id="t_by">By</span> <a href="https://shuai.plus" target="_blank" rel="noreferrer">shuaiplus</a></div>
        <div><a href="https://github.com/shuaiplus/nodewarden" target="_blank" rel="noreferrer">GitHub</a></div>
      </div>
    </aside>

    <div class="flow-bottom">
      <div class="flow-actions">
        <button id="prevBtn" class="btn" type="button">Previous</button>
      </div>
      <div class="dots">
        <span class="dot active" data-step="1"></span>
        <span class="dot" data-step="2"></span>
        <span class="dot" data-step="3"></span>
        <span class="dot" data-step="4"></span>
        <span class="dot" data-step="5"></span>
      </div>
      <div class="flow-actions right">
        <button id="nextBtn" class="btn primary" type="button">Next</button>
      </div>
    </div>
  </div>

  <script>
    const JWT_STATE = ${jwtStateJson};
    let isRegistered = false;
    let currentStep = 1;
    let syncMode = 'manual';

    function isChinese() {
      const lang = (navigator.language || '').toLowerCase();
      return lang.startsWith('zh');
    }

    function t(key) {
      const zh = {
        app: 'NodeWarden',
        tag: '部署在 Cloudflare Workers 上的 Bitwarden 兼容服务端。',
        by: '作者',

        s1Title: '恭喜你，NodeWarden 部署成功',
        s1Desc: '这是一个无需自建服务器的 Bitwarden 第三方服务端：部署快、维护轻、可直接使用官方客户端连接。点击右下角“下一页”开始。',
        s1AdvTitle: '核心优势',
        s1Adv1: '无需 VPS，直接运行在 Cloudflare Workers',
        s1Adv2: '兼容 Bitwarden 官方客户端',
        s1Adv3: '单用户场景更简单、维护成本更低',

        s2Title: '环境检测：JWT_SECRET',
        s2DescGood: 'JWT_SECRET 已通过检测，此步骤会自动跳过。',
        s2DescMissing: '检测到 JWT_SECRET 未配置，请先添加。',
        s2DescDefault: '检测到 JWT_SECRET 仍为默认值，请先更换。',
        s2DescShort: '检测到 JWT_SECRET 长度小于 32，请先更换。',
        s2FixTitleAdd: '当前是“未配置”，请按以下步骤添加：',
        s2FixTitleReplace: '当前是“默认值/长度不足”，请按以下步骤更换：',
        s2Step1: 'Cloudflare 控制台 → Workers 和 Pages → 你的 nodewarden 服务。',
        s2Step2Add: '设置 → 变量和机密 → 新增变量 JWT_SECRET（类型选“密钥”）。',
        s2Step2Replace: '设置 → 变量和机密 → 找到 JWT_SECRET 并编辑为新的随机值。',
        s2Step3: '保存并等待部署完成。',
        s2Step4: '设置完以后，刷新当前页面继续。',
        s2GenTitle: '随机密钥生成器',
        s2GenDesc: '建议至少 32 位，推荐 64 位。复制后粘贴到 JWT_SECRET。',
        refresh: '刷新',
        copy: '复制',
        copied: '已复制',

        s3Title: '先创建账号',
        s3Desc: '请先创建你的唯一账号。创建完成后会进入同步设置。',
        nameLabel: '昵称',
        emailLabel: '邮箱',
        pwLabel: '主密码',
        pwHint: '请选择你能记住的强密码。服务器无法找回主密码。',
        pw2Label: '确认主密码',
        create: '创建账号',
        creating: '正在创建…',
        regExistsTitle: '账号已创建',
        regExistsDesc: '当前实例已注册，注册步骤已跳过。请继续下一页进行同步设置。',

        s4Title: '同步设置',
        s4Desc: '你可以手动同步或自动同步；本页内容可稍后再做，不影响当前使用。',
        s4CommonTitle: '共同前置步骤',
        s4Common1: '如果还没 fork，请先 fork 本项目。',
        s4Common2: 'Cloudflare 控制台 → Workers 和 Pages → 你的服务 → 设置 → Builds / Git repository → 先 Disconnect（解绑原一键部署仓库）。',
        s4Common3: '在同一位置点击 Connect repository，选择你自己的 fork 仓库和分支完成绑定。',
        manualSync: '手动同步',
        autoSync: '自动同步',
        s4ManualText: '手动同步（GitHub 网页一键完成）：',
        s4Manual1: '打开你的 fork 仓库首页，看到上游更新提示时，点击 “Sync fork”。',
        s4Manual2: '在弹窗中点击 “Update branch”。',
        s4AutoText: '自动同步（不用看代码）：',
        s4Auto1: '你的 fork 会带上工作流文件，你只需要打开仓库的 Actions 页面。',
        s4Auto2: '点击 “I understand my workflows, go ahead and enable them” 启用。',
        s4Auto3: '启用后默认每天凌晨 3 点自动同步，也可手动 Run workflow。',
        s4Hint: '提示：这一步可稍后再做，随时可以回来。',

        s5Title: '全部完成',
        s5Desc: '引导结束。你现在可以在 Bitwarden 客户端中使用你的服务地址登录。',
        serverTitle: '服务地址',
        limitTitle: '重要提示',
        limitText: '本项目为单用户设计：不能添加新用户；不支持修改主密码；若忘记主密码需重新部署并重新注册。',
        hideTitle: '隐藏初始化页',
        hideDesc: '隐藏后，初始化页会返回 404；不影响你正常使用密码库。',
        hideBtn: '隐藏初始化页',
        hideWorking: '正在隐藏…',
        hideDone: '已隐藏，此页面将返回 404。',
        hideFailed: '隐藏失败',
        hideConfirm: '确认隐藏初始化页？隐藏后页面不可访问，但不影响密码库使用。',

        prev: '上一页',
        next: '下一页',
        finish: '完成',
        refreshToContinue: '设置完请刷新页面',
        errPwNotMatch: '两次输入的密码不一致',
        errPwTooShort: '密码长度至少 12 位',
        errGeneric: '发生错误：',
        errRegisterFailed: '注册失败',
      };

      const en = {
        app: 'NodeWarden',
        tag: 'Minimal Bitwarden-compatible server on Cloudflare Workers.',
        by: 'By',

        s1Title: 'NodeWarden deployed successfully',
        s1Desc: 'A Bitwarden-compatible server without managing your own VPS: quick deploy, low maintenance, and official client compatibility. Click Next to continue.',
        s1AdvTitle: 'Highlights',
        s1Adv1: 'No VPS required, runs on Cloudflare Workers',
        s1Adv2: 'Compatible with official Bitwarden clients',
        s1Adv3: 'Simple and stable single-user experience',

        s2Title: 'Environment check: JWT_SECRET',
        s2DescGood: 'JWT_SECRET is valid. This step will be skipped automatically.',
        s2DescMissing: 'JWT_SECRET is missing. Add it first.',
        s2DescDefault: 'JWT_SECRET is still default/sample. Replace it first.',
        s2DescShort: 'JWT_SECRET is shorter than 32 chars. Replace it first.',
        s2FixTitleAdd: 'Current state is missing, add it:',
        s2FixTitleReplace: 'Current state is default/too short, replace it:',
        s2Step1: 'Cloudflare Dashboard → Workers & Pages → your nodewarden service.',
        s2Step2Add: 'Settings → Variables and Secrets → add JWT_SECRET (Secret type).',
        s2Step2Replace: 'Settings → Variables and Secrets → edit JWT_SECRET with a new random value.',
        s2Step3: 'Save and wait for deploy to finish.',
        s2Step4: 'After setting it, refresh this page to continue.',
        s2GenTitle: 'Random secret generator',
        s2GenDesc: 'Use 32+ chars (64 recommended). Copy and paste into JWT_SECRET.',
        refresh: 'Refresh',
        copy: 'Copy',
        copied: 'Copied',

        s3Title: 'Create account first',
        s3Desc: 'Create your single account first. After success, you will enter sync setup.',
        nameLabel: 'Name',
        emailLabel: 'Email',
        pwLabel: 'Master password',
        pwHint: 'Choose a strong password you can remember. The server cannot recover it.',
        pw2Label: 'Confirm password',
        create: 'Create account',
        creating: 'Creating…',
        regExistsTitle: 'Account already exists',
        regExistsDesc: 'This instance is already registered. Registration step is skipped. Continue to sync setup.',

        s4Title: 'Sync setup',
        s4Desc: 'You can choose manual or automatic sync. You may also do this later.',
        s4CommonTitle: 'Common prerequisites',
        s4Common1: 'If you have not forked yet, fork this project first.',
        s4Common2: 'Cloudflare Dashboard → Workers & Pages → your service → Settings → Builds / Git repository → Disconnect current one-click-deploy repo.',
        s4Common3: 'On the same page, click Connect repository, then choose your fork repo and branch.',
        manualSync: 'Manual sync',
        autoSync: 'Auto sync',
        s4ManualText: 'Manual sync (one click on GitHub UI):',
        s4Manual1: 'Open your fork repository home page, then click “Sync fork” when updates are available.',
        s4Manual2: 'Click “Update branch” in the dialog.',
        s4AutoText: 'Automatic sync (no code needed):',
        s4Auto1: 'Your fork includes workflow files; just open the repository Actions page.',
        s4Auto2: 'Click “I understand my workflows, go ahead and enable them”.',
        s4Auto3: 'After enabled, it runs every day at 03:00, and can be run manually as well.',
        s4Hint: 'Tip: you can do this later at any time.',

        s5Title: 'All done',
        s5Desc: 'Onboarding is complete. You can now sign in from Bitwarden clients with your server URL.',
        serverTitle: 'Server URL',
        limitTitle: 'Important',
        limitText: 'Single-user design: no extra users, no master password change. If forgotten, redeploy and register again.',
        hideTitle: 'Hide setup page',
        hideDesc: 'After hiding, setup page returns 404; vault usage is unaffected.',
        hideBtn: 'Hide setup page',
        hideWorking: 'Hiding…',
        hideDone: 'Hidden. This page will now return 404.',
        hideFailed: 'Failed to hide setup page',
        hideConfirm: 'Hide setup page? It will be unavailable, but vault usage is unaffected.',

        prev: 'Previous',
        next: 'Next',
        finish: 'Finish',
        refreshToContinue: 'Refresh page after updating secret',
        errPwNotMatch: 'Passwords do not match',
        errPwTooShort: 'Password must be at least 12 characters',
        errGeneric: 'An error occurred: ',
        errRegisterFailed: 'Registration failed',
      };

      return (isChinese() ? zh : en)[key] || key;
    }

    function setText(id, value) {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    }

    function renderStep2FixList() {
      const list = document.getElementById('s2_steps_list');
      if (!list) return;
      list.innerHTML = '';

      if (!JWT_STATE) {
        const li = document.createElement('li');
        li.textContent = isChinese() ? 'JWT_SECRET 已通过检测，无需修改。' : 'JWT_SECRET is valid. No change required.';
        list.appendChild(li);
        return;
      }

      const titleLi = document.createElement('li');
      titleLi.style.fontWeight = '700';
      titleLi.style.color = '#1d2939';
      titleLi.textContent = JWT_STATE === 'missing' ? t('s2FixTitleAdd') : t('s2FixTitleReplace');
      list.appendChild(titleLi);

      const steps = [
        t('s2Step1'),
        JWT_STATE === 'missing' ? t('s2Step2Add') : t('s2Step2Replace'),
        t('s2Step3'),
        t('s2Step4'),
      ];

      steps.forEach((text) => {
        const li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });
    }

    function applyI18n() {
      document.documentElement.lang = isChinese() ? 'zh-CN' : 'en';
      setText('t_app', t('app'));
      setText('t_tag', t('tag'));
      setText('t_by', t('by'));

      setText('t_s1_title', t('s1Title'));
      setText('t_s1_desc', t('s1Desc'));
      setText('t_s1_adv_title', t('s1AdvTitle'));
      setText('t_s1_adv_1', t('s1Adv1'));
      setText('t_s1_adv_2', t('s1Adv2'));
      setText('t_s1_adv_3', t('s1Adv3'));

      setText('t_s2_title', t('s2Title'));
      setText('t_s2_gen_title', t('s2GenTitle'));
      setText('t_s2_gen_desc', t('s2GenDesc'));
      setText('refreshSecretBtn', t('refresh'));
      setText('copySecretBtn', t('copy'));

      setText('t_s3_title', t('s3Title'));
      setText('t_s3_desc', t('s3Desc'));
      setText('t_name_label', t('nameLabel'));
      setText('t_email_label', t('emailLabel'));
      setText('t_pw_label', t('pwLabel'));
      setText('t_pw_hint', t('pwHint'));
      setText('t_pw2_label', t('pw2Label'));
      setText('submitBtn', t('create'));
      setText('t_registered_inline_title', t('regExistsTitle'));
      setText('t_registered_inline_desc', t('regExistsDesc'));

      setText('t_s4_title', t('s4Title'));
      setText('t_s4_desc', t('s4Desc'));
      setText('t_s4_common_title', t('s4CommonTitle'));
      setText('t_s4_common_1', t('s4Common1'));
      setText('t_s4_common_2', t('s4Common2'));
      setText('t_s4_common_3', t('s4Common3'));
      setText('manualTab', t('manualSync'));
      setText('autoTab', t('autoSync'));
      setText('t_s4_manual_text', t('s4ManualText'));
      setText('t_s4_manual_1', t('s4Manual1'));
      setText('t_s4_manual_2', t('s4Manual2'));
      setText('t_s4_auto_text', t('s4AutoText'));
      setText('t_s4_auto_1', t('s4Auto1'));
      setText('t_s4_auto_2', t('s4Auto2'));
      setText('t_s4_auto_3', t('s4Auto3'));
      setText('t_s4_hint', t('s4Hint'));

      setText('t_s5_title', t('s5Title'));
      setText('t_s5_desc', t('s5Desc'));
      setText('t_server_title', t('serverTitle'));
      setText('t_limit_title', t('limitTitle'));
      setText('t_limit_text', t('limitText'));
      setText('t_hide_title', t('hideTitle'));
      setText('t_hide_desc', t('hideDesc'));
      setText('hideBtn', t('hideBtn'));

      setText('prevBtn', t('prev'));
      setText('nextBtn', t('next'));

      const d = document.getElementById('t_s2_desc');
      if (d) {
        if (!JWT_STATE) d.textContent = t('s2DescGood');
        else if (JWT_STATE === 'missing') d.textContent = t('s2DescMissing');
        else if (JWT_STATE === 'default') d.textContent = t('s2DescDefault');
        else d.textContent = t('s2DescShort');
      }

      renderStep2FixList();
    }

    function refreshSecret() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      const bytes = new Uint8Array(64);
      crypto.getRandomValues(bytes);
      let out = '';
      for (let i = 0; i < bytes.length; i++) out += chars[bytes[i] % chars.length];
      const el = document.getElementById('secret');
      if (el) el.textContent = out;
    }

    async function copySecret() {
      const el = document.getElementById('secret');
      if (!el) return;
      const value = el.textContent || '';
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const btn = document.getElementById('copySecretBtn');
      if (btn) {
        const old = btn.textContent;
        btn.textContent = t('copied');
        setTimeout(() => { btn.textContent = old; }, 1000);
      }
    }

    function setSyncMode(mode) {
      syncMode = mode;
      const manualTab = document.getElementById('manualTab');
      const autoTab = document.getElementById('autoTab');
      const manualPanel = document.getElementById('manualPanel');
      const autoPanel = document.getElementById('autoPanel');
      if (!manualTab || !autoTab || !manualPanel || !autoPanel) return;
      const isManual = mode === 'manual';
      manualTab.classList.toggle('active', isManual);
      autoTab.classList.toggle('active', !isManual);
      manualPanel.classList.toggle('active', isManual);
      autoPanel.classList.toggle('active', !isManual);
    }

    function visibleSteps() {
      // 流程固定为：
      // 1 欢迎 → 2 密钥检测(若已通过自动跳过) → 3 注册(已注册则跳过) → 4 同步 → 5 完成
      const steps = [1];
      if (JWT_STATE) steps.push(2);
      if (!isRegistered) steps.push(3);
      steps.push(4, 5);
      return steps;
    }

    function goToStep(step) {
      const steps = visibleSteps();
      if (!steps.includes(step)) {
        step = steps[0];
      }
      currentStep = step;

      for (let i = 1; i <= 5; i++) {
        const el = document.getElementById('step' + i);
        if (el) el.classList.toggle('active', i === currentStep);
      }

      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot) => {
        const s = Number(dot.getAttribute('data-step'));
        dot.classList.toggle('active', s === currentStep);
        dot.style.display = steps.includes(s) ? 'inline-block' : 'none';
      });

      updateNavButtons();
    }

    function updateNavButtons() {
      const steps = visibleSteps();
      const idx = steps.indexOf(currentStep);

      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      if (!prevBtn || !nextBtn) return;

      prevBtn.style.visibility = idx <= 0 ? 'hidden' : 'visible';

      // 第 5 页为完成页：隐藏下一页
      if (idx === steps.length - 1) {
        nextBtn.style.visibility = 'hidden';
      } else {
        nextBtn.style.visibility = 'visible';
      }

      // 第 2 页且密钥异常：不允许下一页，必须刷新后继续
      if (currentStep === 2 && !!JWT_STATE) {
        nextBtn.disabled = true;
        nextBtn.textContent = t('refreshToContinue');
      } else {
        nextBtn.disabled = false;
        nextBtn.textContent = t('next');
      }
    }

    function nextStep() {
      const steps = visibleSteps();
      const idx = steps.indexOf(currentStep);
      if (idx < 0 || idx >= steps.length - 1) return;
      goToStep(steps[idx + 1]);
    }

    function prevStep() {
      const steps = visibleSteps();
      const idx = steps.indexOf(currentStep);
      if (idx <= 0) return;
      goToStep(steps[idx - 1]);
    }

    function showMessage(text, type) {
      const msg = document.getElementById('message');
      if (!msg) return;
      msg.textContent = text;
      msg.className = 'message ' + type;
    }

    function showRegisteredState() {
      isRegistered = true;
      const form = document.getElementById('setup-form');
      const inline = document.getElementById('registered-inline');
      if (form) form.style.display = 'none';
      if (inline) inline.style.display = 'block';

      const serverUrl = document.getElementById('serverUrl');
      if (serverUrl) serverUrl.textContent = window.location.origin;
    }

    async function checkStatus() {
      try {
        const res = await fetch('/setup/status');
        const data = await res.json();
        if (data && data.registered) {
          showRegisteredState();
          // 已注册时直接从同步步骤开始（不再显示注册页）
          goToStep(4);
        } else {
          goToStep(1);
        }
      } catch (e) {
        console.error('Failed to check status:', e);
        goToStep(1);
      }
    }

    async function disableSetupPage() {
      if (!isRegistered) return;
      if (!confirm(t('hideConfirm'))) return;

      const btn = document.getElementById('hideBtn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = t('hideWorking');
      }

      try {
        const res = await fetch('/setup/disable', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.success) {
          showMessage(t('hideDone'), 'success');
          setTimeout(() => window.location.reload(), 700);
          return;
        }
        showMessage((data && data.error) || t('hideFailed'), 'error');
      } catch {
        showMessage(t('hideFailed'), 'error');
      }

      if (btn) {
        btn.disabled = false;
        btn.textContent = t('hideBtn');
      }
    }

    async function pbkdf2(password, salt, iterations, keyLen) {
      const encoder = new TextEncoder();
      const passwordBytes = (password instanceof Uint8Array) ? password : encoder.encode(password);
      const saltBytes = (salt instanceof Uint8Array) ? salt : encoder.encode(salt);

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBytes,
        'PBKDF2',
        false,
        ['deriveBits']
      );

      const derivedBits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: saltBytes, iterations: iterations, hash: 'SHA-256' },
        keyMaterial,
        keyLen * 8
      );

      return new Uint8Array(derivedBits);
    }

    async function hkdfExpand(prk, info, length) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        prk,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const infoBytes = encoder.encode(info);
      const result = new Uint8Array(length);
      let prev = new Uint8Array(0);
      let offset = 0;
      let counter = 1;

      while (offset < length) {
        const input = new Uint8Array(prev.length + infoBytes.length + 1);
        input.set(prev);
        input.set(infoBytes, prev.length);
        input[input.length - 1] = counter;

        const signature = await crypto.subtle.sign('HMAC', key, input);
        prev = new Uint8Array(signature);

        const toCopy = Math.min(prev.length, length - offset);
        result.set(prev.slice(0, toCopy), offset);
        offset += toCopy;
        counter++;
      }

      return result;
    }

    function generateSymmetricKey() {
      return crypto.getRandomValues(new Uint8Array(64));
    }

    async function encryptAesCbc(data, key, iv) {
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
      );

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        data
      );

      return new Uint8Array(encrypted);
    }

    async function hmacSha256(key, data) {
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
      return new Uint8Array(signature);
    }

    function base64Encode(bytes) {
      return btoa(String.fromCharCode.apply(null, bytes));
    }

    async function encryptToBitwardenFormat(data, encKey, macKey) {
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const encrypted = await encryptAesCbc(data, encKey, iv);

      const macData = new Uint8Array(iv.length + encrypted.length);
      macData.set(iv);
      macData.set(encrypted, iv.length);
      const mac = await hmacSha256(macKey, macData);

      return '2.' + base64Encode(iv) + '|' + base64Encode(encrypted) + '|' + base64Encode(mac);
    }

    async function generateRsaKeyPair() {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-1'
        },
        true,
        ['encrypt', 'decrypt']
      );

      const publicKeySpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      const publicKeyB64 = base64Encode(new Uint8Array(publicKeySpki));

      const privateKeyPkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      const privateKeyBytes = new Uint8Array(privateKeyPkcs8);

      return {
        publicKey: publicKeyB64,
        privateKey: privateKeyBytes
      };
    }

    async function handleSubmit(event) {
      event.preventDefault();

      if (isRegistered) {
        nextStep();
        return;
      }

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value.toLowerCase();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
        showMessage(t('errPwNotMatch'), 'error');
        return;
      }

      if (password.length < 12) {
        showMessage(t('errPwTooShort'), 'error');
        return;
      }

      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = t('creating');

      try {
        const iterations = 600000;
        const masterKey = await pbkdf2(password, email, iterations, 32);

        const masterPasswordHash = await pbkdf2(masterKey, password, 1, 32);
        const masterPasswordHashB64 = base64Encode(masterPasswordHash);

        const stretchedKey = await hkdfExpand(masterKey, 'enc', 32);
        const stretchedMacKey = await hkdfExpand(masterKey, 'mac', 32);

        const symmetricKey = generateSymmetricKey();

        const encryptedKey = await encryptToBitwardenFormat(symmetricKey, stretchedKey, stretchedMacKey);

        const rsaKeys = await generateRsaKeyPair();

        const encryptedPrivateKey = await encryptToBitwardenFormat(
          rsaKeys.privateKey,
          symmetricKey.slice(0, 32),
          symmetricKey.slice(32, 64)
        );

        const response = await fetch('/api/accounts/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            name: name,
            masterPasswordHash: masterPasswordHashB64,
            key: encryptedKey,
            kdf: 0,
            kdfIterations: iterations,
            keys: {
              publicKey: rsaKeys.publicKey,
              encryptedPrivateKey: encryptedPrivateKey
            }
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showRegisteredState();
          showMessage(t('s5Title'), 'success');
          // 关键：先注册，再显示同步页
          goToStep(4);
        } else {
          showMessage(result.error || result.ErrorModel?.Message || t('errRegisterFailed'), 'error');
          btn.disabled = false;
          btn.textContent = t('create');
        }
      } catch (error) {
        console.error('Registration error:', error);
        showMessage(t('errGeneric') + (error && error.message ? error.message : String(error)), 'error');
        btn.disabled = false;
        btn.textContent = t('create');
      }
    }

    function init() {
      applyI18n();
      refreshSecret();
      setSyncMode('manual');

      const prevBtn = document.getElementById('prevBtn');
      if (prevBtn) prevBtn.addEventListener('click', prevStep);

      const nextBtn = document.getElementById('nextBtn');
      if (nextBtn) nextBtn.addEventListener('click', nextStep);

      checkStatus();
    }

    init();
  </script>
</body>
</html>`;
}

export async function handleRegisterPage(request: Request, env: Env, jwtState: JwtSecretState | null): Promise<Response> {
  const storage = new StorageService(env.DB);
  const disabled = await storage.isSetupDisabled();
  if (disabled) {
    return new Response(null, { status: 404 });
  }
  return htmlResponse(renderRegisterPageHTML(jwtState));
}