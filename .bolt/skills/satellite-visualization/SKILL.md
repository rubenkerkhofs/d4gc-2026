---
name: satellite-visualization
description: Guide AI-assisted implementation of satellite and orbital visualizations in web applications. Use when building or modifying 2D or 3D satellite maps, globe views, orbit visualizations, orbital-regime comparisons, satellite distributions, or interactive space-data interfaces. Prefer clear, performant, scientifically honest visualizations and distinguish simulated workshop positions from physically propagated satellite positions.
---

# Satellite Visualization

Use this skill when implementing or improving visualizations of satellites, orbital data, satellite positions, orbital regimes, or Earth-based satellite views.

The goal is to produce visually compelling prototypes without overstating the scientific accuracy of the underlying data.

## Core principles

1. Choose the visualization based on the question, not on visual novelty.
2. Prefer a simple 2D chart when it communicates the insight better than 3D.
3. Use 3D when spatial position, Earth geometry, orbital paths, or global distribution are central to the user experience.
4. Keep interactions understandable for non-specialist users.
5. Preserve the existing project stack unless there is a strong technical reason to change it.
6. Avoid unnecessary dependencies.
7. Treat performance as a first-class concern when rendering many satellites.
8. Never imply that simulated workshop coordinates are operationally accurate satellite positions.

## First inspect the project

Before changing code:

1. Read the existing project structure and relevant documentation.
2. Identify the framework and language already in use.
3. Locate the satellite dataset and inspect its fields.
4. Determine whether positions are real, derived, simulated, or propagated.
5. Identify the intended user and the question the visualization should answer.
6. Reuse existing components and libraries where sensible.

Do not replace the existing technical stack merely to implement a visualization.

## Choose 2D or 3D

### Prefer 2D when

Use ordinary charts when the user needs to understand:

- altitude distributions;
- inclination versus altitude;
- apogee versus perigee;
- satellite counts by group;
- satellite counts by orbit regime;
- time trends;
- comparisons between categories;
- correlations between orbital variables.

Suggested approaches:

- scatter plot for inclination versus altitude or apogee versus perigee;
- bar chart for counts by satellite group or orbit regime;
- histogram for altitude or inclination distributions;
- line chart for time series;
- 2D geographic map when global location matters but a globe adds little value.

Do not use 3D merely because satellite data is involved.

### Prefer 3D when

Use a globe or 3D scene when the user needs to understand:

- where satellites are positioned around Earth;
- global spatial distribution;
- the relationship between orbit altitude and Earth;
- approximate orbital paths;
- different orbital shells;
- how satellite groups occupy different regions around Earth;
- animated movement around the planet.

## Library selection

### Default for geospatial globe applications: CesiumJS / Resium

Prefer CesiumJS when the visualization centers on Earth, geographic coordinates, altitude, camera movement, or orbital paths.

For React applications, prefer Resium when it integrates cleanly with the existing project.

Cesium is usually the best choice when:

- latitude and longitude are primary inputs;
- altitude should be represented geographically;
- the user needs to rotate and zoom around Earth;
- geographic context matters;
- orbital paths or spatial trajectories are shown.

### Default for custom visual scenes: React Three Fiber / Three.js

Prefer React Three Fiber or Three.js when:

- the experience is more conceptual than geographic;
- highly customized 3D styling is required;
- precise geospatial behavior is not important;
- the project already uses Three.js;
- custom shaders, particle effects, or unusual visual metaphors are central.

Do not introduce Three.js merely to render a normal Earth map if Cesium provides the required functionality more directly.

### For ordinary analytical charts

Prefer the visualization library already present in the project.

If none exists, choose a lightweight React-compatible library such as Recharts or Plotly depending on the complexity required.

Avoid adding multiple charting libraries to the same prototype.

## Coordinate handling

When a dataset contains:

- `latitude` in degrees;
- `longitude` in degrees;
- `altitude_km` in kilometres;

convert altitude units appropriately for the visualization library.

Cesium expects height in metres when using geographic coordinates.

Conceptually:

```ts
heightMeters = altitudeKm * 1000
```

Then use geographic coordinates such as:

```ts
Cartesian3.fromDegrees(longitude, latitude, heightMeters)
```

Do not silently treat kilometres as metres.

## Scientific accuracy

Always determine how satellite positions were obtained.

### If positions are simulated

Treat them as educational visualization data.

Use wording such as:

- "simulated satellite position";
- "illustrative orbital position";
- "educational simulation".

Do not describe them as:

- live satellite positions;
- current satellite positions;
- precise orbital trajectories;
- operational tracking data.

