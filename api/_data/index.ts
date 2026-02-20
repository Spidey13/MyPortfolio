/**
 * Portfolio Data - Central Export
 * This file combines all data modules into a single export
 */

export * from './profile';
export * from './experience';
export * from './projects';
export * from './publications';
export * from './skills';
export * from './activities';

import { PROFILE, EDUCATION } from './profile';
import { EXPERIENCE } from './experience';
import { PROJECTS } from './projects';
import { PUBLICATIONS } from './publications';
import { SKILLS } from './skills';
import { ACTIVITIES } from './activities';

/**
 * Combined Portfolio Data
 * This is the main data object used throughout the application
 */
export const PORTFOLIO_DATA = {
  profile: PROFILE,
  education: EDUCATION,
  experience: EXPERIENCE,
  projects: PROJECTS,
  skills: SKILLS,
  publications: PUBLICATIONS,
  activities: ACTIVITIES
} as const;

/**
 * Type for portfolio data
 */
export type PortfolioData = typeof PORTFOLIO_DATA;

/**
 * Legacy export for backward compatibility
 * @deprecated Use PORTFOLIO_DATA instead
 */
export const STATIC_PORTFOLIO_DATA = PORTFOLIO_DATA;
