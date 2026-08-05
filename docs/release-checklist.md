# Release Checklist

Use this checklist before publishing `wasm-skills` for public Agent Skills
installation.

- [ ] Repository is public.
- [ ] `skills/wasm-build/SKILL.md` exists.
- [ ] `SKILL.md` frontmatter validates.
- [ ] All files referenced by `SKILL.md` exist.
- [ ] Root `LICENSE` exists.
- [ ] Skill license metadata, if added later, matches repository licensing.
- [ ] `npm run validate` passes.
- [ ] `git diff --check` passes.
- [ ] Direct external-directory install passes.
- [ ] `npx skills add hwclass/wasm-skills --skill wasm-build` succeeds from a
  fresh temporary project.
- [ ] Installed skill is discoverable by at least one supported coding agent.
- [ ] README installation command uses the real GitHub owner and repository.
- [ ] Required Spec Kit tooling under `.agents/skills/speckit-*` remains
  available.
- [ ] No generated product-skill installation such as
  `.agents/skills/wasm-build/` is committed.
- [ ] `.gitignore` excludes `.agents/skills/wasm-build/` without excluding the
  complete `.agents/` directory.
- [ ] No local absolute paths are present in committed documentation.
- [ ] skills.sh dashboard presence is verified separately after public
  publication if dashboard visibility is desired.

The `npx skills add` smoke test requires the repository to be publicly available.
Dashboard indexing or search visibility may occur separately and is not
guaranteed by GitHub publication alone.
