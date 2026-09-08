# Task-force readers and publishing drafts

Contributor preparation workspace. The meeting reader combines the agenda framing, 26 questions and paper mappings. The discussion reader is separate and retains proverb review and revision-bound MCP handoffs.

## Run

With Node.js installed, from this directory:

    node build.cjs
    node work/serve-readers.cjs

Open http://127.0.0.1:8430/. Stop any existing reader server on that port before starting this one. The existing preview may continue to be used while reviewing this addition.

## Sources and ownership

- work/: meeting content, paper crosswalk, builders and local editor.
- inputs/discussion-baseline.html: frozen imported reader baseline from the separate dtgwg-zkp-mage evidence checkout, preserving its proverbs and provenance. No runtime dependency on that checkout.
- outputs/: generated readers and supporting draft inputs. Edit the three reviewed Markdown draft inputs here for P, R and T; rebuild to incorporate them.
- drafts/: extracted review copies of every discussion body and a destination manifest. These are snapshots; regenerate them after rebuilding or exporting browser edits.
- The credential spec remains in its own checkout; ZKP specification, book and construction records remain in dtgwg-zkp-spec. This package does not relocate them.

Browser edits and meeting answers remain in browser storage, not Git. Export them before switching browser or origin. Regenerating files does not import browser edits. Meeting download excludes private answers. No credentials, paper PDF or publication receipts are included here.

## Publication order

1. P: review and prepare the specification PR in its own repository; resolve its release prerequisites and obtain a real PR URL.
2. R: insert that PR URL in the consolidated task-force update.
3. T: after the call, fill attributed outcomes and shared document/notes links; remove all placeholders.
4. K, N and the other active points: refresh original discussions and reply with the relevant stable references. Held/superseded items remain reference-only.

For each post: edit, save revision, read proverb, review exact destination/body, export MCP handoff. Exporting does not publish. Source snapshots are dated and must be refreshed before sending. Keep ratification separate from proposals and meeting interpretations.

The Mage checkout is the local agent workspace. Its organisation remote is intentional: selected reviewed contributions are pushed to trustoverip/dtgwg-zkp-tf. This package preserves that workflow and does not commit or publish anything.
