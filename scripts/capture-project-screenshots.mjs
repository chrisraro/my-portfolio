import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

const targets = [
  { url: 'https://elnidoguide.ph', file: 'elnidoguide.png' },
  { url: 'https://beachbus.ph', file: 'beachbus.png' },
  { url: 'https://amangroup-webapp.enjoyrealty.com', file: 'aman-group.png' },
  { url: 'https://enjoyrealty.com', file: 'enjoyrealty.png' },
]

const outDir = path.resolve('public/assets/images/projects')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const viewport = { width: 1600, height: 900 }

;(async () => {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport(viewport)
  page.setDefaultNavigationTimeout(90000)

  for (const t of targets) {
    try {
      console.log('Capturing', t.url)
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 90000 })
      await new Promise((r) => setTimeout(r, 2500))
      const filePath = path.join(outDir, t.file)
      await page.screenshot({ path: filePath, type: 'png', fullPage: false })
      console.log('Saved:', filePath)
    } catch (e) {
      console.error('Failed:', t.url, e?.message)
    }
  }

  await browser.close()
})()
