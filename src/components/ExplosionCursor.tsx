"use client";

import { useMemo } from "react";
import { DoubleSide } from "three";
import { EXPLOSIVES_BY_MAP } from "@/data/unturned-data";
import { useBaseStore } from "@/store/useBaseStore";
import { splashRadiusInWorld } from "@/utils/raidMath";

export default function ExplosionCursor() {
  const isRaidSimulatorMode = useBaseStore((s) => s.isRaidSimulatorMode);
  const selectedExplosiveId = useBaseStore((s) => s.selectedExplosiveId);
  const simulatorHoverPoint = useBaseStore((s) => s.simulatorHoverPoint);
  const currentMap = useBaseStore((s) => s.currentMap);

  const explosive = useMemo(() => {
    if (!selectedExplosiveId) return null;
    return (
      EXPLOSIVES_BY_MAP[currentMap].find(
        (e) => e.id === selectedExplosiveId
      ) ?? null
    );
  }, [selectedExplosiveId, currentMap]);

  if (!isRaidSimulatorMode || !explosive || !simulatorHoverPoint) return null;
  if (explosive.splashRadius <= 0) return null;

  const radius = splashRadiusInWorld(explosive.splashRadius);
  const [x, y, z] = simulatorHoverPoint;

  return (
    <>
      <mesh
        position={[x, y + 0.06, z]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={2}
      >
        <ringGeometry args={[Math.max(0.05, radius - 0.12), radius, 64]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.55}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[x, y, z]} renderOrder={2}>
        <sphereGeometry args={[radius, 24, 12]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.12}
          wireframe
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
