import type {Preview} from "@storybook/react";

import "../src/features/common/ui/theme.css";
import "../src/features/common/ui/main.css";
import "../src/features/common/ui/forms.css";
import {ChakraProvider} from "@features/common";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ChakraProvider>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;

