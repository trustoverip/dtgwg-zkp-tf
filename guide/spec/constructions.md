## Construction walkthroughs

Each walkthrough says in plain terms what a record proves, how its clauses fit together, and where its limits lie. Then it points to the record. The records are authoritative; these sections only orient.

### Membership and reuse

Records 001, 002, 005 and 006. These four primitives are the shape almost every composed record inherits: *commit, prove membership, nullify*.

- **[001 Set membership](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-001-%C2%B7-set-membership-over-an-accredited-root).** The holder's credential commitment is a leaf of a published root, and the verifier does not learn which leaf. The root is a Merkle tree the community publishes. The tree must hash leaves and internal nodes under separate domains, or every path must have the tree's fixed depth; otherwise an internal node can pass as a leaf.
- **[002 Scoped nullifier](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-002-%C2%B7-scoped-nullifier-(reuse-detection)).** A deterministic value derived from the same secret as the membership leaf, scoped to one context. A second presentation in that context produces the same nullifier and can be refused. Presentations in other contexts stay unlinkable. The "same secret as the leaf" clause is what makes this work: a nullifier from any other secret lets one member present twice.
- **[005 Distinctness](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-005-%C2%B7-distinct-member-%2F-distinct-issuer).** Two leaves, members or issuers are different. The duplicate case is *unsatisfiable*: no witness exists, so there is nothing to reject. Distinct leaves are not distinct people.
- **[006 Non-revocation](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-006-%C2%B7-non-revocation-against-a-status-root).** The credential's handle is absent from the revocation set at a stated epoch, shown by two adjacent entries of a sorted list that bracket it. The registry must commit the list sorted. The proof speaks for its epoch only; a revocation after it is invisible.

### Binding

Records 003, 004, 008 and 022. These primitives tie a proof to *this* request, *this* holder and *this* credential.

- **[003 Transcript binding](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-003-%C2%B7-transcript-binding).** The proof binds a transcript digest, so it cannot be moved to another request. The digest is reduced into the circuit's field, so the proof binds that reduced value. Canonical encoding, audience, freshness and replay policy belong to the presentation profile, not the proof.
- **[004 Holder binding](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-004-%C2%B7-holder-binding-(key-from-secret)).** The presenting key is derived from the secret the credential was issued to. The clause "the credential commitment opens to the same secret" carries it; without that clause, any key passes. Binding says nothing about who holds the secret: sharing, transfer and coercion are outside it.
- **[008 Blinded binder](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-008-%C2%B7-blinded-binder-(taskcontext-hiding%3B-presentation-correlation-unresolved)).** A credential carries a commitment to the trust-task exchange it was issued in, not the plaintext. A verifier that holds the exchange can check it. A visible commitment is the same in every presentation, so presentations can still be correlated by equality. That is an open design requirement.
- **[022 Blinded digest references](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-022-%C2%B7-blinded-digest-references-%E2%80%94-the-digest-valued-members-of-the-credential-specification%2C-unenumerable-at-rest-and-openable-in-proof).** A digest-valued reference in a credential names exactly the credential the enclosing record's clauses read: one credential, not one for the digest and another for the predicate. A salt stops enumeration. A chain reference that the verifier re-checks against the presented parent is sound without a salt.

### Control and equality

Records 007, 009 and 012.

- **[007 Common control](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-007-%C2%B7-common-control-across-identifiers).** Two identifiers open to one secret under the derivation. It proves one *secret*, not one person, and only what the presenter's own secret derives; a counterparty's control needs the counterparty's evidence. An Ed25519 `did:key` has no space for the commitment; `did:peer` (numalgo 2 and 4), `did:web` and `did:webvh` can carry one.
- **[009 Hidden-value equality](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-009-%C2%B7-hidden-value-equality-across-credentials).** A hidden field of one authenticated credential equals a hidden field of another, signed by a different party, without revealing the value. It compares two values and nothing else. Authenticity and control come from the enclosing record's other clauses.
- **[012 Intentional correlation](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-012-%C2%B7-intentional-correlation-%E2%80%94-one-controller-across-k-credentials).** k credentials name identifiers all under the presenter's control. It is k − 1 common-control clauses against the first identifier, sharing one witness. With a binding derivation that makes every pair one controller's. The holder declares the correlation for this presentation only; it widens no identifier's declared scope.

