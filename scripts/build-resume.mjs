// Build an ATS-friendly resume PDF (long bond, 8.5 x 13 in) from semantic HTML
// using the system Chrome via puppeteer-core. Real selectable text → ATS-readable.
//
// Usage: node scripts/build-resume.mjs
// Output: public/assets/resume/Raro, Christian F - Resume (DEV).pdf

import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => fs.existsSync(p))

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; }
  body { font-size: 10.2pt; line-height: 1.26; }
  a { color: #1a1a1a; text-decoration: none; }
  .name { font-size: 21pt; font-weight: 700; letter-spacing: 1px; text-align: center; }
  .title { text-align: center; font-size: 10.5pt; color: #333; margin-top: 2px; letter-spacing: .3px; }
  .contact { text-align: center; font-size: 9.2pt; color: #333; margin-top: 3px; }
  .contact span { white-space: nowrap; }
  h2 { font-size: 10.6pt; font-weight: 700; text-transform: uppercase; letter-spacing: .8px;
       border-bottom: 1.4px solid #1a1a1a; padding-bottom: 2px; margin: 8px 0 4px; }
  p.summary { font-size: 10pt; text-align: justify; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .role { font-weight: 700; }
  .org { font-style: italic; }
  .date { font-size: 9.5pt; color: #333; white-space: nowrap; }
  ul { margin: 2px 0 5px 17px; }
  li { font-size: 9.8pt; margin-bottom: 1px; }
  .skills li { margin-bottom: 2px; }
  .proj { margin-bottom: 5px; }
  .proj .stack { font-weight: 400; color: #333; font-size: 9.6pt; }
  .edu .row { margin-bottom: 1px; }
  .edu .sub { font-size: 9.7pt; color: #333; margin-bottom: 6px; }
  .nda { font-style: italic; color: #333; }
</style></head>
<body>

  <div class="name">CHRISTIAN F. RARO</div>
  <div class="title">Software Engineer &middot; Full-Stack Developer</div>
  <div class="contact">
    <span>09631751535</span> &nbsp;|&nbsp; <span>rarochristian029@gmail.com</span> &nbsp;|&nbsp;
    <span>linkedin.com/in/christian-raro</span> &nbsp;|&nbsp; <span>github.com/chrisraro</span>
  </div>
  <div class="contact">
    <span>christian-digital-portfolio.vercel.app</span> &nbsp;|&nbsp; <span>Naga City, Camarines Sur, Philippines</span>
  </div>

  <h2>Professional Summary</h2>
  <p class="summary">
    Software Engineer and Full-Stack Developer with 2+ years building production web and mobile
    applications. Specialized in Next.js, React, and TypeScript, plus client-ready
    WordPress/WooCommerce sites with custom themes and payment integrations. Experienced across the
    full lifecycle &mdash; UI/UX, backend workflows, REST API integration, and deployment on
    Vercel and Supabase. Ships quickly using modern AI-assisted development workflows.
  </p>

  <h2>Skills</h2>
  <ul class="skills">
    <li><b>Languages:</b> JavaScript, TypeScript, PHP, Java, HTML/CSS, Python</li>
    <li><b>Frameworks &amp; Libraries:</b> Next.js, React, Node.js, Laravel, Flutter, Tailwind CSS, shadcn/ui, Material UI, Bootstrap</li>
    <li><b>CMS &amp; E-commerce:</b> WordPress (GeneratePress, GenerateBlocks Pro), WooCommerce, Bubble.io</li>
    <li><b>Databases:</b> PostgreSQL, MySQL, SQL, Supabase, Firebase</li>
    <li><b>Cloud &amp; DevOps:</b> Vercel, Upstash, Docker, Render, Coolify, Git/GitHub</li>
    <li><b>Payments:</b> PayPal, PayMongo, Maya, Xendit</li>
    <li><b>Tools &amp; AI:</b> VS Code, Cursor, Figma, Claude Code, v0.dev, AI-assisted development</li>
    <li><b>Also:</b> Networking &amp; system administration fundamentals (TCP/IP, VLANs, Active Directory)</li>
    <li><b>Soft Skills:</b> Problem-solving, Communication, Documentation, Teamwork, Time Management, Customer Service</li>
  </ul>

  <h2>Experience</h2>
  <div class="row"><span class="role">Web Developer</span><span class="date">Nov 2024 &ndash; Present</span></div>
  <div class="row"><span class="org">Online Creative Solutions</span><span class="date">Naga City, Camarines Sur</span></div>
  <ul>
    <li>Build full-stack web applications and client-ready WordPress/WooCommerce websites end to end.</li>
    <li>Implement custom child themes (GeneratePress Premium, GenerateBlocks Pro) and integrate payment gateways.</li>
    <li>Maintain backend workflows and third-party API integrations.</li>
    <li>Contribute UI/UX design from concept through production.</li>
  </ul>

  <div class="row"><span class="role">IT Staff / Web Developer</span><span class="date">Mar 2025 &ndash; Aug 2025</span></div>
  <div class="row"><span class="org">Enjoy Realty and Development Corporation</span><span class="date">Naga City, Camarines Sur</span></div>
  <ul>
    <li>Developed and maintained full-stack web applications and WordPress sites.</li>
    <li>Managed backend workflows and API integrations.</li>
    <li>Provided graphic design support and IT maintenance (hardware, networks, software).</li>
  </ul>

  <h2>Projects</h2>

  <div class="proj">
    <div class="row"><span><b>Iskotify</b> <span class="stack">| Next.js, React, Supabase, AI, PWA</span></span><span class="date">2026</span></div>
    <ul>
      <li>Built a scholarship and exam-prep platform for Filipino students with scholarship tracking and deadline reminders.</li>
      <li>Implemented AI-generated flashcards with spaced repetition for UPCAT/ACET/DCAT and an AI study companion.</li>
      <li>Full-stack on Next.js with Supabase; delivered as an installable PWA. (iskotify.ph)</li>
    </ul>
  </div>

  <div class="proj">
    <div class="row"><span><b>Aman Group of Companies Web App</b> <span class="stack">| Next.js, React, Vercel, Supabase, Upstash</span></span><span class="date">Mar &ndash; Apr 2025</span></div>
    <ul>
      <li>Developed a full-stack real-estate platform showcasing projects and properties.</li>
      <li>Added property-visit scheduling, a loan calculator, and broker referral links.</li>
      <li>Deployed on Vercel with Supabase and Upstash for a responsive, performant experience. (amangroup-webapp.enjoyrealty.com)</li>
    </ul>
  </div>

  <div class="proj">
    <div class="row"><span><b>BeachBus Palawan</b> <span class="stack">| WordPress, GeneratePress, GenerateBlocks Pro, WooCommerce</span></span><span class="date">Jun &ndash; Aug 2025</span></div>
    <ul>
      <li>Designed and built the website with a GeneratePress Premium child theme and GenerateBlocks Pro.</li>
      <li>Set up a WooCommerce storefront for digital products with payment integration.</li>
      <li class="nda">Also delivered a confidential internal NFC card management system and ERP for the client (details withheld under NDA). (beachbus.ph)</li>
    </ul>
  </div>

  <div class="proj">
    <div class="row"><span><b>Graceland Bicolano Dining</b> <span class="stack">| WordPress, GeneratePress, GenerateBlocks Pro</span></span><span class="date">2026</span></div>
    <ul>
      <li>Built the website for a heritage Bicolano restaurant chain: menu showcase, branch locations, and brand story.</li>
      <li>Developed with a GeneratePress Premium child theme and GenerateBlocks Pro, with SEO and responsive design.</li>
    </ul>
  </div>

  <h2>Education</h2>
  <div class="edu">
    <div class="row"><span class="role">Bicol University &ndash; Polangui Campus</span><span class="date">Aug 2020 &ndash; Jul 2024</span></div>
    <div class="sub">Bachelor of Science in Computer Science &middot; Polangui, Albay</div>
    <div class="row"><span class="role">Camarines Sur National High School</span><span class="date">2018 &ndash; 2020</span></div>
    <div class="sub">TVL &ndash; Information and Communications Technology (Computer Programming) &middot; With Honors</div>
  </div>

</body></html>`

const outPath = path.resolve('public/assets/resume/Raro, Christian F - Resume (DEV).pdf')
const b = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await b.newPage()
await page.setContent(html, { waitUntil: 'networkidle0' })
await page.pdf({
  path: outPath,
  width: '8.5in',
  height: '13in',
  printBackground: true,
  margin: { top: '0.45in', right: '0.55in', bottom: '0.45in', left: '0.55in' },
})
await b.close()
console.log('saved', outPath)
