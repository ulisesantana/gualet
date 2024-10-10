import type { Meta, StoryObj } from "@storybook/react";

import { AddTransactionForm } from "./AddTransactionForm";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "AddTransactionForm",
  component: AddTransactionForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof AddTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AddForm: Story = {
  args: {
    async onSubmit() {},
    settings: {
      incomeCategories: [
        "💰 Nómina",
        "🏷️ Ventas",
        "🏦 Intereses",
        "🫰🏻 Devolución",
      ],
      outcomeCategories: [
        "🚖 Taxi",
        "🍽️ Comida en el trabajo",
        "👨🏻‍🍳 Restaurante",
        "🛵 Comida a domicilio",
        "☕ Cafetería",
        "🛒 Supermercado",
        "📚 Cultura",
        "🍻 Alcohol",
        "💸 Suscripción",
        "💳 Crédito",
        "🏥 Farmacia",
        "🛍️ Ropa",
        "🚍 Guagua",
        "🛞 Transporte",
        "🛠️ Mantenimiento del hogar",
        "🪴 Ganja",
        "🧑‍⚕️ Médicos",
        "🧠 Terapia psicológica",
        "🐶 Mascotas",
        "💿 Música",
        "💻 Software",
        "🎮 Videojuegos",
        "🎓🚗 Autoescuela",
        "🎓 Formación",
        "🏠 Alquiler",
      ],
      types: ["Tarjeta", "Efectivo", "Bizum", "Transferencia"],
    },
  },
};
