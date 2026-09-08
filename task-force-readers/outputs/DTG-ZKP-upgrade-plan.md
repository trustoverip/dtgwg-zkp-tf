# DTG ZKP specification upgrade plan

Prepared 8 September 2026. Proposed work programme, not an adopted specification or publication authorization.

## Outcome

**Operating model: a continuous research-and-integration loop.** The workstreams below are the initial backlog for a recurring process. Every cycle connects changes in the ToIP workspace to use cases, specification clauses, book explanations, executable evidence and discussion responses. A release is a checkpoint in that loop, not its end. The reader presents this process and its accumulated findings, rather than only a queue of outgoing posts.

The companion [research loop design](DTG-ZKP-research-loop.md) defines cycle stages, durable state, evidence gates, update presentation and the initial bounded research queue.

Make the ZKP specification the bridge between a trust-graph requirement, the credentials expressing that relationship, the Trust Task exchanging a proof, and an implementation whose evidence can be checked. Maintain a readable Book of ZKPs from the same construction records. Bring discussion comments, objections and resolutions into this process as first-class evidence.

The immediate milestone is a coherent review packet for the next working-group session. The subsequent milestone is a reproducible first proof with an explicit credential and task binding. A completed public release should include the spec document, task-force evidence, and targeted discussion updates sharing the same release manifest.

The critical distinction throughout is that proof verification, policy acceptance, task execution and receipt verification are different events. A valid proof establishes its specified statement over authenticated inputs; it does not establish an issuer's real-world truthfulness, unique humanity, authorization for every action, or successful execution.

## Baseline and immediate findings

The local specification already has a useful foundation: generated construction records, disclosure and negative-space descriptions, an evidence ladder, and portable conformance generation. The inspected inventory contains 12 records: four marked constructed and eight carded. None is currently marked run, vetted or published. Individual circuit experiments must not be presented as reproduction of a complete composed construction.

The records cover membership (001), nullifiers (002), transcript binding (003), holder binding (004), distinct members/issuers (005), non-revocation (006), common control (007), blinded binding (008), community-anchored presentation (010), pairwise presentation (011), intentional correlation (012), and delegation chains (020).

The main gaps are precise interoperability rules, complete credential-authenticity bindings, operational root governance, and evidence for composed proofs. The body also puts roughly a thousand lines of cryptographic background ahead of public-input conventions. It needs an earlier explanation of what a graph builder actually does.

The local vendored credential material includes retired identifier terminology. Pin current upstream revisions before reconciling semantics; do not treat that vendor directory as the current credential specification. The inspected ZKP introduction targets WD02, which is a claimed dependency requiring verification against the selected baseline.

