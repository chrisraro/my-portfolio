// Build an ATS-friendly resume PDF (long bond, 8.5 x 13 in) from semantic HTML
// using the system Chrome via puppeteer-core. Real selectable text -> ATS-readable.
//
// Typography: Lato (Google Fonts) embedded in the PDF, Arial fallback. Lato is a
// clean, widely-recognized humanist sans that ATS parsers handle reliably and
// human reviewers find highly legible. One family + a single consistent type
// scale throughout.
//
// Usage: node scripts/build-resume.mjs
// Output: public/assets/resume/Raro, Christian F - Resume (DEV).pdf

import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'

const CHROME = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => p && fs.existsSync(p))

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { font-family: 'Lato', Arial, Helvetica, sans-serif; color: #222; }
  body { font-size: 9.8pt; line-height: 1.3; }
  a { color: #222; text-decoration: none; }

  /* Header */
  .name { font-size: 20pt; font-weight: 700; letter-spacing: 1.2px; text-align: center; }
  .title { text-align: center; font-size: 10.5pt; color: #444; margin-top: 3px; letter-spacing: .4px; }
  .contact { text-align: center; font-size: 9pt; color: #444; margin-top: 3px; }
  .contact span { white-space: nowrap; }

  /* Section headings */
  h2 { font-size: 10.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
       border-bottom: 1.4px solid #222; padding-bottom: 2px; margin: 9px 0 5px; }

  /* Body blocks */
  p.summary { font-size: 9.8pt; text-align: justify; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .role { font-weight: 700; }
  .org { font-style: italic; }
  .date { font-size: 9.3pt; color: #555; white-space: nowrap; }
  ul { margin: 2px 0 6px 17px; }
  li { font-size: 9.8pt; margin-bottom: 1.5px; }
  .skills li { margin-bottom: 2px; }
  .proj { margin-bottom: 6px; }
  .proj .stack { font-weight: 400; color: #555; font-size: 9.4pt; }
  .edu .row { margin-bottom: 1px; }
  .edu .sub { font-size: 9.4pt; color: #555; margin-bottom: 6px; }
  .nda { font-style: italic; color: #555; }
</style></head>
<body>
  <div class="name">CHRISTIAN F. RARO</div>
  <div class="title">Mid-level Full-Stack Developer &middot; Next.js &middot; TypeScript &middot; WordPress</div>
  <div class="contact">
    <span>09631751535</span> &nbsp;|&nbsp; <span>rarochristian029@gmail.com</span> &nbsp;|&nbsp;
    <span>linkedin.com/in/christian-raro</span> &nbsp;|&nbsp; <span>github.com/chrisraro</span>
  </div>
  <div class="contact">
    <span>christian-digital-portfolio.vercel.app</span> &nbsp;|&nbsp; <span>Naga City, Camarines Sur, Philippines</span>
  </div>

  <h2>Professional Summary</h2>
  <p class="summary">
    Full-stack developer with two years of professional experience (since November 2024) shipping production
    web apps and WordPress/WooCommerce sites for hospitality, tourism, education and real-estate clients.
    Builds with Next.js, React and strict TypeScript on PostgreSQL (Supabase, Neon), and with custom WordPress
    themes and plugins wired to Philippine payment gateways. Writes tested code (Vitest, Playwright, CI on every
    push), builds AI automations with n8n and LLM APIs, and uses AI coding tools with review and tests behind them.
  </p>

  <h2>Experience</h2>
  <div class="row"><span class="role">Web Developer / AI Automation Specialist</span><span class="date">Nov 2024 &ndash; Present</span></div>
  <div class="row"><span class="org">Online Creative Solutions</span><span class="date">Naga City, Camarines Sur</span></div>
  <ul>
    <li>Build and maintain WordPress/WooCommerce sites for agency clients, including Azalea Baguio, Azalea Boracay, Graceland and Review Masters Bicol, on GeneratePress/GenerateBlocks child themes.</li>
    <li>Built the OCS WP Control Panel: a Next.js + Supabase dashboard that manages client WordPress sites over MCP, with encrypted credentials and pg_cron background jobs.</li>
    <li>Built the Azalea e-Helpdesk: a hotel service-request and maintenance desk shipped as a WordPress plugin (PHP REST API) with a React front end, covered by Vitest and PHP tests.</li>
    <li>Set up and run the team&rsquo;s self-hosted n8n automation stack (Docker on Render) for Google Workspace and LLM workflows.</li>
    <li>Apply technical SEO and measurement briefs: 301 redirect maps, JSON-LD schema, GA4 and Meta Pixel.</li>
  </ul>

  <div class="row"><span class="role">IT Staff / Web Developer</span><span class="date">Mar 2025 &ndash; Aug 2025</span></div>
  <div class="row"><span class="org">Enjoy Realty and Development Corporation (concurrent)</span><span class="date">Naga City, Camarines Sur</span></div>
  <ul>
    <li>Built the Aman Group web app (Next.js, Upstash): property showcase, loan calculator comparing Pag-IBIG, bank and in-house financing, broker referral links and an admin panel; presented it at the company&rsquo;s brokers&rsquo; meeting.</li>
    <li>Maintained the company&rsquo;s WordPress sites and provided IT and graphic design support.</li>
  </ul>

  <h2>Selected Projects</h2>
  <div class="proj">
    <div class="row"><span><b>BeachBus Palawan</b> <span class="stack">| WordPress, WooCommerce, PayPal, PayMongo, Maya &middot; Next.js, NFC</span></span><span class="date">Jun 2025 &ndash; Present</span></div>
    <ul>
      <li>Built the website and WooCommerce storefront for an El Nido shuttle operator, with three payment gateways.</li>
      <li>Also built and maintain the client&rsquo;s internal NFC card system, now in production.</li>
    </ul>
  </div>
  <div class="proj">
    <div class="row"><span><b>El Nido Guide PH</b> <span class="stack">| WordPress, WooCommerce, Dokan, PayPal, Maya</span></span><span class="date">May &ndash; Jul 2025</span></div>
    <ul><li>Multi-operator tour booking marketplace where each operator runs its own store; custom child theme for product add-ons and bookings.</li></ul>
  </div>
  <div class="proj">
    <div class="row"><span><b>Lunad</b> <span class="stack">| Next.js, React, TypeScript, Neon Postgres + PostGIS, Playwright</span></span><span class="date">Oct 2026 &ndash; pre-launch</span></div>
    <ul><li>Commuter PWA for Naga City: jeepney trip planner, step-by-step guidance, community corrections and an admin review console; row-level security on every table and E2E tests.</li></ul>
  </div>
  <div class="proj">
    <div class="row"><span><b>SkimCare</b> <span class="stack">| React Native, Expo, TypeScript, llama.cpp, ML Kit</span></span><span class="date">Oct 2026</span></div>
    <ul><li>AppBuildersPH Hackathon 2026 entry (Local AI theme, with Glenn Viola): reads an agreement on-device and explains key terms in English or Filipino, linked to the source sentence. Web and Android.</li></ul>
  </div>
  <div class="proj">
    <div class="row"><span><b>BUCS PolicyPulse</b> <span class="stack">| Next.js, Vercel AI SDK, LlamaIndex.TS, Supabase pgvector</span></span><span class="date">Jul 2026</span></div>
    <ul><li>Retrieval-augmented policy assistant that answers from uploaded documents with verifiable citations, plus an admin console for ingestion, retrieval tuning and escalations.</li></ul>
  </div>

  <h2>Skills</h2>
  <ul class="skills">
    <li><b>Languages:</b> TypeScript, JavaScript, PHP, SQL, Python, HTML/CSS</li>
    <li><b>Frontend &amp; mobile:</b> React, Next.js (App Router), Tailwind CSS, shadcn/ui, React Native / Expo, PWA</li>
    <li><b>Backend &amp; data:</b> Node.js, REST APIs, PostgreSQL (Supabase, Neon, PostGIS, pgvector), Upstash Redis</li>
    <li><b>WordPress &amp; e-commerce:</b> custom themes and plugins, WooCommerce, Dokan, GeneratePress/GenerateBlocks; PayPal, PayMongo, Maya, Xendit</li>
    <li><b>AI &amp; automation:</b> n8n, LLM APIs (Groq, Gemini, OpenRouter), RAG (LlamaIndex), MCP, Claude Code, Codex</li>
    <li><b>Testing &amp; DevOps:</b> Vitest, Playwright, GitHub Actions CI, Vercel, Docker, Render, Git</li>
  </ul>

  <h2>Education</h2>
  <div class="edu">
    <div class="row"><span class="role">Bicol University &ndash; Polangui Campus</span><span class="date">Aug 2020 &ndash; Jul 2024</span></div>
    <div class="sub">Bachelor of Science in Computer Science &middot; Polangui, Albay</div>
  </div>
</body></html>`

const outPath = path.resolve('public/assets/resume/Raro, Christian F - Resume (DEV).pdf')
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] })
const page = await b.newPage()
await page.setContent(html, { waitUntil: 'networkidle0' })
await page.evaluate(async () => {
  await document.fonts.ready
})
await page.pdf({
  path: outPath,
  width: '8.5in',
  height: '13in',
  printBackground: true,
  margin: { top: '0.45in', right: '0.55in', bottom: '0.45in', left: '0.55in' },
})
await b.close()
console.log('saved', outPath)
