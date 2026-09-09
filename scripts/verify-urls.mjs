// Spec verification criterion 1: every URL in the inventory returns 200 to a
// browser user-agent. Two sites reject a default curl UA with 406 and one sits
// behind a login, so the UA matters and a redirect is not automatically a fault.
//
// Manual only — this hits the live internet and must never run in CI.
// Usage: npm run verify:urls

import { readProjects } from './lib/read-projects.mjs'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const targets = readProjects().filter((p) => p.live)

let failures = 0

for (const target of targets) {
  try {
    const response = await fetch(target.live, {
      headers: { 'user-agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(25_000),
    })
    const note = target.status === 'auth-gated' ? ' (auth-gated, redirect to login expected)' : ''
    if (!response.ok) failures += 1
    const flag = response.ok ? 'OK ' : 'BAD'
    console.log(`${flag} ${response.status}  ${target.id.padEnd(26)} ${response.url}${note}`)
  } catch (error) {
    failures += 1
    console.log(`ERR      ${target.id.padEnd(26)} ${target.live} — ${error.message}`)
  }
}

console.log(`\n${targets.length - failures}/${targets.length} reachable`)
process.exit(failures === 0 ? 0 : 1)
