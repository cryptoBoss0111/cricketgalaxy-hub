
// Define a utility to optimize and improve image loading across the site

// List of known local images for quicker reference
const knownImages: Record<string, string> = {
  'MI': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Updated Mumbai Indians logo
  'CSK': '/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png',
  'RR': '/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png',
  'KKR': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Updated KKR logo
  'GT': '/lovable-uploads/ba068302-d7ba-4cdd-9735-cc9aac148031.png',
  'LSG': '/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png',
  'PBKS': '/lovable-uploads/8dca24c4-f648-4d13-b9d7-5227f02fc2ff.png',
  'RCB': '/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png'
};

// Map of image IDs to local paths for better performance
const imageIdMap: Record<string, string> = {
  '95836242-efe5-4dab-864c-1d7c3d183fd1': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // New MI logo
  '65c4f6b7-ff25-4841-bce7-30bc76245b41': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Previous MI logo ID points to new logo
  'ecc2d92f-2f5b-47a3-ae69-17dc0df384cd': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Updated MI logo
  '2a4ce6cf-adb0-4f0a-9c8a-3353432db175': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Previous MI logo ID points to new logo
  '1d4a5e68-72f5-4f46-9b46-071be8fdd0fa': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Previous MI logo ID points to new logo
  'f23e809f-871c-487b-b60f-cb1c0614fc56': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Older MI logo ID points to new logo
  '0e340cba-e05f-473c-a8f1-8cdefe533c00': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Direct MI logo ID
  '5b7f4438-0859-4c69-a3ee-5dc05d2cd4bf': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Previous MI logo ID points to new logo
  'ce55e622-ee4f-4402-a770-0dc4c874de64': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Updated KKR logo
  '6c575f57-57f9-4811-804e-0a850a01ef6d': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Previous KKR logo ID points to new logo
  'cc36f6fd-2f71-4dee-8313-6b2fa5cd7d21': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Direct KKR logo ID
  '46dae9e8-7caf-4b10-b557-c735f3a51161': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Direct KKR logo ID
  '051d2143-4908-4260-975a-746c1c9bd80d': '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png', // Direct MI logo ID
  '19133248-8247-4e8c-8615-f3c5b00d9287': "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png",
  '412c16d3-2e56-4ea0-b086-deed0e90d189': "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png",
  'ba068302-d7ba-4cdd-9735-cc9aac148031': "/lovable-uploads/ba068302-d7ba-4cdd-9735-cc9aac148031.png",
  '8dca24c4-f648-4d13-b9d7-5227f02fc2ff': "/lovable-uploads/8dca24c4-f648-4d13-b9d7-5227f02fc2ff.png",
  '95f7655d-a0d9-48a3-a64c-a8f362d04b31': "/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png",
  'e61767b2-868d-47bc-8eb7-911d51239eb1': "/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png"
};

/**
 * Gets the optimized image URL based on team shortname or image ID
 */
export const getOptimizedImageUrl = (url: string, teamShortName?: string): string => {
  // Hardcoded direct returns for MI and KKR to ensure they always work
  if (teamShortName === 'MI') {
    return '/lovable-uploads/95836242-efe5-4dab-864c-1d7c3d183fd1.png';
  }
  
  if (teamShortName === 'KKR') {
    return '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png';
  }
  
  // If we have a known image for this team, use it
  if (teamShortName && knownImages[teamShortName]) {
    return knownImages[teamShortName];
  }
  
  // If no URL provided, return placeholder
  if (!url) return '/placeholder.svg';
  
  // If URL is already a local path, return it
  if (url.startsWith('/lovable-uploads/')) {
    return url;
  }
  
  // Check for known image IDs in the URL
  for (const [id, path] of Object.entries(imageIdMap)) {
    if (url.includes(id)) {
      return path;
    }
  }
  
  // Return original URL if no optimizations found
  return url;
};

// Helper to preload images for faster display
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => {
      console.error(`Failed to preload image: ${url}`);
      resolve();
    };
  });
};

// Helper for common image props
export const getImageProps = (alt: string) => ({
  loading: 'eager' as const,
  decoding: 'async' as const,
  alt,
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${alt}`);
    (e.target as HTMLImageElement).src = '/placeholder.svg';
  }
});
