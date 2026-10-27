Project Knowledge — Satellite Explorer
1. Role and Objective

You are developing Satellite Explorer, an existing web application for exploring satellites and their orbital characteristics.

The product is a minimal, visualization-first dashboard for curious users. Its main features are:

An interactive 3D view of Earth and satellites.
Interactive charts for altitude and inclination.
Satellite selection and details.
Filtering by altitude and inclination.
Comparison of multiple satellites.

Your priority is to create a polished, accurate, understandable, and responsive application.

Do not expand the scope without a clear reason. Every implementation decision should improve visualization quality, data clarity, interaction, or reliability.

2. Mandatory Rules Before Making Changes
Inspect before implementing

Before changing code:

Inspect the existing project structure.
Read the package manifest and identify the framework and available dependencies.
Identify the current routing, state management, styling system, and component conventions.
Locate the existing API integration and inspect its schema.
Identify working components and functionality that must be preserved.
Determine whether relevant visualization libraries already exist.

Do not replace the existing architecture simply because another stack or library is familiar.

Do not assume that a new project should be generated from scratch.

Make focused changes
Implement one coherent improvement at a time.
Prefer modifying existing components over creating duplicate implementations.
Reuse existing UI patterns and design tokens.
Avoid unrelated refactoring.
Do not add dependencies unless they provide a clear benefit.
Keep components modular, with clear responsibilities.
Avoid large files that combine API requests, orbital calculations, visualization rendering, and UI state.
Do not introduce placeholder features that appear functional but are not connected to real behavior.

After each meaningful change, verify that the application still builds and the existing functionality continues to work.

3. Product Priorities

Follow this order when making implementation decisions:

Correctness and integrity of satellite data.
Clear and useful visualization.
Consistent selection and filtering across views.
Visual polish and usability.
Performance and accessibility.
Additional functionality only when justified.

If a decorative effect conflicts with chart readability or satellite visibility, prioritize readability.

If a proposed feature significantly increases complexity without improving the core exploration experience, defer it.

4. Design System
Visual direction

Use a minimal, modern, scientific design.

The interface should feel like a carefully designed data exploration tool rather than a cluttered mission-control console.

Prefer:

Neutral backgrounds and restrained accent colors.
Clear typography and a strong information hierarchy.
Consistent spacing, borders, radii, and alignment.
Subtle separation between panels.
Generous space for the 3D view and charts.
Lightweight transitions that clarify state changes.
Clear labels, units, and contextual tooltips.

Avoid:

Excessive gradients and glow effects.
Unnecessary glassmorphism.
Decorative cards that add no information.
Excessive animation.
Repeated headings and redundant statistics.
Arbitrary colors that change between components.
Tiny text and cramped chart layouts.
Color and selection

Establish a consistent color mapping for satellite identity and selection.

A satellite selected in the 3D view must retain the same visual identity in the charts and comparison panel.

Use additional visual cues, such as outlines, labels, or marker shapes, so that important states do not depend on color alone.

Layout

Prioritize:

The orbital view.
Altitude and inclination analysis.
Satellite details and comparison controls.

Adapt the exact layout to the existing application.

On narrow screens, stack or simplify panels rather than shrinking charts until they become unreadable.

5. Data Integrity and API Usage

The existing API is the source of truth for satellite information.

Before implementing new data-dependent features:

Inspect the API contract.
Verify field names and data types.
Determine the meaning and units of each field.
Identify timestamps, coordinate systems, and data freshness.
Handle authentication and rate limits according to the existing integration.
Validate missing, malformed, or stale data.

Do not invent API endpoints, fields, or response structures.

Do not hardcode example measurements into production visualizations.

If sample data is necessary for development, keep it separate from production data and label it explicitly.

Internal data model

Normalize incoming data into a consistent internal representation while preserving the source metadata needed for validation and interpretation.

Keep the API integration separate from the visualization components.

A possible conceptual model is:

Stable satellite identifier.
Display name.
Available orbital elements.
Position and position timestamp, if available.
Altitude value and its definition.
Inclination in degrees.
Orbital period, if available.
Data source and update metadata.
Data quality or availability information.

This is a conceptual model, not an assumed API schema. Implement only fields supported by the actual data source.

Missing and invalid data
Missing values must not be silently converted to zero.
Invalid measurements must not be plotted as legitimate data.
Unavailable details should be omitted or clearly marked as unavailable.
Filters must handle missing measurements explicitly.
Charts must explain when no valid data is available.
API failures must produce useful error states and retry options where appropriate.

Never silently switch to demonstration data when the API fails.

6. Orbital Visualization Rules

The 3D view should make orbital information understandable without implying more accuracy than the data supports.

Earth and satellite markers
Keep Earth visually subordinate to the satellite data.
Maintain clear marker visibility at different zoom levels.
Provide intuitive camera controls.
Make satellite selection easy.
Prevent unnecessary rendering work.
Provide a way to restore the default camera view.
Position accuracy

Do not assume that altitude and inclination uniquely determine a satellite's current position.

To calculate a satellite position, use the appropriate source data, time, reference frame, and propagation method.

If the API provides precomputed positions, respect their timestamps and coordinate conventions.

If only orbital parameters are available, determine whether those parameters are sufficient for the intended calculation before implementing it.

Never imply that an approximate orbital representation is a precise real-time position.

Orbital paths

Only render paths when the available orbital data supports them.

