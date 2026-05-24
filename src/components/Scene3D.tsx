"use client";

import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { useBaseStore } from "@/store/useBaseStore";
import BuildItemMesh from "./BuildItemMesh";
import BuilderInteraction from "./BuilderInteraction";

export default function Scene3D() {
  const buildItems = useBaseStore((state) => state.buildItems);
  const isSelectMode = useBaseStore((state) => state.isSelectMode);
  const isDragSelecting = useBaseStore(
    (state) => state.dragStartPoint !== null
  );

  return (
    <Canvas
      shadows
      camera={{ position: [16, 16, 16], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#bcd4ff", "#1a1a1a", 0.35]} />
      <directionalLight
        position={[24, 32, 16]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.04}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
      />

      <Grid
        args={[100, 100]}
        cellSize={4}
        cellThickness={0.6}
        cellColor="#4a4a4a"
        sectionSize={16}
        sectionThickness={1.5}
        sectionColor="#6a6a6a"
        fadeDistance={80}
        fadeStrength={1}
        infiniteGrid
      />

      <BuilderInteraction />

      {buildItems.map((item) => (
        <BuildItemMesh key={item.id} item={item} />
      ))}

      <OrbitControls
        makeDefault
        enableRotate={!isSelectMode}
        enabled={!isDragSelecting}
      />
    </Canvas>
  );
}
