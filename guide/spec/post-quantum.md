## Post-quantum considerations

This chapter is informative. It explains the one sentence the specification's Security Considerations give to the post-quantum horizon, and it gives the other DTG task forces a chapter to cite instead of each writing its own paragraph. It states which assumption each layer of a construction rests on and what a cryptographically relevant quantum computer (CRQC) does to that assumption. It does not predict when one arrives, and it does not adopt a construction.

### Two properties, read separately

Every question of the form "is X post-quantum" has two answers, and they drive opposite deployment decisions.

**Soundness and unforgeability fall.** Groth16's knowledge soundness, KZG's binding, and the unforgeability of every discrete-logarithm signature (Ed25519, ECDSA, BLS, Pointcheval–Sanders, structure-preserving signatures) rest on problems in elliptic-curve or pairing groups that Shor's algorithm solves. With a CRQC an adversary recovers a Groth16 setup's trapdoor from the public parameters and forges proofs of false statements; opens a Pedersen or KZG commitment to any value; and mints a membership, relationship, delegation or attenuation credential under any issuer's key.

**Zero-knowledge and hiding hold.** Groth16 is perfectly zero-knowledge: the simulator produces proofs identically distributed to real ones without the witness and without any computational assumption. Pedersen, KZG and hash commitments are perfectly or statistically hiding. A proof or commitment harvested today therefore discloses nothing about its witness to a future quantum adversary. ETSI TR 119 476-1 §9.1 states this for every credential family it surveys: a quantum adversary "will be able to break the authenticity of QEAA systems but not (in most cases) their privacy", and systems with unconditional privacy "are immune to the store now decrypt later attack".

Three consequences follow for a trust graph.

1. There is no retroactive privacy loss. "Harvest now, decrypt later" does not apply to zero-knowledge proofs.
2. There is no retroactive soundness loss either. A proof verified and acted on before the break was sound when it was verified. What falls is every *future* verification: a verifier that still accepts a pairing-based proof or a curve signature after the break accepts forgeries. The migration trigger is therefore a verifier-policy event — retire the suite — not an archival one. The VTI specification's rule that a node must be able to retire an algorithm without a software change (VTI-KEY-013) is the right shape.
3. "Harvest now, forge later" is the narrower window ETSI §9.2 describes: the adversary needs the public material first and cannot pre-collect it. Short validity, rotation and transcript binding are the controls, and every construction record's horizon already lists them.

### The hash side holds

The gadgets the construction records are built from — set membership over a Merkle root, the scoped nullifier, transcript binding, commitment opening, hidden equality over hash commitments, holder binding as a PRF image, distinctness over leaves or tags — rest on hash collision and preimage resistance. Grover's algorithm gives a quadratic speed-up on preimage search; a 256-bit output retains about 128 bits of post-quantum preimage security, which NIST IR 8547 §4.1.3 keeps at its Category 1. Two caveats belong beside that sentence. Poseidon's security argument is algebraic and its margin has been revised more than once classically; a profile that wants the most conservative hash would select SHA-256 or BLAKE3 trees, which the Flock entry offers and which the transcript digest already uses. And a nullifier or pseudonym is only as hidden as the holder secret's entropy: a 256-bit uniformly random secret is fine, a secret derived from a low-entropy source is not, and Grover halves it. The same holds for the salt of a blinded binder (record 022): ETSI's guidance for salted-hash credentials is to double the salt length.

### Hash-based proof systems

Transparent proof systems built from interactive oracle proofs and Merkle commitments — FRI and STARKs, Ligero and Ligerito, Brakedown, Binius, WHIR, STIR — rest on hash assumptions in the random-oracle model. Chiesa, Manohar and Spooner showed that such arguments with round-by-round soundness are secure in the *quantum* random-oracle model, and Chiesa, Ma, Spooner and Zhandry showed Kilian's argument post-quantum secure in the standard model from collapsing hashes. "Plausibly post-quantum" is the honest label and the specification uses it.

