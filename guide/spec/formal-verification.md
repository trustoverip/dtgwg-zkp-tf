## Formal verification review

This chapter is informative. [Reading the evidence](#reading-the-evidence) explains what a record's formal-verification block establishes and what it does not. This chapter records how those blocks are reviewed: each run, what it re-checked, what it found, and what remains open. It also lists places across the specification and the wider DTG stack where a formal model would settle a question that prose and fixtures cannot. A run never advances a record's evidence state, and nothing here is a task-force decision.

### What kind of formal verification this is

The models are **model-level, machine-checked proofs** written in Lean 4. Each record's verifier relation becomes a Lean definition over abstract primitives:

- hashes, commitments and PRFs are functions;
- Merkle trees are an inductive type;
- revocation lists are sorted lists.

Lean's kernel checks every theorem about those definitions. A theorem holds for **every** choice of primitives that satisfies its named hypotheses.

It is **not**:

- **A cryptographic proof.** There are no security reductions, probabilities or adversary running times. A hypothesis such as "the leaf hash is collision-free" is stated as injectivity on the values the theorem reads, and real hashes are not injective. The informal reading is that a counterexample to the conclusion would exhibit a collision, but that reduction is not itself formalised.
- **Circuit verification.** No Circom circuit, R1CS or compiled verifier is modelled. Correspondence between a circuit and its record's relation is deferred (G8).
- **Implementation verification.** The lab runtimes are hashed so drift is detected. Their behaviour is not proved to match the models.
- **A privacy proof.** Zero knowledge, hiding, unlinkability and anonymity sets are computational claims, outside every model.

A reader still trusts three things:

1. the Lean 4.33.1 kernel and toolchain;
2. three standard axioms (`propext`, `Classical.choice`, `Quot.sound`);
3. that each Lean definition says what the record's prose says.

The third is the real gap in any model-level work. Three things address it:

- a clause review that gives every clause a written disposition;
- a scope line on every formal block saying what its model leaves open;
- review witnesses that test the claims made about the models.

The models, clause reviews and review witnesses were prepared with agent assistance under the editor's direction and reviewed by the editor. Every claim here is kernel-checked and reproducible from the evidence repository; none rests on who or what wrote it.

### How a run works

Each run repeats the same steps, so runs can be compared.

1. **Model.** Write the relation as a definition. Where a record composes gadgets (record 001's membership, 002's nullifier, 006's non-revocation), build it from the gadget library, so a composed model applies the primitives' theorems instead of restating them.
2. **Prove, with hypotheses named.** A hypothesis (a binding commitment, a collision-free leaf hash, a sorted revocation list) is an obligation the construction must discharge. It is never declared as an axiom.
3. **Show what each clause is for.** For each clause the record calls necessary, give a counter-deployment: a concrete case where the clause is dropped and the verifier accepts what it should refuse. Where possible, give a concrete case for each "does not establish" line too.
4. **Show the theorems are not vacuous.** Apply each soundness theorem to concrete data that satisfies every one of its hypotheses. A theorem whose hypotheses can never hold together would otherwise pass every other check.
5. **Kernel gate.** Build, and print every cited theorem's axiom footprint. The run fails on `sorry`, on any error, on any axiom outside the three standard ones, and on any difference between the theorems printed and those the records cite. Review witnesses compile under the same rule.
6. **Independent replay.** Re-check every declaration and its whole dependency chain with `leanchecker --fresh`, a second pass through the kernel.
7. **Inventory gate.** Hash every record, clause, runtime reference and model file. The run fails if any changed since the last reviewed inventory, which stops a record's text drifting away from the model checked against it.
8. **Clause review.** Give every clause a disposition (`partial-model`, `assumed-relation`, `outside-model` and so on), bound to its record's hash, so a changed record makes its review stale.
9. **Seal.** Mint the sources, receipt and per-theorem footprints as a content-addressed evidence bundle. A reader can then confirm that a cited root names exactly these files and this output.

Reproduce from a clone of the [evidence repository](https://github.com/mitchuski/dtgwg-zkp-mage) at the revision the specification's Appendix B pins:

```sh
node formal/scripts/check-coverage.mjs
node formal/scripts/check-clause-review.mjs
sh formal/scripts/check-axioms.sh
(cd formal && lake env leanchecker --fresh Formal)
python ../kappa-evidence-mage/verify_bundle.py formal/evidence/kappa/2026-10-27_76
```

The last line needs a sibling checkout of [kappa-evidence-mage](https://github.com/mitchuski/kappa-evidence-mage). `formal/README.md` in the evidence repository lists every check and what it guards. The repository's CI runs the same checks on Linux on every push that touches the models or the records.

### Run register

| run | date | evidence revision | records · clauses | roots · witnesses | result | sealed root |
|---|---|---|---|---|---|---|
| 1 | 2026-09-23 | uncommitted | 18 · 60 | 67 · 2 | PASS when run; the stored receipt later recorded inventory drift | not minted |
| 2 | 2026-10-27 | `599f840` | 19 · 68 | 76 · 34 | PASS | `sha256:e2d4b47fe2fcfb80bacdcba69becba092efb23377fc22c50b54b94673691f21a` |

In run 2, every one of the 76 roots sits within the standard axioms: 23 depend on none, 21 on `propext` only, 31 on `propext` and `Quot.sound`, and 1 on all three. The same holds for the 34 review-witness theorems. There is no `sorry` and no declared axiom anywhere in the package.

Run 2 was reproduced from a fresh clone with no build cache: every gate passed, the replay was clean, and the bundle verified to the same root using the published verifier. An earlier seal from the same day (`sha256:f4747fa4…`) was superseded before publication, when the record 024 write-up was reworded to cite only the published construction source.

### Run 2 (2026-10-27)

**The gate was red, and the reason was benign.** The inventory had last been regenerated on 23 September, and the records had changed since:

- the post-quantum revision added a `quantumHorizon` to every record;
- record 007 gained a horizon note;
- five records had been inventoried from working-draft bytes that were committed later;
- record 025 was added.

Every clause statement, runtime reference, formal root, hypothesis and model-file hash was unchanged. Each clause review was re-bound to its record's new hash, and keeps the previous hash and the reason. The 67 run-1 roots rebuilt with unchanged footprints.

**Sabotage check.** A `sorry` planted in a proof was refused: the inventory gate caught the changed model before Lean ran. After the file was restored, the run passed again with the same source-tree hash.

**Non-vacuity.** Sixteen soundness-style theorems were applied to concrete data satisfying all their hypotheses, covering every gadget and every composed record. The data uses free hash constructors, trees with at least two leaves and non-empty revocation lists. None is vacuous. The uniqueness theorems are witnessed with two equal openings, because that equality is what they prove. Observation F9 below comes from this check.

**New model: record 025 (secret rotation).** The model is composed from records 001, 006 and 002 plus the pre-rotation opening, and is now the record's formal block. The leaf, its handle, its pre-rotation digest and the rotation tag are all read from one opening, so F1's binding gap does not recur.

| theorem | what it shows |
|---|---|
| `soundness` | clauses 1–4: the presenter's leaf is under `root_C`, its handle is not revoked at the epoch, its pre-rotation digest names the replacement presented, and the tag is its secret's |
| `replacement_fixed` | one enrolment leaf admits one replacement and one tag: a party holding a stolen `s` can move the enrolment only to the leaf the member chose |
| `colliding_predigest_two_replacements` | the pre-rotation hash's collision resistance is necessary |
| `second_rotation_refused` | a second rotation from the same secret is refused by the spent-tag set, whichever leaf it opens |
| `rotated_leaf_still_member` | does-not-establish 3: the tree is append-only, so membership alone still accepts a rotated-away leaf |
| `rotated_secret_retired` | the tag-absence check (F8) is what retires the old secret |
| `tag_not_nullifier` | with the rotation context outside every presentation context, a rotation tag never equals a presentation nullifier |
| `straddling_epoch_two_nullifiers` | does-not-establish 4: a context epoch spanning the rotation sees two nullifiers |
| `next_epoch_one_nullifier` | the next-epoch default leaves one live secret, and so one nullifier, per context epoch |

The transcript (clause 5), batch unlinkability, timing and the PRF's pseudorandomness are outside the model.

### Findings

A finding is a gap between a model and the claim made for it. None is an attack on an implementation. "Claim corrected" means the record's scope line now says what the model encodes; strengthening the model so that it covers the original claim remains open work.

| # | record | finding | status |
|---|---|---|---|
| F1 | 013 | The committed half is not bound to the policy form or member leaf the proof checks. A review witness passes a committed `member = true` form as `member = false`, under injective, domain-separated hashes. | claim corrected; model open (bind a canonical decoding of the half to its form and subject) |
| F2 | 013 | The exchange's answers are supplied Booleans; `exchange_safe` proves ordering only. | claim corrected; model open |
| F3 | 010 | Supplied leaves, VRC endpoints and identifiers lack extraction bindings; voucher-side common control is missing; the handle list may be empty. | claim corrected; model open |
| F4 | 023 | Clause 5's key derivation is not in the model; `subj = adm` or common control gives an identifier relation only. | claim corrected; model open |
| F5 | 021 | The parent digest is absent; the different-identifier common-control route is not modelled. | claim corrected; model open |
| F6 | 024 | The counting model is sound for what it states. Clause 5 is not established, and the spent set is sequential rather than a durable transaction. | scope already accurate; implementation work open |
| F7 | specification | The Introduction counted seventeen formal records (omitting 013) and cited superseded root and clause counts. | fixed |
| F8 | 010, 023, 024 | Record 025's issuance requires a rotation-tag check in the records that read an enrolment leaf; none had it. | clause added to all three records; composing it into their models open (covered generically by `rotated_secret_retired`) |
| F9 | 020, 021 | In the chain model, each link's signature check is a proposition the prover supplies; nothing ties it to a signature function. The theorems are sound, but this clause is assumed rather than derived. | observation; the record owner to decide whether the signature relation should be modelled |

### Where formal builds would help next

These are candidates, ordered by how much a model would settle. Each names the property, why prose and fixtures are not enough, and what already exists to build from.

**In this specification and its evidence**

- **Closing F1–F5 and F8 in the models.** The claims are now accurate. Strengthening the models restores the original claims with proofs behind them.
- **Circuit correspondence (G8).** Under-constrained signals live in the Circom circuits, not in the abstract relations. Two routes are open. One is a constraint-level checker on the R1CS, proving each output signal uniquely determined by the inputs. The other is a Lean model of the circuit's constraints, proved equivalent to the record's relation. Start with records 001 and 002, which every composed record reuses.
- **Runtime state machines.** Spent sets, challenge minting and batch admission are modelled as sequential lists. Implementations need durable, concurrent, atomic behaviour: two verifiers racing on one nullifier, a crash between check and record, a root rotating mid-batch. A model with interleavings, checked against runtime logs, covers what fixtures cannot.
- **Models as test oracles.** The gadget definitions are executable. Running the runtimes' fixtures through them in differential tests links model and implementation without a full equivalence proof.
- **Transcript composition.** Every composed record says "the transcript is record 003's", and no composed model includes it. One composed theorem would show that 003's binding carries through each composition.

**In the DTG credentials specification**

- **Canonical encodings.** Commitments, salted binders (cred-spec #38) and digest references (record 022) assume the committed bytes decode one way. A proof that the canonicalisation is injective on well-formed values, and refuses malformed ones, discharges the assumption every digest-based clause makes.
- **The commitment home and the key-profile MUST.** These are well-formedness rules over credential structure. A checked model would let the zero-knowledge records cite them as discharged hypotheses rather than assumed ones.

**Across the Trust over IP stack**

- **Trust Tasks voting.** The per-election tag is checked against a point derived from the community, the election identifier and the manifest digest, and the manifest names its ballot box, which refuses a manifest naming another. So one election cannot be registered at a second box under the same digest, and a ticket's tag is not counted twice across boxes. A state-machine model of box, ticket class and spent set would confirm this binding, in the shape of record 002's `cross_context_not_detected`, and would cover the remaining runtime question of concurrent casts on one box.
- **VTI algorithm retirement.** VTI-KEY-013 (retire an algorithm without a software change) and the hybrid ML-DSA proof sets (VTI-KEY-103 to 105) are policy state machines. A model would show that once a suite is retired, no verification path still accepts it. That is the post-quantum migration property: the trigger is a verifier-policy event.
- **Pre-rotation in DID methods.** `replacement_fixed` is the property KERI pre-rotation and did:webvh `nextKeyHashes` rely on: a committed next-key digest fixes the next key. The record 025 model applies to a log of DID-method rotations with little change.
- **Cryptosuite downgrade.** The Trust Tasks specification pins post-quantum suites and has a downgrade section. A negotiation model proving that no accepted message falls below the pinned floor would be short and reusable across specifications.
- **RAHP CT-28 (a ZKP conformance test suite).** This specification's conformance directory, the formal inventory and this run register are that suite's evidence layer. Mapping CT-27, CT-28 and CT-29 to them would let RAHP cite checked properties rather than restate them.

Each candidate follows the method above. Name the hypotheses, build the counter-deployments, show the theorems are not vacuous, gate the run, seal it, and add a row to the run register.
