/**
 * Publications Data
 * Edit this file to add/update your research publications
 */

export interface Publication {
  id: number;
  title: string;
  outlet: string;
  date: string;
  url: string;
  related_project_id: string | null;
}

export const PUBLICATIONS: Publication[] = [
  {
    id: 1,
    title:
      "An exploratory text-mining approach to analyzing DEI-related issues in eight leading architecture & design firms' publications",
    outlet: "The Design Journal, 1-25",
    date: "2025",
    url: "https://www.tandfonline.com/doi/abs/10.1080/14606925.2025.2482556",
    related_project_id: null,
  },
  {
    id: 2,
    title: "An algorithmic approach for text summarization",
    outlet:
      "2023 International Conference for Advancement in Technology (ICONAT), 1-5",
    date: "2023",
    url: "https://ieeexplore.ieee.org/abstract/document/10080575",
    related_project_id: null,
  },
];
