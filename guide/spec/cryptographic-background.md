## Cryptographic Background

This section is informative.

This section gives the cryptographic background the construction records rely on, in the order a reader needs it: what a proof is and what a transcript binds; fields and curves; constraints, witnesses and public inputs; commitments and the setup question; transparent and hash-based proving; recursion and folding; the commit–membership–nullifier shape every construction inherits; how circuits fail in practice; and agents that prove. It is drawn from the editor's expository work in the agentprivacy body of work ([AGENTPRIVACY], see References), with the expository material carried and nothing else; provenance and licence are in Appendix A. Each subsection states which construction records, public-input conventions or proving-system entries lean on the idea, so a reader who wants only what a given construction needs can stop there.

### P1 · What a proof is, and what a transcript binds

A zero-knowledge proof is a transcript with three properties: it convinces (completeness), it cannot be faked (soundness), and it reveals nothing beyond the statement (zero knowledge). Making it non-interactive — a Fiat–Shamir hash standing in for the verifier's challenge — is exactly why every construction binds a transcript digest: the digest *is* the challenge the proof answers, and a proof that answers a different transcript is a different proof. The common reference string a construction may need is where trust enters before any proof is made.

**Used by:** construction 003 (transcript binding) · public inputs: transcript digest · proving systems: setup column · ePrint 2026/333 Def. 5 (tag-based SE-NIZK: the tag is the transcript)

#### Zero-knowledge proofs: completeness, soundness and zero knowledge

*Covers: ZKP Definition, NIZK, Core Properties, Interactive vs Non-Interactive*

**ZKP Definition:** For a statement S, a protocol between Prover P and Verifier V satisfies:
1. **Completeness:** If S is true, P convinces V with probability ≈ 1
2. **Soundness:** If S is false, P cannot convince V except with negligible probability
3. **Zero-Knowledge:** V learns only that S is true, nothing more

**NIZK:** When V needs no interaction with P—just receives and verifies a proof.

**Historical Note:** First formalized in "The Knowledge Complexity of Interactive Proof Systems" (1985).

**Applied to:** Any ZKP system, self-sovereign identity protocols, privacy architectures

#### Setup and the common reference string

*Covers: Adaptive vs Non-Adaptive Security, Common Reference String, Setup Ceremony*

**Setup Types:**
- **Trusted Setup (per-circuit):** Circuit-specific toxic waste
- **Universal Trusted Setup:** One ceremony, many circuits (e.g., PlonK)
- **Transparent:** No setup needed (e.g., STARKs)

**Security Levels:**
- Non-Adaptive: Adversary commits before seeing CRS
- Adaptive: Adversary sees CRS, then attempts forgery
- Perfect ZK: Simulation indistinguishable even for unbounded adversaries

**Ptau Ceremony:** Multi-party computation where toxic waste is safe unless *all* participants collude.

**Applied to:** Universal setups, ceremony design, transparent systems

#### Non-interactivity: the Fiat–Shamir transformation

*Covers: Fiat-Shamir Transformation, Random Oracle Model, Non-Interactivity*

**Fiat-Shamir Transformation:**
- Converts interactive ZKP to NIZK
- Replaces verifier's random challenge with hash output
- Security relies on Random Oracle Model (ROM)
- Common in practice: Groth16, PlonK, STARKs all use variants

**Hash Function Requirements:**
- Domain separation to prevent cross-protocol attacks
- Include all relevant context in hash
- Cryptographic hash (SHA-256, BLAKE2, Poseidon for in-circuit)

**Vulnerability:** Improper Fiat-Shamir can break soundness (see Frozen Heart vulnerability in Bulletproofs)

**Applied to:** NIZK construction, proof compression, asynchronous verification

### P2 · Fields, curves and why the issuer's signature matters

Every constraint a circuit checks is arithmetic in one finite field, and every signature a credential carries lives on one curve. When the two do not match — an Ed25519 signature checked inside a BN254 circuit — the proof pays for the translation in constraints, seconds and payload. That mismatch is the X3 requirement in construction form: the credential layer must sign, or additionally commit, in a form the proof layer can open cheaply. Binary-field systems change the arithmetic itself: a prover that works in GF(2^k) treats SHA-256 or BLAKE3 as its native operation, which is why the Flock stack — built for Ethereum’s post-quantum transition — can prove the hashes registries already use at under 250× their native cost, and why the hash side of X3 is a stack decision rather than an issuer obligation.

**Used by:** construction 007 / 010 issuance (X3) · cred-spec #17 · proving systems: field column · the legacy-rails class (SIROS Longfellow / Vega) as the case where the issuer cannot change · proving system flock (binary fields; standard hashes at near-native cost)

#### Finite fields, elliptic curves and pairing-friendly curves

*Covers: Finite Fields, Elliptic Curves, Group Theory, Pairing-Friendly Curves*

**Finite Field 𝔽_q:**
- q = p^k elements (p prime)
- Addition and multiplication (mod q)
- Every non-zero element has inverse

**Elliptic Curve Group:**
- Points satisfy y² = x³ + ax + b
- Point addition: geometric line-and-reflect
- Identity element: point at infinity (𝒪)
- Order n: n·P = 𝒪 for all points P

**Pairing e: G₁ × G₂ → G_T:**
- Bilinearity enables equation verification
- Used in Groth16, KZG commitments
- Requires pairing-friendly curves (BN254, BLS12-381)

