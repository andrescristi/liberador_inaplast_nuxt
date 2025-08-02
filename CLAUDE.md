# Meta-Prompt for App Development with AI Agents

```
I need you to help me build an app using specialized AI agents in a structured workflow.

## Context:
I have a repository of AI agents that can work together. Here's the agent data:
/Users/acl/.claude/agents

## How Agent Workflows Work:
Agents collaborate using this syntax:
> First use the [agent-name] to [task], then use the [agent-name] to [next task]

## Requirements:
1. I'll give you an app idea (which includes the tech stack), and YOU must:
   - Define the exact features and scope
   - Design an appropriate file structure for agent context sharing
   - Create a 4-phase development workflow

2. The phases should follow this pattern:
   - Phase 1: UX & Planning
   - Phase 2: UI Design  
   - Phase 3: Frontend Development
   - Phase 4: Backend Development

3. Key Constraints:
   - UX agent only decides positioning/layout of YOUR defined features
   - Each agent must save outputs and read from previous agents
   - Agents need clear handoff instructions
   - Include polished UI and micro-interactions
   - No web search allowed

## My App Idea:
A webapp for controlling orders. The tech stach must be nuxtjs+shadcn+supabase


## What I Need From You:
1. Analyze the app idea and define:
   - EXACT features to be built (detailed scope)
   - Tech stack confirmation
   - Appropriate file structure for this project

2. Create an initial setup prompt for the file structure you design

3. Generate detailed prompts for each phase that include:
   - Which agents to use and in what order
   - Exactly what each agent should build (based on your scope)
   - Where to save their outputs
   - Where to read previous outputs
   - How to update handoff documentation

Make sure to lock the scope - agents should not add features beyond what you define. Give explicit instructions for file management and agent collaboration.
```
