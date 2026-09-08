# DTG ZKP Task Force — questions for the Berkeley team

**For:** Sanjam Garg, Arka Rai Choudhuri, Hart Montgomery, Erkan Tairi (and team)
**From:** Scott Jones and Mitchell Travers, co-chairs, DTG ZKP Task Force
**Re:** *A Cryptographic Framework for Proof of Personhood* (ePrint 2026/333), and how it maps onto what we are specifying
**Timing:** shared ahead of a live session (targeting 8 September). Any of these that are quicker to resolve async, we would gladly take by email or Signal beforehand.

We have adopted 2026/333 as our normative reference, and a lot of our framing follows from it directly (context-dependent unlinkability as the ceiling, PRF-derived per-context pseudonyms, the personhood/relationship credential split). Two cross-task-force threads have surfaced questions that turn specifically on your constructions and their boundaries. These are the ones where your read would be worth more than anyone's.

Context on where we are: we have just taken a deliberate "get concrete" turn, standing up a first real ZKP for a credential in an open verifiable-trust-community setting (a creation and a presentation) rather than staying theoretical, and we are building a prioritized list of the proofs we most need. So alongside the framework questions, we are interested in your view on what a sensible, representative first proof looks like.

## Materials
- Repo: https://github.com/trustoverip/dtgwg-zkp-tf
- Requirements draft (v0.4, graduating): proof-of-liveness-requirements.md
- Verification registry (independent circuit runs, incl. an external run by Affinidi): https://mitchuski.github.io/dtgwg-zkp-mage/index.html
- Cross-TF privacy discussion: https://github.com/trustoverip/dtgwg-cred-tf/discussions/39
- Delegation design note: https://github.com/trustoverip/dtgwg-cred-tf/discussions/40

## The questions

**1. The credential-vs-artifact boundary.** Your framework proves predicates over credentials. Several of our hardest questions (proving a task "completed," or that a relationship edge is valid) require reasoning over *exchange artifacts* (Trust Task documents), not just credentials. Is proving that a matching, proof-verified terminal document exists, without disclosing it, expressible in your model, or is it fundamentally outside it? What would extending to exchange artifacts take?

**2. Blinded, non-correlating context identifiers.** We need a blinded or committed form of a per-exchange identifier that preserves its binding role but removes the cross-presentation correlator. Are your PRF-derived per-issuer/per-context pseudonyms, with consistency enforced inside the proof, the right construction here? Any parameter choices or pitfalls we should know.

**3. A unified set-membership primitive.** A proposal on our side is that anchoring, revocation status, and trust-registry membership are the same primitive: a signed published set root plus a membership or non-membership proof carried in the presentation, ideally an accumulator non-membership witness. Does your machinery support this cleanly? Which accumulator or membership constructions would you recommend that are ZK-friendly and viable on a mobile device?

**4. Delegation-chain validity as a predicate.** Delegation validity decomposes into nested set/range predicates (act ∈ scope_n ⊆ ... ⊆ scope_root), bounded depth, monotone expiry, and non-membership revocation, plus "the root of this chain is a member of registry R." Is this tractable in your framework, and is it a better-posed target than the completion question in (1)?

**5. Our two adopted positions, checked against your impossibility result.** We have adopted (a) a purpose-and-governance-bounded definition of "context," and (b) issuer-verifier collusion resistance as the target for our extended profile, stated as an evidence-backed (adversary, horizon) claim. Does your impossibility result bound these the way we have assumed, with context-dependent unlinkability as the ceiling? Any refinements.

**6. Binding the nullifier secret to identity.** A point from our cryptographers: a nullifier secret that is just a field element has no strict, correct path to an identity or signing key, which limits what it can be used for, and dual-issuer secrets must be taken jointly rather than combined after the fact. How does your framework handle the secret-to-identity binding, and the multi-issuer case?

**7. Post-quantum horizon.** The constructions are pre-quantum. For personhood and relationship credentials that may be long-lived, do you have a view on the migration path and what agility we should preserve now so a later transition does not change the semantic claim model?

**8. Composition and aggregation over a credential set.** One of our people has a probabilistic-sampling prototype: to establish a trust level over a large set of relationship credentials, it samples about 29 of several thousand at 95 percent confidence with a 10 percent bad-fraction threshold, and proves it in roughly 7 seconds. Does this compose cleanly with your personhood and relationship show proofs, and does your multi-issuer confidence result formalise the aggregation we would want here? What breaks if the issuers are correlated rather than independent?

**9. The smallest representative first proof.** We are standing up a first concrete proof for an open verifiable-trust-community credential, a creation and a presentation, to get real rather than stay theoretical. From your vantage, what is the smallest, most tractable proof to build end-to-end that still exercises the core of the framework, so our first integration is both real and representative rather than a toy?

