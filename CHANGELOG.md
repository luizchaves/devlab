# Changelog

All notable changes to the DevLab project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-08-30

### 🚀 Features
- Unified InvestApp frontend in Tailwind utility-first
- Implemented strict Zod schemas validation for body, query, and params in MonitorApp
- Restructured InvestApp documentation and added architecture diagrams
- Added HEAD and OPTIONS method classes to `<ApiRequest>` component
- Added Monitor API project documentation and CORS security guide
- Added Prisma ORM documentation for Express.js covering schemas, migrations, and relations

### 🐛 Bug Fixes
- Resolved code defects across InvestApp project stages
- Updated documentation links to use relative paths for consistency
- Updated `tsconfig.json` exclude patterns for examples directory

### 📚 Documentation & Specs
- Standardized spec file naming convention to `SPEC-XXX-kebab-case.md`
- Added English requirements for commit messages, code identifiers, and specs in `AGENTS.md`
- Added 3-digit `TASK-XXX` IDs and checklists to `docs/TODO.md`
- Audited step-by-step coverage for InvestApp and MonitorApp tracks
- Established `specs/active/` and `specs/executed/` lifecycle directories in `AGENTS.md`

### 🛠️ Refactoring & Tooling
- Created `devlab-release-generator` skill for SemVer releases, `CHANGELOG.md`, and Git tagging