**Curve Examples:**
- BN254: ~100-128 bit security, common in Ethereum
- BLS12-381: 128-bit security, used in Zcash, Ethereum 2.0
- Pasta (Pallas/Vesta): Recursive-friendly pair

**Applied to:** All pairing-based SNARKs, commitment schemes, recursive proof systems

### P3 · Constraints, witnesses and public inputs — the construction form itself

An arithmetic circuit turns a statement into constraints over a witness. The witness stays with the prover; the public inputs are what the verifier supplies and sees. A construction record's *witness* and *public inputs* are the R1CS split written as fields of the record, so that what leaves the holder is a decision made on the page, not discovered in the code. Constraint counts are the first cost every option row reports.

**Used by:** record fields witness / public inputs / method · options: constraintsOrGates · construction 001 (11,523 constraints measured)

#### Arithmetic circuits and rank-1 constraint systems

*Covers: Arithmetic Circuits, R1CS, Gates, Constraints, Witnesses*

**Arithmetic Circuit:**
- Variables: wires carrying field elements
- Gates: operations (× and + over finite field)
- Constraint: equation that must hold

**R1CS (Rank-1 Constraint System):**
- Standard form: `a × b = c` where a, b, c are linear combinations of wires
- Full form: `(Σ aᵢ·wᵢ) × (Σ bⱼ·wⱼ) = Σ cₖ·wₖ`
- Matrix representation: (A·w) ∘ (B·w) = C·w where ∘ is element-wise product

**Key Concepts:**
- **Witness:** Private values assigned to wires
- **Instance:** Public inputs/outputs visible to verifier
- **Satisfying Assignment:** Witness values that make all constraints hold
- **Constraint Count:** Directly affects prover computation time

**Performance Impact:**
- More constraints → longer proving time
- Expensive operations in circuits:
  - Bit operations (AND, OR, XOR): 1-3 constraints each
  - Hash functions: 20,000-100,000 constraints
  - Signature verification: 50,000-150,000 constraints
  - Range proofs: ~300 constraints per bit

**Applied to:** Circuit design, ZKP optimization, constraint minimization

#### From constraints to polynomials: quadratic arithmetic programs

*Covers: QAP (Quadratic Arithmetic Programs), Polynomial Conversion, Vanishing Polynomial*

**QAP Transformation:**

Given R1CS with n constraints and m wires:

1. Create polynomials for each wire and each position:
   - A_wire(i) = coefficient of wire in left side of constraint i
   - B_wire(i) = coefficient of wire in right side of constraint i  
   - C_wire(i) = coefficient of wire in output side of constraint i

2. Use Lagrange interpolation to extend these to full polynomials

3. Combine with witness values:
   - A(x) = Σ wᵢ · Aᵢ(x)
   - B(x) = Σ wᵢ · Bᵢ(x)
   - C(x) = Σ wᵢ · Cᵢ(x)

4. Vanishing polynomial: Z(x) = ∏ᵢ₌₁ⁿ (x - i)

5. QAP equation: A(x)·B(x) - C(x) = Z(x)·H(x)

**Verification:**
- Check equation at random point τ (chosen by setup)
- Use pairings to verify without revealing polynomials
- Soundness: cheating would require guessing τ (computationally infeasible)

**Degree Analysis:**
- A, B, C have degree ≤ n (number of constraints)
- Z has degree exactly n
- H has degree ≤ n (since A·B has degree ≤ 2n)

**Applied to:** Groth16, Pinocchio protocol, polynomial-based SNARKs

#### Witness and instance; knowledge soundness

*Covers: Public vs Private Inputs, Proof Structure, Knowledge Soundness*

**Formal Definitions:**

**Instance (x):** Public values visible to verifier
- Verification key (vk)
- Public inputs/outputs
- Statement parameters

**Witness (w):** Private values known only to prover  
- Secret inputs
- Intermediate computation values
- Randomness used in proof

**Relation R:** Set of valid (instance, witness) pairs
- R = {(x, w) : C(x, w) = 1} where C is the circuit

**Knowledge Soundness:** For any prover P* that convinces V with probability ε, there exists an **extractor** that can extract a valid witness w with probability ≈ ε.