One caveat belongs beside every such label. The "up-to-capacity" Reed–Solomon proximity-gap conjectures that many FRI, STIR and WHIR parameter sets assumed were disproved between November 2025 and April 2026 (Diamond–Gruen; Crites–Stewart; Ben-Sasson, Carmon, Haböck, Kopparty and Saraf; Kambiré). The effect is parametric, not a break: a few percent of proof size under the restated conjecture, roughly double under proven bounds, with binary-field systems the most exposed. A post-quantum profile names the bound it relies on, and a measured cost row states which bound its parameters assume.

A hash-based core wrapped in a pairing-based proof for cheap verification — the Groth16 wrapper around ProveKit, SP1, RISC Zero or Stwo — is not post-quantum at the wrapper. A verifier that sees only the wrapper holds a proof whose soundness falls with Groth16's.

### The signature is the layer that cannot be swapped

The 8 September task-force call put it in one line: zero-knowledge proof systems can be swapped by a software update; the credential signature cannot; if it is not post-quantum, "all bets are off"; a post-quantum proof system does not mask a pre-quantum signature. The reason is the first consequence above: a proof is zero-knowledge, so the verifier cannot tell a forged credential from a real one. A hash-based proof over a forged Ed25519 credential is a perfectly sound proof of a false fact about the world.

In the DTG specifications today the credential specification names one cryptosuite, `eddsa-jcs-2022`. The Trust Tasks framework pins two quantum-resistant suites beside its baseline (`mldsa44-jcs-2024`, `slhdsa128-jcs-2024`, from the W3C Quantum-Resistant Cryptosuites draft) and has a cryptosuite-downgrade section. The VTI specification defines hybrid proof sets — an Ed25519 proof and an ML-DSA-44 proof on one attestation artefact — with the rule that every evaluated proof must verify and that a verifier may require a named suite (VTI-KEY-102..105). The ZKP constructions therefore sit on a post-quantum-capable transport and identifier layer with a classical-only credential layer in between.

### The pattern: sign the commitment, keep the signature out of the circuit

The construction records already assume issuers who can choose commitments. Record 010's issuance line offers two branches: a ZK-friendly signature the circuit verifies, or a published commitment the circuit proves membership against. The second branch is the post-quantum one.

```
issuer                                   holder                           verifier
------                                   ------                           --------
leaf = H(secret, salt, attributes)
root = Merkle(leaves)
sig  = ML-DSA / SLH-DSA (root)  ───►     proves in zero knowledge:        checks sig(root) in the clear
                                          leaf ∈ root, opening, predicates  checks the proof against root
                                          (no signature inside the proof)
```

The circuit proves hash membership, commitment openings and predicates and never verifies a signature. The verifier checks the post-quantum signature on the root outside the proof. This is the set-root primitive the credential task force already described ("signed published root + zero-knowledge membership/status proof") and the transition ETSI TR 119 476-1 §9.3 describes for salted-hash credentials: "the main component vulnerable to quantum computers is the signature scheme used to sign the hash values. Transition to post-quantum cryptography will then mostly consist in replacing this signature scheme by a post-quantum counterpart such as the NIST standard FIPS 204."

The alternative — verifying a post-quantum signature inside the circuit to keep an as-signed model — is not available at presentation cost today. Self-reported figures put an ML-DSA verification at about 16.5 million R1CS constraints in circom and some 22 seconds in a zkVM, against the lab's 11,523 constraints for a whole membership proof; no credible in-circuit figures exist for SLH-DSA or standard Falcon, and FIPS 206 (FN-DSA) has no public draft. The one production system that verifies a lattice signature natively inside a STARK does so with a non-standard algebraic-hash variant.

What the pattern asks of each layer:

