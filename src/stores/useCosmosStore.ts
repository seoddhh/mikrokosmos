import { create } from 'zustand';

export type ViewMode = 'explore' | 'detail' | 'create';

interface CosmosStore {
  cameraTarget: [number, number, number];
  zoomLevel: number;
  viewMode: ViewMode;
  setCameraTarget: (target: [number, number, number]) => void;
  setViewMode: (mode: ViewMode) => void;
  setZoomLevel: (level: number) => void;
}

export const useCosmosStore = create<CosmosStore>((set) => ({
  cameraTarget: [0, 0, 0],
  zoomLevel: 10,
  viewMode: 'explore',

  setCameraTarget: (target) => set({ cameraTarget: target }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
}));
