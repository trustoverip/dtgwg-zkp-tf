## Reading the evidence

A record's statement says what a proof would establish. Evidence says how far anyone has checked that. There are four kinds, and each establishes something different. Read them apart.

| kind | what it establishes | what it does not |
|---|---|---|
| **formal model** (a record's formal-verification block) | a machine-checked theorem that the verifier's relation, over abstract primitives, gives the record's statement, under named hypotheses | that any implementation matches the model; zero knowledge; the cryptography itself |
| **circuit proof** | that a specific constraint system enforces a specific relation, with no under-constrained signal | that the deployed build is that circuit; that the relation is the right one for the task |
| **runtime and fixtures** | that an implementation accepts the cases it should and rejects the ones it should, on the fixtures tried | soundness in general; privacy; anything not covered by a fixture |
| **policy enforcement** | that the community's rules (method floors, independence caps, eligibility, who may be admitted) are applied to verified facts | anything about the proof; it runs after verification |

A passing proof is one input to a policy decision, and an authorized action is a third, separate event.

### Evidence states

A record advances **requested → specified → constructed → run → vetted → published** as evidence accumulates:

- **specified:** written and valid.
- **constructed:** a runtime has measured an option.
- **run:** someone other than the constructor has reproduced it.
- **vetted:** a verification-registry row records that reproduction.

No state is adoption. Normative text needs a separate task-force decision.

### Formal-verification blocks

Where a record carries one, the block names:

- the Lean statement;
- the theorems proved against it;
- the hypotheses they rest on. A hypothesis is a property the construction must supply, such as a binding commitment, a sound proof or a sorted revocation list. It is never an axiom, so each one is an obligation to discharge against a real implementation;
- a scope line saying which clauses the model covers.

A block does not claim every clause: several composed models cover some clauses and leave others to named hypotheses or to other records.

The models also show which clauses are necessary. They include counter-examples for the cases where a clause is dropped: a Merkle tree without leaf/node separation, an unsorted revocation list, a nullifier not tied to the leaf's secret, a chain without the depth-decrement rule. Where a record's negative space says "does not establish", the model often shows why, with a concrete case the verifier accepts. Reproduce the models from the evidence repository with `sh formal/scripts/check-axioms.sh`.

### Proving routes

The specification's Proving Systems section records the candidate stacks. As a map:

- **Pairing-based SNARKs** (Groth16 over BN254 with Poseidon, the evidence lab's route): small proofs and fast verification, with a trusted setup.
- **Transparent and hash-based systems** (FRI/WHIR-style, Flock for batched Boolean work such as standard hashes): no ceremony, larger proofs.
- **Existing-credential routes** (for example Longfellow): prove facts about credentials as already signed, such as ECDSA-signed mdoc or JWT. They are useful where issuers cannot change. A post-quantum proof system does not make the underlying signature post-quantum.
- **Σ-protocols over re-randomisable credentials** (pairing-based, no circuit): the shape of the construction named for 024's admission integration.
- **Lattice-based candidates:** research routes toward post-quantum proving, not yet measured here.

Similar algorithms do not make credentials or profiles interchangeable. Compare routes on the same statement and workload, including credential authentication and status checks.

### Reading a mapping to a paper

Some records cite a paper's construction. A matching name is not a security reduction. For each mapping, look for:

- the paper revision and definition;
- its assumptions;
- how it is read into DTG terms;
- what evidence supports the fit.

Keep three things separate: a statement checked directly, an editorial interpretation, and a proposed DTG extension.
