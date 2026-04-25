import type { Preview } from "@storybook/react-vite";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import i18n from "./i18n";
import i18nEmpty from "./i18nEmpty";
import { theme } from "../src/theme";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        method: "alphabetical",
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        xs: {
          name: "Extra small",
          type: "mobile",
          styles: { width: "360px", height: "100%" },
        },
        sm: {
          name: "Small",
          type: "mobile",
          styles: { width: "600px", height: "100%" },
        },
        md: {
          name: "Medium",
          type: "tablet",
          styles: { width: "900px", height: "100%" },
        },
        lg: {
          name: "Large",
          type: "desktop",
          styles: { width: "1200px", height: "100%" },
        },
        xl: {
          name: "Extra large",
          type: "desktop",
          styles: { width: "1536px", height: "100%" },
        },
      },
    },
    i18n,
    a11y: {
      runOnly: [
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "best-practice",
        "wcag2aaa",
      ],
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <I18nextProvider i18n={parameters.noTranslations ? i18nEmpty : i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <MemoryRouter>
            <Routes>
              <Route path="*" element={<Story />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    ),
  ],
};

export default preview;
