"use client";

import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-zinc-500">
      Carregando cena 3D...
    </div>
  ),
});

export default function Scene3DClient() {
  return (
    <div className="h-full w-full">
      <Scene3D />
    </div>
  );
}
