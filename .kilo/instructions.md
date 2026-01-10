# Kilo Code Instructions

You are Kilo Code, a highly skilled software engineer assisting with the Paapeli IoT Platform codebase. Follow these guidelines:

## Code of Conduct Compliance

**Read and follow:** [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)

Key requirements:
1. ✅ Always include tests for new code
2. ✅ Follow commit message format: `<type>(<scope>): <subject>`
3. ✅ Keep code simple (KISS principle)
4. ✅ Update documentation when changing APIs
5. ✅ One feature per PR
6. ✅ Update architecture docs for structural changes
7. ✅ Use Makefile for all tasks
8. ✅ Avoid unnecessary documents
9. ✅ Track TODOs in TODO.md, not code comments

## Planning Workflow

**MANDATORY:** For any non-trivial task, create a plan first:

### 1. Create Plan File

```bash
# Name format: FEATURE_NAME_PLAN.md or BUGFIX_ISSUE_123_PLAN.md
touch JWT_TO_APISIX_MIGRATION.md
```

### 2. Structure the Plan

```markdown
# Task Name

**Goal:** What you're trying to achieve
**Status:** In Progress
**Started:** 2026-01-05

---

## Plan

### Phase 1: Description
- [ ] Task 1.1: Description
  - Status: Pending
  - Details...

### Phase 2: Description
- [ ] Task 2.1: Description
  - Status: Pending
  - Details...

---

## Progress Log

### 2026-01-05
- Plan created
- [Update after completing each task]
```

### 3. Work Process

1. **Before each task:** Review plan
2. **During task:** Follow plan steps
3. **After task:** Update status to ✅ Complete and add notes
4. **Update Progress Log:** Document what was done

### 4. Complete and Clean Up

```bash
# When all tasks done:
rm FEATURE_NAME_PLAN.md

# Document in TODO.md
echo "- [x] Feature Name ($(date +%Y-%m-%d))" >> TODO.md
```

### 5. Example

Recent example: `JWT_TO_APISIX_MIGRATION.md`
- 5 phases, 15+ tasks
- Updated after each completion
- Clear progress tracking

## Keeping Instructions Updated

**IMPORTANT:** Maintain these instruction files:

### Update Triggers

Update when:
- New patterns/practices adopted
- Workflow changes
- Common issues identified
- Architecture evolves
- Tools change

### Update Process

1. Create plan file: `UPDATE_INSTRUCTIONS_PLAN.md`
2. Document needed changes
3. Update both `.claude/instructions.md` and `.github/copilot-instructions.md` and `.kilo/instructions.md`
4. Test changes
5. Commit: `git commit -m "docs: update AI assistant instructions"`
6. Remove plan file

### Review Cadence

- After major features
- Monthly check
- When onboarding new patterns

## Kilo Code-Specific Capabilities

### 1. Multi-File Analysis

You can analyze entire directories using tools:

```bash
# Analyze backend structure
list_files path: services/backend recursive: true

# Review test coverage
search_files path: tests regex: "test_" file_pattern: "*.py"

# Check documentation consistency
read_file files: [{path: "docs/API.md"}]
```

### 2. Code Review

```bash
# Review changes
read_file files: [{path: "services/backend/main.go"}]

# Suggest improvements
search_files path: . regex: "TODO" file_pattern: "*.go"

# Check compliance with CODE_OF_CONDUCT.md
read_file files: [{path: "CODE_OF_CONDUCT.md"}]
```

### 3. Documentation Generation

```bash
# Generate API docs from code
search_files path: services/backend regex: "func.*Handler" file_pattern: "*.go"

# Update architecture diagram
read_file files: [{path: "docs/ARCHITECTURE.md"}]

# Check doc consistency
list_files path: docs recursive: false
```

## Language-Specific Guidelines

### Go (Backend)

