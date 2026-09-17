export interface StratSimRacePoint {
  lap: number;
  wear: number;
  grip: number;
  rain: number;
  shouldPit: boolean;
  pitExecuted: boolean;
}

// Rounded for display from D:/Projects/F1/scripts/model_testing/tire_manager_simulation.csv.
// This is one saved tire-manager test, not a measured real-world race outcome.
const wear = [0, 1.42, 2.84, 6.08, 8.11, 10.14, 12.17, 14.2, 16.22, 18.25, 20.28, 22.31, 24.34, 26.36, 28.39, 30.42, 32.45, 34.48, 36.5, 38.53, 40.56, 42.59, 44.62, 46.64, 48.67, 50.7, 52.73, 54.76, 56.78, 56.55, 58.5, 60.45, 62.4, 64.35, 66.3, 68.25, 70.2, 72.15, 74.1, 76.05, 0, 0.91, 1.82, 3.9, 5.2, 6.5, 7.8, 9.1, 10.4, 11.7];
const grip = [1, .998, .995, .985, .977, .968, .958, .947, .935, .922, .909, .895, .88, .865, .849, .832, .815, .798, .779, .761, .742, .722, .702, .681, .66, .639, .617, .595, .572, .575, .553, .53, .508, .484, .46, .436, .412, .387, .362, .337, 1, .999, .998, .992, .988, .983, .978, .973, .966, .96];

export const STRATSIM_RACE_POINTS: StratSimRacePoint[] = wear.map((value, index) => ({
  lap: index + 1,
  wear: value,
  grip: grip[index],
  rain: index >= 29 ? 0.5 : 0,
  shouldPit: index >= 31 && index <= 39,
  pitExecuted: index === 40,
}));
