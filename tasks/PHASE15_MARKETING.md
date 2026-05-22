# Phase 15 — Marketing & Adoption

## Status: Not Started (0% done)

No badges, screenshots, discussions, or community infrastructure.

---

## Tasks

### 15.1 GitHub Repository Polish

- [ ] Add a concise repository description (already done, but verify it's compelling)
- [ ] Add GitHub topics via `gh repo edit --add-topic`:
  - `documentation-generator`, `ai-agents`, `developer-tools`, `cli`, `scaffolding`
- [ ] Create repository banner/hero image: 1280x640 PNG showing CLI output screenshot
- [ ] Add shields.io badges to README:
  ```markdown
  ![npm version](https://img.shields.io/npm/v/create-agent-docs)
  ![build](https://img.shields.io/github/actions/workflow/status/anomalyco/create-agent-docs/test.yml)
  ![license](https://img.shields.io/npm/l/create-agent-docs)
  ![npm downloads](https://img.shields.io/npm/dm/create-agent-docs)
  ```

### 15.2 Demo Assets

- [ ] Record a terminal demo (using `asciinema` or `termtosvg`)
- [ ] Embed the demo GIF in README (convert asciicast to GIF with `agg`)
- [ ] Create a "30-second quickstart" code block for README top fold

### 15.3 Community Infrastructure

- [ ] Enable GitHub Discussions in repo settings (document steps in CONTRIBUTING.md)
- [ ] Create issue templates:
  - `.github/ISSUE_TEMPLATE/bug_report.md`
  - `.github/ISSUE_TEMPLATE/feature_request.md`
  - `.github/ISSUE_TEMPLATE/preset_request.md`
- [ ] Create PR template: `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Add `good first issue` and `help wanted` labels to relevant existing issues

### 15.4 Social Proof

- [ ] Add "Used by" section to README (once there are users)
- [ ] Add testimonials section (when available)
- [ ] Create a `USERS.md` for teams/organizations using the tool

---

## Verification

- [ ] README badges render correctly
- [ ] GitHub repo has topics, description, and proper labels
- [ ] Issue templates appear when creating a new issue
- [ ] PR template appears when creating a new PR