**Style:**
- Follow [Effective Go](https://golang.org/doc/effective_go.html)
- Use `gofmt` (run `make format-go`)
- Keep functions < 50 lines

**Testing:**
```go
// Use testify/suite for tests
type MyTestSuite struct {
    suite.Suite
    server *Server
}

func (suite *MyTestSuite) TestFeature() {
    // Arrange
    input := "test"
    
    // Act
    result := suite.server.Process(input)
    
    // Assert
    assert.Equal(suite.T(), "expected", result)
}
```

**Error handling:**
```go
// Wrap errors with context
if err != nil {
    return fmt.Errorf("failed to process: %w", err)
}
```

### Python (Gateway, ML)

**Style:**
- Follow PEP 8
- Use `black` formatter (run `make format-python`)
- Type hints where appropriate

**Testing:**
```python
import unittest
from unittest.mock import Mock, patch

class TestMyClass(unittest.TestCase):
    def setUp(self):
        self.instance = MyClass()
    
    def test_feature(self):
        # Arrange
        input_data = "test"
        
        # Act
        result = self.instance.process(input_data)
        
        # Assert
        self.assertEqual(result, "expected")
```

## Common Patterns

### API Endpoints (Backend)

```go
func (s *Server) handleMyEndpoint(c *gin.Context) {
    // 1. Parse request
    var req MyRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // 2. Validate
    if err := req.Validate(); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // 3. Business logic
    result, err := s.service.Process(req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    // 4. Return response
    c.JSON(http.StatusOK, gin.H{"data": result})
}
```

### Database Operations

```go
func (d *Database) GetGateway(id uuid.UUID) (*Gateway, error) {
    var gateway Gateway
    err := d.conn.QueryRow(
        "SELECT id, name, location FROM gateways WHERE id = $1",
        id,
    ).Scan(&gateway.ID, &gateway.Name, &gateway.Location)
    
    if err == sql.ErrNoRows {
        return nil, fmt.Errorf("gateway not found")
    }
    if err != nil {
        return nil, fmt.Errorf("database error: %w", err)
    }
    
    return &gateway, nil
}
```

### MQTT Publishing (Gateway)

```python
def publish_aggregate(self, aggregate: dict):
    """Publish aggregate to MQTT broker"""
    topic = f"/gateways/{self.gateway_id}/aggregates"
    payload = json.dumps(aggregate)
    
    try:
        self.mqtt_client.publish(topic, payload, qos=1)
        logger.info(f"Published aggregate to {topic}")
    except Exception as e:
        logger.error(f"Failed to publish: {e}")
        # Store in local buffer for retry
        self.buffer.store(aggregate)
```

## Documentation Updates

**Always update when:**
- Adding API endpoints → `docs/API.md`
- Changing architecture → `docs/ARCHITECTURE.md`
- Modifying tests → `docs/TESTING.md`
- Deployment changes → `docs/DEPLOYMENT.md`

**Format for API docs:**
```markdown
### POST /api/v1/my-endpoint

**Request:**
```json
{
  "field": "value"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "created_at": "timestamp"
  }
}
```

**Errors:**
- 400: Invalid request
- 500: Server error
```

## Testing Requirements

**For every new feature:**
1. Unit test (test individual function)
2. Integration test (if touches database/MQTT)
3. Update existing tests if breaking changes

**Run before committing:**
```bash
make test           # Quick unit tests
make test-all       # Full test suite
make test-coverage  # Generate coverage
```

## TODO Handling

**Instead of:**
```go
// TODO: Add rate limiting
func handleRequest() {
    // ...
}
```

**Do:**
1. Add to [`TODO.md`](../TODO.md):
   ```markdown
   - [ ] Add rate limiting to request handler
     - Location: backend/src/main.go:145
     - Effort: 1 day
   ```

2. Create GitHub issue:
   ```bash
   gh issue create --title "Add rate limiting" --body "See TODO.md"
   ```

3. Link in TODO.md:
   ```markdown
   - [ ] #123 - Add rate limiting to request handler
   ```

## Commit Message Examples

```bash
# Good
git commit -m "feat(backend): add gateway authentication

- Implement JWT token generation
- Add middleware for token validation
- Update API documentation

Closes #123"

# Bad
git commit -m "fixed stuff"
```

## Questions?

When uncertain:
1. Check [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)
2. Review [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
3. Look at existing code patterns
4. Ask in PR comments

**Remember:** Simple, tested, documented code is better than clever code.