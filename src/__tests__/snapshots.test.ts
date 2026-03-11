import path from 'path';

import { composeStories } from '@storybook/react-vite';
import { describe, test, expect } from 'vitest';

// Helper to convert Storybook title to snapshot path
function titleToSnapshotPath(title: string, storyName: string): string {
  const normalized = title
    .split('/')
    .map((part) => part.trim())
    .map((part) => part.replace(/\s+/g, ''))
    .join('/');
  const sanitizedStoryName = storyName.replace(/\s+/g, '');
  return path.join('./__snapshots__', normalized, `${sanitizedStoryName}.snapshot`);
}

// Dynamically import all story files using Vite's glob import
const storyFiles = import.meta.glob('../**/*.stories.@(ts|tsx)', { eager: true });

// Process each story file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object.entries(storyFiles).forEach(([filePath, module]: [string, any]) => {
  const composedStories = composeStories(module);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testableStories: [string, any][] = Object.entries(composedStories)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter(([, story]: [string, any]) => story.parameters?.storyshots?.disable !== true);

  if (testableStories.length === 0) return;

  const componentName = module.default?.title || path.basename(filePath).replace(/\.stories\.(ts|tsx)$/, '');

  describe(`Snapshots: ${componentName}`, async () => {
    testableStories.forEach(([storyName, Story]) => {
      test(`${componentName} / ${storyName}`, async () => {
        await Story.run(); // Run the story

        const element = document.body.firstChild as HTMLElement | null;

        if (!element) {
          throw new Error(`Story "${storyName}" rendered nothing to the DOM`);
        }

        // Normalize MUI and React IDs in the DOM before snapshotting
        const seenIds = new Map<string, number>();
        let muiCounter = 1;
        let reactCounter = 1;

        const normalizeIds = (node: Element) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elementNode = node as Element;
            // Normalize MUI IDs (mui-p-123 -> stable-mocked-mui-id-1)
            if (elementNode.id && elementNode.id.match(/^mui-p-\d+$/)) {
              if (!seenIds.has(elementNode.id)) {
                seenIds.set(elementNode.id, muiCounter);
                muiCounter += 1;
              }
              elementNode.id = `stable-mocked-mui-id-${seenIds.get(elementNode.id)}`;
            }

            // Normalize React IDs in attributes (:r1a: -> :stable-mocked-react-id-1:)
            Array.from(elementNode.attributes).forEach((attr) => {
              const newValue = attr.value
                .replace(/mui-p-\d+/g, (originalId: string) => {
                  if (!seenIds.has(originalId)) {
                    seenIds.set(originalId, muiCounter);
                    muiCounter += 1;
                  }
                  return `stable-mocked-mui-id-${seenIds.get(originalId)}`;
                })
                .replace(/:r[0-9a-z]+:/g, (originalId: string) => {
                  if (!seenIds.has(originalId)) {
                    seenIds.set(originalId, reactCounter);
                    reactCounter += 1;
                  }
                  return `:stable-mocked-react-id-${seenIds.get(originalId)}:`;
                });
              attr.value = newValue;
            });
          }

          // Recursively process children
          Array.from(node.children).forEach(normalizeIds);
        };

        // Normalize dynamic IDs for stable snapshots
        normalizeIds(element);

        const snapshotPath = titleToSnapshotPath(componentName, storyName);
        expect(element).toMatchFileSnapshot(snapshotPath);
      });
    });
  });
});
