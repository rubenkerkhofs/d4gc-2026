import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Satellite, OrbitRegime } from "../data/satelliteTypes";

export interface FilterState {
    selectedRegimes: Set<OrbitRegime>;
    selectedGroups: Set<string>;
}

export interface AppState {
    satellites: Satellite[];
    filteredSatellites: Satellite[];
    filters: FilterState;
    selectedNoradId: number | null;
    setFilters: (f: Partial<FilterState>) => void;
    toggleRegime: (r: OrbitRegime) => void;
    toggleGroup: (g: string) => void;
    resetFilters: () => void;
    selectSatellite: (noradId: number | null) => void;
}

const AppContext = createContext<AppState | null>(null);

const ALL_REGIMES: OrbitRegime[] = ["LEO", "MEO", "GEO-like"];

export function AppProvider({ satellites, children }: {
    satellites: Satellite[];
    children: ReactNode;
}) {
    const [selectedRegimes, setSelectedRegimes] = useState<Set<OrbitRegime>>(
        new Set(ALL_REGIMES)
    );
    const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
    const [selectedNoradId, setSelectedNoradId] = useState<number | null>(null);

    const allGroups = useMemo(
        () => Array.from(new Set(satellites.map((s) => s.group))).sort(),
        [satellites]
    );

    const effectiveGroups = useMemo(
        () => selectedGroups.size === 0 ? new Set(allGroups) : selectedGroups,
        [selectedGroups, allGroups]
    );

    const filteredSatellites = useMemo(
        () => satellites.filter(
            (s) => selectedRegimes.has(s.orbitRegime) && effectiveGroups.has(s.group)
        ),
        [satellites, selectedRegimes, effectiveGroups]
    );

    const value: AppState = {
        satellites,
        filteredSatellites,
        filters: { selectedRegimes, selectedGroups },
        selectedNoradId,
        setFilters: (f) => {
            if (f.selectedRegimes !== undefined) setSelectedRegimes(new Set(f.selectedRegimes));
            if (f.selectedGroups !== undefined) setSelectedGroups(new Set(f.selectedGroups));
        },
        toggleRegime: (r) => {
            setSelectedRegimes((prev) => {
                const next = new Set(prev);
                if (next.has(r)) next.delete(r);
                else next.add(r);
                return next;
            });
        },
        toggleGroup: (g) => {
            setSelectedGroups((prev) => {
                const next = new Set(prev);
                if (next.has(g)) next.delete(g);
                else next.add(g);
                return next;
            });
        },
        resetFilters: () => {
            setSelectedRegimes(new Set(ALL_REGIMES));
            setSelectedGroups(new Set());
        },
        selectSatellite: (noradId) => setSelectedNoradId(noradId),
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppState {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useAppState must be used within AppProvider");
    return ctx;
}

export const REGIME_COLORS: Record<OrbitRegime, string> = {
    "LEO": "#4fb3d9",
    "MEO": "#f0a830",
    "GEO-like": "#e85d5d",
};

export function getRegimeColor(regime: OrbitRegime): string {
    return REGIME_COLORS[regime] ?? "#888888";
}
