# ADOM Inc. website

Static source for https://adominc.com, served by Cloudflare Worker `adominc-site`.
GitHub Pages is disabled. Do not re-enable it or restore the GitHub Pages CNAME.

## What is here

Four hand-written pages, no build step: what is committed is what is served.

| Path | What |
| --- | --- |
| `index.html` | home: the name, "Technology Solutions", Contact us |
| `contact/`, `privacy/`, `tos/` | contact details and the two legal pages |
| `css/style.css` | the whole design: dark only, Inter, dotted type on the tagline |
| `js/fabric.js` | the hero animation: a drifting sheet of metallic tiles, plain WebGL, no libraries |
| `fonts/` | Inter latin subsets (woff2) and their licence, `OFL.txt` |
| `favicon.svg` | the mark |

The home page works without `fabric.js`: a CSS backdrop stays in place when JavaScript or
WebGL is unavailable, and reduced-motion visitors get one still frame. To look at a change,
serve this directory (`python3 -m http.server`) and open it; nothing is fetched from any
other host.

## Hosting

Migrated 2026-09-28 after the GitHub Pages origin certificate expired on
2026-09-23 and failed renewal (`bad_authz`), producing Cloudflare 526.
Both `adominc.com` and `www.adominc.com` are Workers Custom Domains with
Cloudflare-managed certificates. The Worker serves uploaded assets directly,
without fetching GitHub or any other origin. HTTP and www redirect to HTTPS apex.

## Publishing

Commit content changes here. Publishing is an explicit operator step; pushing
this repository alone does not deploy. On `mkna-server`, follow
`/home/jbt/hq/ops/adom-site/README.md`: export the reviewed commit's site files
as data, then run the hq deployment script and the live content checks.
The Worker implementation and credential-free deployment code live in
`mkna-ai/hq`, under `ops/adom-site/`. Credentials stay on the operator host.
