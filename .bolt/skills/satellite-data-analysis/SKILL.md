---
name: satellite-data-analysis
description: Analyze satellite datasets for exploratory dashboards, hackathon prototypes, and educational applications. Use when working with satellite catalog data, orbital characteristics, orbit regimes, satellite groups, altitude, inclination, eccentricity, apogee, perigee, orbital period, or simulated satellite position snapshots. Apply this skill to summarize, compare, validate, classify, and interpret satellite data while avoiding scientifically misleading conclusions.
---

# Satellite Data Analysis

Use this skill to analyze satellite datasets quickly and consistently for prototypes, dashboards, hackathons, and educational applications.

## Core objective

Turn satellite data into clear, defensible insights without overstating what the dataset can support.

Prioritize:

1. correct interpretation of orbital variables;
2. transparent distinction between source, derived, and simulated fields;
3. simple, useful descriptive analysis before advanced modelling;
4. comparisons that are understandable to non-specialists;
5. checks for misleading or invalid conclusions.

## First inspect the dataset

Before proposing an analysis, inspect:

- column names;
- number of rows;
- number of unique satellites;
- duplicate identifiers;
- missing values;
- units;
- timestamp coverage;
- satellite groups;
- ranges of key orbital variables.

Determine whether the dataset contains:

- one row per satellite;
- repeated time observations per satellite;
- real catalog values;
- derived classifications;
- simulated positions.

Do not assume every row represents a unique satellite.

## Prefer satellite identifiers over names

Use a stable identifier such as `norad_id` when grouping or joining records.

Treat satellite names as labels rather than guaranteed unique identifiers.

## Important orbital variables

### Inclination

Interpret `inclination_deg` as the angle between the orbital plane and Earth's equatorial plane.

Useful interpretation:

- near 0 degrees: approximately equatorial;
- medium inclination: inclined orbit;
- near 90 degrees: approximately polar.

Do not infer mission purpose from inclination alone.

### Eccentricity

Interpret eccentricity as orbital shape.

- 0: circular;
- small positive values: nearly circular;
- larger values: increasingly elliptical.

Do not treat eccentricity as an altitude measure.

### Apogee and perigee

Use `apogee_km` and `perigee_km` as the maximum and minimum approximate altitude above Earth's surface.

The difference between them can be used as a simple measure of orbital ellipticity.

A useful derived value is:

```text
altitude_range_km = apogee_km - perigee_km
```

### Mean altitude

If not supplied, estimate:

```text
mean_altitude_km = (apogee_km + perigee_km) / 2
```

Label this as an approximation.

### Orbital period

Use `period_minutes` as the approximate time required for one orbit.

Expect a relationship between altitude and orbital period, but do not present a regression or correlation as a causal discovery.

## Orbit regime classification

When an orbit regime is not already provided, prefer a simple altitude-based educational classification.

A practical prototype convention is:

```text
LEO: mean altitude < 2,000 km
MEO: 2,000 km <= mean altitude < 35,000 km
GEO/high orbit: mean altitude >= 35,000 km
```

Treat this as a simplified classification for exploration.

Do not imply that all high-altitude satellites are truly geostationary. A geostationary orbit requires specific orbital properties, not altitude alone.

If the dataset includes inclination and eccentricity, avoid labeling an object `GEO` solely from altitude unless the data supports that classification.

Prefer labels such as:

- `LEO`;
- `MEO`;
- `High Earth Orbit`;

when scientific precision is uncertain.

## Recommended exploratory analyses

Start with simple questions.

### Population overview

Calculate:

- total observations;
- unique satellites;
- satellites per group;
- satellites per orbit regime;
- median and range of altitude;
- median inclination;
- median orbital period.

### Compare satellite groups

For each group, consider:

- number of satellites;
- median altitude;
- altitude distribution;
- median inclination;
- median period;
- eccentricity distribution.

Prefer medians and quantiles when distributions are skewed.

Do not rely only on means.

### Orbit structure

Useful relationships include:

- altitude vs orbital period;
- altitude vs inclination;
- apogee vs perigee;
- eccentricity vs altitude range;
- satellite group vs orbit regime.

Use scatterplots for continuous relationships and bar charts for category counts.

### Outlier exploration

Flag potential outliers using transparent rules rather than opaque anomaly models by default.

Examples:

- unusually high apogee;
- unusually large apogee-perigee difference;
- eccentricity far above the dataset median;
- unexpected inclination for a satellite group;
- period inconsistent with other records at similar altitude.

Treat outliers as records to inspect, not automatically as errors.

## Repeated position snapshots

If multiple rows exist per satellite over time, distinguish between:

- satellite-level attributes that should not be double counted;
- time-varying position observations.

For counts such as "number of satellites," use unique `norad_id` values rather than row count.

For time-series or map analysis, use the repeated observations.

## Simulated position data

