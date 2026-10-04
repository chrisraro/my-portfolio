// Records which live project sites can be shown in an <iframe> on this site.
// Output: lib/embeddable.json  { checkedAt, projects: { <slug>: boolean } }
//
// Usage: node scripts/check-embeds.mjs   (hits the live internet; never in CI)
//
// A site is embeddable only when it forbids neither X-Frame-Options (DENY or
// SAMEORIGIN) nor a CSP frame-ancestors directive that excludes other origins.
// A site that does not answer 2xx (after redirects), or is unreachable, is
// recorded as not embeddable.

import fs from 'node:fs'
import path from 'node:path'
import { readProjects } from './lib/read-projects.mjs'
import { allowsFraming } from './lib/embeddability.mjs'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

async function check(url) {
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'user-agent': UA, accept: 'text/html,*/*' },
    signal: AbortSignal.timeout(30000),
  })
  await res.body?.cancel()
  return { embeddable: res.ok && allowsFraming(res.headers), status: res.status }
}

const out = path.resolve('lib/embeddable.json')
const projects = {}

for (const p of readProjects().filter((p) => p.live)) {
  try {
    const { embeddable, status } = await check(p.live)
    projects[p.slug] = embeddable
    console.log(`${embeddable ? 'embeddable ' : 'blocked    '} ${p.slug} (${status}) ${p.live}`)
  } catch (e) {
    projects[p.slug] = false
    console.log(`unreachable ${p.slug} ${p.live}: ${e?.message}`)
  }
}

fs.writeFileSync(out, JSON.stringify({ checkedAt: new Date().toISOString(), projects }, null, 2) + '\n')
console.log('wrote', out)
