import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [_, setLocation] = useLocation();

  // Redirect to leads page by default
  useEffect(() => {
    setLocation("/leads");
  }, [setLocation]);

  return null;
}
