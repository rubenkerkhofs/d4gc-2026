import { useAppState, getRegimeColor } from "../state/AppState";
import { useTheme } from "../state/ThemeContext";

function DetailRow({ label, value, hint, colors }: {
    label: string;
    value: string;
    hint?: string;
    colors: { textSecondary: string; textPrimary: string; textMuted: string; rowBorder: string };
}) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "5px 0",
            borderBottom: `1px solid ${colors.rowBorder}`,
            fontSize: "13px",
        }}>
            <span style={{ color: colors.textSecondary, flexShrink: 0 }}>
                {label}
                {hint && (
                    <span style={{
                        display: "block",
                        fontSize: "10px",
                        color: colors.textMuted,
                        marginTop: "1px",
                    }}>
                        {hint}
                    </span>
                )}
            </span>
            <span style={{
                color: colors.textPrimary,
                textAlign: "right",
                fontWeight: 500,
            }}>
                {value}
            </span>
        </div>
    );
}

function formatNum(n: number, decimals = 0): string {
    if (isNaN(n)) return "N/A";
    return n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    }) + " UTC";
}

export function DetailsPanel() {
    const { satellites, selectedNoradId, selectSatellite } = useAppState();
    const { colors } = useTheme();

    const selected = selectedNoradId !== null
        ? satellites.find((s) => s.noradId === selectedNoradId)
        : null;

    if (!selected) {
        return (
            <div style={{
                background: colors.bgTertiary,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                padding: "20px 16px",
                textAlign: "center",
            }}>
                <div style={{ fontSize: "13px", color: colors.textMuted }}>
                    Select a satellite on the globe to see its details.
                </div>
            </div>
        );
    }

    const regimeColor = getRegimeColor(selected.orbitRegime);
    const firstPos = selected.positions[0];

    const rowColors = {
        textSecondary: colors.textSecondary,
        textPrimary: colors.textPrimary,
        textMuted: colors.textMuted,
        rowBorder: colors.rowBorder,
    };

    return (
        <div style={{
            background: colors.bgTertiary,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            padding: "16px",
            maxHeight: "100%",
            overflowY: "auto",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
            }}>
                <div>
                    <h3 style={{
                        margin: 0,
                        fontSize: "15px",
                        fontWeight: 600,
                        color: colors.textPrimary,
                    }}>
                        {selected.name}
                    </h3>
                    <div style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "4px",
                        fontSize: "12px",
                    }}>
                        <span style={{
                            color: regimeColor,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}>
                            <span style={{
                                display: "inline-block",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: regimeColor,
                            }} />
                            {selected.orbitRegime}
                        </span>
                        <span style={{ color: colors.textMuted }}>· {selected.group}</span>
                    </div>
                </div>
                <button
                    onClick={() => selectSatellite(null)}
                    aria-label="Close details"
                    style={{
                        background: "transparent",
                        border: "none",
                        color: colors.textMuted,
                        fontSize: "16px",
                        cursor: "pointer",
                        padding: "0 4px",
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>
            </div>

            <DetailRow label="NORAD ID" value={String(selected.noradId)} colors={rowColors} />
            <DetailRow
                label="Intl. Designator"
                value={selected.internationalDesignator || "N/A"}
                colors={rowColors}
            />
            <DetailRow label="Launch Year" value={isNaN(selected.launchYear) ? "N/A" : String(selected.launchYear)} colors={rowColors} />

            <div style={{ height: "8px" }} />

            <DetailRow
                label="Mean Altitude"
                value={`${formatNum(selected.meanAltitudeKm)} km`}
                hint="Average of apogee and perigee"
                colors={rowColors}
            />
            <DetailRow
                label="Inclination"
                value={`${formatNum(selected.inclinationDeg, 2)}°`}
                hint="Angle of orbit vs. Earth's equator"
                colors={rowColors}
            />
            <DetailRow
                label="Orbital Period"
                value={isNaN(selected.periodMinutes) ? "N/A" : `${formatNum(selected.periodMinutes, 2)} min`}
                colors={rowColors}
            />
            <DetailRow
                label="Apogee"
                value={`${formatNum(selected.apogeeKm)} km`}
                hint="Highest point in orbit"
                colors={rowColors}
            />
            <DetailRow
                label="Perigee"
                value={`${formatNum(selected.perigeeKm)} km`}
                hint="Lowest point in orbit"
                colors={rowColors}
            />
            <DetailRow
                label="Eccentricity"
                value={isNaN(selected.eccentricity) ? "N/A" : selected.eccentricity.toFixed(5)}
                hint="0 = circular, higher = elliptical"
                colors={rowColors}
            />

            <div style={{ height: "8px" }} />

            {firstPos && (
                <>
                    <div style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: colors.textMuted,
                        marginBottom: "6px",
                        marginTop: "4px",
                    }}>
                        Simulated Position (first snapshot)
                    </div>
                    <DetailRow label="Altitude" value={`${formatNum(firstPos.altitudeKm, 1)} km`} colors={rowColors} />
                    <DetailRow label="Latitude" value={`${formatNum(firstPos.latitudeDeg, 2)}°`} colors={rowColors} />
                    <DetailRow label="Longitude" value={`${formatNum(firstPos.longitudeDeg, 2)}°`} colors={rowColors} />
                    <DetailRow label="Timestamp" value={formatDate(firstPos.timestampUtc)} colors={rowColors} />
                </>
            )}

            <div style={{
                marginTop: "12px",
                padding: "8px 10px",
                background: colors.bgSecondary,
                borderRadius: "4px",
                fontSize: "11px",
                color: colors.textMuted,
                lineHeight: 1.5,
            }}>
                Positions are simplified educational simulations from catalog orbital
                parameters, not SGP4-propagated tracking data.
            </div>
        </div>
    );
}
