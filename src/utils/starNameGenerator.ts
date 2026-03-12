const PREFIXES = ['HD', 'HIP', 'GJ'];

export function generateStarName(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const number = Math.floor(1000 + Math.random() * 900000); // 4 to 6 digits roughly
  return `${prefix} ${number}`;
}
