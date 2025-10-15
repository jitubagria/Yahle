# Medical Voices Module

**Purpose:**
Platform for doctors to raise medical issues, gather support, and coordinate actions.

**Key Tables:**
- medical_voices
- medical_voice_supporters
- medical_voice_updates
- medical_voice_contacts
- medical_voice_gatherings

**Key Routes:**
- GET /api/medical-voices
- POST /api/medical-voices
- POST /api/medical-voices/:id/support
- POST /api/medical-voices/:id/updates

**Dependencies:**
- Drizzle ORM
- BigTos WhatsApp API

**Next Tasks:**
- Add WhatsApp reminders for gatherings
- Implement voice moderation tools
- Add bulk supporter import
