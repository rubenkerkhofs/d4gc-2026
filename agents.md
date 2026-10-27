AGENTS.md
Project Objective

Develop a minimal, visualization-first satellite explorer that enables curious users to explore satellites through an interactive 3D Earth view, altitude and inclination charts, filtering, and satellite comparison.

Prioritize visualization quality, data accuracy, usability, and incremental development over feature quantity.

Working with the Codebase
Inspect the existing architecture before modifying code.
Preserve the existing framework, dependencies, conventions, and working functionality.
Prefer small, focused changes over large rewrites.
Reuse existing components and utilities where appropriate.
Avoid adding dependencies without a clear justification.
Never replace existing functionality without understanding its purpose.
Keep documentation synchronized with meaningful architectural changes.
Data Integrity
Use the existing satellite API as the source of truth.
Inspect and validate the actual API schema before implementing data-dependent features.
Never invent API endpoints, fields, measurements, or satellite positions.
Do not silently substitute mock data when a live request fails.
Clearly distinguish unavailable, stale, approximate, and demonstration data.
Preserve the meaning, units, timestamps, and coordinate conventions of orbital measurements.
Visualization and Interaction
Maintain a minimal, scientific, and readable visual design.
Treat the 3D orbital view and analytical charts as primary features.
Keep satellite selection and filtering consistent across all views.
Use consistent visual identities for selected and compared satellites.
Label measurements and units clearly.
Ensure charts accurately represent the underlying data.
Do not imply precise orbital positioning unless the available data and calculations support it.
Implementation Workflow

For each feature:

Inspect the relevant code and existing behavior.
Identify the smallest coherent implementation.
Make the required changes without unrelated refactoring.
Verify the relevant build, tests, and interactions.
Check for regressions and relevant error states.
Summarize the changes, verification performed, and remaining limitations.

Never claim a test, build, or API integration succeeded unless it was actually verified.

Definition of Done

A feature is complete when it:

Meets its intended user-facing requirements.
Follows the existing architecture and visual design.
Handles relevant loading, error, empty, and missing-data states.
Integrates correctly with shared selection and filter state.
Preserves existing functionality.
Has been verified through appropriate checks.
Documents important limitations or unfinished work.
Scope Control

Do not introduce unrelated features, unnecessary abstractions, or broad architectural changes without justification.

Develop the application incrementally, prioritizing:

Existing codebase and API understanding.
Visual foundation and data integration.
Interactive 3D visualization.
Altitude and inclination charts.
Synchronized filtering and selection.
Satellite comparison.
Performance, accessibility, and polish.

When requirements conflict, prioritize data correctness, existing functionality, and a clear user experience.