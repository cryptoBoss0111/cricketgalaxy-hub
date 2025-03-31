
// Define a utility to optimize and improve image loading across the site

// List of known local images for quicker reference
const knownImages: Record<string, string> = {
  'MI': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png', // Updated Mumbai Indians logo with the newly uploaded image
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
  // New Mumbai Indians logo (latest uploaded)
  '1718f29d-1883-4a28-8d2e-297f47801e7e': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  
  // Previous Mumbai Indians logo IDs point to new logo
  '7c6b5fbe-264b-4ddb-8a13-3ad8757b5556': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  'd032bae5-4076-4cc1-adb8-e2ad1ac0906a': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '5822342e-1583-4231-8d81-afed50615136': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '24add757-3d73-4ffc-b77f-51c845609433': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '19133248-8247-4e8c-8615-f3c5b00d9287': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '95836242-efe5-4dab-864c-1d7c3d183fd1': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '65c4f6b7-ff25-4841-bce7-30bc76245b41': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  'ecc2d92f-2f5b-47a3-ae69-17dc0df384cd': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '2a4ce6cf-adb0-4f0a-9c8a-3353432db175': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '1d4a5e68-72f5-4f46-9b46-071be8fdd0fa': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  'f23e809f-871c-487b-b60f-cb1c0614fc56': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '0e340cba-e05f-473c-a8f1-8cdefe533c00': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '5b7f4438-0859-4c69-a3ee-5dc05d2cd4bf': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  '051d2143-4908-4260-975a-746c1c9bd80d': '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png',
  
  // KKR and other team logos
  'ce55e622-ee4f-4402-a770-0dc4c874de64': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Updated KKR logo
  '6c575f57-57f9-4811-804e-0a850a01ef6d': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Previous KKR logo ID points to new logo
  'cc36f6fd-2f71-4dee-8313-6b2fa5cd7d21': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Direct KKR logo ID
  '46dae9e8-7caf-4b10-b557-c735f3a51161': '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png', // Direct KKR logo ID
  '412c16d3-2e56-4ea0-b086-deed0e90d189': "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png",
  'ba068302-d7ba-4cdd-9735-cc9aac148031': "/lovable-uploads/ba068302-d7ba-4cdd-9735-cc9aac148031.png",
  '8dca24c4-f648-4d13-b9d7-5227f02fc2ff': "/lovable-uploads/8dca24c4-f648-4d13-b9d7-5227f02fc2ff.png",
  '95f7655d-a0d9-48a3-a64c-a8f362d04b31': "/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png",
  'e61767b2-868d-47bc-8eb7-911d51239eb1': "/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png",
  '1e95e00e-b311-4ab0-89d3-cb051ab0e846': "/lovable-uploads/1e95e00e-b311-4ab0-89d3-cb051ab0e846.png", // Sunil Narine image
  '5bb2ea7d-70ca-49f6-9f96-1002a5b7b550': "/lovable-uploads/5bb2ea7d-70ca-49f6-9f96-1002a5b7b550.png", // Varun Chakravarthy image
  '143884fc-6b7b-4af4-b860-2122a3ebcd67': "/lovable-uploads/143884fc-6b7b-4af4-b860-2122a3ebcd67.png", // Tilak Varma image
  'fe2f72a9-f686-42da-bdbe-553aac70e888': "/lovable-uploads/fe2f72a9-f686-42da-bdbe-553aac70e888.png", // Venkatesh Iyer image
  '4c55a560-556b-4890-b1d3-7375ad7a8f23': "/lovable-uploads/87f31ffe-3086-45ed-ae49-ccdcdaaf0347.png", // Updated Jasprit Bumrah image
  '87f31ffe-3086-45ed-ae49-ccdcdaaf0347': "/lovable-uploads/87f31ffe-3086-45ed-ae49-ccdcdaaf0347.png",  // New Jasprit Bumrah image
  '2b9b3d5f-ead2-46a4-b348-f15346af1401': "/lovable-uploads/2b9b3d5f-ead2-46a4-b348-f15346af1401.png",  // Shubman Gill image
  '4e9330c7-46db-4c36-ab1e-cba38e23d97c': "/lovable-uploads/4e9330c7-46db-4c36-ab1e-cba38e23d97c.png"   // Additional player image
};

/**
 * Gets the optimized image URL based on team shortname or image ID
 */
export const getOptimizedImageUrl = (url: string, teamShortName?: string): string => {
  // Hardcoded direct returns for MI and KKR to ensure they always work
  if (teamShortName === 'MI') {
    return '/lovable-uploads/1718f29d-1883-4a28-8d2e-297f47801e7e.png';
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
