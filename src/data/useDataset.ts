import { useEffect, useState } from "react";
import type { RawRow } from "./satelliteTypes";
import { normalizeDataset, summarizeDataset } from "./satelliteTypes";
import type { Satellite, DatasetSummary } from "./satelliteTypes";

export interface DatasetState {
    readonly satellites: Satellite[];
    readonly summary: DatasetSummary | null;
    readonly loading: boolean;
    readonly error: string | null;
}

export function useDataset(): DatasetState {
    const [state, setState] = useState<DatasetState>({
        satellites: [],
        summary: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;
        fetch("/data/satellites.json")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<RawRow[]>;
            })
            .then((rows) => {
                if (cancelled) return;
                const satellites = normalizeDataset(rows);
                const summary = summarizeDataset(satellites);
                setState({ satellites, summary, loading: false, error: null });
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                const message = err instanceof Error ? err.message : "Unknown error";
                setState({
                    satellites: [],
                    summary: null,
                    loading: false,
                    error: `Failed to load satellite data: ${message}`,
                });
            });
        return () => { cancelled = true; };
    }, []);

    return state;
}