The retrieved Trust Tasks framework identifies itself as a draft and defines task-specific payloads separately from document integrity. Its top-level `proof` is not a generic slot for this ZKP presentation. Some response forms are reserved rather than fully specified in that revision. Pin the actual revision and define the ZKP task profile explicitly. [Trust Tasks framework](https://raw.githubusercontent.com/trustoverip/dtgwg-trust-tasks-tf/main/SPEC.md)

OpenVTC describes a VTA responsible for keys, identifiers and access policy, with VTC membership functionality built above it. Its workspace includes task definitions and a manifest. This is a useful integration boundary, but repository-level descriptions do not demonstrate that the proposed ZKP protocol already exists. Inspect the pinned implementation before naming supported endpoints or claiming interoperability. [OpenVTC repository](https://github.com/OpenVTC/verifiable-trust-infrastructure)

The reader has already received local review, revision-binding, receipt, pagination and generation fixes. The recorded checks passed, but its last attempted live survey lacked a token. Its publication reports remain unverified until checked against GitHub. The Windows specification renderer also needs its source-branch metadata fixed before publication. See [reader change record](reader-changes.md).

## 1. Establish one baseline and a traceable decision record

### Primary reading and verifier evidence

Treat the [DTG credential specification](https://github.com/trustoverip/dtgwg-cred-spec) as the source for credential meaning and its declared conformance requirements. Treat the ZKP Mage source, particularly `CRED-SPEC-COHERENCE.md`, `CIRCUITS.md`, the canonical/fixture consumers, registry manifest and verifier code, as the evidence for what has actually been modelled and checked. Reconcile their revisions: the Mage runtime README still contains older identifier terminology and an older repository-layout description.

The inspected Mage `runtimes/circom-gadget/verify-run.mjs` is specifically a **submitted build-report acceptance checker**. It compares reported pinned artifact digests, sizes and constraint metadata to a manifest. Setup-chain digests can be advisory because local setups include randomness. It does not itself run Groth16 verification, rerun the reported suites, authenticate a submitter or prove independent reproduction. Preserve separate records for report acceptance, actual cryptographic verification, observed test execution, and independent provenance.

Reuse the existing nullifier/membership/transcript circuit and cross-language canonical fixtures as the first demonstration baseline. The next first-proof milestone means the **first credential-bound end-to-end profile**, not the first circuit ever built. Measure the gap from that existing implementation to issuer authenticity, holder binding, revocation and the selected Trust Task exchange. Before promoting its transcript binding, review both circuit constraints and verifier-side semantic checks; a field being bound to a proof does not establish that it encodes the intended request correctly.

**Deliverables:** source manifest, terminology crosswalk, issue register, discussion/comment index.

- Pin commit IDs for the credential spec, ZKP spec, task-force requirements, Trust Tasks and OpenVTC. Record dirty local changes separately from committed sources.
- Inventory relevant discussions, all comments and replies, issues, PR reviews and merged changes. Preserve native item IDs, parent relationships, author, timestamps, URL, retrieval time and content digest.
- Classify each substantive contribution as a requirement, proposal, question, objection, example, evidence submission, editorial correction or recorded decision. Classification is editorial assistance, not an authority judgment.
- Map each item to a requirement ID, construction record, spec section, implementation dependency and disposition. Support multiple mappings in both directions.
- Use dispositions such as open, addressed in draft, awaiting evidence, deferred with reason, superseded and adopted by recorded decision. An answered thread is not necessarily an adopted requirement.
- Keep verbatim source separate from interpretation. A synthesis should identify disagreement and uncertainty rather than flatten them into consensus.

**Exit:** a reviewer can trace every proposed substantive change to its source or see that it is a new proposal. Critical terminology and upstream-version conflicts are listed explicitly.

**Proposed owner:** spec editor, with credential and task maintainers reviewing their respective mappings.

## 2. Reorganize the specification around graph operations

**Deliverables:** revised outline, terminology, trust-graph lifecycle and component responsibilities.

Recommended reading order:

1. Purpose, scope, document status and assurance limits.
2. Trust-graph lifecycle and worked example.
3. Credential semantics and issuer/holder/verifier/registry roles.
4. Threat model and privacy boundaries.
5. Proof request and presentation protocol.
6. Encoding, transcript, context, root and freshness profiles.
7. Construction records and composition rules.
8. Trust Tasks binding.
9. OpenVTC implementation profile.
10. Conformance, evidence, security and adoption process.
11. Book of ZKPs: background, construction alternatives and measured examples.

Explain graph creation as issuance and acceptance of relationships, private storage, selective presentation, verifier policy evaluation, task execution, and later expiry/revocation. State precisely which operation creates an authoritative edge and which merely supplies evidence about an existing relationship.

The book and specification should be two views of shared material, with normative status visibly distinguished. Move the lengthy primer behind the operational explanation; preserve deep mathematical content and stable anchors.

**Exit:** a reader can follow one relationship from credential issuance to a proof-backed decision without first studying every proving system.

## 3. Define the interoperable protocol before choosing winners

**Deliverables:** versioned protocol profile, payload schemas, canonical examples and rejection vectors.

Specify request and presentation identifiers, verifier challenge, audience, purpose, correlation scope, selected construction/profile version, accepted roots and epochs, disclosure requirements, expiry and verifier policy version. Distinguish authenticated request context from untrusted holder claims.

Define exact canonical bytes, transcript coverage, hash algorithms, domain separators, field encodings, byte order, scalar range checks and public-signal order. Optional signals require explicit profile variants and fixed arity; an informal optional nullifier inside a signal list is insufficient. Explain whether transcript hashing happens outside or inside the circuit and what binds its semantic content to the verified statement.

Root profiles must identify the root authority, leaf semantics, hash construction, signature verification, publication and update rules, historical acceptance, and maximum staleness. The prover cannot silently choose a different hash from the registry. Membership and revocation paths normally remain private witnesses; distinguish that from public roots and deliberately disclosed material.

Separate challenge freshness, credential validity, registry freshness and policy freshness. Define clock skew, unavailable registry behavior, replay storage and concurrent-use handling. Where a nullifier is used, state its domain and the observer that can correlate it.

**Exit:** independently written producer and verifier code agree on bytes and reject modified audience, context, root, epoch, challenge, expiry and signal layout.

## 4. Complete and version the construction records

**Deliverables:** compatible schema migration, complete dependency graph and revised privacy claims.

Introduce structured fields for credential versions/formats, authenticated fields, public/private inputs, in-circuit versus external checks, root profile, transcript profile, supported key capabilities, dependencies, claim IDs, test vectors and evidence artifact digests. Migrate the current board vocabulary without breaking existing IDs or silently rewriting historical receipts.

Separate four dimensions: editorial status, implementation completeness, independent evidence, and adoption/security-review status. Keep the existing maturity history, but permit evidence invalidation or supersession after a defect. A previously reproduced vulnerable version cannot remain implicitly endorsed.

Audit missing dependency leaves, particularly signature verification, credential parsing/authentication and delegation-chain semantics. Keep gadget, composed construction, protocol profile and proving backend distinct.

Priority corrections:

- **001/004/006:** connect membership to an authenticated credential, actual holder control and accepted revocation state. Membership of an arbitrary leaf alone is insufficient.
- **005:** distinct leaves or issuers do not prove distinct humans or independent controllers.
- **007/008:** specify key derivation and opening assumptions; do not assume arbitrary or hardware-protected keys share an exportable scalar. A hidden plaintext can still have a correlatable public commitment.
- **010:** retain as the flagship graph use case. Resolve how an offline voucher's linkage is supplied and authenticated; it cannot follow from the presenter's own secret. Replace absolute anonymity wording with observer-specific claims.
- **011/012:** distinguish private presentation from intentionally linkable presentation and define consent/context boundaries.
- **020:** reconcile the selected credential revision's delegation semantics, acknowledgments, scope narrowing, depth and revocation. A hidden chain length needs padding or another justified construction. Grant evidence remains separate from action invocation and completion.

**Exit:** every composed clause has an explicit dependency and every privacy claim names an adversary, horizon, leakage and assumptions.

## 5. Deliver the first proof as a narrow end-to-end slice

**Recommendation:** start with private membership eligibility, as the technical foundation for construction 010. Keep the full community-anchored proof as the first flagship goal rather than claiming the smaller proof completes it.

The first slice should demonstrate: an eligible credential from an accepted issuer; holder binding; membership in the selected community; acceptable validity and revocation state; binding to one verifier request; and exactly the intended disclosure. This draws on 001, 003, 004 and 006 plus credential authenticity. Some of these are currently only carded, so this is new implementation work.

Publish synthetic credentials, keys and registry fixtures; proof generation and verification commands; pinned circuit/tool versions; public-input manifests; proof and verification-key digests; timing and memory methodology; and failure cases. Never include operational holder secrets.

Required negative cases include altered credential fields/signature, wrong holder, wrong issuer/root, revoked or expired credential, stale state, wrong verifier/context, reused challenge, and tampered public inputs. Schema success and a positive proof alone are not enough. Review circuit constraints for underconstrained witnesses as well as running fixtures.

Keep the initial operation read-only: return an eligibility result to a policy evaluator. Then extend it to the voucher/linkage requirements of 010. Follow with pairwise presentation; take on bounded delegation before assuming recursion is required.

**Exit:** another person can reproduce the exact proof and negative cases from a clean environment. Name the profile and version tested; do not promote unrelated records.

## 6. Bind it to Trust Tasks and OpenVTC

**Deliverables:** proposed task specification and schemas, adapter contract, pinned integration demonstration.

Define the task-specific request/presentation/result payload and its relationship to authenticated transport or document integrity. Preserve the distinction between a task document's integrity proof and the ZKP it carries. Specify correlation, idempotency, expiry, failure and retry behavior without relying on reserved response types as if they were implemented.

Map responsibilities to actual pinned OpenVTC code: credential issuance and membership state, wallet/witness custody, root retrieval, proof verification, policy evaluation and task response. Decide explicitly where proving runs. Hosted proving may expose witnesses to the host even if the final proof hides them from the verifier.

Test real service boundaries with controlled fixtures. Local callback adapters and simulated receipts are useful preparation but do not establish live VTA/VTC interoperability. Keep proof acceptance distinct from execution consent, action dispatch and cryptographically checked receipts. When later adding state-changing tasks, preserve durable operation IDs and reconciliation to prevent duplicate execution on ambiguous retries.

**Exit:** a documented task exchange works against the pinned implementation; failures are observable and repeatable; every simulated component is identified.

## 7. Build the Book of ZKPs as a decision guide

**Deliverables:** construction-option pages, compatibility matrix and benchmark records.

Organize by the question a graph builder needs answered: membership, non-revocation, holder control, common control, bounded attributes, private relationships and delegated authority. Explain each statement, witness, disclosure, non-goals, issuer requirements, wallet requirements and alternative implementations.

Choose options by compatibility before speed: credential signature/serialization, as-issued verification versus issuer changes, holder key access, root design, setup assumptions, target device and privacy model. Treat the current Groth16, ProveKit, Longfellow and Flock material as differing kinds of evidence and capability, not a single performance leaderboard.

Compare performance only for equivalent workloads with pinned parameters, hardware, security assumptions, prover memory/time, verifier cost, proof size and setup artifacts. Label source-author benchmarks, local measurements and independent reproductions separately. Audit remaining broad performance and privacy claims across the full corpus.

**Exit:** every option answers when it is usable, what integration it requires, and which claims are measured versus conjectured.

## 8. Make discussion comments part of a reliable sync and publication cycle

**Deliverables:** durable source archive, comment-aware change feed, review queue, publication bundle and verified publication receipts.

Use this cycle: fetch sources → record changes → interpret contributions → propose dispositions → edit spec/evidence → validate → draft thread-specific responses → review exact versions → publish authorized items → verify remote content → reconcile.

Fetching must include nested replies and PR review comments, not just discussion summaries. Use native IDs for deduplication, content hashes for edits, per-repository successful watermarks and overlap windows for recovery. A missing item or permissions failure is not proof of deletion; mark uncertainty. A later successful complete scan can establish tombstones. Persist snapshots so an edited comment cannot silently rewrite the basis of an earlier decision.

For each comment, show what it asks, the relevant construction/paragraph, the proposed disposition, the remaining disagreement and a draft response. Answer the specific contribution rather than posting the same consolidated update everywhere. Avoid generating replies to every minor comment; group related points where context allows while preserving attribution.

Use one consolidated anchor to explain the overall programme, with targeted follow-up comments on the original threads. Each response should state the interpretation, what changed or remains open, an exact document/PR/evidence link, and any concrete review question. Mark proposed versus adopted text. Attribution must not imply the commenter endorsed the synthesis.

Keep the proverb as an editorial reflection prompt: does the concise wording preserve the actual claim and its limits? It is not cryptographic approval, consensus or publication evidence. Bind review to exact body, destination and relevant source revisions. Changed source material should trigger impact review and invalidate approval when it affects the response.

Prepare publication receipts containing target native ID and URL, exact approved content digest, remote content digest, timestamp and outcome. Distinguish drafted, reviewed, copied, reported posted, remotely verified and edited after posting. Manual publication can satisfy the initial release. Any future API publisher should recheck source/target state, use explicit authorization and recover ambiguous retries without duplicate comments.

**Exit:** a reviewer can start from an original comment and reach its spec change, evidence, response and publication receipt; the reverse path also works.

## 9. Establish source ownership and a reproducible release

After an explicit migration, make accepted construction definitions canonical in the spec repository. Keep experiments, raw measurements and independent reproduction evidence in the evidence/task-force repositories. The reader consumes pinned exports and adds editorial workflow state. Avoid two repositories independently overwriting the same construction records.

Each release manifest should identify spec commit, source-discussion snapshot, record schema/profile versions, task definition versions, implementation commits, evidence digests and known limitations. Generate the spec, book and reader from this manifest; validate actual generated content, links and anchors rather than relying only on matching digest stamps.

Prepare a spec PR, companion task-force evidence change and discussion drafts as a reviewable bundle. Publish in dependency order: stable reviewable document/evidence links first, consolidated anchor second, targeted replies third. Update provisional links before review. Record later corrections as revisions, preserving earlier receipts.

**Exit:** all released surfaces reference the same evidence baseline, source links resolve to the correct branch/revision, and no release status implies unrecorded working-group adoption.

## Sequence and meeting readiness

Estimates below are planning ranges, not commitments; the next meeting date and available contributors are not yet established.

**Before the next session: approximately 2–4 focused working days for a review packet.** Freeze sources; refresh authorized read-only discussion access; produce the cross-spec matrix, comment/decision index, revised outline, first-proof statement, key unresolved questions and publication drafts. Include an existing runnable demonstration only at its actual maturity. Do not promise a newly completed composed proof if it has not passed its gates.

**Following 1–2 weeks:** settle baseline semantics and protocol encodings, migrate record schema, resolve first-slice authenticity/root/key requirements, and draft the task binding.

**Following 2–4 weeks:** implement and test the first slice, prepare reproduction artifacts and connect the selected implementation adapter. Time depends strongly on as-issued credential verification and non-exportable holder keys.

**Following 2–4 weeks:** extend toward 010, run independent reproduction, complete the comparison book and release the synchronized document/evidence bundle. Independent cryptographic review and formal adoption have their own availability and cannot be guaranteed by an engineering timetable.

Recommended reviewable change sequence:

1. Baseline manifest, terminology and comment-to-requirement mapping.
2. Spec structure and graph lifecycle; no cryptographic behavior changes.
3. Protocol/root/encoding profile and deterministic vectors.
4. Record schema migration and construction dependency corrections.
5. First-proof implementation and conformance evidence.
6. Trust Task profile and OpenVTC integration evidence.
7. Book option comparisons and independent reproduction.
8. Reader sync, release manifest and thread-specific publication packet.

Reader ingestion and editorial work can proceed alongside protocol work, but technical responses must use the actual current evidence state. Keep each change reviewable rather than placing the entire programme into one PR.

## Decisions to bring to the working group

1. Which exact credential and Trust Tasks revisions are the baseline?
2. Is 010 the flagship, with private membership eligibility as the first implementation slice?
3. Which credential format, issuer-authentication route and holder-key capabilities must the first proof support?
4. Who owns root semantics, publication, revocation and accepted freshness?
5. Which candidate profile should receive initial implementation effort, and who can independently reproduce it?
6. Which repository owns accepted records, and what recorded decision authorizes normative adoption?

The session should leave with named reviewers, resolved baseline choices, an agreed first-proof statement and a bounded next change set. It need not resolve every proving-system option to establish a credible path forward.
