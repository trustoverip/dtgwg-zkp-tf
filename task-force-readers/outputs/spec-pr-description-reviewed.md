This draft introduces an implementation-oriented ZKP specification for decentralized trust graphs. It starts with the outcome an application needs—membership eligibility, a private relationship, selective disclosure, common control, accepted status or delegated authority—and connects it to credential inputs, constructions, verifier checks and reproducible evidence. Personhood and liveness are important use cases and sources, rather than the specification's entire scope.

The contribution contains twelve construction records, the ADR-001 crosswalk, four proving-system entries and portable conformance generation. Records remain informative at their existing evidence states. ADR-001 is the flagship community-anchored use case; a credential-bound membership presentation is proposed as the first implementation milestone supporting it. Existing component tests do not establish the complete composition.

The reading order now leads with an implementation guide and trust-graph lifecycle. Detailed cryptographic background follows the operational material. The book explains construction fit and paper relationships from the same technical records. Explicit WG review notes mark proposals, open technical questions and evidence requests; they do not imply ratification.

The draft clarifies private witness custody, credential authenticity, offline voucher linkage, distinct members versus distinct people, root authority, transcript encoding and the separation of proof verification, policy acceptance and action completion. It documents the lab's domain-separated, length-prefixed transcript hash and BN254 conversion, with a comparison vector. Strict transcript types and semantic checks remain proposed implementation work, rather than claims about the current lab validator.

Near the end, an informative maintenance note describes how surveys of related DTG, Trust over IP, VTC and First Person Project work may produce traceable updates. An agent handoff lists twelve verification tasks with use-case fit, dependencies and expected evidence. The companion research/verifier-worklist.json makes that queue reusable.

Validation performed locally: all 17 conformance files validate; generated sections and terms match regeneration; Spec-Up-T renders with its two configured external glossary sources; the framed/plain transcript comparison digests were separately reproduced. Existing record states and histories were preserved. These checks are not a circuit audit or independent reproduction of the complete proof.

Review requested: general scope and first milestone; credential/witness contracts; canonical wire profile; construction comparisons; book organization; and the evidence required for future recommendations or adoption.

Before public release, resolve the adapted background's licensing statement in Appendix A and the renderer's Windows branch-metadata fallback. The draft also leaves exact cross-repository implementation baselines and several wire-profile decisions open. No construction or proving system is proposed as adopted merely by opening this PR.

