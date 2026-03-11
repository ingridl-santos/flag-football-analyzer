import '@testing-library/jest-dom';

// Mock element scrollTo for Vitest as mocked DOM does not implement it
Element.prototype.scrollTo = vi.fn();
