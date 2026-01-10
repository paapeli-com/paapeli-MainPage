# Claude CLI Instructions

> **Note:** This file extends and references `.github/copilot-instructions.md`. Read that file first for core guidelines.

## Quick Reference

**Core guidelines:** See [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)

**Code of Conduct:** See [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md)

## Claude-Specific Capabilities

### 1. Multi-File Analysis

You can analyze entire directories:

```bash
# Analyze backend structure
claude analyze backend/src/

# Review test coverage
claude analyze --tests gateway-agent/tests/

# Check documentation consistency
claude check-docs docs/
```

### 2. Code Review

```bash
# Review PR changes
claude review --pr 123

# Suggest improvements
claude suggest backend/src/main.go:145-200

# Check compliance with CODE_OF_CONDUCT.md
claude check-compliance --file backend/src/new_feature.go
```

### 3. Documentation Generation

```bash
# Generate API docs from code
claude generate-docs --type api backend/src/

# Update architecture diagram
claude update-diagram docs/ARCHITECTURE.md

# Check doc consistency
claude check-docs --sync
```

## Instruction Hierarchy

1. **Primary:** [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)
2. **Secondary:** [.github/copilot-instructions.md](../.github/copilot-instructions.md)
3. **Local:** [.claude/settings.local.json](settings.local.json)
4. **This file:** Claude-specific workflows

## Extended Guidelines

### Architectural Analysis

When suggesting changes that affect architecture:

1. **Check current architecture:**
   ```bash
   claude analyze --architecture
   ```

2. **Suggest changes with diagram:**
   ```markdown
   ## Proposed Change
   
   Current:
   ```mermaid
   graph LR
   A[Gateway] --> B[MQTT]
   B --> C[Backend]
   ```
   
   Proposed:
   ```mermaid
   graph LR
   A[Gateway] --> B[MQTT]
   A --> D[Local Buffer]
   B --> C[Backend]
   D -.->|Retry| B
   ```
   ```

3. **Update docs automatically:**
   ```bash
   claude update-docs --architecture
   ```

### Test Generation

Generate tests following project patterns:

**Backend (Go):**
```bash
claude generate-test --type suite backend/src/feature.go
```

Generated test will follow:
- testify/suite pattern
- Arrange-Act-Assert structure
- Project naming conventions

**Gateway (Python):**
```bash
claude generate-test --type unittest gateway-agent/src/feature.py
```

Generated test will follow:
- unittest.TestCase pattern
- setUp/tearDown methods
- Mock decorators where needed

### Documentation Sync

Keep documentation in sync with code:

```bash
# Check if docs match code
claude check-sync

# Update docs to match code
claude sync-docs

# Verify all examples work
claude test-examples docs/
```

### TODO Management

Help manage TODOs:

```bash
# Find all TODOs in code
claude find-todos

# Convert code TODOs to TODO.md entries
claude migrate-todos

# Create GitHub issues from TODO.md
claude create-issues --from-todos
```

## Workflow Examples

### Adding New Feature

```bash
# 1. Check architecture impact
claude analyze --impact feature-name

# 2. Generate test skeleton
claude generate-test --feature feature-name

# 3. Implement feature (with Claude's help)

# 4. Update documentation
claude sync-docs

# 5. Check compliance
claude check-compliance --all

# 6. Review before commit
claude review --self
```

### Refactoring

```bash
# 1. Analyze current code
claude analyze --complexity module-name

# 2. Suggest refactoring
claude suggest-refactor module-name

# 3. Generate tests for refactored code
claude generate-test --refactor module-name

# 4. Update documentation
claude sync-docs

# 5. Verify no regressions
make test-all
```

### Bug Fix

```bash
# 1. Analyze bug
claude analyze-bug --issue 123

# 2. Generate failing test
claude generate-test --bug 123

# 3. Fix bug (with Claude's help)

# 4. Verify test passes
make test

# 5. Update docs if needed
claude check-docs --issue 123
```

## Integration with Makefile

Claude can suggest Makefile improvements:

```bash
# Check Makefile completeness
claude check-makefile

# Suggest new targets
claude suggest-makefile --for testing
```

Example suggestion:
```makefile
check-todos:
	@echo "Checking for untracked TODOs..."
	@grep -r "TODO:" --exclude-dir=.git --exclude="TODO.md" . || echo "No untracked TODOs found"

migrate-todos:
	@echo "Migrating code TODOs to TODO.md..."
	@claude migrate-todos
```

## Planning Workflow

**IMPORTANT:** For any non-trivial task (multi-step, affects multiple files, or requires design decisions):

### 1. Create a Plan File

Before starting implementation:

```bash
# Create a plan file with descriptive name
touch FEATURE_NAME_PLAN.md
# or
touch BUGFIX_ISSUE_123_PLAN.md
```

