import { useDataset } from "./data/useDataset";
import { AppProvider, useAppState, REGIME_COLORS } from "./state/AppState";
import { useTheme } from "./state/ThemeContext";
import { GlobeView } from "./components/GlobeView";
import { FilterBar } from "./components/FilterBar";
import { DetailsPanel } from "./components/DetailsPanel";
import type { OrbitRegime } from "./data/satelliteTypes";
import { useMemo } from "react";

function RegimeLegend() {
    const { theme, colors } = useTheme();
    const regimes = Object.keys(REGIME_COLORS) as OrbitRegime[];
    return (
        <div style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            display: "flex",
            gap: "14px",
            background: theme === "dark" ? "rgba(10,15,24,0.8)" : "rgba(255,255,255,0.85)",
            border: `1px solid ${colors.border}`,
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: "12px",
            zIndex: 5,
        }}>
            {regimes.map((r) => (
                <span key={r} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: colors.textSecondary,
                }}>
                    <span style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: REGIME_COLORS[r],
                    }} />
                    {r}
                </span>
            ))}
        </div>
    );
}

function EmptyState() {
    const { theme, colors } = useTheme();
    return (
        <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
        }}>
            <div style={{
                background: theme === "dark" ? "rgba(10,15,24,0.9)" : "rgba(255,255,255,0.9)",
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                padding: "20px 28px",
                textAlign: "center",
            }}>
                <div style={{ fontSize: "14px", color: colors.textSecondary, marginBottom: "4px" }}>
                    No satellites match the current filters.
                </div>
                <div style={{ fontSize: "12px", color: colors.textMuted }}>
                    Adjust or reset filters to see satellites.
                </div>
            </div>
        </div>
    );
}

function Dashboard() {
    const { filteredSatellites } = useAppState();
    const { colors } = useTheme();
    const showEmpty = filteredSatellites.length === 0;

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gridTemplateRows: "auto 1fr",
            gap: "12px",
            height: "100%",
            minHeight: 0,
        }}>
            <div style={{ gridColumn: "1 / -1" }}>
                <FilterBar />
            </div>
            <div style={{
                position: "relative",
                background: colors.bgPrimary,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                overflow: "hidden",
                minHeight: 0,
            }}>
                <GlobeView />
                <RegimeLegend />
                {showEmpty && <EmptyState />}
                <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    fontSize: "10px",
                    color: colors.textDim,
                    zIndex: 5,
                    maxWidth: "200px",
                    textAlign: "right",
                }}>
                    Drag to rotate · Scroll to zoom
                </div>
            </div>
            <div style={{ minHeight: 0, overflow: "hidden" }}>
                <DetailsPanel />
            </div>
        </div>
    );
}

function LoadingState() {
    const { colors } = useTheme();
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            flexDirection: "column",
            gap: "12px",
        }}>
            <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: `2px solid ${colors.border}`,
                borderTopColor: colors.accentBlue,
                animation: "spin 0.8s linear infinite",
            }} />
            <div style={{ fontSize: "13px", color: colors.textMuted }}>
                Loading satellite data...
            </div>
        </div>
    );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    const { colors } = useTheme();
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
        }}>
            <div style={{
                background: colors.bgTertiary,
                border: `1px solid ${colors.errorRed}`,
                borderRadius: "8px",
                padding: "24px 32px",
                textAlign: "center",
                maxWidth: "400px",
            }}>
                <div style={{ fontSize: "14px", color: colors.errorRed, marginBottom: "8px" }}>
                    Unable to load data
                </div>
                <div style={{ fontSize: "13px", color: colors.textSecondary, marginBottom: "16px" }}>
                    {message}
                </div>
                <button
                    onClick={onRetry}
                    style={{
                        background: colors.bgSecondary,
                        border: `1px solid ${colors.borderSecondary}`,
                        borderRadius: "4px",
                        padding: "6px 16px",
                        fontSize: "13px",
                        color: colors.textSecondary,
                        cursor: "pointer",
                    }}
                >
                    Retry
                </button>
            </div>
        </div>
    );
}

export default function App() {
    const { satellites, loading, error } = useDataset();
    const { summary } = useDataset();

    const headerSubtitle = useMemo(() => {
        if (loading || error || !summary) return "";
        return `${summary.totalSatellites} satellites · ${summary.regimes.join(", ")} · ${summary.groups.join(", ")}`;
    }, [loading, error, summary]);

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                <Header subtitle="" />
                <div style={{ flex: 1, minHeight: 0 }}>
                    <LoadingState />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                <Header subtitle="" />
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ErrorState
                        message={error}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Header subtitle={headerSubtitle} />
            <div style={{ flex: 1, minHeight: 0, padding: "12px" }}>
                <AppProvider satellites={satellites}>
                    <Dashboard />
                </AppProvider>
            </div>
        </div>
    );
}

function Header({ subtitle }: { subtitle: string }) {
    const { colors } = useTheme();
    return (
        <header style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
        }}>
            <div>
                <h1 style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 600,
                    color: colors.textPrimary,
                    letterSpacing: "-0.01em",
                }}>
                    Satellite Explorer
                </h1>
                {subtitle && (
                    <div style={{ fontSize: "12px", color: colors.textMuted, marginTop: "2px" }}>
                        {subtitle}
                    </div>
                )}
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
            }}>
                <span style={{ fontSize: "11px", color: colors.textDim }}>
                    Educational visualization · Simulated positions
                </span>
                <ThemeToggle />
            </div>
        </header>
    );
}

function ThemeToggle() {
    const { theme, colors, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
                background: "transparent",
                border: `1px solid ${colors.borderSecondary}`,
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "13px",
                color: colors.textSecondary,
                cursor: "pointer",
                lineHeight: 1.4,
                minWidth: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {isDark ? "\u2600" : "\u263D"}
        </button>
    );
}