Clearly distinguish orbital paths from satellite trails or historical trajectories if those concepts are introduced later.

Avoid presenting arbitrary circles as actual satellite orbits.

7. Charting Rules

Charts are primary product features, not decorative dashboard elements.

Every chart must have:

A meaningful title.
Clearly labeled axes.
Appropriate units.
Scales that communicate the data honestly.
Useful tooltips.
Clear selected and unselected states.
Appropriate behavior when data is missing or filtered out.
Altitude

Use kilometers unless the existing application establishes a different convention.

Define whether the value represents instantaneous altitude, mean altitude, or another supported estimate.

Inclination

Use degrees relative to Earth's equatorial plane, subject to the source's documented definition.

Shared chart behavior

Charts must reflect the same normalized dataset and active filter state.

Selecting a point should select the corresponding satellite wherever that interaction is supported.

Use a histogram for distributions and a scatter plot when examining relationships between two numerical variables. Choose the chart that best answers the user's question rather than using multiple chart types without a clear purpose.

Avoid excessive gridlines, unnecessary legends, and visual clutter.

8. Shared Interaction State

Maintain a clear source of truth for:

Selected satellite.
Compared satellites.
Active altitude filter.
Active inclination filter.
Current dataset and loading status.

Avoid independent state implementations in the globe and charts that can become inconsistent.

Satellite selection

Selecting a satellite should:

Update the selected satellite state.
Highlight the satellite in the 3D view.
Highlight the corresponding chart marks.
Update the details panel.
Preserve relevant active filters.

If a selected satellite becomes excluded by a filter, define and implement consistent behavior rather than leaving an invisible selection.

Filtering

Filters should update all relevant views using the same filtering logic.

Display active filter values.
Allow filters to be reset.
Keep the remaining dataset count accurate.
Handle empty results gracefully.
Define how satellites with missing measurements are treated.

Filtering should not require separate API requests unless the API or dataset size makes that necessary.

Comparison
Support selection of multiple satellites for comparison.
Use a consistent identifier for each satellite.
Show comparable values with units.
Handle missing properties.
Distinguish compared satellites consistently across charts and the globe.
Keep the interface readable when several satellites are selected.

Use a sensible selection limit if needed, and explain the limit in the interface.

9. Performance and Responsiveness

The application should remain responsive while users interact with the globe, charts, and filters.

Avoid unnecessary full-component or full-scene re-renders.
Separate expensive calculations from ordinary UI updates.
Reuse normalized and derived data where appropriate.
Avoid repeated API requests caused by unrelated interactions.
Use suitable caching and refresh strategies.
Optimize rendering based on the actual dataset size.
Consider level of detail or marker aggregation if large datasets make individual satellites difficult to distinguish.

Do not introduce premature optimization that makes the application harder to maintain.

Test performance against realistic data rather than relying exclusively on a small sample.

10. Accessibility and Error Handling
Provide accessible names for controls.
Support keyboard navigation where practical.
Maintain readable contrast and visible focus states.
Do not communicate status through color alone.
Respect reduced-motion preferences.
Provide a non-3D way to select and inspect satellites.
Include loading, empty, error, and stale-data states.
Keep error messages concise and actionable.
Avoid blocking the entire dashboard when an independent panel fails.
11. Development Workflow

Use an iterative workflow for every feature.

Step 1: Understand

Inspect the relevant files, existing patterns, data flow, and dependencies.

Step 2: Plan

State the intended change, the components involved, and any assumptions or risks.

Step 3: Implement

Make the smallest coherent change that delivers the intended improvement.

Step 4: Verify

Check:

The build and relevant tests.
The feature's main interaction.
Existing functionality that could be affected.
Loading, error, and empty states.
Responsive behavior where relevant.
Consistency between the 3D view and charts.
Step 5: Summarize

Explain what changed, which files were affected, what was verified, and what remains incomplete.

Never claim that a build, test, or API integration was verified unless it was actually checked.

12. Implementation Milestones

Follow the project roadmap in this order:

Inspect the existing codebase and API.
Establish the visual foundation and real-data flow.
Implement the interactive 3D orbital view.
Implement altitude and inclination charts.
Synchronize satellite selection and filtering.
Add multi-satellite comparison.
Polish performance, responsiveness, accessibility, and error handling.

Each milestone must leave the application in a working state.

Do not attempt to implement every milestone in a single change.

If a dependency or missing API capability blocks a milestone, explain the issue and implement the most useful supported alternative without fabricating data.

13. Definition of Done

A feature is complete only when:

It fulfills the intended user-facing behavior.
It follows the established visual design.
It uses validated data and documented units.
It integrates correctly with shared selection and filter state.
It handles relevant loading, empty, error, and missing-data cases.
It does not break existing functionality.
It has been checked against the relevant build, tests, or manual verification steps.
Any limitations or unfinished work are documented.
14. Rules for Future Requests

For each new request:

Relate the requested feature to the project's existing goals.
Inspect the relevant implementation before editing.
Preserve existing functionality and established conventions.
Avoid unrelated changes and unnecessary dependencies.
Prefer reusable solutions over duplicated logic.
Ask for clarification only when a missing detail materially affects correctness or architecture.
If a detail can be established from the existing codebase or API, inspect it rather than guessing.
Keep documentation synchronized with meaningful architectural or behavioral changes.

The guiding principle is simple: build a reliable, beautiful satellite exploration experience through small, verified improvements.