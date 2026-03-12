export type StarTheme = 'dream' | 'goal' | 'wish' | 'hope';
export type StarStatus = 'active' | 'dying' | 'archived';
export type BrightnessStage = 'protostar' | 'young' | 'mainSequence' | 'giant' | 'supergiant';

export interface Log {
  id: string;
  text: string;
  createdAt: Date;
}

export interface Star {
  id: string;
  catalogName: string;
  theme: StarTheme;
  title: string;
  initialText: string;
  status: StarStatus;
  brightnessStage: BrightnessStage;
  position: [number, number, number];
  logs: Log[];
  createdAt: Date;
  archivedAt?: Date;
}
