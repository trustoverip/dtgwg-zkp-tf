# Drafting rules

Four conventions every contribution to this task force should follow. Proposed by @mitchuski, adopted by the group.

They exist to prevent one specific failure: a spec whose privacy claims are **unfalsifiable** — four teams implement it, all conformant, and the property nobody wrote down is the one that fails.

---

### 1. Every privacy claim names its adversary

The verifier, the issuer, or the two colluding. Those are three different specifications, and only one of them is the one we mean. "Unlinkable" with no adversary named is not a claim; it is a mood.

### 2. Every privacy claim names its horizon

The proof artefact and the enrolment root have very different lifetimes and very different threat clocks. **A bound with no validity period is not a bound.**

### 3. Every predicate states what it does not establish

A liveness proof does not establish that the determination was correct. A nullifier does not establish one human. Holder-key control does not establish agent authority.

Write the negative space. It is where specifications quietly over-promise.

### 4. Conjecture is labelled as conjecture

With a confidence where we can give one. It is much easier to change your mind about something you said you were 60% sure of.

---

## Why these, and not others

Most ZKP specifications describe what a proof *hides*. Far fewer state what it **leaks, to whom, and for how long** — and that is the axis on which they mislead. These rules force the negative space onto the page.

If you think a rule is wrong, say so in a discussion. They bind contributors, including the chairs, and they should be argued with rather than inherited.
