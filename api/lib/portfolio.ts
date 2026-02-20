/**
 * Portfolio Data Loader
 * Loads static TypeScript portfolio data for use in AI agents
 */

// Import all portfolio data types and instances
import { PORTFOLIO_DATA, type PortfolioData } from '../data/index';

/**
 * Get complete portfolio data
 * This is a synchronous function since data is static and bundled
 */
export function getPortfolioData(): PortfolioData {
  return PORTFOLIO_DATA;
}

/**
 * Get profile and education data
 */
export function getProfile() {
  return {
    profile: PORTFOLIO_DATA.profile,
    education: PORTFOLIO_DATA.education
  };
}

/**
 * Get all projects
 */
export function getProjects() {
  return PORTFOLIO_DATA.projects;
}

/**
 * Get featured projects only
 */
export function getFeaturedProjects() {
  return PORTFOLIO_DATA.projects.filter(p => p.featured);
}

/**
 * Get all experience
 */
export function getExperience() {
  return PORTFOLIO_DATA.experience;
}

/**
 * Get all skills
 */
export function getSkills() {
  return PORTFOLIO_DATA.skills;
}

/**
 * Get all publications
 */
export function getPublications() {
  return PORTFOLIO_DATA.publications;
}

/**
 * Get all activities
 */
export function getActivities() {
  return PORTFOLIO_DATA.activities;
}

export function searchProjects(query: string) {
  const stopWords = ['show', 'me', 'my', 'in', 'on', 'for', 'the', 'a', 'an', 'and', 'with', 'using', 'experience', 'projects', 'work'];
  const keywords = query.toLowerCase()
    .split(/[\s,]+/)
    .filter(k => k.length > 2 && !stopWords.includes(k));

  if (keywords.length === 0) return [];

  return PORTFOLIO_DATA.projects.filter(project => {
    const searchText = `${project.title} ${project.star.situation} ${project.star.task} ${project.star.action} ${project.star.result} ${project.technologies.join(' ')}`.toLowerCase();
    // specific check: if query has "visualization" or "visualisation", match "visual"
    const isVisQuery = keywords.some(k => k.includes('visual'));
    
    return keywords.some(k => searchText.includes(k)) || (isVisQuery && searchText.includes('visual'));
  });
}

/**
 * Search experience by keyword
 */
export function searchExperience(query: string) {
  const stopWords = ['show', 'me', 'my', 'in', 'on', 'for', 'the', 'a', 'an', 'and', 'with', 'using', 'experience', 'projects', 'work', 'job', 'role'];
  const keywords = query.toLowerCase()
    .split(/[\s,]+/)
    .filter(k => k.length > 2 && !stopWords.includes(k));

  if (keywords.length === 0) return [];

  return PORTFOLIO_DATA.experience.filter(exp => {
    // Include more fields for better matching
    const searchText = `${exp.company} ${exp.role} ${exp.star.situation || ''} ${exp.star.task || ''} ${exp.star.action || ''} ${exp.star.result}`.toLowerCase();
    
    // specific check: if query has "visualization" or "visualisation", match "visual"
    const isVisQuery = keywords.some(k => k.includes('visual'));
    
    return keywords.some(k => searchText.includes(k)) || (isVisQuery && searchText.includes('visual'));
  });
}

/**
 * Get a specific project by ID
 */
export function getProjectById(id: string) {
  return PORTFOLIO_DATA.projects.find(p => p.id === id);
}

/**
 * Get profile summary for quick responses
 */
export function getProfileSummary() {
  return {
    name: PORTFOLIO_DATA.profile.name,
    title: PORTFOLIO_DATA.profile.title,
    summary: PORTFOLIO_DATA.profile.summary,
    highlights: PORTFOLIO_DATA.profile.highlights,
    skillCount: Object.values(PORTFOLIO_DATA.skills).flat().length,
    projectCount: PORTFOLIO_DATA.projects.length,
    experienceCount: PORTFOLIO_DATA.experience.length
  };
}
