"use client";
import React, { useState, useEffect, use } from 'react';
import WidgetWrapper from './widget-wrapper';

// Define a type for the component props
interface BackgroundWidgetProps {
  // backgrounds: string[]; // Array of strings for background image URLs
  opacity?: number;
  interval?: number;
}

const defaultProps: BackgroundWidgetProps = {
  opacity: 0.5,
  interval: 30000,
}

const BackgroundWidget: React.FC<BackgroundWidgetProps> = ({interval, opacity} : BackgroundWidgetProps = defaultProps) => {

  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState<number>(0);

  const backgrounds = [
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
      className="fixed top-0 left-0 h-full w-full z-[-999] bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${backgrounds[currentBackgroundIndex]})`,
        transition: 'background-image 1s ease-in-out',
        opacity: opacity, // Add some transparency to the background
      }}
    >
    </div>
  );
};

// export default BackgroundWidget;

export default WidgetWrapper(BackgroundWidget, defaultProps);
