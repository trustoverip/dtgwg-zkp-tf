## Reading this guide

This guide is a companion to the [DTG ZKP specification](https://trustoverip.github.io/dtgwg-zkp-spec/). The specification is compressed on purpose: each construction record states what a verifier learns, from which inputs, under which assumptions, and what the proof does not establish, and little else. This guide adds the context a first reading needs. It explains where each record fits, how the records compose, and how to read the evidence attached to them. It defines nothing. Where the two differ, the specification is authoritative.

Three reading paths:

- **Building something.** Start with [From a Trust-Graph Outcome to a Proof](#from-a-trust-graph-outcome-to-a-proof), then the walkthrough for your record family, then the record itself.
- **Reviewing a record.** Read its walkthrough in [Construction walkthroughs](#construction-walkthroughs), then the record, then [Reading the evidence](#reading-the-evidence) for what its formal block and runtime do and do not show.
- **Learning the cryptography.** The [Cryptographic Background](#cryptographic-background) runs from what a proof is to how circuits fail in practice. Each part names the records that rely on it.

### How to read a construction record

Every record has the same parts, and each part answers one question:

| part | the question it answers |
|---|---|
| statement | what does the verifier learn, and from whom? |
| witness · public inputs | what does the prover hold privately, and what does the verifier supply and see? |
| relation | which clauses must hold, each bound to one gadget? A composed record's clauses name the primitive records they reuse |
| disclosure set | exactly what is revealed: the public signals plus anything shown alongside |
| does not establish | what a passing proof does **not** mean. Read this before relying on a result |
| adversary · horizon | against whom each privacy claim holds, and until when |
| fixtures · options · issuance | how conformance is tested, which constructions could implement it, and what issuers must do so the witness exists |
| formal verification | where present, a machine-checked model of the relation (see [Reading the evidence](#reading-the-evidence)) |
| state | how far the evidence has come: requested → specified → constructed → run → vetted → published. Evidence states are not adoption |

Primitive records bind exactly one gadget. Composed records combine primitives under one transcript and write their disclosure set and negative space fresh, because proofs that are individually sound can leak jointly.

### From an outcome to a record

| you need to show | read |
|---|---|
| a holder belongs to a community, privately | [001](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-001-%C2%B7-set-membership-over-an-accredited-root) membership, with [004](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-004-%C2%B7-holder-binding-(key-from-secret)) holder binding, [006](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-006-%C2%B7-non-revocation-against-a-status-root) non-revocation and [003](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-003-%C2%B7-transcript-binding) transcript binding |
| a second use in the same context is detectable | [002](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-002-%C2%B7-scoped-nullifier-(reuse-detection)) scoped nullifier |
| two credentials come from different members or issuers | [005](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-005-%C2%B7-distinct-member-%2F-distinct-issuer) distinctness |
| a relationship between two members of a community | [010](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-010-%C2%B7-community-anchored-proof-(adr-001)), the community-anchored proof |
| a relationship between two disclosed personas | [011](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-011-%C2%B7-pairwise-edge-(vrc-possession%2C-directed-personas-shown%2C-pairwise-identifiers-hidden)) pairwise edge |
| identifiers are under one controller | [007](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-007-%C2%B7-common-control-across-identifiers) common control, [012](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-012-%C2%B7-intentional-correlation-%E2%80%94-one-controller-across-k-credentials) across k credentials |
| a hidden field is equal across two credentials | [009](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-009-%C2%B7-hidden-value-equality-across-credentials) hidden-value equality |
| a credential was issued within a particular exchange | [008](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-008-%C2%B7-blinded-binder-(taskcontext-hiding%3B-presentation-correlation-unresolved)) blinded binder, [022](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-022-%C2%B7-blinded-digest-references-%E2%80%94-the-digest-valued-members-of-the-credential-specification%2C-unenumerable-at-rest-and-openable-in-proof) blinded digest references |
| an applicant is admitted on member vouches | [023](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-023-%C2%B7-two-vouch-admission-proof-%E2%80%94-an-applicant-proves-k-%E2%89%A5-2-vouches-from-distinct-current-members-to-the-issuing-community%2C-without-disclosing-which-members) two-vouch admission |
| an applicant is admitted by vetters who stay hidden | [024](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-024-%C2%B7-hidden-vetting-admission-%E2%80%94-an-applicant-proves-k-attestations-from-pairwise-distinct-eligible-vetters-of-the-issuing-community%2C-without-disclosing-which-vetters) hidden-vetting admission |
| a cross-community edge is admissible to both sides before either publishes | [013](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-013-%C2%B7-mutual-edge-admissibility-%E2%80%94-each-half-admissible-under-the-other-community%E2%80%99s-policy%2C-neither-policy-nor-member-revealed) mutual edge admissibility |
| an agent acts for a member, or a party acts under attenuated authority | [020](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-020-%C2%B7-delegation-chain-(vdc)-%E2%80%94-agent-acts-for-a-member) delegation chain, [021](https://trustoverip.github.io/dtgwg-zkp-spec/#construction-021-%C2%B7-authority-chain-(vac)-%E2%80%94-an-agent-or-device-acts-as-itself-under-attenuated-authority) authority chain |

Links point to the published specification. Records added in a revision under review appear there once it merges.
