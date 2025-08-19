declare global {
  interface Window {
    scrollToSection: (sectionId: string) => void;
    gtag: (...args: any[]) => void;
  }
}

export {};