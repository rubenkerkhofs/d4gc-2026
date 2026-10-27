export type OrbitRegime = "LEO" | "MEO" | "GEO-like";

export interface SatelliteGroup {
    readonly id: string;
    readonly label: string;
}

export interface PositionSnapshot {
    readonly timestampUtc: string;
    readonly altitudeKm: number;
    readonly latitudeDeg: number;
    readonly longitudeDeg: number;
    readonly orbitalPhaseDeg: number;
}

export interface Satellite {
    readonly noradId: number;
    readonly name: string;
    readonly group: string;
    readonly internationalDesignator: string;
    readonly orbitRegime: OrbitRegime;
    readonly launchYear: number;
    readonly periodMinutes: number;
    readonly inclinationDeg: number;
    readonly apogeeKm: number;
    readonly perigeeKm: number;
    readonly eccentricity: number;
    readonly gpAgeDays: number;
    readonly source: string;
    readonly positionMethod: string;
    readonly meanAltitudeKm: number;
    readonly positions: PositionSnapshot[];
}

export interface RawRow {
    readonly timestamp_utc: string;
    readonly group: string;
    readonly international_designator: string;
    readonly norad_catalog_number: string | number;
    readonly name: string;
    readonly orbit_regime: string;
    readonly launch_year: string | number;
    readonly period_minutes: string | number;
    readonly inclination_degrees: string | number;
    readonly apogee_km: string | number;
    readonly perigee_km: string | number;
    readonly eccentricity: string | number;
    readonly simulated_altitude_km: string | number;
    readonly simulated_latitude_deg: string | number;
    readonly simulated_longitude_deg: string | number;
    readonly orbital_phase_deg: string | number;
    readonly gp_age_days: string | number;
    readonly source: string;
    readonly position_method: string;
}

function toNumber(v: string | number | null | undefined): number {
    if (v === null || v === undefined || v === "") return NaN;
    const n = typeof v === "number" ? v : parseFloat(v);
    return n;
}

function isValidPosition(lat: number, lon: number, alt: number): boolean {
    return (
        !isNaN(lat) && !isNaN(lon) && !isNaN(alt) &&
        lat >= -90 && lat <= 90 &&
        lon >= -180 && lon <= 180 &&
        alt > 0
    );
}

export function normalizeDataset(rows: RawRow[]): Satellite[] {
    const byNorad = new Map<number, Satellite>();

    for (const row of rows) {
        const noradId = toNumber(row.norad_catalog_number);
        if (isNaN(noradId)) continue;

        const altitudeKm = toNumber(row.simulated_altitude_km);
        const latitudeDeg = toNumber(row.simulated_latitude_deg);
        const longitudeDeg = toNumber(row.simulated_longitude_deg);

        const snapshot: PositionSnapshot = {
            timestampUtc: row.timestamp_utc,
            altitudeKm,
            latitudeDeg,
            longitudeDeg,
            orbitalPhaseDeg: toNumber(row.orbital_phase_deg),
        };

        const existing = byNorad.get(noradId);
        if (existing) {
            if (isValidPosition(latitudeDeg, longitudeDeg, altitudeKm)) {
                (existing.positions as PositionSnapshot[]).push(snapshot);
            }
            continue;
        }

        const apogee = toNumber(row.apogee_km);
        const perigee = toNumber(row.perigee_km);
        const meanAlt = !isNaN(apogee) && !isNaN(perigee)
            ? (apogee + perigee) / 2
            : NaN;

        const positions: PositionSnapshot[] = [];
        if (isValidPosition(latitudeDeg, longitudeDeg, altitudeKm)) {
            positions.push(snapshot);
        }

        byNorad.set(noradId, {
            noradId,
            name: row.name ?? "Unknown",
            group: row.group ?? "Unknown",
            internationalDesignator: row.international_designator ?? "",
            orbitRegime: (row.orbit_regime as OrbitRegime) ?? "LEO",
            launchYear: toNumber(row.launch_year),
            periodMinutes: toNumber(row.period_minutes),
            inclinationDeg: toNumber(row.inclination_degrees),
            apogeeKm: apogee,
            perigeeKm: perigee,
            eccentricity: toNumber(row.eccentricity),
            gpAgeDays: toNumber(row.gp_age_days),
            source: row.source ?? "",
            positionMethod: row.position_method ?? "",
            meanAltitudeKm: meanAlt,
            positions,
        });
    }

    const satellites = Array.from(byNorad.values());
    satellites.sort((a, b) => a.noradId - b.noradId);
    return satellites;
}

export interface DatasetSummary {
    readonly totalSatellites: number;
    readonly groups: string[];
    readonly regimes: OrbitRegime[];
    readonly timestampRange: { start: string; end: string } | null;
}

export function summarizeDataset(satellites: Satellite[]): DatasetSummary {
    const groups = new Set<string>();
    const regimes = new Set<OrbitRegime>();
    let minTs: string | null = null;
    let maxTs: string | null = null;

    for (const sat of satellites) {
        groups.add(sat.group);
        regimes.add(sat.orbitRegime);
        for (const p of sat.positions) {
            if (minTs === null || p.timestampUtc < minTs) minTs = p.timestampUtc;
            if (maxTs === null || p.timestampUtc > maxTs) maxTs = p.timestampUtc;
        }
    }

    return {
        totalSatellites: satellites.length,
        groups: Array.from(groups).sort(),
        regimes: Array.from(regimes).sort(),
        timestampRange: minTs && maxTs ? { start: minTs, end: maxTs } : null,
    };
}