This is stronger than regular soundness (which just says false statements can't be proven).

**Zero-Knowledge Simulation:** There exists a simulator that can produce proofs indistinguishable from real proofs, without knowing the witness.

**Practical Implications:**
- Witness size doesn't affect proof size (in SNARKs)
- Multiple provers with same witness produce different proofs (randomization)
- Verifier learns only: "statement is true"

**Applied to:** All ZKP systems, credential design, privacy protocols

### P4 · Commitments and the setup question

A commitment binds a value now and hides it until opened; polynomial commitments do this for whole computations. Which commitment a stack uses decides its trust story: KZG gives constant-size proofs but needs a trusted setup whose toxic waste must be destroyed; hash-based commitments need no ceremony but cost proof size. The lab's fixed-entropy setup is unusable for production for exactly this reason, and the registry treats setup-chain digests as advisory because a real ceremony is machine-local by design.

**Used by:** proving systems: setup / postQuantum columns · construction 001 KZG substitution (paper §3.7 hiding KZG, HR-6) · registry: advisory setup chain · runtimes/ceremony-orchestrator

#### Pairings, Groth16 and KZG commitments

*Covers: Bilinear Pairings, Groth16, KZG Commitments, Pairing-Based SNARKs*

**Pairing Properties:**
```
e(P + P', Q) = e(P, Q) · e(P', Q)   (left linearity)
e(P, Q + Q') = e(P, Q) · e(P, Q')   (right linearity)  
e(aP, bQ) = e(P, Q)^(ab)            (bilinearity)
e(P, Q) = 1_GT ⟺ P = O or Q = O    (non-degeneracy)
```

**Groth16 Proof:**
- Proof = ([A], [B], [C]) ∈ G₁ × G₂ × G₁
- Size: 128 bytes (BN254) or 192 bytes (BLS12-381)
- Verification: 3 pairings + small arithmetic
- Setup: Circuit-specific, requires τ destruction

**KZG Polynomial Commitment:**
```
Commit:  C = g^φ(τ)
Open:    q(x) = (φ(x) - y)/(x - a)
Proof:   π = g^q(τ)
Verify:  e(C / g^y, g) = e(π, g^τ / g^a)
```

**Security:**
- Relies on q-SDH (q-Strong Diffie-Hellman) assumption
- Trusted setup: τ must be destroyed
- Multi-party ceremony: safe if ≥1 participant is honest

**Practical Curves:**
- **BN254:** ~100-128 bit security, Ethereum's choice, faster
- **BLS12-381:** 128-bit security, future-proof, Ethereum 2.0

**Applied to:** Groth16, KZG, PlonK with KZG backend, Ethereum L2s

#### Polynomial commitment schemes: binding, hiding and their trade-offs

*Covers: Polynomial Commitment Schemes, Hiding vs Binding, PCS Properties*

**PCS Interface:**
```
Setup(λ, n) → pp (public parameters)
Commit(pp, φ(x), r) → C (commitment)  
Open(pp, φ, a, C, r) → (y, π) where y = φ(a)
Verify(pp, C, a, y, π) → accept/reject
```

**Properties Required:**
1. **Binding:** Cannot open to different y' ≠ φ(a)
2. **Hiding:** C reveals nothing about φ (computational or information-theoretic)
3. **Evaluation binding:** Cannot produce valid proof for wrong evaluation

**Comparison Table:**

| PCS | Commit | Proof | Verify | Setup | Quantum-Safe |
|-----|--------|-------|--------|-------|--------------|
| KZG | O(n log n) | O(1) 48B | O(1) pairing | Trusted | ✗ |
| IPA | O(n) | O(log n) | O(log n) | Transparent | ✗ |
| FRI | O(n log n) | O(log²n) | O(log²n) | Transparent | ✓ |

**Where n = degree of polynomial**

**Used In:**
- KZG: PlonK, Groth16, most Ethereum L2s
- IPA: Halo2, Bulletproofs
- FRI: STARKs (StarkNet, Polygon Miden, Risc Zero)

**Applied to:** All modern SNARKs, data availability, verifiable secret sharing

#### Universal setups and powers-of-tau ceremonies

*Covers: Universal vs Circuit-Specific Setup, Trusted Setup Ceremonies, Powers of Tau, MPC*

**Powers of Tau Structure:**

Setup produces:
```
G₁: [g^1, g^τ, g^(τ²), ..., g^(τ^N)]
G₂: [h^1, h^τ, h^(τ²), ..., h^(τ^N)]
```

**Circuit-Specific Key Derivation (PlonK):**

Given universal parameters and circuit description:
```
1. Compute selector polynomials: q_L, q_R, q_O, q_M, q_C
2. Compute permutation polynomial: σ
3. Derive: [q_L(τ)], [q_R(τ)], [σ(τ)], etc. using universal params
4. All computation public—no secrets needed!
```

**Security Analysis:**

**Trust Assumptions:**
- Groth16: Trust all 6 ceremony participants
- Universal (1-of-N): Trust ≥1 of N participants
- Transparent: Trust cryptographic assumptions only

**Probability of Compromise:**
- If p = probability any single participant is honest
- n participants
- Probability of compromise: (1-p)^n

Example: p=0.1 (only 10% honest), n=100
→ Compromise probability: 0.9^100 ≈ 0.000026 (extremely low)

**Real Ceremonies:**

**Perpetual Powers of Tau:**
- Phase 1: 87 contributors (2017-2018)
- Phase 2: 300+ contributors (ongoing)
- Total entropy: 400+ independent randomness sources
- Supports up to 2^28 (~268M) constraints
- Used by: Aztec, Hermez, Tornado Cash, zkSync

**Circuit-Specific Examples:**
- Zcash Sprout: 6 participants
- Zcash Sapling: 90+ participants  
- Loopring: Separate ceremony

**Applied to:** Practical SNARK deployment, production systems, ceremony planning

#### Trusted-setup failure modes and toxic waste

*Covers: Security Vulnerabilities, Trusted Setup Failures, Circuit Bugs, Audit Practices*

**Setup Vulnerabilities:**

**Attack Model:**
```
Attacker possesses τ from compromised ceremony
Can compute:
- g^(φ(τ)) for any polynomial φ
- Valid proofs for any statement (true or false)
```

**Detection:** Impossible (zero-knowledge property hides forgery)

**Mitigation:**
- Multi-party computation (1-of-N trust)
- Transparent systems (no τ exists)

**Parameter Vulnerabilities:**

**Common Weaknesses:**
- Insufficient FRI queries (STARK soundness)
- Small field size (brute force attacks)
- Weak Fiat-Shamir hash (domain separation issues)
- Reduced security parameters for performance

**Example: FRI Soundness**
```
Claimed degree: d
Domain size: n
Queries: k

Soundness error ≈ (d/n)^k

Required: (d/n)^k < 2^(-λ) for λ-bit security
```

**Circuit Vulnerabilities:**

**Under-Constraint Example:**
```circom
template Multiplier() {
    signal input a;
    signal input b;
    signal output c;
    
    c <-- a * b;  // BUG: only assignment, no constraint
}

// Fix:
c <== a * b;  // constraint with automatic witness
// or explicitly:
c === a * b;
```

**Audit Checklist:**
- [ ] All signals properly constrained
- [ ] Range checks on all bounded values
- [ ] No overflow/underflow possible
- [ ] Private inputs truly private
- [ ] Public inputs properly exposed
- [ ] Edge cases tested
- [ ] Malicious prover tests

**Cryptanalytic Risks:**

**Current Assumptions:**
- Discrete Log Problem (DLP)
- Computational Diffie-Hellman (CDH)
- Decisional Diffie-Hellman (DDH)
- q-Strong Diffie-Hellman (q-SDH)
- Knowledge of Exponent (KEA)

**Post-Quantum Status:**
- Pairing-based SNARKs: Broken by Shor's algorithm
- Hash-based (FRI): Quantum-resistant
- IPA/Bulletproofs: Broken by Shor's algorithm

**Applied to:** Security audits, production deployment, risk assessment, long-term system design

### P5 · Transparent and hash-based proving

Where a pairing-based SNARK buys tiny proofs with a ceremony, transparent systems buy the absence of a ceremony with larger proofs: FRI and its descendants (WHIR) commit to evaluations with Merkle trees and test low degree by queries; sumcheck-based provers (Spartan) trade prover memory for round-by-round polynomial checks; inner-product arguments (Bulletproofs, Halo2) sit between. This is the axis on which ProveKit's numbers read: ~2.5 MB of proving payload and a 716 KB proof against Groth16's hundreds of megabytes and 1 KB. Flock sits at the far end of this axis: a hash-based, transparent SNARK for batches of Boolean computation whose whole purpose is to make standard hashes cheap to prove — the property Ethereum needs to aggregate hash-based signatures after the quantum transition, and the property a trust graph needs if its roots and digests are to stay on ordinary hashes.

**Used by:** proving system provekit (Noir → WHIR/Spartan) · options: proofKB vs payloadMB · ADR-001 D1/D3 · proving system flock (Ligerito commitment, binary fields, transparent, post-quantum rationale) · the Flock subsection below — this section’s post-quantum case

#### FRI and hash-based low-degree testing

*Covers: Fast Reed-Solomon IOP, Low-Degree Testing, Proximity Proofs, STARKs*

**FRI Protocol Formally:**

Given claimed polynomial φ(x) of degree ≤ d over domain D:

**Commit Phase:**
```
Round 0: Commit to φ₀(x) = φ(x) evaluations via Merkle
For i = 0 to log(d):
    Receive random challenge αᵢ
    Compute φᵢ₊₁(x) = φᵢ_even(x) + αᵢ · φᵢ_odd(x)
    Commit to φᵢ₊₁ evaluations via Merkle
Until φ_final is constant
```

**Query Phase:**
```
For j = 1 to num_queries:
    Choose random index r
    For each layer i:
        Request φᵢ(r) and φᵢ(-r) with Merkle proofs
        Verify: φᵢ₊₁(r²) = (φᵢ(r) + φᵢ(-r))/2 + αᵢ·(φᵢ(r) - φᵢ(-r))/(2r)
```

**Security:**
- Soundness error: (d/|D|)^num_queries
- Typical: 20-40 queries for 100+ bit security
- Proof size: O(n · log(n) · log(d)) where n = |D|

**STARK Stack:**
- **AIR (Algebraic Intermediate Representation):** Constraint system for execution traces
- **Trace polynomial:** Encodes computation as polynomial
- **Quotient polynomial:** Proves constraints satisfied
- **FRI:** Proves all polynomials are low-degree

**Performance (Fibonacci 1M iterations):**
- Proving time: ~2-5 seconds
- Proof size: ~150 KB
- Verification: ~10-30 ms
- **No setup required**

**Real Systems:**
- StarkWare: StarkNet, StarkEx
- Polygon: Polygon Miden (zkVM)
- RiscZero: Rust zkVM
- Winterfell: STARK library

**Applied to:** STARKs, quantum-resistant ZKP, long-term archival, trustless systems

#### The sumcheck protocol and GKR

*Covers: Sumcheck Protocol, Interactive Proofs, GKR Protocol, Multilinear Extensions*

**Sumcheck Protocol:**

Prover claims: H = Σ_{x∈{0,1}ⁿ} g(x₁, ..., xₙ)

```
For i = 1 to n:
    Prover sends: gᵢ(Xᵢ) = Σ_{xᵢ₊₁,...,xₙ ∈ {0,1}} g(r₁,...,rᵢ₋₁,Xᵢ,xᵢ₊₁,...,xₙ)
    
    Verifier checks: 
        gᵢ(0) + gᵢ(1) = previous_sum (or H if i=1)
        
    Verifier sends: random challenge rᵢ ← 𝔽
    
    Update: previous_sum ← gᵢ(rᵢ)
    
End: Verifier checks g(r₁,...,rₙ) = gₙ(rₙ) by evaluating directly
```

**Complexity:**
- Rounds: n
- Communication: n polynomials of degree d
- Verifier time: O(n · d)
- Soundness error: n · d / |𝔽|

**Multilinear Extension:**

Any f: {0,1}ⁿ → 𝔽 extends uniquely to f̃: 𝔽ⁿ → 𝔽 where:
```
f̃(x₁,...,xₙ) = Σ_{b∈{0,1}ⁿ} f(b) · ∏ᵢ χᵢ(xᵢ, bᵢ)
χᵢ(x,0) = 1-x, χᵢ(x,1) = x
```

**Applications:**
- **GKR:** Verifiable circuit evaluation
- **Spartan:** SNARK based on sumcheck
- **Hyrax:** Doubly-efficient IPs
- **HyperNova:** Used in folding
- **zkVMs:** Memory consistency checks

**Performance Example (2²⁰ sum):**
- Direct computation: 1M evaluations
- Sumcheck rounds: 20
- Verifier work: ~100 field operations
- **~10,000x speedup**

**Applied to:** Polynomial verification, GKR protocol, zkVMs, memory checking

#### Inner-product arguments and transparent setups

*Covers: Inner Product Arguments, Bulletproofs, Halo2, Transparent Setups*

**IPA Protocol (Simplified):**

Given commitment C to vector a, claim ⟨a,b⟩ = z:

```
Setup: G = (G₁,...,Gₙ), H (random curve points)
Commitment: C = Σ aᵢGᵢ + rH

For k = 1 to log₂(n):
    Split: a = (aₗ || aᵣ), b = (bₗ || bᵣ)
    
    Compute: L = ⟨aₗ,bᵣ⟩·G + random·H
             R = ⟨aᵣ,bₗ⟩·G + random·H
    
    Send L, R to verifier
    
    Receive challenge: u
    
    Fold: a ← aₗ + u⁻¹aᵣ
          b ← ubₗ + bᵣ  
          G ← Gₗ + uGᵣ
          
Final: Send (a,b) (now scalars), verify ⟨a,b⟩ matches folded relation
```

**Complexity:**
- Proof size: 2·log₂(n) curve points + 2 scalars
- Prover time: O(n log n)
- Verifier time: O(n) (must reconstruct G through folding)

**Bulletproofs Range Proof:**
- Claim: v ∈ [0, 2ⁿ)
- Prove v = Σ vᵢ2ⁱ where vᵢ ∈ {0,1}
- Convert to inner product relation using Hadamard product
- Size: 2log₂(n) + 7 curve points

**Halo 2 Stack:**
- Circuits: PlonKish (custom gates, lookup tables)
- Polynomial commitment: IPA
- Curves: Pasta (Pallas/Vesta pair)
- Recursion: Cycle between Pallas and Vesta

**Real Systems:**
- Monero: Uses Bulletproofs for confidential amounts
- Zcash: Halo 2 in Orchard shielded pool  
- Mina: Previous recursion (now transitioning)
- Scroll: Halo 2 variant for zkEVM

**Applied to:** Transparent SNARKs, range proofs, recursive composition without pairings

#### Binary-field SNARKs for standard hash functions (Flock)

*Covers: Binary Fields, Batched Boolean Proofs, Standard Hash Functions, Ligerito Commitments, Post-Quantum Signatures, Ethereum's Quantum Transition, The Counting Triple (23 + 38 = 61)*



### P6 · Recursion and folding — chains of delegation

A proof can verify another proof. Folding schemes (Nova) accumulate many steps into one instance; recursive verifiers wrap a large transparent proof in a small pairing-based one for a verifier that needs 1 KB. For the trust graph this is the shape of a delegation chain: each hop's grant nests inside its parent's, and the chain is proven either hop-by-hop with folding or flattened into one circuit. PLONKish arithmetisation with custom gates and lookups is the counter-proposal the lab's Groth16 baseline invites through the same gate.

**Used by:** construction 020 (chain-resolve gadget) · proving system provekit: Groth16 recursive wrapper · options: recursion column · PATH-MAP P4: PLONKish/folding counter-proposal welcome

#### PLONKish arithmetisation: custom gates, lookups and permutation arguments

*Covers: PlonK, Custom Gates, Lookup Tables, Copy Constraints, Permutation Arguments*

**PlonK Gate Equation:**
```
qL·a + qR·b + qO·c + qM·(a·b) + qC = 0
```

Where q values are public selectors that configure gate behavior.

**Ultra PlonK Extensions:**
- Higher-degree gates: q₁·a² + q₂·b³ + ... = 0
- Custom gates: Specialized equations for common operations
- Lookup arguments: Plookup, LogUp for table queries

**Permutation Argument (Copy Constraints):**
- Mark wires that should be equal: {w₁, w₅, w₁₂}
- Prove they form a permutation of their values
- Uses polynomial identity testing
- Much cheaper than constraint-per-equality

**Lookup Tables (Plookup):**
1. Prover claims lookups in table T
2. Create sorted list of lookups
3. Prove sorted list is a subset of T using permutation
4. Single polynomial check verifies all lookups

**Efficiency Gains:**
- Poseidon hash: 20x fewer constraints vs R1CS
- Range checks: 100x fewer constraints with lookups
- Bit operations: 10x fewer constraints with custom gates
- Universal setup: One ceremony for all circuits

**PlonK Variants:**
- TurboPLONK: Higher-degree custom gates
- UltraPLONK: + lookup tables
- PlonKup: Lookup-optimized
- Halo2: PlonKish + IPA backend

**Applied to:** Modern zkEVM, hash-heavy circuits, bit operations, range proofs

#### Folding schemes and incrementally verifiable computation

*Covers: Nova, IVC (Incrementally Verifiable Computation), Folding Schemes, Relaxed R1CS*

**Relaxed R1CS:**
```
Standard: (Az) ∘ (Bz) = Cz
Relaxed:  (Az) ∘ (Bz) = u·Cz + E

Where:
- z: witness vector
- u: scalar (initially 1)
- E: error vector (initially 0)
```

**Folding Operation:**
```
Given (z₁, u₁, E₁) and (z₂, u₂, E₂), random r:

z' = z₁ + r·z₂
u' = u₁ + r·u₂  
E' = E₁ + r·T + r²·E₂

Where T = (Az₁)∘(Bz₂) + (Az₂)∘(Bz₁) - u₁·Cz₂ - u₂·Cz₁
```

**Nova IVC:**
```
Initialize: z₀ = initial state
For i = 1 to n:
    Compute: z_i = F(z_{i-1})  (single step)
    Fold: (z_folded, u, E) ← fold(z_folded, z_i, r_i)
    
Final: Prove (z_folded, u, E) satisfies relaxed R1CS using SNARK
```

**Performance (1M Fibonacci steps):**
- Nova folding per step: ~0.5ms
- Traditional recursive verification per step: ~50ms
- **100x faster accumulation**
- Final proof: Standard SNARK size (~128-192 bytes)

**Variants:**
- **Nova:** Single function, 2 curves
- **SuperNova:** Multiple functions, more flexibility
- **HyperNova:** High-degree gates, better for complex ops
- **ProtoStar:** Non-uniform IVC

**Applications:**
- zkVMs (Nexus, Lurk)
- Blockchain state proofs
- Streaming verification
- Parallelizable computation trees

**Applied to:** IVC, zkVMs, long-running computations, streaming proofs, verifiable history

#### Recursive proof composition and cycles of curves

*Covers: Recursive ZKP, Proof Composition, Pasta Curves, SSSA Attack, Proof Carrying Data*

**Recursive Verification Challenge:**

To verify a pairing-based SNARK in-circuit requires:
1. Elliptic curve point additions (1,000-5,000 constraints each)
2. Scalar multiplications (10,000-50,000 constraints each)
3. Pairing operations (100,000-200,000 constraints)
4. Field arithmetic in non-native field (expensive)

Total: ~100,000-500,000 constraints per verification

**Pasta Curves Solution:**

**Pallas:**
- Base field: F_p where p = 28948022309329048855892746252171976963363056481941560715954676764349967630337
- Scalar field: F_q where q = 28948022309329048855892746252171976963363056481941647379679742748393362948097

**Vesta:**
- Base field: F_q (Pallas's scalar field)
- Scalar field: F_p (Pallas's base field)

This enables:
```
Pallas circuit → Pallas proof → verify in Vesta circuit → Vesta proof → verify in Pallas circuit → ...
```

**Performance Comparison:**

| Approach | Constraints/Verification | Recursion Strategy |
|----------|--------------------------|-------------------|
| Direct pairing verification | ~200,000 | Single curve (hard) |
| Pasta cycle | ~100,000 | Alternate curves |
| Nova folding | ~1,000 | Avoid full verification |
| STARK-in-STARK | ~50,000 | Hash-based, same field |

**Applications:**

**Blockchain Compression (Mina):**
- Constant-size blockchain: ~22 KB
- New nodes verify only latest recursive proof
- Full history proved through recursion

**Proof Aggregation:**
- Combine n proofs into 1
- Used in zkRollup batch submission
- Reduces L1 verification cost by n

**Proof-Carrying Data:**
- Distributed computation with provenance
- Each message proves valid derivation
- Applications: supply chain, audit trails

**Applied to:** Blockchain compression, proof aggregation, proof-carrying data, recursive composition, large recursive-proof architectures

#### Cyclic recursion and circuit identity

*Covers: Cyclic Recursive ZKP, Self-Referential Circuits, Circuit Identity Verification*

**Cyclic Recursion Construction:**

```
Circuit C {
    Inputs:
        - new_state: current computation
        - prev_proof: previous proof from C
        - circuit_identity: claimed hash of C
        
    Constraints:
        1. Verify prev_proof is valid SNARK proof
        2. Extract "circuit_hash" from prev_proof's public inputs
        3. Check: circuit_hash = circuit_identity
        4. Check: circuit_identity = hash(description of C)
        5. Compute new state from old state
        6. Output new_state and circuit_identity as public inputs
}
```

**Why It Works:**

- Circuit hash is a fixed value once circuit is defined
- Hash verification can be embedded without changing the hash
- Public inputs carry circuit identity forward
- Each proof attests to circuit identity, creating trust chain

**Performance:**

- Additional cost: ~30,000-50,000 constraints for hash verification
- Typically uses Poseidon hash (ZK-friendly)
- Amortized over many iterations

**Real Systems:**

**Mina Protocol:**
- Uses cyclic Pickles proving system
- Constant-size blockchain (~22 KB)
- Each block proves entire history
- Circuit: validate block + verify previous proof

**Incrementally Verifiable Computation:**
- Same circuit, different inputs each step
- Final proof validates entire computation
- Used in some zkVM designs

**Limitations:**

1. **Homogeneous computation:** All steps must fit same circuit
2. **No circuit upgrades:** Changing circuit breaks the cycle
3. **Initial proof:** Need base case (can use dummy proof)

**Applied to:** Blockchain compression, homogeneous state machines, constant-space verification

### P7 · Commit, prove membership, nullify — the shape every construction inherits

The mixer circuit is the ancestor of every construction in this specification: commit to a secret, insert the commitment in a Merkle tree, later prove membership of a hidden leaf under the public root and emit a nullifier derived from the secret so the same leaf cannot be spent twice — without revealing which leaf. Replace 'deposit' with 'membership grant', 'pool' with 'community root', 'withdrawal' with 'presentation', and 'spent twice' with 'presented twice in one context' and you have constructions 001 and 002 exactly; the compliance variant — in the pool and *not* in the sanctions list — is construction 006's non-membership. The anonymity set is the size of the community root; the relayer is the mediator.

**Used by:** construction 001 (set membership) · construction 002 (scoped nullifier) · construction 006 (non-revocation) · lab circuit nullifier_membership (the same shape, measured) · runtimes/mediator (the relayer's role, as a trust task)

#### Shielded transactions: commitments, nullifiers and Merkle trees (Zcash)

*Covers: Shielded Transactions, JoinSplit, Sapling, Orchard, Privacy Pools*

**Note Structure (Sapling):**

```
Note = (value, addr, rho, rcm)
- value: amount (64 bits)
- addr: payment address (diversified)
- rho: unique to prevent linkability
- rcm: commitment randomness

Commitment: cm = PedersenCommit(value, addr, rho, rcm)
Nullifier: nf = PRF(spending_key, rho)
```

**Spend Circuit (Sapling):**

```
Public inputs:
- rt: Merkle root (commitment tree)
- nf: nullifier
- rk: randomized verification key
- cv: value commitment

Private inputs:
- path: Merkle path
- value: note value
- addr: payment address
- rho, rcm: note secrets
- alpha: randomness

Constraints:
1. Commitment valid: cm = COMM(value, addr, rho, rcm)
2. Merkle path valid: path leads from cm to rt
3. Nullifier correct: nf = PRF(sk, rho)
4. Value commitment: cv = PedersenCommit(value, rcm_v)
5. Signature key: rk = SpendAuthSig(sk, alpha)

Total: ~170,000 constraints
```

**Privacy Pool Proof:**

```
Public inputs:
- pool_root: Merkle root of approved addresses
- tx_proof: Normal shielded tx proof

Private inputs:
- source_address: where funds actually came from
- membership_path: Merkle path proving source_address ∈ approved set

Constraints:
1. tx_proof.verify() == true (valid shielded transaction)
2. MerkleVerify(source_address, membership_path, pool_root) == true
3. Bind source_address to transaction (via commitment)

Result: Privacy maintained, compliance proven
```

**Performance Comparison:**

| Version | Circuit Size | Proof Time | Setup | Year |
|---------|--------------|------------|-------|------|
| Sprout | 2.3M | ~60s | Trusted (6) | 2016 |
| Sapling | 170K | ~7s | Trusted (90) | 2018 |
| Orchard | ~100K | ~3s | Transparent | 2021 |

**Real-World Impact:**

- ZEC market cap: ~$500M-1B
- Shielded transactions: ~5-20% of volume
- Privacy adoption: Growing but still minority
- Regulatory pressure: Delisting from some exchanges
- Technical legacy: Influenced Tornado Cash, Aztec, many privacy protocols

**Applied to:** Privacy protocols, compliant anonymity, financial privacy, note-based privacy systems

#### Mixers: anonymity sets, deposit–withdraw and set non-membership

*Covers: Mixing Services, Anonymity Sets, Deposit/Withdraw, Sanctions, Decentralized Privacy*

**Tornado Smart Contract (Simplified):**

```solidity
contract TornadoCash {
    uint256 public denomination;  // Fixed: 1 ETH
    uint32 public levels = 20;    // Merkle tree depth
    
    // Merkle tree
    bytes32[] public filledSubtrees;
    bytes32 public currentRootIndex;
    mapping(bytes32 => bool) public roots;  // Historical roots
    
    // Deposits and withdrawals
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifierHashes;
    
    IVerifier public verifier;  // Groth16 verifier contract
    
    function deposit(bytes32 _commitment) external payable {
        require(msg.value == denomination);
        require(!commitments[_commitment]);
        
        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;
        
        emit Deposit(_commitment, insertedIndex, block.timestamp);
    }
    
    function withdraw(
        bytes calldata _proof,
        bytes32 _root,
        bytes32 _nullifierHash,
        address payable _recipient,
        address payable _relayer,
        uint256 _fee
    ) external {
        require(!nullifierHashes[_nullifierHash]);
        require(isKnownRoot(_root));
        require(verifier.verifyProof(
            _proof,
            [uint256(_root), uint256(_nullifierHash),
             uint256(_recipient), uint256(_relayer), _fee]
        ));
        
        nullifierHashes[_nullifierHash] = true;
        _recipient.transfer(denomination - _fee);
        if (_fee > 0) _relayer.transfer(_fee);
        
        emit Withdrawal(_recipient, _nullifierHash, _relayer, _fee);
    }
}
```

**Circuit Constraints:**

```
Tornado Circuit (Circom):
- Poseidon hash: ~150 constraints per hash
- Merkle proof (depth 20): 20 × 150 = 3,000 constraints
- Nullifier computation: ~150 constraints
- Commitment verification: ~150 constraints
Total: ~4,000 constraints

Proof time: ~1-2 seconds
Proof size: 128 bytes (Groth16 on BN254)
Gas cost: ~300,000 gas to verify
```

**Anonymity Set Analysis:**

```
Pool with N deposits:
- Each withdrawal is 1 of N
- Anonymity: N-1 others
- Probability of identification: 1/N

But timing analysis can reduce:
- Deposit → immediate withdraw: Obvious
- Deposit → wait for 100+ deposits → Good
- Use multiple pools → Better

Best practice: Wait for large anonymity set
```

**Real Statistics (Before Sanctions):**

- Total volume: ~$7-10 billion
- Number of deposits: ~500,000+
- Average per-pool size: 5,000-50,000 deposits
- Typical anonymity set: 1,000-10,000 (good)
- Relayer fee: 0.3-0.5%

**Applied to:** Privacy mixers, anonymity sets, decentralized privacy, compliance challenges

### P8 · Circuits in practice and their failure modes

Circom's signals, templates and constraint compilation are what the lab's three circuits are written in; the vulnerability codex is why the book's rule is what it is. Under-constrained signals, unchecked booleanity, audited interfaces that are not the shipped interfaces, setup failures — none of these is caught by a proof verifying. Reproduction on a stranger's machine catches the build; behavioural fixtures catch the properties; neither is an audit, and every record says so.

**Used by:** stack lab-groth16-circom · requirements v0.4 §16.1 audit scope ('audited MUST name the reviewed commit and file set') · NOTE-2026-08-19 zk-kit evaluation (MultiMux1 booleanity; audited-commit drift) · registry: reproduction ≠ audit

#### Circom: signals, templates and R1CS compilation

*Covers: Circom Language, R1CS Compilation, Signal Types, Templates, Circuit Composition*



#### Vulnerability classes and audit practice

*Covers: Security Audits, Bug Bounties, Formal Verification, Circuit Review, Production Hardening*



### P9 · Agents that prove: the separation of proving from acting

An agent acting for a person can carry proofs the person could make, within a scope the person granted, without the verifier learning who the person is. That is construction 020's statement and the reason the task force answers delegation early: chain resolution is a disclosure boundary of the same kind as completion evidence, and an agent that cannot prove its bounds is an agent nobody should accept a presentation from. The tooling that produced this specification runs under the same rule at a different scale: an assistant composes, reconstructs and drafts; a person signs, admits and publishes.

**Used by:** construction 020 (delegation chain) · construction 004 (holder binding) · cred-tf #40 (delegation as a design-time case) · the mediator instrument of the evidence repository (proving tiers; the four exits from a failed local proof) · AGENT-RUNTIMES.md (dtgwg-zkp-tf PR #21) · ePrint 2026/333 App. B.1 (AI agent reputation)

#### The separation of proving from acting

An agent presents on a person's behalf in two roles, and the constructions in this specification assume the two are held by two distinct processes.

```
principal — holds the credentials and the holder secret
   │  issues a delegation: scope, validity, and an acceptance the delegate countersigns
   ▼
acting process ── composes presentations, chooses what to disclose, requests signatures ──▶ verifier
   │              never holds the holder secret; sees only what it composes
   ▼
boundary process ── holds the holder secret and keys; signs only acts that are in scope, chained to the
                    delegation, and not already signed; keeps an append-only record of what it signed;
                    refuses everything else — as values, never as errors
```

The boundary process is the party that can be held to the drafting rules. It knows the adversary it protects against — the acting process itself and everything the acting process talks to — the horizon of every key it holds, and what it does not establish: that an act was wise, only that it was in scope. The acting process is the party that can be delegated, replaced, or run by a third party without the secret leaving the holder. What passes between them is a request and a signature; what never passes is the secret. A verifier sees a proof that an agent acting for a member of a recognised community did so within a stated scope before a stated time — construction 020 — and learns neither which member nor what else the agent may do.

Construction records use this separation without naming it. The witness of every record is what the boundary process holds; the disclosure set is what the acting process is permitted to compose; holder binding (construction 004) is the clause that ties the two to one secret. The mediator instrument in the evidence repository specifies the tiers at which a third party may run the acting process — a mediator that proves on the holder's behalf must be unable to learn the witness or to correlate presentations — and the four exits from a failed local proving attempt, none of them silent.

