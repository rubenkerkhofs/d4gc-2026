import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";

export type Theme = "dark" | "light";

export interface ThemeColors {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    border: string;
    borderSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textDim: string;
    accentBlue: string;
    errorRed: string;
    scrollbarThumb: string;
    scrollbarHover: string;
    rowBorder: string;
    globeBackground: string;
    earthColor: string;
    earthEmissive: string;
    gridColor: string;
    atmosphereColor: string;
    tooltipBg: string;
    tooltipBorder: string;
    tooltipText: string;
}

const darkColors: ThemeColors = {
    bgPrimary: "#05080d",
    bgSecondary: "#0a0f18",
    bgTertiary: "#0e131b",
    border: "#1e2530",
    borderSecondary: "#2a3340",
    textPrimary: "#e8eaed",
    textSecondary: "#a8b0bc",
    textMuted: "#6b7280",
    textDim: "#4a5260",
    accentBlue: "#4fb3d9",
    errorRed: "#e85d5d",
    scrollbarThumb: "#1e2530",
    scrollbarHover: "#2a3340",
    rowBorder: "#161c26",
    globeBackground: "radial-gradient(circle at 50% 50%, #0a0f18 0%, #05080d 100%)",
    earthColor: "#1a2a3a",
    earthEmissive: "#0a1420",
    gridColor: "#2a4a5a",
    atmosphereColor: "#4fb3d9",
    tooltipBg: "rgba(15,20,28,0.92)",
    tooltipBorder: "rgba(255,255,255,0.15)",
    tooltipText: "#e8eaed",
};

const lightColors: ThemeColors = {
    bgPrimary: "#f4f6f9",
    bgSecondary: "#ffffff",
    bgTertiary: "#ffffff",
    border: "#dfe3ea",
    borderSecondary: "#c8cdd6",
    textPrimary: "#1a2332",
    textSecondary: "#4a5568",
    textMuted: "#6b7280",
    textDim: "#9aa3b0",
    accentBlue: "#2b8ab8",
    errorRed: "#d14343",
    scrollbarThumb: "#c8cdd6",
    scrollbarHover: "#b0b6c2",
    rowBorder: "#eaecef",
    globeBackground: "radial-gradient(circle at 50% 50%, #e8edf3 0%, #d8dee8 100%)",
    earthColor: "#a8c4d8",
    earthEmissive: "#8ab0c8",
    gridColor: "#7a98ad",
    atmosphereColor: "#6ba8c8",
    tooltipBg: "rgba(255,255,255,0.95)",
    tooltipBorder: "rgba(0,0,0,0.12)",
    tooltipText: "#1a2332",
};

interface ThemeContextValue {
    theme: Theme;
    colors: ThemeColors;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const colors = theme === "dark" ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
