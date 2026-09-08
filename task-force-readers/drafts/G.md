Seed set update. The linked-entry format proposed above is now the construction-record form in the ZKP specification draft (`trustoverip/dtgwg-zkp-spec`, pull request forthcoming); each board row can link a record id. Twelve records, all validating.

**From cred-tf #39 and #40, the ZKP TF work items on record:** 008 *blinded binder* (salted commitment available now; PRF-derived per-context pseudonym as the fuller construction) · *issuer-as-predicate* as the alias of 001 · *delegation-chain validity* as 020, carded with the acceptance clause and the core/profile split from the #40 design note (the single-hop core needs no chain proof; the record proves the chained profile) · the *set-root primitive* as a construction option on 006 and a public-input convention, flagged as the priority pressure-test.

**From cred-spec WD02 (#22 → PR #30, three correlation scopes):** 007 *common control across identifiers* — the linkage #31 says four things now lean on, answered on #9 — and 012 *intentional correlation*, the one case identified there as still needing a proof. 010 and 011 are re-carded in the WD02 vocabulary with the common-control clause added; 010 now lists the voucher-side linkage as a witness ingredient rather than assuming it.

**Proving systems:** four entries — the reference Groth16 lab (the only one with registry rows), ProveKit, the SIROS catalog, Flock — recorded as facts with sources, not recommendations.

Construction detail for 010 follows in its own thread once the Projects board exists, so the row has something to point at.