- **Issuers and registries** sign roots and leaf commitments with ML-DSA-65 by default, or SLH-DSA where a hash-only assumption set is wanted — registry roots are few and long-lived, so the large, slow signature is affordable there — in a hybrid proof set with Ed25519 during the overlap, as VTI-KEY-103..105 specify.
- **Holders** are bound by a PRF image of their secret (record 004's relation as written), not by a curve key; the session key that signs the transcript can be anything the transport accepts.
- **Provers** use a hash-based system for the selected construction. Groth16 remains what its entry says: a measured benchmarking vehicle, not the task force's selection.
- **Verifiers** keep an accepted-suite set they can change without a release, and check the root signature before the proof.
- **Chains** (records 020 and 021) replace each hop's countersignature inside the proof with each hop's commitment in a signed registry, which is a credential-specification change.

The cost is the one the specification prints beside every option: a proof grows from under a kilobyte to a few hundred kilobytes. Trust Tasks already carries multi-megabyte payloads, so this is a profile decision (ADR-001's D3), not a blocker.

### What stays off the post-quantum path

The Predicate Credential System route of records 023 and 024 — Pointcheval–Sanders credentials with the Tag_DDH pseudorandom function over BLS12-381 and Schnorr proofs — is pairing-based end to end: credential unforgeability, the proofs' soundness and the tag's key-injectivity (the once-per-tick counting) all fall, and the harvested tag stream becomes linkable once DDH falls, which makes it the one confidentiality exposure in the catalogue. Lattice-based anonymous credentials and blind signatures exist at research grade (credentials of about 80 KB, blind signatures of about 22 KB, buildable with IBM's LaZer library), and ETSI §9.4.1 records that no standardisation effort for post-quantum blind signatures, group signatures or anonymous credentials exists. The honest record for the route is a horizon line saying so, with the hash-based option of the same statement marked as its post-quantum realisation.

Longfellow and the SIROS catalogue prove statements over credentials as issuers already sign them. The argument layer uses only SHA-256 and is plausibly post-quantum; the statement proven is an ECDSA signature, so credential soundness is classical. That is a different route, for credentials DTG does not issue.

### The clocks

None of the published migration timelines mentions zero-knowledge proofs; all of them name the signatures DTG credentials carry today.

| authority | instrument | dates |
|---|---|---|
| NIST | IR 8547 (initial public draft, Nov 2024) | ECDSA, EdDSA and RSA deprecated after 2030, disallowed after 2035; hashes at ≥128-bit stay Category 1 |
| EU | NIS Cooperation Group coordinated PQC roadmap (Jun 2025) | inventories and pilots by end-2026; high-risk and critical systems by end-2030; as much as feasible by 2035 |
| 18 EU agencies | "Securing Tomorrow, Today" (Nov 2024) | hybrid post-quantum for the most sensitive uses by end-2030 |
| UK NCSC | migration timelines (Mar 2025) | 2028 discovery, 2031 priority migrations, 2035 complete |
| US | NSM-10 (2022), CNSA 2.0 | 2035; signing exclusive-post-quantum in national security systems by 2030 |

### What is still unknown

- No peer-reviewed in-circuit cost for any NIST post-quantum signature; the figures above are self-reported.
- No agency document on post-quantum zero-knowledge proofs for digital identity; ETSI TR 119 476-1 §9 is the nearest and it is informative. The EUDI ARF's ZKP topic (v1.4) does not discuss post-quantum.
- No post-quantum anonymous-credential standards track at IETF, W3C, DIF or ToIP. W3C's Quantum-Resistant Cryptosuites draft (June 2026) provides selective disclosure without unlinkability and is marked experimental.
- FIPS 206 timing.
- Whether WHIR, Binius and Stwo have re-parameterised for the proximity-gap results; a measured Flock or WHIR cost row in the evidence repository must say which bound it assumes.

### Where this lands in the specification

Security Considerations item 8 carries the soundness-versus-zero-knowledge split and names the signature as the non-swappable layer. Each construction record carries a *quantum horizon* — which clauses fall to forgery and which, if any, lose confidentiality. Each proving-system entry states post-quantum soundness and post-quantum zero-knowledge separately. WG-18 puts the issuance contract to the task force beside WG-02. The requirements document's LIV-ALG-09 (proposed) makes a profile say where the issuer signature is verified. Sources for every figure in this chapter are kept in the evidence repository's research note of 12 October 2026.
