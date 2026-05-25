import FloatingBOMWindow from "@/components/FloatingBOMWindow";
import FloatingRaidMathWindow from "@/components/FloatingRaidMathWindow";
import Scene3DClient from "@/components/Scene3DClient";
import SelectionPanel from "@/components/SelectionPanel";
import UIOverlay from "@/components/UIOverlay";
import WelcomeModal from "@/components/WelcomeModal";

export default function Page() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-zinc-950">
      <div className="absolute inset-0">
        <Scene3DClient />
      </div>
      <UIOverlay />
      <SelectionPanel />
      <WelcomeModal />

      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <FloatingBOMWindow />
        <FloatingRaidMathWindow />
      </div>
    </main>
  );
}
