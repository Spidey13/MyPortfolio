/**
 * Portfolio Data - Central Export
 * This file combines all data modules into a single export
 */

export * from './profile.js';
export * from './experience.js';
export * from './projects.js';
export * from './publications.js';
export * from './skills.js';
export * from './activities.js';

import { PROFILE, EDUCATION } from './profile.js';
import { EXPERIENCE } from './experience.js';
import { PROJECTS } from './projects.js';
import { PUBLICATIONS } from './publications.js';
import { SKILLS } from './skills.js';
import { ACTIVITIES } from './activities.js';

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
