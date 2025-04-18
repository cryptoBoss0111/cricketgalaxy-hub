
// Function to map path segments to category names
export const getCategoryFromPath = (pathSegment?: string): string => {
  switch (pathSegment) {
    case 'ipl':
      return 'IPL 2025';
    case 'test':
      return 'Test Cricket';
    case 't20':
      return 'T20 Cricket';
    case 'odi':
      return 'ODI Cricket';
    case 'womens':
      return 'Women\'s Cricket';
    case 'domestic':
      return 'Domestic Cricket';
    default:
      return 'All Categories';
  }
};

// Function to format category for URL
export const formatCategoryForUrl = (category: string): string => {
  switch (category) {
    case 'IPL 2025':
      return 'ipl';
    case 'Test Cricket':
      return 'test';
    case 'T20 Cricket':
      return 't20';
    case 'ODI Cricket':
      return 'odi';
    case 'Women\'s Cricket':
      return 'womens';
    case 'Domestic Cricket':
      return 'domestic';
    default:
      return '';
  }
};
