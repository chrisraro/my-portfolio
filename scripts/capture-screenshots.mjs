// Capture above-the-fold desktop mockups for portfolio projects using the
// system Chrome via puppeteer-core. Output: public/assets/images/projects/<id>.png
//
// Usage: node scripts/capture-screenshots.mjs [id ...]
//   - no args: capture all targets
//   - with ids: capture only those targets (e.g. `node scripts/capture-screenshots.mjs graceland iskotify`)

import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'

// id must match the project `id` (and image filename) in lib/data.ts
const targets = [
  { id: 'graceland', url: 'https://res326.servconfig.com/~graceland/staging/' },
  { id: 'iskotify', url: 'https://iskotify.ph' },
  { id: 'aman-webapp', url: 'https://amangroup-webapp.enjoyrealty.com' },
  { id: 'naga-perks-giya-app', url: 'https://giya.vercel.app' },
  { id: 'elnido', url: 'https://elnidoguide.ph' },
  { id: 'beachbus', url: 'https://beachbus.ph' },
  { id: 'upcat-review-plus', url: 'https://upcatreviewplus.com' },
  { id: 'downtown-district-hotel', url: 'https://downtowndistricthotel.ph' },
  { id: 'azalea-main', url: 'https://onlinecreativesolutions.com/azaleamain' },
  { id: 'fish2go', url: 'https://onlinecreativesolutions.com/fish2go' },
  { id: 'online-creative-solutions', url: 'https://onlinecreativesolutions.com' },
]

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

const viewport = { width: 1440, height: 900, deviceScaleFactor: 1 }

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

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: true,
    args: ['--no-sandbox', '--hide-scrollbars'],
  })

  const results = { ok: [], failed: [] }

  for (const t of queue) {
    const page = await browser.newPage()
    await page.setViewport(viewport)
    await page.setDefaultNavigationTimeout(60000)
    try {
      console.log('Capturing', t.id, '→', t.url)
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 60000 })
      await new Promise((r) => setTimeout(r, 2000))
      await autoScroll(page)
      const filePath = path.join(outDir, `${t.id}.png`)
      await page.screenshot({ path: filePath, type: 'png', fullPage: false })
      console.log('  saved:', filePath)
      results.ok.push(t.id)
    } catch (e) {
      console.error('  FAILED:', t.id, e?.message)
      results.failed.push(t.id)
    } finally {
      await page.close()
    }
  }

  await browser.close()

  console.log('\n=== Summary ===')
  console.log('OK     :', results.ok.join(', ') || '(none)')
  console.log('FAILED :', results.failed.join(', ') || '(none)')
  if (results.failed.length) process.exitCode = 1
})()
