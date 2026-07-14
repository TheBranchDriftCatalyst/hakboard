import { useState } from "react";
import { useInterval } from "@/hooks/useInterval";

interface BackgroundProps {
  opacity?: number;
  intervalSeconds?: number;
}

const backgrounds = [
  "backgrounds/bg0.jpg",
  "backgrounds/bg1.jpg",
  "backgrounds/bg2.jpg",
  "backgrounds/bg3.jpg",
];

const Background = ({ opacity = 0.5, intervalSeconds = 30 }: BackgroundProps) => {
  const [index, setIndex] = useState(0);

  useInterval(() => setIndex((prev) => (prev + 1) % backgrounds.length), intervalSeconds * 1000);

  return (
    <div
      className="fixed top-0 left-0 h-full w-full z-[-10] bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${backgrounds[index]})`,
        transition: "background-image 1s ease-in-out",
        opacity,
      }}
    />
  );
};

export default Background;
