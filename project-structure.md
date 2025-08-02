# INAPLAST Order Control - Agent Collaboration Structure

```
/order-release-manager/
├── /docs/                          # Agent collaboration hub
│   ├── /01-ux-research/            # Phase 1 outputs
│   │   ├── wireframes/             # 10 screen wireframes
│   │   ├── interaction-patterns.md # UX patterns doc
│   │   └── role-permissions.md     # Role-based access mapping
│   ├── /02-planning/               # Phase 1 & 2 outputs  
│   │   ├── component-breakdown.md  # Detailed component list
│   │   ├── build-order.md          # Implementation sequence
│   │   └── role-architecture.md    # Permission system design
│   ├── /03-ui-design/              # Phase 2 outputs
│   │   ├── component-specs.md      # shadcn/ui specifications
│   │   ├── animations.md           # Mobile interactions
│   │   ├── role-variants.md        # UI variations per role
│   │   └── color-system.md         # INAPLAST brand colors
│   └── /04-architecture/           # Phase 3 & 4 outputs
│       ├── api-endpoints.md        # Backend API design
│       ├── database-schema.md      # Data structure
│       ├── security-model.md       # Role-based security
│       └── deployment-guide.md     # Launch instructions
├── /.agent-artifacts/              # Agent handoff files
│   ├── handoff-notes.md           # Current phase decisions
│   ├── next-phase-requirements.md # What's needed next
│   ├── role-requirements.md       # Permission specifications
│   └── technical-decisions.md     # Tech choices made
└── /app/                          # Nuxt.js application
    ├── pages/                     # 10 screen routes
    ├── components/                # Role-aware components
    ├── composables/               # Permission hooks
    ├── middleware/                # Route guards
    ├── server/api/                # Supabase integration
    └── stores/                    # Role-based state
```

## Agent Input/Output Protocol

### Phase Handoffs:
- Each agent MUST read previous phase outputs from `/docs/0X-phase/`
- Each agent MUST update `/.agent-artifacts/handoff-notes.md`
- Each agent MUST specify requirements for next phase

### Role System Requirements:
- All components must implement 3-tier permission checks
- UI must adapt based on user role (Inspector/Supervisor/Admin)
- Data filtering must happen at both frontend and backend levels