# DTG ZKP Task Force

A task force of the [Decentralized Trust Graph Working Group](https://lf-toip.atlassian.net/wiki/spaces/HOME/pages/257785857/Decentralized+Trust+Graph+Working+Group) (DTGWG) at the Trust over IP Foundation (ToIP), part of Linux Foundation Decentralized Trust (LFDT).

## Mission

Design and deliver a specification for how DTG verifiable trust agents (VTAs) can produce **privacy-preserving zero-knowledge proofs** of DTG credentials — for **proof of personhood** and **biometric liveness** of the principal — without revealing the person's identity or the underlying biometric.

### What the cryptography carries — and what it doesn't

The proof establishes **possession of a valid attestation** from an accredited issuer, under a stated policy and assurance class. It does **not** establish that the underlying biometric determination was *correct*.

**The cryptography carries the privacy. The accreditation framework carries the assurance.**

We state this plainly because it determines who is accountable when a determination is wrong. A verifier reading "zero-knowledge proof of liveness" would otherwise assume the cryptography is carrying the assurance. It isn't.

### Normative reference

[*A Cryptographic Framework for Proof of Personhood*](https://eprint.iacr.org/2026/333) — Choudhuri, Garg, Lee, Montgomery, Policharla, Sinha (IACR ePrint 2026/333). Formalises Sybil-resistance, authenticated personhood, and **unlinkability across contexts** — and establishes why full unlinkability alongside Sybil resistance is unreachable. We are specifying a deployment profile of this framework, not reinventing one.

## Deliverable

**DTG ZKP V1.0** — a specification defining the requirements for conformant ZK proofs of:

- the DTG credentials held by the principal,
- the biometric liveness of the principal, and
- any other trust signals the principal agrees to share with a verifier.

It will also cover any trust-task protocols specific to generating, presenting, or verifying these proofs that aren't already specified in **DTG Core Trust Task Protocols V1.0** (from the Trust Task Protocols TF).

## Milestone

A complete **Working Draft ready for discussion at IIW #43 (3–5 November 2026)**. Interim target: a shareable strawman of the proof-of-liveness requirements by September, to put in front of the cryptography teams.

## How we work

A weekly working call plus async work on GitHub. The weekly call (being scheduled — watch Discord) sets the agenda and reviews progress; long-form work and decisions happen here on GitHub (issues + discussions), with short-form notices in Discord and status reports at the DTGWG weekly.

## Leadership

- **Chair:** Scott Jones (Realeyes)
- **Co-chair:** Mitchell Travers (Soulbis)

## Get involved

1. Be a member of **ToIP or DIF** (see the [DTGWG home page](https://lf-toip.atlassian.net/wiki/spaces/HOME/pages/257785857/Decentralized+Trust+Graph+Working+Group) for how to join).
2. Join the Discord channel **#toip-dtgwg-zkp-tf** for short-form discussion.
3. Comment on [issues](https://github.com/trustoverip/dtgwg-zkp-tf/issues) and [discussions](https://github.com/trustoverip/dtgwg-zkp-tf/discussions) in this repo.
4. Add your name to the [TF wiki page](https://lf-toip.atlassian.net/wiki/spaces/HOME/pages/948240390/DTG+ZKP+Task+Force).

We especially want **cryptographers and cryptographic engineers** who can pressure-test what's implementable at scale, and **implementers / relying parties** with concrete use cases that need privacy-preserving liveness.

## First work item

A **Predicate & Assurance-Boundary decision document**, time-boxed to two weeks.

It is a *decision* document, not a description — because what we have written down so far is not yet consistent, and the inconsistency has to be resolved inside it. For each predicate: what it establishes, what it does **not** establish, what it discloses and to whom, and who is accountable for which part of the claim.

The decision that sits underneath all of it:

> **What counts as a context — and must a context boundary survive the issuer and the verifier acting together?**

Every candidate construction is parameterised by that answer. Ask a cryptographer for a nullifier scheme today and the first question back is *"unlinkable against whom?"* Construction selection is sequenced **behind** this, not before it.

## Where to start

- [`proof-of-liveness-requirements.md`](./proof-of-liveness-requirements.md) — requirements draft (v0.3): what a privacy-preserving proof of liveness must prove, what it must *not* claim, the contexts, the disclosure boundaries, and candidate constructions to confirm. Input to the decision document, not a settled spec.
- [`DRAFTING-RULES.md`](./DRAFTING-RULES.md) — the four conventions every contribution should follow.

## Coordination with related work

- **Credentials TF** and **Trust Task Protocols TF** — define the credential formats and protocols our proofs apply to (upstream of us).
- **LFDT / UC Berkeley ZKP work** — the build priority for the October Linux Plumbers / OpenVTC track; we aim to keep our proof definitions in sync with it.

## Intellectual property

Inherits the DTGWG [JDF Charter](https://lf-toip.atlassian.net/wiki/spaces/HOME/pages/257785857/Decentralized+Trust+Graph+Working+Group) IPR terms:

- Copyright: Creative Commons Attribution 4.0
- Patent: W3C Mode
- Source code: Apache 2.0

## Links

- [TF wiki / charter page](https://lf-toip.atlassian.net/wiki/spaces/HOME/pages/948240390/DTG+ZKP+Task+Force)
- [DTGWG home](https://lf-toip.atlassian.net/wiki/spaces/HOME/pages/257785857/Decentralized+Trust+Graph+Working+Group)
- [ZKP background page](https://lf-toip.atlassian.net/wiki/spaces/HOME/pages/257949824/Zero-Knowledge+Proofs+ZKPs)
- [ToIP meeting calendar](https://zoom-lfx.platform.linuxfoundation.org/meetings/ToIP?view=month)
