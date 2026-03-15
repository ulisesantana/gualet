import React from "react";

import { LoadingSpinner } from "../Layout";

export function Loader(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} data-testid="loader">
      <LoadingSpinner />
    </div>
  );
}
