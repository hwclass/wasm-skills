# Acceptance Criteria: wasm-build Route Proof

This file is the canonical acceptance view for implementation and audit
purposes. Requirements remain defined in
[spec.md](./spec.md), and these criteria mirror the approved acceptance criteria
from that specification without changing AC-001 through AC-013.

- **AC-001**: Rust Browser completes a real build.
- **AC-002**: Rust Browser produces the expected Wasm artifact.
- **AC-003**: Rust Browser artifact validation passes.
- **AC-004**: The missing Rust target approval/resume workflow is demonstrated
  when the target was initially unavailable.
- **AC-005**: TinyGo WASI completes a real build.
- **AC-006**: TinyGo WASI produces the expected Wasm artifact.
- **AC-007**: TinyGo WASI artifact validation passes.
- **AC-008**: The TinyGo prerequisite approval/resume workflow is demonstrated
  if TinyGo was initially unavailable.
- **AC-009**: JavaScript Component build and validation regression remains
  passing.
- **AC-010**: No environment/toolchain mutation occurs without explicit
  approval.
- **AC-011**: Generated build output is not committed.
- **AC-012**: Existing `wasm-build` tests remain green.
- **AC-013**: No new skill or unrelated build capability is added.
- **AC-014**: The final evidence artifact contains exactly one route-proof
  decision. `FREEZE WASM-BUILD AND START THE NEXT SPECIALIZED SKILL` is allowed
  only if Rust Browser has real successful build and validation evidence,
  TinyGo WASI has real successful build and validation evidence, and JavaScript
  Component regression remains passing; otherwise the decision must be
  `WASM-BUILD STILL LACKS REAL ROUTE PROOF`.

## Traceability Note

- `FR-022` maps explicitly to `AC-014`.
