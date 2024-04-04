"use client";
import React, { useEffect, useState } from 'react';

// Define a type for the component props
interface BackgroundProps {
  // backgrounds: string[]; // Array of strings for background image URLs
  opacity?: number;
  interval?: number;
}

const defaultProps: BackgroundProps = {
  opacity: 0.5,
  interval: 30,
}

const Background: React.FC<BackgroundProps> = ({interval, opacity} : BackgroundProps = defaultProps) => {

  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState<number>(0);

  const backgrounds = [
    // TODO: get this dynamically from a folder or from dropbox in the future
    "backgrounds/bg0.jpg",
    "backgrounds/bg1.jpg",
    "backgrounds/bg2.jpg",
    "backgrounds/bg3.jpg",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, interval || 30 * 1000);

    return () => clearInterval(timer);
  }, [backgrounds.length, interval]);

  return (
    <div
      className="fixed top-0 left-0 h-full w-full z-[-10] bg-center bg-no-repeat bg-cover"
      style={{
        // TODO: this is going to be something like.... 
        // getBackgroundFromPRovider(DropboxProvider, "backgrounds") -> urls[]
        backgroundImage: `url(${backgrounds[currentBackgroundIndex]})`,
        transition: 'background-image 1s ease-in-out',
        opacity: opacity, // Add some transparency to the background
      }}
    >
    </div>
  );
};

export default Background;
