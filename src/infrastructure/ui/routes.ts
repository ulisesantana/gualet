export const routes = {
  categories: {
    detail: "/categories/details/:id",
    list: "/categories",
  },
  paymentMethods: {
    detail: "/payment-methods/details/:id",
    list: "/payment-methods",
  },
  transactions: {
    details: "/transactions/details/:id",
  },
  root: "/",
  settings: "/settings",
};

export function generatePath(
  path: string,
  params: { [key: string]: string | number },
) {
  return path.replace(/:(\w+)/g, (_, key) => params[key].toString());
}
