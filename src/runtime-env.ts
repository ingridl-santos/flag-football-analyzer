declare global {
  interface Window {
    env: {
      [name: string]: string | undefined
      // You may add entries here if you'd like to have type-checking for your environment variables
    }
  }
}

export {};

// Hold execution until the environment variables are loaded
// eslint-disable-next-line no-await-in-loop -- This is intentional
while (typeof window.env !== 'object') await new Promise((resolve) => { setTimeout(resolve, 100); });
