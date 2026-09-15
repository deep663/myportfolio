# PROJECT.md — deep-portfolio

> Project constitution for the TrieDatum Agentic SDLC agents operating on
> this repo. Do not edit mid-task to make a story easier to ship.

## Identity

- **name:** deep-portfolio
- **description:** Deep Senchowa's personal developer portfolio website.
  Currently a static HTML/Tailwind CSS/vanilla-JS site (`legacy-website/`).
  A repositioning + rebuild is in scope per `.aidlc/A00-01-USER-REQUIREMENTS/plan_v01.txt`.
- **repo_root:** /home/deeps/projects/deep-portfolio
- **is_git_repo:** true  # git initialized 2026-09-14, default branch `main`, no remote configured yet.

## Stack

- **languages:** typescript, javascript, css — legacy site (`legacy-website/`,
  html/css/vanilla-js) is being superseded by a rebuild on the target stack
  below, confirmed 2026-09-14 per Analyst ambiguity resolution.
- **target_stack:** Next.js (App Router) + TypeScript + Tailwind CSS + MDX,
  deployed on Vercel.
- **frameworks_detected (legacy):** Tailwind CSS 3.4, GSAP + ScrollTrigger
  (legacy site animations — porting decision tracked in Story 1.2)
- **package_manager:** npm (legacy-website/package.json)
- **test_commands:** none configured — legacy-website's `npm test` is a stub
  (`echo "Error: no test specified" && exit 1`). # TODO
- **default_branch:** # TODO — not a git repo yet

## Ticket system

- **ticket_system:** none  # TODO — no Jira/GitHub Issues/Linear signal found
  in the repo. Analyst will use filesystem-based story output
  (`.sdlc/requirements/`) until a ticket system is chosen.

## Output location

- **convention:** dotfolder
- **root:** .sdlc/

(User explicitly chose the hidden `.sdlc/` folder over continuing the
existing `.aidlc/A00-01-USER-REQUIREMENTS/` numbered-folder convention.
Note: `.aidlc/` already holds the source requirements doc — leave it in
place as historical input; new agent outputs go under `.sdlc/`.)

## MCP servers

- **required:** none configured
- **optional:** none configured
# TODO — confirm whether any MCP (Jira, Confluence, GitHub, Vector Search,
Diagram) should be wired up once a ticket system is chosen.

## Quality gates

- **component_size_ceiling:** 100  # framework non-negotiable default
- **coverage_target:** 50  # framework default floor — # TODO confirm with user once a test framework exists

## Other

- **secrets_layer:** # TODO — no signal in repo (no .env.example, no secrets manager config)
- **design_docs_root:** # TODO — no docs/design or docs/adr found
- **cloud/env:** none detected (no terraform/, .aws/, azure-pipelines.yml, databricks.yml)
