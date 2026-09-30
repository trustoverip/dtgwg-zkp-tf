# DTG ZKP Implementation Guide

Informative companion, extracted after the 22 September 2026 discussion. Construction records remain in `trustoverip/dtgwg-zkp-spec`. This guide has no editable copy of that catalogue.

From this directory: `npm ci`, `npm run render`, then `npm run check`. Output is `docs/`; do not commit it. `npm run collectExternalReferences` refreshes external glossary data. The lockfile is copied from the validated ZKP specification toolchain.

The guide workflow validates pull requests and uploads the rendered preview as an artifact. Publication is a separate step: review the guide, merge it, then configure a Pages deployment with the maintainers. This change does not enable hosting. Intended URL: https://trustoverip.github.io/dtgwg-zkp-tf/ .

Read spec/siros-review.md for the proposed September 29 review path. Review source-map.json and spec/attribution.md before merging. The deeper book is part of this guide for now, not a third deliverable.
