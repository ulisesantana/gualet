// This file is intentionally kept minimal.
// All stories are defined in CategoryList.stories.tsx
import type { Meta } from "@storybook/react";

import { CategoryList } from "./CategoryList";

const meta: Meta<typeof CategoryList> = {
  title: "Categories/CategoryList",
  component: CategoryList,
  tags: ["!dev", "!autodocs", "!test"],
};

export default meta;