### If positions come from TLE / GP orbital elements

Do not assume the orbital elements themselves are positions.

Precise position estimation requires orbital propagation, typically with an SGP4 implementation.

If the application does not perform SGP4 propagation, do not claim that it provides accurate real-time satellite tracking.

### Workshop dataset

For the workshop satellite dataset, latitude, longitude, and time-varying altitude snapshots are simplified educational simulations.

The underlying catalog characteristics may be based on real satellite data, but the simulated snapshots are not operational orbit predictions.

Make this clear when the visualization could otherwise be mistaken for real tracking.

## Visual hierarchy

For a satellite globe, prioritize the following hierarchy:

1. Earth/globe context.
2. Satellite population.
3. Selected or highlighted satellite.
4. Filters and controls.
5. Detailed satellite metadata.

Do not overwhelm the initial view with labels for every satellite.

## Satellite rendering

For small numbers of satellites, individual points or entities are acceptable.

For hundreds or thousands of satellites:

- avoid rendering expensive independent React components for every object when possible;
- avoid permanent text labels for every satellite;
- render lightweight points, sprites, billboards, or batched entities;
- show detailed labels only on hover or selection;
- consider sampling or aggregation if the full population is visually unreadable;
- update only the values that actually change during animation.

Performance is more important than rendering every metadata field simultaneously.

## Recommended interaction model

For an exploratory satellite application, prefer:

- orbit-regime filter;
- satellite-group filter;
- search by satellite name or NORAD ID;
- hover tooltip with essential information;
- click to select a satellite;
- details panel for the selected satellite;
- reset-view control;
- optional time slider when time-varying positions exist.

Keep the initial interface usable without requiring knowledge of orbital mechanics.

## Tooltips

Keep hover tooltips concise.

Good default fields:

- satellite name;
- satellite group;
- orbit regime;
- altitude;
- inclination.

Put more detailed information such as apogee, perigee, eccentricity, period, and NORAD ID in a selected-item panel rather than every tooltip.

## Orbital terminology

When displaying technical orbital variables, provide brief explanations for non-specialists.

### Inclination

Angle between the orbital plane and Earth's equatorial plane.

Typical interpretation:

- near 0 degrees: approximately equatorial;
- near 90 degrees: approximately polar.

### Eccentricity

Describes how circular or elliptical an orbit is.

- near 0: nearly circular;
- larger values: more elliptical.

### Perigee

Lowest approximate orbital altitude above Earth.

### Apogee

Highest approximate orbital altitude above Earth.

### Orbital period

Approximate time required to complete one orbit.

## Orbit regimes

If the dataset already contains an orbit-regime field, use it rather than inventing a new classification.

If classification must be derived, document the thresholds clearly and treat them as simplified categories.

Common high-level categories include:

- LEO: Low Earth Orbit;
- MEO: Medium Earth Orbit;
- GEO / geosynchronous region;
- high elliptical or other orbit categories.

Do not imply that simplified altitude-only categories capture every nuance of orbital classification.

## Orbit paths

Only draw an "orbit path" when the available data reasonably supports one.

If several time-indexed positions exist for a satellite, a path can be drawn through those observations.

If only one position exists, do not fabricate a precise orbit line around Earth.

If an illustrative orbit is intentionally created from simplified orbital parameters, clearly describe it as illustrative.

## Animation

When animating satellite positions:

- provide play/pause controls when useful;
- avoid unnecessarily high update frequencies;
- interpolate only when doing so is appropriate for the data;
- display the current simulated or observation timestamp;
- avoid implying real-time tracking unless live propagated data is actually used.

For workshop prototypes, smooth visual behavior is more important than physically exact animation.

## Camera defaults

For a 3D globe:

- begin far enough away to understand the global distribution;
- keep Earth centered initially;
- avoid starting inside a satellite cloud;
- allow free rotation and zoom;
- when a satellite is selected, optionally fly or zoom toward it without losing geographic context;
- provide a simple reset-view action.

## Color and styling

Use color primarily to encode meaningful categories such as:

- satellite group;
- orbit regime;
- selected versus unselected state.

Avoid excessive gradients and decorative coloring that obscure meaning.

Use high contrast between satellites and the Earth/background.

Do not rely on color alone for critical state distinctions when a label, icon, or selection state can help.

## Progressive disclosure

Do not put all information on screen simultaneously.

Prefer:

```text
Overview
  -> filter
  -> hover
  -> select
  -> inspect details
```

This is especially important when visualizing thousands of objects.

## Recommended prototype sequence

When asked to add a satellite visualization, implement progressively.

