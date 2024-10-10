import type { Preview } from "@storybook/react";
import "../src/infrastructure/ui/theme.css"; // Import your global styles
import "../src/infrastructure/ui/main.css"; // Import your global styles
import "../src/infrastructure/ui/forms.css"; // Import your global styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
