# Privacy-Preserving Proof of Liveness — Requirements (v0.3)

**Status:** Input to the Predicate & Assurance-Boundary decision document, not a settled spec. v0.3 corrects a **contradiction in v0.2** (see Section 2) and elevates the boundary question that parameterises everything else.

**Author:** Scott Jones (Realeyes), Chair, DTG ZKP Task Force
**v0.3** — revised following review by @sankarshanmukhopadhyay and @mitchuski. Changelog at the end.

**Normative reference:** [*A Cryptographic Framework for Proof of Personhood*](https://eprint.iacr.org/2026/333) — Choudhuri, Garg, Lee, Montgomery, Policharla, Sinha (IACR ePrint 2026/333). Formalises Sybil-resistance, authenticated personhood, and **unlinkability across contexts**, and establishes why full unlinkability is unreachable. This work should align to it rather than reinvent it.

---

## 1. Purpose

Define what the decentralized trust graph needs for human liveness and personhood — precisely enough that a cryptographer can answer *"can we build this, and with which construction?"* and a biometric provider can answer *"can we supply these inputs and consume this output?"*

## 2. The constraint that shapes everything (corrects v0.2)

**v0.2 was internally inconsistent.** It required uniqueness/deduplication *and* unlinkability across presentations and across verifiers. Those cannot both hold.

The deduplicating enrolment that gives uniqueness its teeth is the same artefact that makes the population correlatable. Per ePrint 2026/333, no real-world protocol achieves full unlinkability and Sybil resistance simultaneously. What is reachable is **context-dependent unlinkability**: *linkable within a context, unlinkable across contexts*.

**This is a trade curve, not a ladder.** The three uniqueness claims are three points on it, and every step up buys Sybil resistance by spending unlinkability:

1. **One action per enrolled secret, per scope and epoch** — a nullifier construction can enforce this. *Cryptographic.*
2. **One enrolment per issuer or ecosystem** — depends on enrolment quality, re-enrolment controls, recovery rules, issuer coordination. *Governance + biometrics.*
3. **One natural person globally** — much stronger, and **not implied** unless the architecture supports it.

"The strongest one we can implement" is therefore **not an available strategy**. Where we sit on the curve is a decision, and it must be made explicitly.

## 3. The foundational boundary question

Underneath all six predicates sits one question that parameterises every construction:

> **What counts as a context — and must a context boundary survive the issuer and the verifier acting together?**

Every candidate construction in Section 6 is parameterised by the answer. Ask a cryptographer for a nullifier scheme today and the first question back is *"unlinkable against whom?"* Until this is answered, the construction table **looks specific but is underdetermined**. This question belongs inside the boundary document, not adjacent to it.

## 4. What the proof does — and does not — establish

> A ZKP proves possession of, and selected properties about, **an attestation**. It does not prove that the underlying biometric determination was **correct**.

There are only two honest ways to honour a claim about the *means* of the determination:

- **(a) Accreditation-carried assurance.** The issuer attests; the verifier trusts the accreditation. The proof establishes that an accredited party signed a determination under a stated policy and assurance class — and says nothing about whether that determination was right. **The cryptography carries the privacy; the accreditation framework carries the assurance.**
- **(b) Execution-carried assurance.** The proof attests to the model's execution — i.e. **zkML**. *Conjecture (high confidence): not deployable at consumer-device scale in 2026. We would welcome being argued out of this.*

**For V1.0 the answer is (a).** A spec that implies (b) while delivering (a) would mislead every verifier who reads "zero-knowledge proof of liveness" and assumes the cryptography is carrying the assurance. This must be stated in plain language, because **it determines who is accountable when a determination is wrong.**

*Note: the current mission statement — "without revealing identity, the underlying biometric, or the proprietary means of the determination" — implies (b). It needs amending.*

**Corollary:** proof of holder-key control does not establish that the key was not transferred, nor that an agent's authority covers the current action. **Key control ≠ agent authority.**

## 5. Drafting rules (proposed — adopt as a group)

1. **Every privacy claim names its adversary** — the verifier, the issuer, or the two colluding. These are three different specifications.
2. **Every privacy claim names its horizon.** The proof artefact and the enrolment root have different lifetimes and different threat clocks. A bound with no validity period is not a bound.
3. **Every predicate states what it does not establish.**
4. **Conjecture is labelled as conjecture**, with a confidence where we can give one.

## 6. Predicates, constructions, and disclosure

Candidate mappings — a starting point to confirm, and **underdetermined until Section 3 is answered**. The disclosure column is what most ZKP specs leave implicit.

| Predicate | Candidate construction (to confirm) | Discloses what, to whom | Does NOT establish |
|---|---|---|---|
| Liveness attestation | Issuer-signature proof + policy / validity / revocation predicates, attestation hidden | Assurance class, policy version, accreditation framework → verifier | That the biometric determination was **correct** |
| Personhood (subject policy) | Predicate proof over attested subject policy | Policy satisfied → verifier | Identity; global uniqueness |
| Issuer accreditation | One-of-many (set-membership) over accredited issuers | Accreditation framework → verifier; specific issuer concealed **only if the profile says so** | That the issuer's determination was correct |
| Uniqueness within a scope | Nullifier (deterministic per-scope, per-epoch pseudonym) | A scope-bound pseudonym → verifier; **linkable within the context** | One human; anything across contexts |
| Holder binding | PoK of holder key, bound to transcript | Key control → verifier | Non-transfer of the key; **agent authority** |
| Freshness | Binding to a canonical, domain-separated transcript | Transcript params → verifier | Anything about the human |
| Demographic range | Range proof over an attested attribute — **extension**, not core | Range satisfied → verifier | Exact attribute value |

**Transcript must bind:** protocol ID, profile ID, verifier/audience, challenge, session ID, requested predicates, policy version, expiry boundary. A bare nonce is too narrow.

**Nullifier inputs must be explicit:** enrolment root/population, scope, epoch, purpose, profile ID, rotation and recovery rules.

## 7. Profile split — the natural fracture line

Not a delivery convenience. The **minimum liveness profile never touches the trade curve at all**; the **extended personhood profile is entirely defined by where it sits on it.** The split falls exactly along the constraint.

- **Minimum liveness profile** — attestation possession, policy and assurance predicates, holder binding, transcript binding, expiry, revocation. Ships and benchmarks independently.
- **Extended personhood profile** — issuer set-membership, scoped nullifiers, same-human-as-enrolment. Agent authorization composed as separate, structured delegation evidence (principal, agent, scope, duration, revocation).

## 8. Context — where the proof is requested

| Context | Example | Predicates required |
|---|---|---|
| Account creation / sign-up | Dating app, marketplace, social platform — one real person per account | Personhood + scoped uniqueness + liveness |
| Age-gated access | Adult content, gambling, alcohol delivery | Liveness + demographic range (extension) |
| Login / re-authentication | Returning user proving it's still the same human | Liveness + freshness + same-human-as-enrolment |
| High-value / sensitive action | Moving funds, changing security settings | Liveness + freshness + holder binding |
| Account recovery | Regaining access after lockout | Liveness + personhood + scoped uniqueness |
| Agent authorisation (day-zero) | A human anchoring / authorising an AI agent | Liveness + personhood + holder binding + delegation evidence |
| Agent step-up | Human-in-the-loop on intent drift, new permission, new environment | Liveness + freshness + delegation evidence |

## 9. Inputs the biometric provider supplies

- A liveness determination (pass + assurance class), signed as an attestation by an accredited issuer under a stated policy.
- A privacy-preserving binding artefact (commitment derived from the biometric) supporting scoped uniqueness and same-human checks **without** storing or revealing a raw template.
- Session binding material feeding the canonical transcript.

## 10. Privacy & trust requirements (corrected)

- **Context-dependent unlinkability** — unlinkable *across* contexts; linkable *within* a context. Full cross-verifier unlinkability is not achievable alongside Sybil resistance (Section 2). Each claim must name its adversary and horizon (Section 5).
- No central biometric honeypot; binding artefacts must not be reversible to a template.
- Pre-quantum acceptable for V1, **provided** algorithm agility, profile identifiers, migration and deprecation are mandatory from day one. Post-quantum must not block the first implementable release.

## 11. Ruled out

- Claiming the ZKP proves the **correctness** of the biometric determination.
- Claiming full unlinkability alongside Sybil resistance.
- Treating a nullifier as sufficient to establish one-human-one-record.
- Global stable identifiers or nullifiers.
- Raw biometrics or reversible templates anywhere in the proof flow.
- Mandatory civil-identity disclosure.
- Mandatory issuer concealment in every profile.
- Conflating holder-key control with human continuity or agent authority.
- Undocumented composition of multiple proofs.
- Proprietary verifier-only formats without interoperable test vectors.
- Hard-coding one algorithm into the semantic model.

## 12. Scope — open

**Probably ours, to be tested:**
- **Delegation / agent authority.** If agents present proofs on a person's behalf, delegation is our surface whether we specify it or not. Cryptographic literature reaches this point and stops.
- **Composition.** Proofs individually sound can leak jointly. Whose job is this — ours, or Trust Task Protocols?

**Not ours (stated so nobody assumes otherwise):**
- Accreditation frameworks — we depend on them; we do not define them.
- The correctness of any model determination.

## 13. Open questions

1. **Section 3** — what counts as a context, and must it survive issuer+verifier collusion? *(Everything else is parameterised by this.)*
2. Which construction per predicate, once (1) is answered.
3. Trade-offs: mobile/browser SDK support, verifier throughput, parameter distribution, library maturity, independent implementations, deterministic test vectors, revocation/refresh cost, offline verification, secure-hardware dependencies, version negotiation, error diagnosability, and **fallback behaviour** (if a device cannot generate the preferred proof: fail, step down, mediated prover, or switch channel?).
4. What enrolment controls are needed to support claim (2) on the trade curve, and how strong a guarantee does it give?

## 14. Next steps

1. First working call: ratify the sequencing and begin drafting the **Predicate & Assurance-Boundary decision document** (two-week box). It is a *decision* document, not a description — the Section 2 contradiction gets resolved inside it.
2. Align with the Credentials TF (PHCs/VRCs) and Trust Task Protocols TF.
3. Engage the authors of ePrint 2026/333 — the framework is already formalised; we should be specifying its deployment profile.
4. Working Draft for IIW #43 (3–5 November 2026).

---

## Changelog

**v0.3** — Following review by @mitchuski:
- **Corrected a contradiction:** v0.2 required both uniqueness and full cross-verifier unlinkability. Per ePrint 2026/333 these cannot coexist. Replaced with **context-dependent unlinkability** and stated the Sybil/unlinkability **trade curve** explicitly.
- Elevated the **foundational boundary question** (what counts as a context; does it survive issuer+verifier collusion) — every construction is parameterised by it.
- Added the **zkML vs accreditation** fork, labelled conjecture with confidence; flagged that the current mission statement over-claims.
- Added **proposed drafting rules** (name the adversary; name the horizon; state what is not established; label conjecture).
- Added a **disclosure column** — what each predicate discloses, and to whom.
- Reframed the profile split as the **natural fracture line of the constraint**.
- Added ePrint 2026/333 as a normative reference.
- Added an explicit **scope** section (delegation, composition; and what is not ours).

**v0.2** — Following review by @sankarshanmukhopadhyay: proof establishes attestation possession, not determination correctness; key control separated from agent authority; uniqueness claim narrowed; transcript binding; issuer concealment as profile choice; demographic range as extension; "ruled out" section.

**v0.1** — Initial strawman.
