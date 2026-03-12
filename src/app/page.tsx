import { LandingOverlay } from '@/components/ui/LandingOverlay';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-space-bg">
      {/* Background space elements could go here, but we will redirect to /cosmos */}
      <LandingOverlay />
    </main>
  );
}