### Relationships

Records 010 and 011.

- **[010 Community-anchored proof](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-010-%C2%B7-community-anchored-proof-(adr-001)) (ADR-001).** A presenter shows a relationship with a voucher inside community C while the voucher is offline. Both are proven current members, their leaves distinct (a self-vouch is unsatisfiable), and the relationship credential verifies over the presenter's key. The hard part is linking the identifier the voucher signed with to the voucher's membership. A membership path alone does not do it. It needs a reused directed identifier or an issuance-time linkage artifact.
- **[011 Pairwise edge](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-011-%C2%B7-pairwise-edge-(vrc-possession%2C-directed-personas-shown%2C-pairwise-identifiers-hidden)).** Two disclosed persona identifiers hold a valid relationship credential between them, while the pairwise identifiers under it stay hidden. Because each persona is linked to its pairwise identifier, the presenter's key check speaks about the persona the verifier can see. The counterparty's linkage rests on the counterparty's own attestation.

### Admission

Records 023, 024 and 013. Admission is a different act from a relationship proof. The applicant is not yet a member, and the verifier is the community that will issue the membership. In every admission record, verifying the proof, counting it under policy and issuing the membership grant are three separate acts.

- **[023 Two-vouch admission](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-023-%C2%B7-two-vouch-admission-proof-%E2%80%94-an-applicant-proves-k-%E2%89%A5-2-vouches-from-distinct-current-members-to-the-issuing-community%2C-without-disclosing-which-members).** The applicant holds relationship credentials from at least k distinct current members, without revealing which. It needs members to have issued relationship credentials to the applicant: an admission path that issues none cannot satisfy it. It has no clause excluding the applicant from its own vouchers, so an applicant who is already a member could vouch for itself. The community's admission check must refuse existing members.
- **[024 Hidden-vetting admission](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-024-%C2%B7-hidden-vetting-admission-%E2%80%94-an-applicant-proves-k-attestations-from-pairwise-distinct-eligible-vetters-of-the-issuing-community%2C-without-disclosing-which-vetters).** k pairwise-distinct eligible vetters attested the applicant, and the community does not learn which. It needs no relationship credential. Each vetter's tag comes from the vetter's own secret and the applicant's identifier. The same vetter twice counts once, and tags do not link across applicants. Clause 7 excludes the applicant's own key, where a construction builds it. The lab's Groth16 route does not yet, so there it holds only while applicants are outside the vetter set. Distinct tags are distinct keys, not people. The cap on attestations has two profiles:
  - a **secret-derived** profile gives each vetter a bounded number of slots derived from its own secret, which caps every vetter;
  - a **transferable-token** profile blind-issues tokens against a budget for the whole vetter set, which colluding vetters can pool.
  
  Either way a spent serial is refused, and a consumed challenge cannot be replayed.
- **[013 Mutual edge admissibility](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-013-%C2%B7-mutual-edge-admissibility-%E2%80%94-each-half-admissible-under-the-other-community%E2%80%99s-policy%2C-neither-policy-nor-member-revealed).** Before either side of a cross-community edge publishes its half, each learns the other's half would be admitted under its own community's policy. Neither half is revealed until both answers are yes. Policies stay published, since proving a form is accepted needs the policy's path. Nothing makes a party reveal after both answers are yes.

### Delegation and authority

Records 020 and 021.

- **[020 Delegation chain](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-020-%C2%B7-delegation-chain-(vdc)-%E2%80%94-agent-acts-for-a-member).** An agent holds a chain of delegations rooted at a member: scope narrows at every hop, no hop is expired or revoked, and every hop was accepted by its delegate. The verifier checks each parent–child pair, and those local checks give the global property. Checking the action and expiry at the leaf alone is enough, and no hop can sit deeper than any ancestor allows, provided each child's depth allowance is at most its parent's minus one.
- **[021 Authority chain](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-021-%C2%B7-authority-chain-(vac)-%E2%80%94-an-agent-or-device-acts-as-itself-under-attenuated-authority).** A party acts *as itself* under authority attenuated from the party governing a scope, within a depth ceiling of 8. It uses the same chain checks; nothing here appoints anyone to act in another's name (that is 020). A party attenuating to itself under a second identifier satisfies every clause.
