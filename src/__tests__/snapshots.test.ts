import path from 'path';

import { composeStories } from '@storybook/react-vite';
import {
  describe, test, expect, afterEach,
} from 'vitest';

// Device tiers used to generate three sets of snapshots.
// Width values are representative pixels within each MUI breakpoint range.
const DEVICE_TIERS = [
  { name: 'Mobile', width: 360 }, // xs  — below sm - Mobile
  { name: 'Tablet', width: 900 }, // md  — between sm and lg - Tablet
  { name: 'Desktop', width: 1200 }, // lg+ — above lg breakpoint - Desktop
] as const;

// Helper to convert Storybook title to snapshot path
function titleToSnapshotPath(tier: string, title: string, storyName: string): string {
  const normalized = title
    .split('/')
    .map((part) => part.trim())
    .map((part) => part.replace(/\s+/g, ''))
    .join('/');
  const sanitizedStoryName = storyName.replace(/\s+/g, '');
  return path.join('./__snapshots__', tier, normalized, `${sanitizedStoryName}.snapshot`);
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
    afterEach(() => {
      // Reset to desktop width after each test
      (window as Window & { innerWidth: number }).innerWidth = DEVICE_TIERS.find((t) => t.name === 'Desktop')!.width;
    });

    DEVICE_TIERS.forEach(({ name: tierName, width }) => {
      describe(tierName, () => {
        testableStories.forEach(([storyName, Story]) => {
          test(`${componentName} / ${storyName}`, async () => {
            (window as Window & { innerWidth: number }).innerWidth = width;

            await Story.run(); // Run the story

            const element = document.body.firstChild as HTMLElement | null;

            if (!element) {
              throw new Error(`Story "${storyName}" rendered nothing to the DOM`);
            }

            // Normalize MUI and React IDs in the DOM before snapshotting
            const seenIds = new Map<string, number>();
            let muiCounter = 1;
            let reactCounter = 1;
            let litCounter = 1;

            const normalizeIds = (node: Node) => {
              // Normalize lit IDs from DiSC graph package
              if (node.nodeType === Node.COMMENT_NODE && node.nodeValue) {
                if (!seenIds.has(node.nodeValue)) {
                  seenIds.set(node.nodeValue, litCounter);
                  litCounter += 1;
                }
                node.nodeValue = `stable-mocked-lit-id-${seenIds.get(node.nodeValue)}`;
                return;
              }

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
                    // MUI Specific IDs
                    .replace(/mui-p-\d+/g, (originalId: string) => {
                      if (!seenIds.has(originalId)) {
                        seenIds.set(originalId, muiCounter);
                        muiCounter += 1;
                      }
                      return `stable-mocked-mui-id-${seenIds.get(originalId)}`;
                    })
                    // New React IDs
                    .replace(/:r[0-9a-z]+:/g, (originalId: string) => {
                      if (!seenIds.has(originalId)) {
                        seenIds.set(originalId, reactCounter);
                        reactCounter += 1;
                      }
                      return `:stable-mocked-react-id-${seenIds.get(originalId)}:`;
                    })
                    // Old React IDs
                    .replace(/_r_[0-9a-z]+_/g, (originalId: string) => {
                      if (!seenIds.has(originalId)) {
                        seenIds.set(originalId, reactCounter);
                        reactCounter += 1;
                      }
                      return `_stable-mocked-react-id-${seenIds.get(originalId)}_`;
                    });
                  attr.value = newValue;
                });
              }

              // Traverse into shadow DOM if present
              // This is important for components that use Shadow DOM
              // like the DiSC graph package, to ensure
              // their internal IDs are also normalized
              if (node.nodeType === Node.ELEMENT_NODE && (node as Element).shadowRoot) {
                Array.from((node as Element).shadowRoot!.childNodes).forEach(normalizeIds);
              }

              // Recursively process children
              Array.from(node.childNodes).forEach(normalizeIds);
            };

            // Normalize dynamic IDs for stable snapshots
            normalizeIds(element);

            // Normalize inline styles to remove transition animation artifacts.
            // MUI's Grow/Fade set transform via JS at different lifecycle ticks;
            // scale(1, 1) and none are visually identical but cause flaky diffs.
            element.querySelectorAll('[style]').forEach((el) => {
              el.setAttribute(
                'style',
                el.getAttribute('style')!
                  .replace(/transform:\s*scale\(1,\s*1\)/g, 'transform: none'),
              );
            });

            const snapshotPath = titleToSnapshotPath(tierName, componentName, storyName);
            expect(element).toMatchFileSnapshot(snapshotPath);
          });
        });
      });
    });
  });
});
