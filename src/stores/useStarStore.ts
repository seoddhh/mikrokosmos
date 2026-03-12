import { create } from 'zustand';
import { Star, StarTheme } from '../types';
import { mockStars } from '../data/mockStars';
import { generateStarName } from '../utils/starNameGenerator';

interface StarStore {
  stars: Star[];
  selectedStarId: string | null;
  createStar: (theme: StarTheme, title: string, text: string, position: [number, number, number]) => void;
  addLog: (starId: string, text: string) => void;
  archiveStar: (starId: string) => void;
  setSelectedStarId: (id: string | null) => void;
  getMyStars: () => Star[]; // In mock, all are "my" stars for now
}

export const useStarStore = create<StarStore>((set, get) => ({
  stars: mockStars,
  selectedStarId: null,

  createStar: (theme, title, text, position) => {
    const newStar: Star = {
      id: `star-${Date.now()}`,
      catalogName: generateStarName(),
      theme,
      title,
      initialText: text,
      status: 'active',
      brightnessStage: 'protostar',
      position,
      logs: [],
      createdAt: new Date(),
    };
    
    set((state) => ({ stars: [...state.stars, newStar] }));
  },

  addLog: (starId, text) => {
    set((state) => ({
      stars: state.stars.map((star) => {
        if (star.id === starId) {
          return {
            ...star,
            logs: [{ id: `log-${Date.now()}`, text, createdAt: new Date() }, ...star.logs],
            // Update status back to active if dying
            status: 'active',
            // Ideally also update brightness stage here, but keep simple for now
          };
        }
        return star;
      })
    }));
  },

  archiveStar: (starId) => {
    set((state) => ({
      stars: state.stars.map((star) => 
        star.id === starId 
          ? { ...star, status: 'archived', archivedAt: new Date(), logs: [] } 
          : star
      )
    }));
  },

  setSelectedStarId: (id) => {
    set({ selectedStarId: id });
  },

  getMyStars: () => {
    return get().stars;
  }
}));
