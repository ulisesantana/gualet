import {PaymentMethod} from "./models";

export function generateDefaultPaymentMethods(): PaymentMethod[] {
  return [
    new PaymentMethod({
      icon: "💳",
      name: "Credit card",
    }),
    new PaymentMethod({
      icon: "💶",
      name: "Cash",
    }),
    new PaymentMethod({
      icon: "📱",
      name: "Bizum",
    }),
    new PaymentMethod({
      icon: "🏦",
      name: "Bank transfer",
    }),
  ];
}