### 2. Document the Plan

Write a structured plan with:

```markdown
# Feature/Task Name

**Goal:** Clear objective statement

**Status:** In Progress / Complete
**Started:** YYYY-MM-DD
**Estimated Duration:** X hours

---

## Plan

### Phase 1: [Phase Name]
- [ ] Task 1.1: Description
  - Status: Pending
  - Details...

- [ ] Task 1.2: Description
  - Status: Pending
  - Details...

### Phase 2: [Phase Name]
- [ ] Task 2.1: Description
  - Status: Pending
  - Details...

---

## Progress Log

### YYYY-MM-DD
- Initial plan created
- [Update after each task]
```

### 3. Follow the Plan

- Work through tasks sequentially or by priority
- Update task status after completion:
  ```markdown
  - [x] Task 1.1: Description
    - Status: ✅ Complete
    - Actual implementation details...
  ```
- Add progress notes to the Progress Log section

### 4. Remove Plan File When Done

```bash
# After all tasks complete and changes committed
rm FEATURE_NAME_PLAN.md

# Document completion in TODO.md
echo "- [x] Feature Name ($(date +%Y-%m-%d))" >> TODO.md
```

### 5. Example: JWT Migration

See recent example: `JWT_TO_APISIX_MIGRATION.md`
- Created plan with 5 phases
- Updated status after each task
- Documented all changes
- Will be removed after testing complete

## Keeping Instructions Up to Date

**CRITICAL:** These instruction files must be maintained:

### When to Update

Update `.claude/instructions.md` and `.github/copilot-instructions.md` when:
1. New architectural patterns emerge
2. Development workflow changes
3. New tools/practices are adopted
4. Code style guidelines evolve
5. Common mistakes are identified

### How to Update

```bash
# 1. Create a plan
touch UPDATE_INSTRUCTIONS_PLAN.md

# 2. Document what needs updating
# 3. Make changes to both files
# 4. Test with example prompts
# 5. Commit changes
git commit -m "docs: update AI assistant instructions"

# 6. Remove plan file
rm UPDATE_INSTRUCTIONS_PLAN.md
```

### Review Schedule

- **Weekly:** Quick review during team sync
- **Monthly:** Full review and updates
- **Per Project:** After major architectural changes

## Best Practices for Claude Usage

### 1. Context Awareness

Provide context in prompts:

```bash
# Good
claude "Add authentication to gateway API endpoint, following the pattern used in backend/src/main.go:827"

# Better
claude --context CODE_OF_CONDUCT.md "Add authentication to gateway API endpoint"
```

### 2. Iterative Development

Use Claude for incremental improvements:

```bash
# Step 1: Plan
claude "Outline steps to add feature X"

# Step 2: Implement
claude "Generate code for step 1"

# Step 3: Test
claude generate-test --feature X

# Step 4: Document
claude sync-docs --feature X
```

### 3. Compliance Checking

Always check compliance:

```bash
# Before committing
claude check-compliance --all

# Check specific aspects
claude check-compliance --tests
claude check-compliance --docs
claude check-compliance --todos
```

## Performance Considerations

To maintain Claude's performance:

1. **Use focused prompts:**
   ```bash
   # Instead of
   claude "Review entire codebase"
   
   # Do
   claude "Review backend/src/auth.go for security issues"
   ```

2. **Leverage caching:**
   ```bash
   # Cache architecture understanding
   claude cache --architecture
   
   # Use cached context
   claude --cached "Suggest improvement to auth flow"
   ```

3. **Batch operations:**
   ```bash
   # Generate multiple tests at once
   claude generate-tests --batch backend/src/*.go
   ```

## File References

Instead of duplicating content, reference other files:

```bash
# Reference CODE_OF_CONDUCT.md
claude --ref CODE_OF_CONDUCT.md "Check if this code follows guidelines"

# Reference copilot instructions
claude --ref .github/copilot-instructions.md "Generate test following project patterns"

# Reference architecture
claude --ref docs/ARCHITECTURE.md "Is this change architecturally sound?"
```

## Troubleshooting

### Claude not following guidelines?

```bash
# Reload context
claude reload-context

# Explicitly reference guidelines
claude --ref CODE_OF_CONDUCT.md --ref .github/copilot-instructions.md "Review this PR"
```

### Suggestions not matching project style?

```bash
# Analyze existing patterns
claude learn-patterns backend/src/

# Apply learned patterns
claude --use-patterns "Generate new endpoint"
```

### Documentation out of sync?

```bash
# Full sync
claude sync-docs --force

# Verify sync
claude check-docs --strict
```

## Questions?

See:
1. [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) - Development standards
2. [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Code guidelines
3. [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) - System architecture
4. [TODO.md](../TODO.md) - Tracked work items

**Remember:** Claude is a tool to help you follow the guidelines, not replace them.
