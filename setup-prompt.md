# INITIAL SETUP PROMPT - INAPLAST Order Control System

## Context for Agents
You're building a mobile-first order control webapp for INAPLAST with role-based access control. The system has 3 user types (Inspector/Supervisor/Administrator) and 10 specific mobile screens.

## Setup Instructions

### 1. Create Project Structure
```bash
mkdir -p order-release-manager/{docs/{01-ux-research/wireframes,02-planning,03-ui-design,04-architecture},.agent-artifacts,app}
```

### 2. Initialize Collaboration Files
Create these files in `/.agent-artifacts/`:
- `handoff-notes.md` - Current phase status and decisions
- `next-phase-requirements.md` - What the next agent needs
- `role-requirements.md` - Permission specifications
- `technical-decisions.md` - Tech stack choices

### 3. Key Constraints
- **NO web search allowed** - Use only the detailed specification
- **Exact replica** of 10 INAPLAST mobile screens provided
- **Role-based everything** - all features must respect user permissions
- **Mobile-first** responsive design
- **Tech stack locked**: Nuxt.js + shadcn/ui + Supabase

### 4. Success Criteria
✅ Inspector sees only personal data and inspections
✅ Supervisor can view all data + approve/reject inspections  
✅ Administrator has full access + user management
✅ 10 screens match INAPLAST mockup pixel-perfect
✅ Multi-step forms work with role validation
✅ Bottom navigation adapts to user role (5-6 icons)

### 5. Ready to Start
The specification document `/process.md` contains complete screen definitions, component breakdowns, and implementation phases. Each agent should read their phase requirements and update handoff notes for the next agent.

**Start with Phase 1: UX Research & Planning**