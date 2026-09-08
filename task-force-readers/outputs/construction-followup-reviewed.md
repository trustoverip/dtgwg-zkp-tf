Following up on my earlier construction notes for Glenn’s ADR-001, I’ve refined the Community-Anchored Proof record and the questions we’re taking into the specification.

Two points in my earlier comment need more precise wording. Distinct membership leaves reject reuse of the same leaf; they do not establish distinct people or prevent one controller holding two memberships. And the lab’s transcript-binding constraint binds the presentation to a request; it does not by itself establish the paper’s tagged simulation-extractable NIZK property.

The main construction question is the offline voucher’s linkage: what authenticated artifact lets the presenter establish that the voucher’s relationship identifier and community-membership identifier belong to the same controller? That linkage needs to be supplied at issuance or follow from deliberate identifier reuse under the chosen scope. It cannot be inferred from the presenter’s own secret.

I propose carrying these requirements into the detailed record:

- State that the offline membership check covers the community-issued grant half; it does not establish the voucher’s acknowledgement.
- Specify credential authenticity, both parties’ identifier linkage, status freshness and the shared witnesses needed for the composed proof.
- State the adversary, disclosure set and validity horizon for each privacy claim. A context nullifier is an intentional link within that context; other disclosed metadata may also correlate presentations.
- Keep rejected witnesses distinct from verifier-side rejection tests, and compare constructions against the same credential format and statement.

The vouchable-credential model gives us a useful basis for this, but the DTG issuance artifacts and complete composition still need to be established. The existing component measurements are evidence for those components, not an end-to-end implementation of ADR-001.

Would this be a useful next revision of the linked construction detail for the first board item? I’d particularly welcome Glenn’s and the cryptography team’s view on the offline linkage artifact and the smallest representative implementation.
