import { StarTheme, StarStatus, BrightnessStage } from '../types';

export const THEME_COLORS: Record<StarTheme, string> = {
  dream: 'hsl(45, 95%, 65%)', // Warm yellow
  goal: 'hsl(40, 80%, 80%)',  // White gold
  wish: 'hsl(220, 85%, 60%)', // Cobalt blue
  hope: 'hsl(280, 70%, 65%)', // Purple/Cyan
};

export const STAGE_SCALES: Record<BrightnessStage, number> = {
  protostar: 0.5,
  young: 0.8,
  mainSequence: 1.0,
  giant: 1.5,
  supergiant: 2.0,
};

export function getStarColor(theme: StarTheme, status: StarStatus): string {
  const baseColor = THEME_COLORS[theme];
  // In a real advanced shader we'd pass uniforms to desaturate.
  // For now, we will just return base color and let shaders/materials handle it based on status.
  return baseColor;
}

export function getBaseScale(stage: BrightnessStage): number {
  return STAGE_SCALES[stage];
}
