# Privacy-Preserving Proof of Liveness — Requirements (v0.4)

**Status:** Proposed Task Force Working Draft. This version extends v0.3 with
implementation, interoperability, assurance, lifecycle, privacy, and
conformance requirements.

**Version:** 0.4

**Author:** Scott Jones (Realeyes), Chair, DTG ZKP Task Force

**Contributors/reviewers:** @sankarshanmukhopadhyay and @mitchuski

**Revision history:** v0.3 was revised following review by
@sankarshanmukhopadhyay and @mitchuski. The v0.4 changelog is at the end.

**Normative reference:** [*A Cryptographic Framework for Proof of Personhood*](https://eprint.iacr.org/2026/333) — Choudhuri, Garg, Lee, Montgomery, Policharla, Sinha (IACR ePrint 2026/333). Formalises Sybil-resistance, authenticated personhood, and **unlinkability across contexts**, and establishes why full unlinkability is unreachable. This work should align to it rather than reinvent it.


---

## 1. Purpose

This document defines the properties that a DTG privacy-preserving liveness presentation needs to express before a proof construction can be selected responsibly.

It is intended to be precise enough that:

- a cryptographer can determine whether a requested property is constructible and under which assumptions;
- a biometric or personhood provider can determine which attestations and binding artefacts it must produce;
- a wallet or prover implementer can determine which inputs, state and transcript elements are required;
- a verifier can determine exactly what successful verification authorises it to conclude;
- a governance or assurance function can determine which claims depend on non-cryptographic controls; and
- a conformance suite can distinguish protocol failure, assurance failure and privacy failure.

The document is proof-system agnostic. It defines semantic and assurance requirements first; construction selection follows those decisions.

## 2. Scope and non-goals

### 2.1 In scope

This draft covers:

- proof of possession of a liveness/personhood attestation;
- selective disclosure of policy and assurance predicates;
- holder binding and proof-session binding;
- freshness and replay resistance;
- status, expiry, suspension and revocation handling;
- optional scoped uniqueness and same-human-as-enrolment functions;
- privacy and correlation boundaries;
- verifier-visible failure semantics;
- algorithm and profile agility;
- interoperability evidence and conformance expectations; and
- composition with separate delegation evidence when an agent acts for a human principal.

### 2.2 Explicit non-goals

This draft does not define:

- the biometric algorithm or model used to decide liveness;
- an accreditation framework for biometric/personhood providers;
- global civil identity;
- a universal one-natural-person registry;
- a mandatory ZK proof system;
- a delegation or agent-authority protocol; or
- proof that a biometric model's underlying determination was correct.

The last point is foundational. A ZKP can prove properties of an attestation and of the proof computation. Unless the biometric inference itself is proven inside the relevant computation, the proof does not establish that the biometric decision was factually correct.

## 3. Terminology that must not be collapsed

The following terms represent different claims and should not be used as synonyms.

| Term | Meaning in this document | What it does not imply |
|---|---|---|
| **Liveness** | Evidence that an upstream process determined that a capture represented a live subject under a stated policy, method class and time boundary. | Personhood, identity, uniqueness or correctness of the determination. |
| **Personhood** | Evidence that the subject satisfied an attested policy intended to distinguish a natural person from an ineligible subject class. | Civil identity or global uniqueness. |
| **Holder binding** | Evidence that the presenter controls the key or secret bound to the credential/proof transcript. | That the key is non-transferable or currently controlled by the same human who enrolled. |
| **Human continuity** | Evidence that a later event is bound, under a stated method, to the human represented at an earlier event. | Global identity or uniqueness. |
| **Scoped uniqueness** | Evidence that the same enrolled secret/subject cannot exercise a defined action more than allowed within a scope and epoch. | One natural person globally. |
| **Freshness** | Evidence that a proof or upstream determination falls within a verifier-required time/session boundary. | Liveness by itself. |
| **Agent authority** | Evidence that an agent is authorised to act for a principal under defined scope, duration and revocation conditions. | Holder binding or liveness alone. |
| **F_PoP** | The normative reference's first-person proof-of-personhood framing: a proof property concerning a first-person personhood assertion under explicit system assumptions. | Civil identity, global uniqueness, or agent authority. |
| **f-distinct** | The normative reference's distinct-human property: evidence that two relevant attestations correspond to two distinct humans under the stated construction and assumptions. | Merely proving that two pseudonyms, keys, credentials, or issuer records differ. |

A conformant profile should use the narrowest term matching the actual claim. The symbols `F_PoP` and `f-distinct` are adopted where they sharpen alignment with the primary cryptographic reference; they do not replace the profile-specific semantic definitions in this document.

## 4. The assurance boundary: what the proof establishes

> A privacy-preserving proof of liveness proves possession of, and selected predicates over, an attestation produced under a stated assurance regime. It does not by itself prove that the liveness determination was correct.

There are two materially different assurance models:

1. **Accreditation-carried assurance.** The issuer performs the liveness/personhood determination and issues an attestation. The ZK proof demonstrates possession and policy predicates without revealing unnecessary attestation data. Correctness risk remains with the issuer, accreditation and governance system.
2. **Execution-carried assurance.** The proof establishes properties of execution of the liveness/personhood model itself, for example through zkML or equivalent verifiable computation. This has substantially different implementation, performance and model-governance requirements.

**V1 assumption:** accreditation-carried assurance. Execution-carried assurance is an extension unless separately standardised and benchmarked.

This distinction determines accountability. Verification software must not translate `proof_valid=true` into a stronger semantic claim than the profile permits.

## 5. The constraint that shapes personhood and uniqueness

A previous form of the requirements combined strong deduplication with broad unlinkability. Those goals conflict when the same underlying enrolment state must support anti-Sybil enforcement.

The practical design space is a trade curve:

1. **One action per enrolled secret, scope and epoch.** A scoped nullifier can enforce this cryptographically, assuming correct secret binding and nullifier derivation.
2. **One enrolment per issuer or ecosystem.** This additionally depends on enrolment quality, re-enrolment controls, recovery rules and issuer coordination.
3. **One natural person globally.** This is a much stronger governance and infrastructure claim and is not implied by either of the first two.

The specification must therefore define the intended uniqueness property first and select constructions second.

## 6. Foundational context and adversary model

The foundational frame is adopted for this working draft: privacy is not assurance; unlinkability is context-dependent; Minimum Liveness and Extended Personhood are separate profiles; material predicates have paired assurance and disclosure boundaries; and every material privacy or assurance claim names its adversary and horizon.

### 6.1 Adopted working context definition (B1)

A **context** is a purpose-and-governance-bounded, versioned governance object defining an intentional linkability domain. The verifier is not, by itself, the unit of context. A context **MUST** identify at least:

- a named authority responsible for the context;
- a human-legible purpose;
- the verifier or relying-party set covered by the context;
- the applicable profile and policy version;
- an epoch or other bounded lifecycle delimiter where linkability or nullifiers are used;
- the linkage that is permitted within the context;
- the linkage that is prohibited across contexts; and
- versioning, effective-time and change-control rules that prevent silent expansion.

A context **MAY** contain multiple verifiers when they perform the same governed purpose and the shared linkability domain is explicit and proportionate. Common ownership, common infrastructure, federation, merger, analytics, or use of the same registry **MUST NOT** silently merge contexts.

### 6.2 Adopted working collusion position (B2)

Issuer-verifier collusion is a named and tracked privacy risk. Issuer and verifier role separation is the default architecture. A node or legal entity **MAY** be capable of both roles, but it **MUST NOT** exercise issuer and verifier authority in the same transaction without an explicit combined-role analysis and a correspondingly weaker privacy claim where required.

Every unlinkability claim **MUST** be stated as an evidence-backed `(adversary, horizon)` claim. Where evidence supports it, the Extended Personhood Profile should target resistance to:

- an honest-but-curious verifier;
- multiple colluding verifiers operating in different contexts; and
- issuer-verifier collusion.

If a deployment cannot substantiate one of those resistance claims, it **MUST** declare the weaker privacy class rather than inherit a stronger claim from the profile label.

A statement such as “unlinkable across verifiers” is therefore incomplete until it states the governed contexts, who may collude, what auxiliary information is available, and for how long correlation resistance is expected to hold.

For a non-normative operational context record, disclosure analysis and
change-control method, see the maintained fork's
[`predicate-assurance-boundary-decision.md`](https://github.com/sankarshanmukhopadhyay/dtgwg-zkp-tf/blob/4034bd23f9c4421bd87d000f787cb7f2afaddf77/docs/implementation-guide/boundaries/predicate-assurance-boundary-decision.md).

## 7. Actors and trust model

A deployment may combine roles, but the logical roles remain distinct.

| Actor | Responsibility | Must not be implicitly trusted for |
|---|---|---|
| **Subject / principal** | Participates in capture/enrolment and authorises use of credentials. | Correct implementation by issuer, wallet or verifier. |
| **Liveness/personhood issuer** | Performs or relies on the upstream determination and issues the attestation. | Verifier policy or downstream purpose limitation. |
| **Accreditation/governance authority** | Defines eligible issuers, assurance classes, status and policy rules. | Correctness of every individual determination. |
| **Wallet / prover** | Holds credential material and produces a proof bound to the requested transcript. | Authority of an agent beyond separately supplied delegation evidence. |
| **Verifier / relying party** | Constructs the request, verifies proof/status/policy and applies relying-party policy. | Facts not contained in the proof/profile semantics. |
| **Status / registry service** | Supplies issuer, accreditation, revocation or policy status needed by the profile. | Semantic correctness of the original liveness decision. |
| **Mediated prover** *(optional)* | Provides proving capacity when local proving is unavailable. | Retention or use of sensitive witness material unless explicitly authorised. |
| **Agent** *(optional)* | Presents or triggers proof-related actions under delegated authority. | Principal authority without separate delegation evidence. |

Role co-location must not erase the privacy analysis. If issuer and verifier are the same legal/technical actor, the profile must analyse that combined observation surface explicitly.

## 8. Three different freshness clocks

“Fresh liveness” is ambiguous unless the system separates three clocks.

1. **Capture freshness** — how recently the biometric/liveness capture occurred.
2. **Attestation freshness** — how recently the attestation was issued or refreshed and whether its status is still acceptable.
3. **Proof freshness** — whether the presentation is bound to the current verifier request/session and cannot be replayed outside it.

A verifier may require one, two or all three. They are not interchangeable.

Example: a proof generated now from a six-month-old liveness attestation can have excellent **proof freshness** and poor **capture freshness**.

## 9. Requirement notation

The identifiers below are stable handles for review, scenarios and conformance mapping. In this fork draft, **MUST**, **SHOULD** and **MAY** express proposed requirement strength, not ratified upstream normative language.

### 9.1 Claim semantics

**LIV-CLAIM-01 — Bounded liveness claim.** A profile claiming liveness **MUST** identify the liveness policy/method class, assurance class and the time property to which the claim applies.

**LIV-CLAIM-02 — No correctness over-claim.** A verifier result **MUST NOT** state or imply that cryptographic verification proves the biometric determination was correct unless execution-carried assurance is explicitly part of the profile.

**LIV-CLAIM-03 — Personhood separation.** Liveness and personhood **MUST** be represented as separate predicates unless the attestation policy explicitly defines a compound predicate and its semantics.

**LIV-CLAIM-04 — Uniqueness separation.** Scoped uniqueness **MUST NOT** be represented as global natural-person uniqueness.

**LIV-CLAIM-05 — Agent authority separation.** Holder binding or liveness **MUST NOT** be interpreted as authorisation for an agent action. Agent authority requires separately verifiable delegation/mandate evidence.

### 9.2 Attestation and policy

**LIV-ATT-01 — Issuer authenticity.** The proof **MUST** demonstrate possession of an attestation whose issuer is acceptable under the selected profile, without disclosing more issuer information than that profile requires.

**LIV-ATT-02 — Policy binding.** The attestation **MUST** be bound to an identifiable liveness/personhood policy version and assurance class.

**LIV-ATT-03 — Time metadata.** The attestation/profile **MUST** provide enough authenticated time metadata to evaluate required capture freshness and attestation freshness.

**LIV-ATT-04 — Method semantics.** Where multiple liveness methods or assurance classes are accepted, the profile **MUST** define whether method identity is disclosed, hidden within an approved set, or reduced to a policy predicate.

**LIV-ATT-05 — Accreditation state.** If verifier acceptance depends on issuer accreditation, the proof flow **MUST** bind the relevant accreditation framework/policy identifier and permit the verifier to evaluate its applicable status.

### 9.3 Session, transcript and replay resistance

**LIV-SES-01 — Canonical transcript.** A presentation **MUST** be bound to a canonical, domain-separated transcript.

At minimum, the transcript must commit to:

- protocol identifier and version;
- profile identifier and version;
- verifier/audience identifier or canonical audience commitment;
- verifier challenge/nonce;
- session identifier where the protocol defines one;
- requested predicates;
- policy/accreditation version or accepted-policy commitment;
- relevant expiry/freshness boundary;
- context/scope identifier when nullifiers or linkability are in use; and
- algorithm/proof-suite identifier needed to prevent cross-suite confusion.

**LIV-SES-02 — Audience restriction.** A proof generated for one verifier/audience **MUST NOT** validate as a presentation to a different audience unless an explicitly transferable presentation profile says otherwise.

**LIV-SES-03 — Challenge uniqueness.** Verifiers **MUST** generate challenges with sufficient unpredictability and lifetime controls to prevent practical replay.

**LIV-SES-04 — Request integrity.** The prover **MUST** be able to determine the predicates, audience and context it is authorising before producing the proof. Hidden verifier-side policy changes must not retroactively strengthen the meaning of a previously generated proof.

**LIV-SES-05 — Proof expiry.** A profile **MUST** define the validity window of a generated proof/presentation independently from credential or attestation expiry.

### 9.4 Freshness and temporal policy

**LIV-TIME-01 — Explicit freshness class.** Each profile **MUST** state whether it requires capture freshness, attestation freshness, proof freshness, or a combination.

**LIV-TIME-02 — Verifier threshold.** A verifier requesting capture or attestation freshness **MUST** express an acceptable threshold or a referenced policy from which the threshold is deterministically derived.

**LIV-TIME-03 — Clock assumptions.** Profiles using wall-clock time **MUST** define tolerated skew and the trusted source/assumption for timestamps relevant to acceptance.

**LIV-TIME-04 — No freshness inference.** A recent proof-generation timestamp **MUST NOT** be treated as evidence that the biometric capture was recent.

### 9.5 Status, revocation and policy change

**LIV-STAT-01 — Status semantics.** The profile **MUST** define how attestation status is evaluated and distinguish at least valid, expired, revoked, suspended/temporarily unavailable where the underlying status mechanism supports them.

**LIV-STAT-02 — Accreditation change.** Where issuer accreditation is material, the profile **MUST** define whether verifier acceptance is based on accreditation status at issuance time, presentation time, both, or another explicitly defined evaluation time.

**LIV-STAT-03 — Historical/as-of verification.** If a use case requires historical verification, the status mechanism **MUST** support an unambiguous evaluation time and evidence sufficient to distinguish “valid as of T” from “valid now”.

**LIV-STAT-04 — Policy supersession.** A policy version becoming obsolete **MUST NOT** be conflated automatically with revocation of every attestation issued under it. Profiles must define supersession and transition rules.

**LIV-STAT-05 — Status privacy.** Status checking **SHOULD** avoid creating a verifier-to-subject correlation channel. Where privacy-preserving status is not available, the disclosure/correlation impact must be documented.

### 9.6 Holder binding and continuity

**LIV-BIND-01 — Holder-key proof.** Where holder binding is required, the presentation **MUST** prove control of the bound holder key/secret and bind that proof to the canonical transcript.

**LIV-BIND-02 — Non-transferability disclaimer.** The profile **MUST NOT** infer that holder-key control proves the key was never copied, transferred or exercised through malware/remote control.

**LIV-BIND-03 — Human continuity.** A “same human as enrolment” claim **MUST** identify the specific binding mechanism and assurance assumptions supporting continuity. Holder-key control alone is insufficient unless the profile explicitly defines key continuity as the intended, weaker claim.

**LIV-BIND-04 — Recovery impact.** Key/credential recovery **MUST** define whether continuity, scoped uniqueness or nullifier state survives, rotates or is re-established, and how duplicate recovery is prevented or detected.

### 9.7 Scoped uniqueness and nullifiers

**LIV-UNIQ-01 — Explicit scope.** Any nullifier **MUST** be derived from a canonical scope/context definition, profile identifier and epoch/purpose inputs defined by the profile.

**LIV-UNIQ-02 — No global stable nullifier.** The core profile **MUST NOT** use a globally stable nullifier or pseudonymous identifier.

**LIV-UNIQ-03 — Claim precision.** A verifier receiving a nullifier **MUST** treat it as evidence only of the anti-replay/anti-duplication property defined for that scope and epoch.

**LIV-UNIQ-04 — Rotation semantics.** Profiles using epochs **MUST** define epoch duration, rollover behaviour, late-arriving proofs, recovery interaction and whether old/new epoch values can be correlated by any party.

**LIV-UNIQ-05 — Multi-issuer semantics.** If uniqueness spans multiple issuers, the architecture **MUST** define how enrolment coordination, duplicate handling and privacy are achieved. A nullifier construction alone is insufficient.

**LIV-UNIQ-06 — Distinct-human semantics.** Where a profile claims `f-distinct`, it **MUST** define the evidence and assumptions under which two attestations are treated as originating from two distinct humans. Distinct pseudonyms, keys, credentials, issuer records, or enrolment identifiers are not sufficient by themselves.

**LIV-UNIQ-07 — Attester-independence boundary.** Where a profile relies on multiple issuers or attesters, any independence claim **MUST** state the correlated-failure or collusion risk it is intended to bound. Attester independence **MUST NOT** be represented as evidence that any individual attester's underlying determination was correct, honest, or factually grounded. Cryptographic soundness establishes that a valid proof satisfies the construction with an admissible witness; it does not by itself establish that the witness corresponds to external reality.

### 9.8 Privacy and disclosure

**LIV-PRIV-01 — Named adversary.** Every unlinkability or confidentiality claim **MUST** name the relevant adversary: verifier, issuer, registry/status service, mediator, colluding parties, or another defined actor set.

**LIV-PRIV-02 — Named horizon.** Every privacy claim **MUST** state the period or event horizon over which it is expected to hold, including effects of key rotation, policy change, compromise or later data disclosure.

**LIV-PRIV-03 — Disclosure register.** A profile **MUST** state which fields/predicates are visible to each actor and which stable or quasi-stable values can be observed across sessions.

**LIV-PRIV-04 — No raw biometric disclosure.** Raw biometric samples and reversible biometric templates **MUST NOT** be included in the proof presentation or verifier-visible evidence.

**LIV-PRIV-05 — Binding artefact protection.** Biometric-derived binding artefacts **MUST** be designed and evaluated for irreversibility/non-invertibility appropriate to their threat model. “Hashed biometric” is not sufficient terminology by itself.

**LIV-PRIV-06 — Composition review.** A deployment combining multiple individually privacy-preserving proofs **MUST** assess joint correlation and reconstruction risk across the combined transcript and external metadata.

**LIV-PRIV-07 — Mediated proving.** A mediated proving profile **MUST** define witness exposure, retention, logging, operator access, transport protection, deletion and compromise assumptions. Mediation must not be presented as privacy-equivalent to local proving without evidence.

### 9.9 Algorithm and implementation agility

**LIV-ALG-01 — No semantic hard-coding.** Semantic claim identifiers **MUST NOT** encode a single proof system as the only valid construction.

**LIV-ALG-02 — Suite identification.** Proofs **MUST** identify the proof/credential/commitment suites required for deterministic verification and downgrade resistance.

**LIV-ALG-03 — Negotiation.** If multiple suites are supported, negotiation **MUST** be transcript-bound and resistant to silent downgrade.

**LIV-ALG-04 — Migration.** Profiles **MUST** define how suites are deprecated, how verifier policy changes are communicated and how long-lived attestations migrate without changing their semantic claim silently.

**LIV-ALG-05 — Dependency disclosure.** A profile **MUST** document trusted setup, common reference string, secure hardware, remote prover or registry dependencies that materially affect security or availability.

**LIV-ALG-06 — Security horizon.** Every selected cryptographic suite **MUST** state the security horizon over which its confidentiality, integrity, unlinkability, and verification claims are expected to remain supportable. The horizon **MUST** be reviewed against cryptanalytic change, implementation compromise, and retention requirements.

**LIV-ALG-07 — Post-quantum migration readiness.** V1 **MAY** use pre-quantum constructions, but a conformant V1 profile **MUST** preserve algorithm agility and define migration triggers, overlap rules, and downgrade protections so that transition to post-quantum-capable suites does not require changing the semantic claim model.

**LIV-ALG-08 — Continuity mechanisms do not restore broken guarantees.** Where a profile uses hash chaining or another succession mechanism to preserve evidence lineage across suite rotations, it **MUST** state which property the chain preserves. Such chaining **MUST NOT** be represented as restoring confidentiality, unlinkability, or unforgeability after a relied-on primitive is no longer secure.

**LIV-ALG-09 — Issuance separability (proposed 2026-10-12).** A profile **MUST** state whether the issuer signature on a credential is verified inside the proof or over a published commitment or root outside it. A profile that verifies a pre-quantum signature inside the proof **MUST** state that its forgery horizon is the signature's, whatever the proof system's post-quantum status, because the credential signature is the layer a software update cannot swap. A profile that signs a published commitment or root **SHOULD** name the post-quantum suite for that signature and the hybrid overlap rule, by reference to the DTG VTI specification's proof-set requirements (VTI-KEY-103..105) and the cryptosuites the Trust Tasks framework pins.

### 9.10 Failure and degraded mode

**LIV-FAIL-01 — Typed failure.** Implementations **MUST** distinguish at least cryptographic invalidity, unsupported profile/suite, stale proof, stale capture/attestation, unacceptable issuer/accreditation, revoked/suspended status and local policy rejection.

**LIV-FAIL-02 — Privacy-preserving errors.** Error responses **MUST NOT** reveal unnecessary credential, biometric, issuer or subject information beyond what is required to diagnose the failed protocol interaction.

**LIV-FAIL-03 — Fallback policy.** A deployment **MUST** define what happens when the preferred proving path is unavailable: fail closed, select another conformant profile, step down assurance, use a mediated prover or switch channel.

**LIV-FAIL-04 — No silent assurance downgrade.** Any reduction in liveness freshness, issuer assurance, proof suite or privacy class **MUST** be explicit to the relying-party policy decision and, where material to consent, to the subject/prover.

## 10. Lifecycle, cryptoperiod and assurance horizon

Lifecycle controls bind the semantic claim to the period during which its assumptions remain supportable. Evidence retention and assurance validity are different clocks: a record may need to be retained after the cryptographic, biometric, accreditation, status, or privacy assurance on which the original decision relied has expired.

**LIV-LCM-01 — Bounded epochs.** Nullifier, reuse-detection and other intentionally linkable state **MUST** operate within a defined epoch or equivalent bounded lifecycle. Epoch rollover, overlap and deletion semantics **MUST** be stated.

**LIV-LCM-02 — Cryptoperiods.** Long-lived enrolment roots, issuer keys, proving parameters and other cryptographic dependencies **MUST** have a defined cryptoperiod, rotation trigger and migration path.

**LIV-LCM-03 — Retention.** Every retained presentation, nullifier, status, decision, receipt, audit or recovery artefact **MUST** have a stated purpose, retention period, access boundary and deletion or archival rule. Long-retention obligations, for example a deployment profile requiring a seven-year KYC/AML hold, **MUST NOT** silently extend the validity or privacy assurance horizon of the underlying proof.

**LIV-LCM-04 — Revocation cadence.** Profiles **MUST** define the cadence, cache age, effective-time semantics and unavailable-state behaviour for attestation, issuer, accreditation and policy status needed by the relying decision.

**LIV-LCM-05 — Assurance horizon.** Each material assurance or privacy claim **MUST** identify the event or time at which it must be re-evaluated, including cryptanalytic change, biometric-model change, schema migration, governance change, key compromise, status change or newly available auxiliary data.

**LIV-LCM-06 — Historical evidence.** Where a relying regime requires long-term audit or historical verification, the retained evidence **MUST** make clear what was valid as of the original evaluation time and what, if anything, remains verifiable at the later audit time.

For non-normative implementation guidance, see the maintained fork's
[`cryptoperiod-and-assurance-horizon.md`](https://github.com/sankarshanmukhopadhyay/dtgwg-zkp-tf/blob/4034bd23f9c4421bd87d000f787cb7f2afaddf77/docs/implementation-guide/lifecycle/cryptoperiod-and-assurance-horizon.md)
and
[`ADR-009-cryptoperiod-assurance-horizon.md`](https://github.com/sankarshanmukhopadhyay/dtgwg-zkp-tf/blob/4034bd23f9c4421bd87d000f787cb7f2afaddf77/docs/implementation-guide/adr/ADR-009-cryptoperiod-assurance-horizon.md).

## 11. Predicate and disclosure matrix

Candidate construction mappings remain provisional until they pass the construction-selection gate in Section 20 and the corresponding paired assurance/disclosure boundary review.

| Predicate | Candidate construction family | Minimum verifier-visible result | Material disclosure/correlation surface | Does not establish |
|---|---|---|---|---|
| Liveness attestation | Issuer-signature proof + hidden credential predicates | Liveness policy satisfied; assurance class; freshness result | Policy/accreditation/profile identifiers as selected | Correctness of biometric determination |
| Personhood policy | Predicate proof over attested policy | Personhood policy satisfied | Policy/profile identifier | Civil identity; global uniqueness |
| Issuer accreditation | Set membership / trust-registry-backed predicate | Issuer belongs to acceptable set | Accreditation framework; issuer may be hidden or disclosed by profile | Correctness of issuer determination |
| Scoped uniqueness | Scope/epoch nullifier | Duplicate/not-duplicate under defined scope rule | Stable within-scope value or equivalent verifier state | One natural person globally |
| Holder binding | Proof of possession/control bound to transcript | Bound secret/key controlled in this session | Key class/identifier only if profile exposes it | Non-transferability; human continuity; agent authority |
| Human continuity | Credential/biometric-derived continuity mechanism | Same enrolment binding under stated policy | Correlation within defined continuity domain | Identity outside that domain |
| Proof freshness | Domain-separated transcript + challenge | Current request/session bound | Verifier/audience and session metadata | Recent biometric capture |
| Demographic range *(extension)* | Range/set proof over attested attribute | Requested predicate satisfied | Predicate threshold/policy | Exact attribute value |

## 12. Profile model

The draft retains a natural split between a liveness-only profile and personhood/uniqueness extensions.

### 12.1 Minimum Liveness Profile (MLP)

The MLP should be independently implementable and testable without uniqueness machinery. It includes:

- attestation possession;
- liveness policy and assurance predicate;
- explicit freshness class;
- holder binding where required by the use case;
- canonical transcript and replay resistance;
- expiry and status evaluation;
- accreditation predicate where required;
- disclosure-boundary declaration; and
- algorithm/profile agility.

It does **not** require scoped nullifiers, deduplication or global personhood claims.

### 12.2 Extended Personhood Profile (EPP)

The EPP composes the MLP with one or more of:

- personhood-policy predicate;
- same-human-as-enrolment continuity;
- scoped uniqueness/nullifier behaviour;
- issuer-set membership or ecosystem-level accreditation; and
- cross-issuer enrolment coordination where the selected uniqueness claim requires it.

The EPP must state its position on the Sybil-resistance/unlinkability trade curve explicitly.

### 12.3 Agent-mediated use

Where an agent initiates or presents a proof on behalf of a principal, the liveness/personhood proof establishes only the human-related predicates defined by its profile. When an application relies on agent authority, a separate delegation/mandate object **MUST** carry at least:

- principal;
- delegate/agent;
- authorised action or capability scope;
- audience/environment constraints where applicable;
- effective time and expiry;
- revocation/status reference; and
- evidence linking the delegation decision to the appropriate human-authorisation event.

The two evidence sets **MAY** be cryptographically composed, but their semantics **MUST** remain separable. This document defines the composition boundary only; the delegation protocol and authority semantics remain owned by the applicable delegation or Trust Task work.

## 13. Use-case requirements

| Context | Core requirement | Likely profile | Important temporal property |
|---|---|---|---|
| Account creation / sign-up | Personhood plus anti-duplicate rule within a defined service/community scope | EPP | Capture freshness + proof freshness |
| Age-gated access | Live subject plus demographic predicate where required | MLP + attribute extension | Profile-dependent capture freshness |
| Login / re-authentication | Current presenter bound to prior enrolment/credential | MLP or EPP continuity | Proof freshness; capture freshness only for step-up |
| High-value / sensitive action | Current human presence and holder binding | MLP | Tight capture + proof freshness |
| Account recovery | Human evidence sufficient to re-establish control without enabling duplicate recovery | EPP/continuity | Fresh capture; explicit recovery epoch/rules |
| Agent authorisation | Human authorisation event plus separate delegation | MLP/EPP + delegation | Fresh capture and proof; delegation effective time |
| Agent step-up | Human approval for changed scope/environment/action | MLP + delegation update | Very tight proof/capture freshness |
| Offline verification | Verifiable liveness/personhood evidence without live registry/status reachability | Profile-specific | Evidence/status freshness horizon must be bounded |

Use cases must not select a stronger profile than they need merely because stronger predicates are available. Data minimisation applies to semantic predicates as well as raw attributes.

## 14. Biometric/personhood-provider input contract

A provider integration needs an explicit contract rather than an abstract “liveness pass”. At minimum it should identify:

- determination result and policy identifier/version;
- assurance class and method class or approved-set membership;
- capture time or bounded capture-time evidence;
- attestation issue and expiry times;
- issuer identifier/key reference and status mechanism;
- accreditation framework/reference where required;
- subject/holder binding input;
- optional privacy-preserving continuity/uniqueness binding artefact;
- enrolment deduplication method, population scope, quality evidence and known failure modes where the profile claims person-level anti-Sybil properties;
- biometric-provider independence evidence where multi-issuer assurance is claimed, including relevant shared model family, vendor, training-data, deduplication-service or upstream-data dependencies rather than corporate ownership alone;
- recovery/re-enrolment semantics; and
- session-binding material needed to prevent substitution between capture, attestation and proof sessions.

A nullifier obtains anti-Sybil force only from the enrolment and binding assumptions behind it. A deployment **MUST NOT** describe a nullifier as person-level anti-Sybil evidence when repeated enrolment by the same human is not controlled to the level required by the claim. Likewise, multiple issuers **MUST NOT** be described as independent merely because they are different legal entities when material biometric or data dependencies are shared.

Attester independence addresses a different assurance question from attester correctness. Independence evidence can bound correlated failure, common-mode compromise, shared-data exposure, or collusion across attesters; it does not establish that any one attester's biometric/personhood determination corresponds to reality. A profile **MUST** keep these claims separate. Provenance, accreditation, signed attestations, trusted capture controls, or execution-carried assurance can strengthen evidence about how a determination was produced, but none may be described as establishing external-world truth beyond the property actually demonstrated.

The contract must also state which values are secret witness data, credential data, public proof inputs and verifier outputs.

## 15. Verification outcome contract

A verifier should receive a structured result rather than a single boolean. A minimum semantic result model should be able to report:

- profile and suite evaluated;
- cryptographic validity;
- requested predicate results;
- proof-freshness result;
- capture/attestation-freshness result where requested;
- issuer/accreditation acceptance result;
- attestation/status result and evaluation time;
- scoped uniqueness result where requested;
- policy version evaluated; and
- typed failure or warning codes.

The result should make it difficult for an application developer to confuse `cryptographically_valid` with `business_policy_accepted` or `biometric_determination_correct`.

## 16. Interoperability and conformance evidence

A candidate profile should not be called interoperable without evidence. Before promotion toward a normative working draft, this fork proposes that each profile provide:

1. a machine-readable profile identifier and version;
2. canonical transcript serialisation rules;
3. deterministic positive and negative test vectors where the construction permits them;
4. at least two independent verifier implementations or an equivalent independent cross-check;
5. explicit status/revocation test cases;
6. replay, wrong-audience and wrong-context negative tests;
7. downgrade/version-negotiation negative tests;
8. privacy/disclosure review against the declared adversary model;
9. mobile/browser or target-platform performance measurements for the intended deployment class;
10. failure-code interoperability tests; and
11. evidence that recovery, rotation and migration rules do not silently break uniqueness or privacy guarantees.

Proof-system performance alone is not sufficient interoperability evidence.

### 16.1 Construction-selection gate and circuit evidence

A cryptographic construction **MUST NOT** be promoted into a profile merely because a circuit or prototype is functionally feasible. Selection is gated on approval of the exact statement, negative meaning, context/scope/epoch inputs, adversary and horizon, attestation fields and disclosure modes, composition assumptions, lifecycle, accountability path, performance envelope, and conformance evidence.

The maintained fork provides a non-normative
[`construction-selection gate`](https://github.com/sankarshanmukhopadhyay/dtgwg-zkp-tf/blob/4034bd23f9c4421bd87d000f787cb7f2afaddf77/docs/implementation-guide/boundaries/predicate-assurance-boundary-decision.md#25-construction-selection-gate)
that can be used to evaluate candidate evidence. Experimental lab or circuit
benchmarks **MAY** be used as evidence input to that gate, but until
independently reproduced or otherwise independently verified they **MUST** be
labelled experimental and **MUST NOT** by themselves support an
interoperability, assurance, or production-readiness claim.

## 17. Security and privacy acceptance questions

Before deployment, an implementer should be able to answer:

- Who can correlate two presentations and under what conditions?
- Can issuer and verifier collusion defeat the intended context boundary?
- What stable metadata remains even when credential attributes are hidden?
- What happens after issuer-key compromise?
- What happens after holder-key compromise?
- What happens after a liveness policy or model is withdrawn?
- Can old proofs be verified “as of” a historical time, and should they be?
- Does recovery create a second usable uniqueness identity?
- Does mediated proving expose witnesses or create durable logs?
- Can a verifier force a weaker privacy/suite profile through negotiation?
- Can multiple successful proofs be combined to reconstruct information that no single proof reveals?
- What evidence supports the claimed biometric-derived artefact irreversibility?

A deployment that cannot answer these questions has an assurance gap even if every proof verifies cryptographically.

## 18. Ruled out

The following are incompatible with this draft's requirements unless a future profile explicitly changes the model and documents the consequences:

- claiming that ZK verification proves biometric-decision correctness under accreditation-carried assurance;
- claiming full unlinkability alongside strong, shared Sybil-resistance state without defining the actual adversary model;
- treating a nullifier as sufficient proof of one-natural-person uniqueness;
- globally stable identifiers or nullifiers in the core profiles;
- raw biometrics or reversible templates in verifier-facing proof flows;
- mandatory civil-identity disclosure for liveness/personhood;
- mandatory issuer concealment regardless of relying-party policy;
- conflating holder-key control, human continuity and agent authority;
- a bare nonce as the entire proof transcript;
- untyped `true/false` verification results that hide status or policy failure;
- silent fallback to weaker assurance/privacy;
- undocumented composition of multiple proofs;
- proprietary verifier-only formats without interoperable evidence; and
- hard-coding one cryptographic algorithm into the semantic claim model.

## 19. Decision backlog

The remaining work should be separated into **semantic/governance decisions** and **construction/engineering decisions**. The second category should not be finalised before the first.

### 19.1 Semantic and governance decisions

B1 and B2 are no longer treated as open questions in this working draft. Their adopted working positions are recorded in Section 6 and remain subject to amendment through Task Force decision governance. The remaining semantic/governance backlog is:

1. **B3 — Minimum liveness semantics:** what precisely counts as “live” for the base profile, and how is method/policy variance represented?
2. **B4 — Freshness classes:** which profiles require capture freshness versus only proof/attestation freshness?
3. **B5 — Status time:** current-time, issuance-time, transaction-time and historical verification rules.
4. **B6 — Accreditation semantics:** whether issuer identity is disclosed, hidden in a set or policy-selectable.
5. **B7 — Recovery/continuity:** how recovery changes holder binding and uniqueness state.
6. **B8 — Agent composition:** ownership boundary between this work and Trust Task Protocols for delegation composition.
7. **B9 — Offline mode:** what assurance/status horizon permits disconnected verification?
8. **B10 — Privacy class:** whether profiles expose a standard privacy/disclosure classification usable during negotiation.

### 19.2 Construction and engineering decisions

After the above are bounded:

1. proof construction per predicate/profile;
2. credential signature and selective-disclosure suite compatibility;
3. set-membership/accreditation construction;
4. nullifier derivation and epoch scheme;
5. status/revocation proof mechanism;
6. transcript canonicalisation/encoding;
7. suite negotiation and downgrade protection;
8. local versus mediated proving support;
9. secure-hardware assumptions;
10. platform performance targets;
11. parameter/trusted-setup distribution where applicable; and
12. deterministic vectors and independent implementation strategy.

## 20. Proposed progression toward a specification

A practical sequence is:

1. **Maintain the ratified foundational frame.** Keep privacy-not-assurance, context-dependent unlinkability, the profile split, paired boundaries, and adversary/horizon parameters explicit in every downstream requirement.
2. **Maintain and evidence B1/B2.** Treat the purpose-and-governance context definition and evidence-qualified collusion position as adopted working positions; amend them only through decision governance.
3. **Ratify the Minimum Liveness Profile semantics.** This can progress without the uniqueness trade curve.
4. **Define the attestation and verification outcome contracts.** Make upstream biometric inputs and downstream verifier semantics testable.
5. **Apply the construction-selection gate before selecting MLP constructions.** Use experimental circuit benchmarks as inputs, then require independent verification/reproduction before stronger readiness claims.
6. **Resolve EPP uniqueness/continuity governance.** Include enrolment dedup quality, `f-distinct` semantics where relevant, and biometric-provider independence before selecting scoped-nullifier/multi-issuer mechanisms.
7. **Pressure-test lifecycle and migration.** Cover bounded epochs, cryptoperiods, post-quantum migration, long-retention evidence, revocation cadence, recovery, policy withdrawal and offline verification.
8. **Pressure-test agent composition.** Keep human-related predicates separate from delegated authority and treat failures as first-class protocol states.
9. **Cross-map every proposed normative requirement to conformance evidence.** A requirement with no observable test or assurance evidence should be explicitly identified as governance-only rather than accidentally untestable.

## 21. Maintained follow-up and upstreaming backlog

The original “immediate next steps” list has been retired. Repository work completed after the v0.4 requirements draft means several of those items are now implemented and should be tracked as maintained assurance state rather than repeatedly presented as future work.

| Work item | Status | Durable evidence / next gate |
|---|---|---|
| Map `LIV-LCM-*`, `LIV-ALG-*` and `LIV-UNIQ-06` into predicate, scenario and assurance coverage | **completed** | The maintained fork's non-normative [`requirements-assurance-map.csv`](https://github.com/sankarshanmukhopadhyay/dtgwg-zkp-tf/blob/4034bd23f9c4421bd87d000f787cb7f2afaddf77/docs/implementation-guide/matrices/requirements-assurance-map.csv) provides direct requirement-to-scenario/control/guardrail/test traceability. |
| Pressure-test long retention, revocation cadence, post-quantum migration, enrolment-dedup failure and correlated multi-issuer biometric dependencies | **completed as test definitions; evidence remains deployment-dependent** | The maintained fork's non-normative [`RAHP v1.1 refresh`](https://github.com/sankarshanmukhopadhyay/dtgwg-zkp-tf/blob/4034bd23f9c4421bd87d000f787cb7f2afaddf77/docs/implementation-guide/pressure-tests/rahp-v1.1-refresh.md) records the five focused tests, expected evidence and retest triggers. |
| Keep B1/B2 status synchronized through decision governance | **implemented and ongoing** | The decision register and B1/B2 conformance cases remain the authority. A change to either working position requires an explicit governed decision rather than prose drift. |
| Collect construction/circuit benchmarks and independent reproduction evidence | **open evidence gate** | Construction selection remains deferred. Experimental benchmarks may inform the gate but do not support readiness claims until independently reproduced or otherwise independently verified. |
| Prepare a concise upstream contribution separating semantic improvements from fork-specific implementation machinery | **open upstream action** | Upstreaming should package broadly reusable requirements and decision semantics separately from this fork's validators, deployment profiles, runbooks and local assurance machinery. |

The RAHP refresh is deliberately **not** treated as a transfer of normative authority. RAHP identifies risks, harms, controls, guardrails and evidence expectations; the ZKP Task Force or other applicable specification authority remains responsible for adopting or rejecting normative changes.

---

## Changelog

**Fork working draft v0.4**

- Reframed the document as a proof-system-agnostic semantic and assurance requirements draft.
- Added explicit terminology separating liveness, personhood, holder binding, human continuity, scoped uniqueness, freshness and agent authority.
- Added an actor/trust model.
- Split freshness into capture, attestation and proof freshness.
- Added stable `LIV-*` requirement identifiers covering claims, attestations, transcripts, replay, status, time, binding, uniqueness, privacy, algorithm agility and failure semantics.
- Added current-time versus historical/as-of status semantics.
- Added recovery, rotation, migration, mediated-proving and downgrade requirements.
- Added a structured verification-outcome contract to avoid boolean over-claiming.
- Added interoperability/conformance evidence expectations.
- Promoted the ratified foundational frame from open framing into the working requirements baseline.
- Replaced open B1/B2 questions with the purpose-and-governance-bounded context definition and evidence-qualified collusion position.
- Established the requirements document as the semantic source of truth, with the boundary decision document as the operational decision method and the predicate register as the recorded implementation view.
- Added the construction-selection gate and treatment of experimental circuit benchmarks pending independent verification.
- Added post-quantum migration readiness, security-horizon and hash-chain continuity guardrails.
- Proposed 2026-10-12 (not yet ratified): LIV-ALG-09 issuance separability — where the issuer signature is verified decides the forgery horizon; the published-commitment route is the post-quantum one at presentation cost today. Source: the 8 September call (signature scheme as the non-swappable choice) and the post-quantum chapter of the implementation guide.
- Added lifecycle requirements covering bounded epochs, cryptoperiods, retention, revocation cadence and historical evidence.
- Strengthened biometric-provider inputs for enrolment-dedup quality and multi-issuer biometric independence.
- Added `F_PoP` and `f-distinct` terminology alignment with the primary cryptographic reference.
- Tightened the separation of agent authority into mandatory structured delegation evidence when relied upon.
- Split the remaining backlog into semantic/governance decisions and construction/engineering decisions.
- Preserved the v0.3 assurance-boundary correction: cryptography proves attestation properties under the V1 model; it does not prove the underlying biometric determination was correct.

**Upstream v0.3**

- Corrected the contradiction between uniqueness and full cross-verifier unlinkability by adopting context-dependent unlinkability.
- Elevated the foundational context/collusion boundary question.
- Distinguished accreditation-carried assurance from execution-carried assurance.
- Added drafting rules naming adversary, horizon, negative semantics and conjecture.
- Added a disclosure column and profile split.

**Upstream v0.2**

- Clarified attestation possession versus determination correctness, key control versus agent authority, uniqueness scope, transcript binding, issuer concealment choice and demographic-range extension.

**Upstream v0.1**

- Initial strawman.