### Step 1: Clarify the purpose

Determine what the user should learn or accomplish.

Examples:

- explore the satellite population;
- compare orbital regimes;
- understand altitude distribution;
- inspect individual satellites;
- observe simulated movement around Earth.

### Step 2: Propose the smallest useful visualization

Before implementing a large 3D interface, recommend the smallest visualization that demonstrates the idea.

Example:

> Start with a rotatable globe, lightweight satellite points, orbit-regime filtering, and a selected-satellite details panel.

### Step 3: Implement the core view

Get the visualization running before adding secondary controls.

### Step 4: Add one useful interaction at a time

Recommended order:

1. rendering;
2. basic filtering;
3. hover/select behavior;
4. detail panel;
5. time controls or animation;
6. polish.

### Step 5: Test against the actual data

Verify:

- coordinates appear in the correct locations;
- altitude units are correct;
- missing values do not crash the app;
- filters produce sensible subsets;
- performance remains acceptable;
- tooltips and selected values match the source records.

### Step 6: Review scientific claims

Before finishing, check all labels and explanatory text for claims that imply greater positional accuracy than the data supports.

## Performance guidelines

For thousands of satellites:

1. Parse the dataset once rather than repeatedly on every render.
2. Memoize expensive derived values when appropriate.
3. Avoid recreating large arrays on every interaction.
4. Avoid one expensive DOM node per satellite.
5. Prefer WebGL-backed rendering for large spatial point sets.
6. Disable permanent labels by default.
7. Keep filtering client-side if the dataset is small enough for the browser.
8. Add pagination or virtualization for long metadata tables.
9. Do not recompute static orbital classifications during every render.
10. Profile before adding complex visual effects.

## Dependency discipline

Before installing a new package:

1. Check whether the project already has a library that can satisfy the requirement.
2. Prefer one visualization ecosystem over several overlapping ones.
3. Explain why a substantial dependency such as Cesium or Three.js is needed.
4. Avoid adding a library solely for one trivial UI element.

For rapid prototypes, reliability and simplicity take priority over architectural sophistication.

## Error handling

Satellite data frequently contains missing or malformed values.

Handle these gracefully:

- skip invalid coordinates rather than crashing the entire scene;
- show unavailable metadata as `Unknown` or `N/A`;
- validate numeric conversions;
- avoid plotting `NaN` positions;
- report how many records could not be rendered when relevant.

## Accessibility and usability

Even visually rich applications should remain understandable.

Provide:

- readable labels;
- sufficient contrast;
- descriptive control names;
- keyboard-accessible controls where feasible;
- textual metadata for selected satellites;
- explanations for specialist orbital terminology.

## What not to do

Do not:

- replace a clear 2D chart with 3D for novelty;
- claim simulated positions are live satellite tracking;
- fabricate orbital trajectories from a single point without disclosure;
- introduce multiple heavy visualization frameworks unnecessarily;
- show thousands of permanent satellite labels;
- rebuild the project's framework when a component-level change is enough;
- hide units;
- silently convert or reinterpret data;
- optimize visual spectacle at the expense of comprehension.

## Default recommendation for this workshop

For the satellite workshop React/Vite/TypeScript project, when asked to create a visually impressive satellite explorer:

1. Prefer a Cesium/Resium globe if 3D Earth-based visualization is central.
2. Load the existing satellite CSV from the project's public data directory.
3. Render satellites as lightweight points.
4. Encode orbit regime or satellite group visually.
5. Add filters for satellite group and orbit regime.
6. Add hover or selection details.
7. Explain orbital variables in plain language.
8. Clearly label simulated positional data as illustrative.
9. Avoid adding orbit-path calculations unless supported by the available observations.
10. Keep the first implementation small enough to run and evaluate before adding animation or advanced effects.

## Example user requests that should trigger this skill

- "Add a 3D globe showing the satellites."
- "Visualize the orbital regimes around Earth."
- "Create an interactive satellite map."
- "Show the satellites moving around the globe."
- "Build a dashboard comparing satellite altitude and inclination."
- "Add orbit paths for selected satellites."
- "Make the satellite visualization more performant."
- "Create an educational visualization explaining LEO, MEO, and GEO."

## Expected behavior

When triggered:

1. Inspect the available project and data context.
2. Recommend the appropriate visualization approach briefly.
3. Preserve the project's existing architecture.
4. Implement the smallest useful version first.
5. Validate units, positions, and interaction behavior.
6. State limitations when visualization accuracy depends on simulated or non-propagated orbital data.
7. Iterate from a working baseline rather than attempting an oversized first implementation.
