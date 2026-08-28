# Agent runtimes — how task-force members and their AI assistants work the evidence

*A companion to [`DRAFTING-RULES.md`](./DRAFTING-RULES.md). The drafting rules say what a
contribution must state; this document says how a contribution can be **run** — by a person,
by an assistant acting for a person, or by both — so that positions on this task force are
backed by behaviour that anyone can reproduce, not by adjectives.*

Nothing here changes what the task force decides or who decides it. It describes an
open-source working practice one co-chair uses and offers it to the fold.

## 1. The evidence repository

The reference runtimes, conformance fixtures, verification registry and board cards that back
positions taken in this repository's discussions live in a separate public repository, under
the same IPR posture as this one (CC BY 4.0 docs, Apache 2.0 code):

> **github.com/mitchuski/dtgwg-zkp-mage** — *"where our spec's claims go to be tested"*
> (discussion [#14](https://github.com/trustoverip/dtgwg-zkp-tf/discussions/14)).

It is deliberately **not** part of this repository. This repository carries the specification
and the decisions; the evidence repository carries runnable claims about them. The boundary
matters: a spec should never depend on one lab, and a lab should never be mistaken for the spec.

What is there, in one line each:

| lane | what it is | why the task force cares |
|---|---|---|
| `runtimes/` | one runtime per predicate in [`proof-of-liveness-requirements.md`](./proof-of-liveness-requirements.md) §4 (nullifier, liveness attestation, set membership, holder binding, freshness, range) plus instruments every predicate shares (canonical transcript, context card, fixtures, multi-issuer aggregation, ceremony orchestrator) | turns "which proof type per predicate" from prose candidates into measured constructions |
| `runtimes/circom-gadget/` | three real Groth16 circuits with published constraint counts and timings, setup scripts, and a fixed-entropy lab setup (unusable for production, reproducible from a clean clone) | numbers for the construction-selection gate; see its `CIRCUITS.md` |
| `runtimes/fixtures/` | a conformance-fixture format: a rejection-reason register, accept/reject/lint vectors, a zero-shared-code consumer in a second language | the shape a future §26 conformance suite could take |
| `registry/` | a verification registry: independent parties rebuild the circuits on their own hardware and file a run; the maintainer re-derives the verdict and publishes a row | reproduction by strangers is the only evidence that travels |
| `board/` | cards for requested proofs (discussion [#18](https://github.com/trustoverip/dtgwg-zkp-tf/discussions/18)): statement, witness, public inputs, clauses bound to gadgets, disclosure set, what it does not establish, adversary, horizon, fixtures, construction options with cost, issuance requirements | the substance a board row links to, in a format a stranger can rebuild from |

## 2. Working it with an assistant

Members are welcome to point an AI assistant at the evidence repository. Its `AGENTS.md`
and `PATH-MAP.md` are written for that reader: the paths are grouped by expertise, every
green mark is a suite the assistant can run, and the requested output is a **position record**
— which aspects the member ratifies, would refine, refutes, or could build with us.

Three rules of the practice, stated so they can be held to:

1. **The assistant operates; the member decides.** An assistant may run suites, reconstruct
   evidence, draft a comment, and derive a verdict. It does not post to this repository, admit a
   seat to the registry, or publish a row. Those are a person's acts, and the person's name is
   on them.
2. **Disclose the assistant.** A comment an assistant drafted, or a verdict it derived, says so
   — in the comment, and in the registry record's `role` field. The task force's own drafting
   rule that nothing is silent applies to its back office.
3. **Say only what the tests hold.** A claim that a construction has a property is a claim that
   a suite fails when the property is removed. Where no suite exists, the drafting rules'
   fourth convention applies: label it conjecture.

## 3. From a discussion to a runnable claim

The path a contribution takes, and where a person must stand in it:

```
discussion / issue  →  card (board/)  →  runtime + measurement  →  independent run  →  registry row  →  position in the discussion
        ↑ person            ↑ anyone            ↑ anyone                ↑ a different pair of hands      ↑ maintainer (HUMAN)   ↑ person
```

- A **card** is the smallest complete statement of a proof: what it proves, over which
  credentials, what it does not establish, against whom, for how long, and how it is tested.
  Cards compose only under one transcript and one declared disclosure set — because proofs
  that are individually sound can leak jointly.
- A **runtime** is a card with numbers. Substitutions (other constructions through the
  selection gate) are welcome and are listed with their measured cost beside the first.
- An **independent run** is the same build on someone else's hardware. The tool refuses a run
  by the constructor's own hands, and refuses to vet a run whose runner was the constructor —
  the same rule a community-anchored proof needs (the voucher is not the holder), applied to
  the process that produces it.
- A **registry row** is published by one person after re-deriving the verdict locally. The
  repository describes that acceptance flow step by step, marking the two acts that are
  judgment — admitting a seat, publishing — as human and never delegated.

## 4. What this is not

- Not a construction selection. The lab's Groth16 circuits are a benchmarking vehicle, chosen
  for toolchain maturity; the task force's selection is sequenced behind boundary ratification
  (decision document §25), and a PLONKish or folding counter-proposal through the same gate
  is a welcome contribution.
- Not an audit. A registry row says a published source compiles bit-identically on
  independent hardware and its behavioural suites hold there. Reproduction and behaviour are
  not review; the narrowness is the credibility.
- Not a requirement on anyone. Members who prefer prose contribute prose; the drafting rules
  are the only rules of this repository.

## 5. Contact

Mitchell Travers (co-chair) — via the discussions in this repository, or the evidence
repository's issues (`verification-run` and `position` templates).
