I have prepared an initial contribution to the DTG ZKP specification for review. Before this update is published, I will add the actual draft-PR link so the group can inspect the proposed text alongside this discussion.

The scope is ZKPs for decentralized trust graphs generally: membership, relationships, selective disclosure, identifier control, status and delegated authority. Personhood and liveness remain important use cases and sources; they are not prerequisites for every graph participant or proof.

The draft now starts with an implementation guide: choose the graph outcome, identify the required credentials and private inputs, select a compatible construction profile, define verifier checks, and demonstrate both accepted and rejected cases. Twelve construction records provide the technical detail. ADR-001 is the first composed use case, with a narrower credential-bound membership milestone proposed to establish its foundation.

The book explains the cryptographic options and their fit using those same records. Paper claims, local component measurements and proposed DTG extensions are kept distinct. The current records remain informative at carded or constructed; no complete composition or backend recommendation is claimed from component tests alone.

For the authors' working-group discussion, the question reader connects the paper's vouchable credentials, context/PRF construction, revocation caveat, proof-system assumptions and evaluation to the DTG implementation questions. It also asks what artifacts, review and worked examples would help build the book. The paper's generic conversion is in Appendix C; its evaluation identifies the zkbk reference implementation. These give us concrete points to examine rather than asking for a general endorsement.

An informative maintenance note proposes a continuing research cycle: survey related workspace changes and discussion comments, map them to use cases and construction assumptions, investigate a bounded question, prepare a coherent spec/book update, validate it and return the result to the original discussion. A twelve-task verifier backlog turns construction-option research into checks and implementation work. Completed research and explicit group decisions remain separate.

I would welcome focused review of four points:

1. Does the outcome-led structure and general DTG scope fit the task force's intended deliverable?
2. What exact credential, holder-key and offline voucher artifacts should the first implementation support?
3. Which matched workload and evidence should guide construction selection, including setup and deployment constraints?
4. What should the first book chapter demonstrate, and who would like to review its formal mapping or reproduce its implementation?

I’m bringing the questions and decisions back to this task force, with the proposed specification and book changes in the ZKP spec repository. Where that work calls for changes to credential definitions, I’ll raise them separately with the Credentials TF and link the relevant credential-spec changes here so the group can follow the work.

I also maintain a separate implementation repository, dtgwg-zkp-mage, for experiments and reproducible evidence. I’ll link relevant results where they help us assess a proposal. They are contributions for review, not task-force recommendations.

I’m offering this draft for the group’s review; adoption remains a working-group decision.
