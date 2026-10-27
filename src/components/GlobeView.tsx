import { useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Satellite } from "../data/satelliteTypes";
import { useAppState, getRegimeColor } from "../state/AppState";
import { useTheme } from "../state/ThemeContext";

const EARTH_RADIUS_KM = 6371;
const SCALE = 1 / EARTH_RADIUS_KM;

function latLonToVector3(latDeg: number, lonDeg: number, altKm: number): THREE.Vector3 {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const r = (EARTH_RADIUS_KM + altKm) * SCALE;
    return new THREE.Vector3(
        r * Math.cos(lat) * Math.cos(lon),
        r * Math.sin(lat),
        -r * Math.cos(lat) * Math.sin(lon)
    );
}

interface PointData {
    satellite: Satellite;
    position: THREE.Vector3;
    color: string;
}

function SatelliteMarker({ point, isSelected, onSelect, onHover }: {
    point: PointData;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onHover: (id: number | null) => void;
}) {
    const color = point.color;
    const markerSize = isSelected ? 0.035 : 0.018;

    return (
        <group position={point.position}>
            <mesh
                onClick={(e: ThreeEvent<MouseEvent>) => {
                    e.stopPropagation();
                    onSelect(point.satellite.noradId);
                }}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover(point.satellite.noradId);
                    document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                    onHover(null);
                    document.body.style.cursor = "auto";
                }}
            >
                <sphereGeometry args={[markerSize, 12, 12]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {isSelected && (
                <mesh>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.6}
                        wireframe
                    />
                </mesh>
            )}
        </group>
    );
}

function SatellitePoints() {
    const { filteredSatellites, selectedNoradId, selectSatellite } = useAppState();
    const { colors } = useTheme();
    const [hovered, setHovered] = useState<number | null>(null);

    const points = useMemo<PointData[]>(() => {
        const result: PointData[] = [];
        for (const sat of filteredSatellites) {
            if (sat.positions.length === 0) continue;
            const pos = sat.positions[0];
            const v = latLonToVector3(pos.latitudeDeg, pos.longitudeDeg, pos.altitudeKm);
            result.push({
                satellite: sat,
                position: v,
                color: getRegimeColor(sat.orbitRegime),
            });
        }
        return result;
    }, [filteredSatellites]);

    const hoveredSat = hovered !== null
        ? points.find((p) => p.satellite.noradId === hovered)
        : null;

    const handleHover = useCallback((id: number | null) => {
        setHovered(id);
    }, []);

    return (
        <group>
            {points.map((p) => (
                <SatelliteMarker
                    key={p.satellite.noradId}
                    point={p}
                    isSelected={p.satellite.noradId === selectedNoradId}
                    onSelect={selectSatellite}
                    onHover={handleHover}
                />
            ))}

            {hoveredSat && (
                <Html
                    position={hoveredSat.position}
                    distanceFactor={3}
                    style={{ pointerEvents: "none" }}
                    zIndexRange={[10, 0]}
                >
                    <div style={{
                        background: colors.tooltipBg,
                        border: `1px solid ${colors.tooltipBorder}`,
                        borderRadius: "6px",
                        padding: "6px 10px",
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                        color: colors.tooltipText,
                        fontFamily: "system-ui, sans-serif",
                    }}>
                        <div style={{ fontWeight: 600 }}>{hoveredSat.satellite.name}</div>
                        <div style={{ opacity: 0.7, marginTop: "2px" }}>
                            {hoveredSat.satellite.group} · {hoveredSat.satellite.orbitRegime}
                        </div>
                        <div style={{ opacity: 0.7 }}>
                            Alt: {hoveredSat.satellite.meanAltitudeKm.toFixed(0)} km
                        </div>
                    </div>
                </Html>
            )}

            <OrbitControls
                enablePan={false}
                minDistance={1.5}
                maxDistance={8}
                rotateSpeed={0.5}
                zoomSpeed={0.8}
            />
        </group>
    );
}

function Earth() {
    const { colors } = useTheme();
    const textureRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (textureRef.current) {
            textureRef.current.rotation.y += delta * 0.02;
        }
    });

    return (
        <mesh ref={textureRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhongMaterial
                color={colors.earthColor}
                emissive={colors.earthEmissive}
                emissiveIntensity={0.4}
                shininess={5}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
}

function Atmosphere() {
    const { colors } = useTheme();
    return (
        <mesh scale={1.03}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
                color={colors.atmosphereColor}
                transparent
                opacity={0.08}
                side={THREE.BackSide}
            />
        </mesh>
    );
}

function GridLines() {
    const { colors } = useTheme();
    const geometry = useMemo(() => {
        const positions: number[] = [];
        const radius = 1.001;

        for (let lat = -75; lat <= 75; lat += 15) {
            for (let i = 0; i <= 64; i++) {
                const lon1 = (i / 64) * 2 * Math.PI;
                const lon2 = ((i + 1) / 64) * 2 * Math.PI;
                const latRad = (lat * Math.PI) / 180;
                positions.push(
                    radius * Math.cos(latRad) * Math.cos(lon1),
                    radius * Math.sin(latRad),
                    -radius * Math.cos(latRad) * Math.sin(lon1)
                );
                positions.push(
                    radius * Math.cos(latRad) * Math.cos(lon2),
                    radius * Math.sin(latRad),
                    -radius * Math.cos(latRad) * Math.sin(lon2)
                );
            }
        }

        for (let lon = 0; lon < 360; lon += 15) {
            for (let i = 0; i <= 64; i++) {
                const lat1 = (i / 64) * Math.PI - Math.PI / 2;
                const lat2 = ((i + 1) / 64) * Math.PI - Math.PI / 2;
                const lonRad = (lon * Math.PI) / 180;
                positions.push(
                    radius * Math.cos(lat1) * Math.cos(lonRad),
                    radius * Math.sin(lat1),
                    -radius * Math.cos(lat1) * Math.sin(lonRad)
                );
                positions.push(
                    radius * Math.cos(lat2) * Math.cos(lonRad),
                    radius * Math.sin(lat2),
                    -radius * Math.cos(lat2) * Math.sin(lonRad)
                );
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return geo;
    }, []);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color={colors.gridColor} transparent opacity={0.3} />
        </lineSegments>
    );
}

export function GlobeView() {
    const { colors } = useTheme();
    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Canvas
                camera={{ position: [3, 2, 3], fov: 50 }}
                style={{ background: colors.globeBackground }}
                gl={{ antialias: true, alpha: false }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 3, 5]} intensity={1.2} />
                <Earth />
                <GridLines />
                <Atmosphere />
                <SatellitePoints />
            </Canvas>
        </div>
    );
}
