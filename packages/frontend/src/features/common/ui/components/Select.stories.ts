import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "./Select";

const countryOptions = [
  { value: "es", label: "Spain" },
  { value: "en", label: "United Kingdom" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
];

const meta = {
  title: "Common/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: "Select a country",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Country",
    options: countryOptions,
    placeholder: "Select a country",
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: "Country",
    options: countryOptions,
    defaultValue: "es",
  },
};

export const WithError: Story = {
  args: {
    label: "Country",
    options: countryOptions,
    placeholder: "Select a country",
    error: "Please select a valid country",
  },
};

export const Required: Story = {
  args: {
    label: "Language",
    options: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
    ],
    placeholder: "Select a language",
    required: true,
  },
};
