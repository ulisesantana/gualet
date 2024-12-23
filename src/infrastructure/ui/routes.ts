export const routes = {
  categories: {
    add: "/categories/add",
    details: "/categories/details/:id",
    list: "/categories",
  },
  paymentMethods: {
    details: "/payment-methods/details/:id",
    list: "/payment-methods",
  },
  transactions: {
    details: "/transactions/details/:id",
  },
  reports: "/reports",
  root: "/",
  settings: "/settings",
};

export function generatePath(
  path: string,
  params: { [key: string]: string | number },
) {
  return path.replace(/:(\w+)/g, (_, key) => params[key].toString());
}
