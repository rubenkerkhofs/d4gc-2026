import { useMemo } from "react";
import { useAppState, getRegimeColor } from "../state/AppState";
import { useTheme } from "../state/ThemeContext";
import type { OrbitRegime } from "../data/satelliteTypes";

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    color?: string;
    textPrimary: string;
    textSecondary: string;
    accentBlue: string;
}

function Checkbox({ label, checked, onChange, color, textPrimary, textSecondary, accentBlue }: CheckboxProps) {
    return (
        <label style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontSize: "13px",
            userSelect: "none",
        }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                style={{ accentColor: color ?? accentBlue, width: "14px", height: "14px" }}
            />
            {color && (
                <span style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                }} />
            )}
            <span style={{ color: checked ? textPrimary : textSecondary }}>{label}</span>
        </label>
    );
}

export function FilterBar() {
    const {
        satellites,
        filteredSatellites,
        filters,
        toggleRegime,
        toggleGroup,
        resetFilters,
    } = useAppState();
    const { colors } = useTheme();

    const allGroups = useMemo(
        () => Array.from(new Set(satellites.map((s) => s.group))).sort(),
        [satellites]
    );

    const allRegimes: OrbitRegime[] = ["LEO", "MEO", "GEO-like"];

    const groupCounts = useMemo(() => {
        const counts = new Map<string, number>();
        for (const s of satellites) {
            counts.set(s.group, (counts.get(s.group) ?? 0) + 1);
        }
        return counts;
    }, [satellites]);

    const filtersActive =
        filters.selectedRegimes.size < 3 || filters.selectedGroups.size > 0;

    return (
        <div style={{
            background: colors.bgTertiary,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            padding: "14px 16px",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
            }}>
                <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: colors.textSecondary,
                }}>
                    Filters
                </span>
                <span style={{ fontSize: "12px", color: colors.textSecondary }}>
                    {filteredSatellites.length} / {satellites.length} satellites
                </span>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div>
                    <div style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "6px" }}>
                        Orbit Regime
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {allRegimes.map((r) => (
                            <Checkbox
                                key={r}
                                label={r}
                                checked={filters.selectedRegimes.has(r)}
                                onChange={() => toggleRegime(r)}
                                color={getRegimeColor(r)}
                                textPrimary={colors.textPrimary}
                                textSecondary={colors.textSecondary}
                                accentBlue={colors.accentBlue}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "6px" }}>
                        Satellite Group
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {allGroups.map((g) => (
                            <Checkbox
                                key={g}
                                label={`${g} (${groupCounts.get(g) ?? 0})`}
                                checked={filters.selectedGroups.size === 0 || filters.selectedGroups.has(g)}
                                onChange={() => toggleGroup(g)}
                                textPrimary={colors.textPrimary}
                                textSecondary={colors.textSecondary}
                                accentBlue={colors.accentBlue}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {filtersActive && (
                <button
                    onClick={resetFilters}
                    style={{
                        marginTop: "10px",
                        background: "transparent",
                        border: `1px solid ${colors.borderSecondary}`,
                        borderRadius: "4px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        color: colors.textSecondary,
                        cursor: "pointer",
                    }}
                >
                    Reset Filters
                </button>
            )}
        </div>
    );
}
