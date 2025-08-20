declare global {
  interface Window {
    scrollToSection: (sectionId: string) => void;
  }
}

export {};