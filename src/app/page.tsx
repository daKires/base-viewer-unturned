import Scene3DClient from "@/components/Scene3DClient";
import SelectionPanel from "@/components/SelectionPanel";
import UIOverlay from "@/components/UIOverlay";

export default function Page() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-zinc-950">
      <div className="absolute inset-0">
        <Scene3DClient />
      </div>
      <UIOverlay />
      <SelectionPanel />
    </main>
  );
}
