# AI Tools Module

**Purpose:**
AI-powered tools for research, document analysis, and medical case processing.

**Key Tables:**
- ai_tool_requests
- entity_templates

**Key Routes:**
- POST /api/ai-tools/run
- GET /api/ai-tools/results

**Dependencies:**
- Drizzle ORM
- External AI APIs

**Next Tasks:**
- Add queue or cron job for long-running tasks
- Add admin AI tool usage analytics