If `latitude`, `longitude`, `altitude_km`, or timestamps are documented as simulated educational snapshots:

- state clearly that the positions are simulated;
- never call them real-time positions;
- never infer operational satellite passes;
- never use them for collision analysis;
- never claim scientific orbital propagation;
- avoid comparing simulated coordinates against external real-world tracking data as if both were equivalent.

The simulated snapshots are suitable for:

- educational maps;
- interface prototypes;
- animation demonstrations;
- filtering by time;
- testing visualization workflows.

They are not suitable for operational aerospace analysis.

## Scientific accuracy safeguards

Do not infer the following unless explicit data supports it:

- satellite purpose from orbit alone;
- ownership from satellite name alone;
- collision risk from proximity in a visualization;
- geostationary status from altitude alone;
- orbital decay from two or three snapshots;
- true ground tracks from simplified simulated positions;
- causal relationships from descriptive correlations.

When uncertain, use language such as:

- "associated with";
- "appears higher/lower in this dataset";
- "for exploratory purposes";
- "simplified classification";
- "simulated position".

## Data-quality checks

Run lightweight checks before analysis.

### Missing values

Report missingness for important fields such as:

- `norad_id`;
- `satellite_name`;
- `inclination_deg`;
- `eccentricity`;
- `apogee_km`;
- `perigee_km`;
- `period_minutes`.

Do not silently convert missing orbital values to zero.

### Range validation

Typical sanity checks:

```text
0 <= inclination_deg <= 180
0 <= eccentricity < 1
apogee_km >= perigee_km
period_minutes > 0
-90 <= latitude <= 90
-180 <= longitude <= 180
```

Treat failed checks as records requiring review.

### Duplicate records

Check whether repeated rows are expected due to timestamps.

Use the combination of satellite identifier and timestamp when testing duplicate snapshots.

### Units

Always show units in outputs and visualizations.

Prefer:

- altitude: km;
- period: minutes;
- inclination: degrees;
- latitude/longitude: degrees.

## Visualization guidance

Use the simplest visualization that answers the question.

Prefer:

- bar chart: satellite counts by group or regime;
- scatterplot: altitude vs period or inclination;
- histogram: altitude or eccentricity distribution;
- line chart: one satellite's values over time when meaningful;
- map/globe: position snapshots;
- table: extreme or unusual satellites.

Do not use 3D visualization when a 2D chart communicates the analytical point more clearly.

If the user specifically requests orbital or globe visualization, combine this skill with the satellite visualization skill when available.

## Dashboard design

For a general satellite explorer, prefer this information hierarchy:

1. summary KPIs;
2. filters;
3. one primary visualization;
4. one supporting comparison;
5. selected-satellite details;
6. caveats or data notes.

Useful filters include:

- satellite group;
- orbit regime;
- altitude range;
- inclination range;
- timestamp;
- satellite name/search.

Avoid showing too many charts simultaneously.

## Analysis workflow

Follow this sequence unless the task requires otherwise.

### 1. Inspect

Understand schema, row count, unique satellites, units, and limitations.

### 2. Validate

Check ranges, duplicates, missingness, and identifier consistency.

### 3. Summarize

Produce a small set of descriptive statistics and category counts.

### 4. Formulate a useful question

Examples:

- Which orbital regimes dominate the dataset?
- How do satellite groups differ in altitude and inclination?
- Which satellites have unusually elliptical orbits?
- How strongly is orbital period associated with altitude?

### 5. Choose the minimum analysis

Use the simplest calculation that answers the question.

### 6. Visualize

Select a chart or map appropriate to the analysis.

### 7. Interpret carefully

Explain the pattern without overstating causality or precision.

### 8. State limitations

Surface simulated data, simplified classifications, or coverage limitations when relevant.

## Rapid-prototyping behavior

For hackathon or prototype contexts:

- prefer fast descriptive insights over complex modelling;
- derive only fields that materially improve the product;
- keep transformations transparent;
- avoid adding ML merely to make the prototype appear advanced;
- prioritize interpretations users can understand;
- keep the analysis reproducible from the supplied dataset.

If asked to "make it smarter," first consider whether better filtering, comparison, explanation, or derived metrics would be more useful than a predictive model.

## Good example requests

Use this skill for requests such as:

- "Analyze the satellite dataset and identify the most interesting patterns."
- "Compare Starlink and GPS satellites."
- "Classify the satellites into orbit regimes."
- "Find unusual satellites in the dataset."
- "Build summary statistics for the satellite dashboard."
- "What charts should we build from this orbital data?"
- "Check whether the satellite data contains suspicious values."
- "Analyze altitude versus orbital period."

## Output expectations

When presenting an analysis:

1. state the question;
2. state which fields are used;
3. provide the result or implementation;
4. explain the interpretation in plain language;
5. mention important caveats;
6. recommend the next most useful analysis only when appropriate.

Keep exploratory results concise and actionable.
