import { useState } from "react";
import { Loader } from "@components";

export function useLoader() {
  const [isLoading, setIsLoading] = useState(true);

  return {
    isLoading,
    setIsLoading,
    Loader,
  };
}
