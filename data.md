# Data

## Overview

This project uses a satellite dataset intended for rapid prototyping and visualization.

The dataset combines:

- real satellite catalog information derived from public CelesTrak orbital data;
- additional derived fields intended to make exploration easier;
- simulated orbital snapshot positions used for educational visualization.

The data is designed for prototyping, not for precise operational orbit tracking.

---

## Files

### `satellites.csv`

This is the main dataset used by the application.

It contains repeated time-based observations for a set of satellites, allowing the application to support:

- maps;
- timelines;
- filtering;
- orbital comparisons;
- dashboard-style visualizations.

There are multiple observations per satellite.

---

## Important distinction

Some fields are based on real satellite catalog data, while others are derived or simulated.

### Real / source-derived data

The underlying satellite characteristics originate from public CelesTrak data.

Examples include:

- satellite name;
- NORAD catalog identifier;
- orbital inclination;
- eccentricity;
- orbital period;
- apogee;
- perigee.

### Derived data

Some variables are calculated from the source data to make analysis easier.

Examples may include:

- mean orbital altitude;
- orbit regime;
- simplified categories.

### Simulated data

Time-varying latitude, longitude, and altitude observations are simplified educational simulations.

They should **not** be interpreted as precise satellite positions.

Accurate satellite tracking normally requires propagating orbital elements using an orbital propagation model such as SGP4.

---

# Main fields

## `satellite_name`

Human-readable name of the satellite.

Example:

```text
ISS (ZARYA)
STARLINK-1234
GPS BIIR-2
```

---

## `norad_id`

Unique NORAD catalog identifier assigned to a tracked space object.

This is useful as a stable satellite identifier.

---

## `satellite_group`

High-level category used in the workshop dataset.

Examples may include:

- Starlink;
- GPS;
- CubeSat;
- active satellite;
- other satellite groups.

This field is useful for filtering and comparisons.

---

## `timestamp`

Time associated with a simulated orbital observation.

Multiple rows may exist for the same satellite at different timestamps.

This allows time-based visualizations and simple animations.

---

## `latitude`

Simulated latitude of the satellite position in degrees.

Approximate range:

```text
-90 to +90
```

This value is provided for educational visualization only.

It is **not** a precise propagated orbital position.

---

## `longitude`

Simulated longitude of the satellite position in degrees.

Approximate range:

```text
-180 to +180
```

This value is provided for educational visualization only.

---

## `altitude_km`

Approximate altitude above the Earth's surface, expressed in kilometres.

Depending on the satellite, this may vary over the simulated orbit.

---

## `inclination_deg`

Orbital inclination in degrees.

Inclination describes the angle between the satellite's orbital plane and the Earth's equatorial plane.

Typical interpretation:

- near `0°`: approximately equatorial orbit;
- around `50–60°`: inclined orbit;
- near `90°`: approximately polar orbit.

Inclination is useful for understanding which parts of the Earth a satellite can pass over.

---

## `eccentricity`

Describes how circular or elliptical an orbit is.

Typical interpretation:

```text
0        → circular orbit
closer to 1 → increasingly elliptical orbit
```

Most low-Earth-orbit satellites have relatively low eccentricity.

---

## `period_minutes`

Approximate time required for the satellite to complete one orbit around Earth.

This is expressed in minutes.

Low-Earth-orbit satellites often have periods of roughly 90–120 minutes.

---

## `apogee_km`

Maximum approximate altitude of the orbit above the Earth's surface.

---

## `perigee_km`

Minimum approximate altitude of the orbit above the Earth's surface.

For a nearly circular orbit:

```text
apogee ≈ perigee
```

For a more elliptical orbit, the difference can be much larger.

---

## `mean_altitude_km`

Derived approximation of the average orbital altitude.

Typically calculated from apogee and perigee.

This field is useful for simple charts and filtering.

---

## `orbit_regime`

Derived high-level classification of the satellite's orbit.

Possible categories may include:

- LEO — Low Earth Orbit;
- MEO — Medium Earth Orbit;
- GEO / high-altitude orbit;
- other simplified categories.

These classifications are intended for exploration rather than rigorous orbital analysis.

---

# Possible analyses

The dataset can support prototypes such as:

- satellite population explorer;
- orbital altitude dashboard;
- interactive map;
- comparison of satellite groups;
- inclination versus altitude visualization;
- orbit-regime explorer;
- satellite filtering tool;
- educational space dashboard;
- simple orbital animation;
- analysis of orbital congestion.

These are examples only. The application does not need to implement all of them.

---

# Data quality and limitations

## Satellite positions are simulated

The latitude and longitude observations are deliberately simplified.

Do not use this dataset for:

- satellite tracking;
- collision prediction;
- operational navigation;
- scientific orbit propagation;
- identifying the true current position of a satellite.

---

## Orbital data changes over time

Satellite orbits evolve.

Even real orbital-element data represents an observation or estimate at a particular point in time.

Therefore, values in this dataset should be treated as a snapshot.

---

## Categories are simplified

Some satellite groups and orbit regimes have been simplified to make the dataset easier to explore during the workshop.

They should not be treated as authoritative scientific classifications.

---

# Source

The underlying satellite catalog information is based on public orbital data from CelesTrak:

https://celestrak.org/

CelesTrak distributes orbital information derived from tracked space-object catalogs.

The expanded time-series observations in this workshop dataset were created specifically for educational prototyping.

---

# Intended use

This dataset is intended for:

- teaching;
- hackathons;
- rapid prototyping;
- visualization;
- experimentation with AI-assisted software development.

It is not intended for operational aerospace applications.

When building features, prioritize clarity, exploration, and usability over scientific precision.