# ADOM Inc. website

Static source for https://adominc.com, served by Cloudflare Worker `adominc-site`.
GitHub Pages is disabled. Do not re-enable it or restore the GitHub Pages CNAME.

Migrated 2026-09-28 after the GitHub Pages origin certificate expired on
2026-09-23 and failed renewal (`bad_authz`), producing Cloudflare 526.
Both `adominc.com` and `www.adominc.com` are Workers Custom Domains with
Cloudflare-managed certificates. The Worker serves uploaded assets directly,
without fetching GitHub or any other origin. HTTP and www redirect to HTTPS apex.

## Publishing

Commit content changes here. Publishing is an explicit operator step; pushing
this repository alone does not deploy. On `mkna-server`, follow
`/home/jbt/hq/ops/adom-site/README.md`: export the reviewed commit's HTML/CSS
as data, then run the hq deployment script and the live content checks.
The Worker implementation and credential-free deployment code live in
`mkna-ai/hq`, under `ops/adom-site/`. Credentials stay on the operator host.
