declare global {
  interface Window {
    env: {
      [name: string]: string | undefined;
      // You may add entries here if you'd like to have type-checking for your environment variables
      PUBLIC_NODE_ENV: string;
    };
  }
}

export {};

// Hold execution until the environment variables are loaded
while (typeof window.env !== 'object') await new Promise(
  (resolve) => { setTimeout(resolve, 100); },
);
