# Repository guidance

Read [README.md](README.md) for site structure and checks. Before changing product
copy, read [docs/products.md](docs/products.md), the pinned
[product definition](docs/product-definition.md), and its
[provenance](docs/product-context.md). Update the canonical definition first for
product decisions; repository snapshots are not independent authorities.
Keep the static site dependency-free and preserve the existing hero and contact page.
Run `make check` before handing off changes. Deployment and merges are separate
operator actions.
