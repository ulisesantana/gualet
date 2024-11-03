import {useLocation} from "wouter";
import {useEffect} from "react";

export function TestRouter({ path }: { path: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(path); // Set the location to the desired test path
  }, [path, setLocation]);

  return null; // This component only controls the path, no rendering needed
}
