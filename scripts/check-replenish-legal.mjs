#!/usr/bin/env node
// Proves the built /replenish/privacy and /replenish/terms pages carry the same words as the app.
//
// Source of truth: Replenish/Features/Legal/LegalDocument.swift (and the support email in
// Replenish/Services/AppLinks.swift) in the app repo (quitsmoke).
//
// Usage (after `npm run build`):
//   npm run check:replenish-legal -- /path/to/quitsmoke
//   (or set REPLENISH_REPO; default ~/Projects/quitsmoke)
//
// It compares the rendered page text (h1, date, intro, every h2 and paragraph inside <article>)
// with the Swift string literals, line by line, and exits 1 on any difference.
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const appRepo = process.argv[2] || process.env.REPLENISH_REPO || join(homedir(), 'Projects', 'quitsmoke')
const swiftPath = join(appRepo, 'Replenish/Features/Legal/LegalDocument.swift')
const linksPath = join(appRepo, 'Replenish/Services/AppLinks.swift')
const builtDir = join(process.cwd(), '.next/server/pages/replenish')

for (const p of [swiftPath, linksPath]) {
  if (!existsSync(p)) {
    console.error(`Missing ${p}. Pass the app repo path as the first argument.`)
    process.exit(2)
  }
}

// ---------- Swift side ----------
const linksSrc = readFileSync(linksPath, 'utf8')
const supportEmail = linksSrc.match(/static let supportEmail\s*=\s*"([^"]*)"/)?.[1]
if (!supportEmail) {
  console.error('Could not read supportEmail from AppLinks.swift')
  process.exit(2)
}

const swiftSrc = readFileSync(swiftPath, 'utf8')

/** All string literals between `static let <name> = LegalDocument(` and the next `static let` (or end). */
function swiftDocLines(name) {
  const start = swiftSrc.indexOf(`static let ${name} = LegalDocument(`)
  if (start < 0) throw new Error(`static let ${name} not found in LegalDocument.swift`)
  const next = swiftSrc.indexOf('static let ', start + 1)
  const block = swiftSrc.slice(start, next < 0 ? undefined : next)
  const lines = []
  // A Swift "..." literal: any run of non-quote, non-backslash chars or backslash escapes.
  // An interpolation \( ... ) has no quotes inside in this file.
  for (const m of block.matchAll(/"((?:[^"\\\n]|\\.)*)"/g)) {
    let s = m[1]
    s = s.replace(/\\\(AppLinks\.supportEmail\)/g, supportEmail)
    if (/\\\(/.test(s)) throw new Error(`Unhandled interpolation in: ${s}`)
    s = s.replace(/\\(["\\'])/g, '$1').replace(/\\n/g, '\n').replace(/\\t/g, '\t')
    lines.push(s)
  }
  return lines
}

// ---------- Built page side ----------
const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', rsaquo: '\u203a', lsaquo: '\u2039' }
function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
    return entities[e.toLowerCase()] ?? all
  })
}

function pageLines(file) {
  const path = join(builtDir, file)
  if (!existsSync(path)) {
    console.error(`Missing ${path}. Run \`npm run build\` first.`)
    process.exit(2)
  }
  const html = readFileSync(path, 'utf8')
  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/)?.[1]
  if (!article) throw new Error(`No <article> in ${file}`)
  const lines = []
  for (const m of article.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<(h1|h2|p)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    lines.push(decode(m[2].replace(/<[^>]+>/g, '')))
  }
  return lines
}

// ---------- Compare ----------
let failed = false
for (const [name, file] of [['privacy', 'privacy.html'], ['terms', 'terms.html']]) {
  const want = swiftDocLines(name)
  const got = pageLines(file)
  const n = Math.max(want.length, got.length)
  let diffs = 0
  for (let i = 0; i < n; i++) {
    if (want[i] !== got[i]) {
      diffs++
      console.error(`  ${name} line ${i + 1} differs:\n    app:  ${JSON.stringify(want[i])}\n    page: ${JSON.stringify(got[i])}`)
    }
  }
  if (diffs) {
    failed = true
    console.error(`FAIL /replenish/${name}: ${diffs} of ${n} lines differ`)
  } else {
    console.log(`OK   /replenish/${name}: ${n} lines match LegalDocument.${name} word for word`)
  }
}
process.exit(failed ? 1 : 0)
