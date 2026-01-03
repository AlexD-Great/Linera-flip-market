/**
 * Load Linera client library dynamically
 */

export function loadLineraScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).linera) {
      console.log('Linera library already loaded');
      resolve();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="linera_web.js"]');
    if (existingScript) {
      console.log('Linera script tag exists, waiting for load...');
      existingScript.addEventListener('load', () => {
        console.log('Linera library loaded via existing script');
        resolve();
      });
      existingScript.addEventListener('error', (error) => {
        console.error('Linera script failed to load:', error);
        reject(new Error('Failed to load Linera library from CDN'));
      });
      return;
    }

    // Create and inject script tag
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@linera/client@0.15.7/dist/linera_web.js';
    script.async = true;
    // Don't set type="module" - let the browser handle it

    script.onload = () => {
      console.log('Linera library loaded successfully from CDN');
      // Give it a moment to initialize
      setTimeout(() => {
        if ((window as any).linera) {
          resolve();
        } else {
          reject(new Error('Linera library loaded but window.linera not available'));
        }
      }, 100);
    };

    script.onerror = (error) => {
      console.error('Failed to load Linera script:', error);
      reject(new Error('Failed to load Linera library from CDN'));
    };

    document.head.appendChild(script);
    console.log('Linera script tag injected');
  });
}
