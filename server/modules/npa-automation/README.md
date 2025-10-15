# NPA Automation Module

**Purpose:**
Automate NPA certificate generation and delivery.

**Key Tables:**
- npa_templates
- npa_opt_ins
- npa_automation

**Key Routes:**
- GET /api/npa-automation/templates
- POST /api/npa-automation/templates
- GET /api/npa-automation/opt-ins
- POST /api/npa-automation/opt-ins
- GET /api/npa-automation/automation
- POST /api/npa-automation/automation

**Dependencies:**
- Drizzle ORM
- BigTos WhatsApp API

**Next Tasks:**
- Implement cron for scheduled delivery
- Add WhatsApp notification logic
- Add tests
