// This file is intentionally kept minimal.
// All stories are defined in CategoryCard.stories.tsx
import type { Meta } from "@storybook/react";

import { CategoryCard } from "./CategoryCard";

const meta: Meta<typeof CategoryCard> = {
  title: "Categories/CategoryCard",
  component: CategoryCard,
  tags: ["!dev", "!autodocs", "!test"],
};

export default meta;
