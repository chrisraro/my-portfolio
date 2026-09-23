// Capture above-the-fold desktop mockups for portfolio projects using the
// system Chrome via puppeteer-core. Output: public/assets/images/projects/<id>.png and <id>-mobile.png
//
// Usage: node scripts/capture-screenshots.mjs [id ...]
//   - no args: capture all targets
//   - with ids: capture only those targets (e.g. `node scripts/capture-screenshots.mjs graceland iskotify`)

import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'
import { readProjects } from './lib/read-projects.mjs'

// Anything with a public URL is capturable. Auth-gated and internal projects
// are not: their screenshots are supplied by hand (spec Phase 3, Q2).
const targets = readProjects()
  .filter((p) => p.live && p.status !== 'auth-gated' && p.status !== 'internal')
  .map((p) => ({ id: p.id, url: p.live }))

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
]

function findBrowser() {
  for (const p of CHROME_CANDIDATES) {
    if (fs.existsSync(p)) return p
  }
  throw new Error('No Chrome/Edge executable found. Edit CHROME_CANDIDATES.')
}

const outDir = path.resolve('public/assets/images/projects')
fs.mkdirSync(outDir, { recursive: true })

const onlyIds = process.argv.slice(2)
const queue = onlyIds.length ? targets.filter((t) => onlyIds.includes(t.id)) : targets

// Desktop keeps writing <id>.png, the file lib/data.ts already points at.
// Mobile writes <id>-mobile.png; lib/project-page.ts shows it when it exists.
const VIEWPORTS = [
  { suffix: '', viewport: { width: 1440, height: 900, deviceScaleFactor: 1 } },
  { suffix: '-mobile', viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
]

// Scroll through the page to trigger lazy-loaded images/sliders, then return to top.
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const maxHeight = document.body.scrollHeight
      let total = 0
      const step = 400
      const timer = setInterval(() => {
        window.scrollBy(0, step)
        total += step
        if (total >= maxHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 150)
    })
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 1200))
}

// These are live marketing sites, so a first-time visitor is met with a cookie
// banner, a newsletter modal, a chat bubble — often all three. Captured as-is,
// the thumbnail shows someone else's consent UI instead of the work, and a
// modal backdrop dims the whole page. Dismiss what has a dismiss control, then
// strip whatever is left.
async function dismissOverlays(page) {
  // Prefer the site's own control, and take the privacy-preserving option where
  // there is one — never "Accept all". Clicking that would register a consent
  // decision on the site owner's behalf, which is not ours to give.
  const clicked = await page.evaluate(() => {
    const DISMISS = [
      /^reject( all)?$/i, /^decline$/i, /^only (necessary|essential)/i,
      /^no,? thanks$/i, /^close$/i, /^dismiss$/i, /^[×✕✖x]$/i,
    ]
    const notes = []
    for (const el of document.querySelectorAll('button, a[role="button"], [role="button"], [aria-label]')) {
      const label = (el.innerText || el.getAttribute('aria-label') || '').trim()
      if (label && DISMISS.some((re) => re.test(label))) {
        el.click()
        notes.push(label)
      }
    }
    return notes
  })

  await new Promise((r) => setTimeout(r, 800))

  // Anything still floating above the page: remove it. A sticky header sits at
  // the top and is short, so it survives — that is real chrome and belongs in
  // the shot. The z-index floor keeps this off fixed-position background
  // layers, which sit at or below 0.
  const stripped = await page.evaluate(() => {
    const vh = window.innerHeight
    const notes = []
    for (const el of document.body.querySelectorAll('*')) {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      const isTopChrome = r.top <= 8 && r.height < vh * 0.25
      if (isTopChrome) continue
      const zIndex = Number(cs.zIndex)
      const isModal = el.getAttribute('role') === 'dialog' || el.getAttribute('aria-modal') === 'true'
      if (isModal || (Number.isFinite(zIndex) && zIndex >= 100)) {
        const cls = String(el.className || '').split(/\s+/)[0]
        notes.push(el.tagName.toLowerCase() + (cls ? '.' + cls : ''))
        el.remove()
      }
    }
    // A modal usually locks scrolling; give it back or autoScroll does nothing.
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    return notes
  })

  if (clicked.length) console.log('  dismissed:', clicked.join(', '))
  if (stripped.length) console.log('  stripped :', stripped.join(', '))
}

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: true,
    args: ['--no-sandbox', '--hide-scrollbars'],
  })

  const results = { ok: [], failed: [] }

  for (const t of queue) {
    for (const { suffix, viewport } of VIEWPORTS) {
      const label = `${t.id}${suffix}`
      const page = await browser.newPage()
      await page.setViewport(viewport)
      await page.setDefaultNavigationTimeout(60000)
      try {
        console.log('Capturing', label, '→', t.url)
        await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 60000 })
        await new Promise((r) => setTimeout(r, 2000))
        await dismissOverlays(page)
        await autoScroll(page)
        // Late-firing exit-intent and timed popups reappear after the scroll.
        await dismissOverlays(page)
        const filePath = path.join(outDir, `${label}.png`)
        await page.screenshot({ path: filePath, type: 'png', fullPage: false })
        console.log('  saved:', filePath)
        results.ok.push(label)
      } catch (e) {
        console.error('  FAILED:', label, e?.message)
        results.failed.push(label)
      } finally {
        await page.close()
      }
    }
  }

  await browser.close()

  console.log('\n=== Summary ===')
  console.log('OK     :', results.ok.join(', ') || '(none)')
  console.log('FAILED :', results.failed.join(', ') || '(none)')
  if (results.failed.length) process.exitCode = 1
})()
