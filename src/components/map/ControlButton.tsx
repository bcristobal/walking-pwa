import React from 'react';
import style from "./myMap.module.css";

interface ControlButtonProps {
  isTracking: boolean;
  onClick: () => void;
}

export const ControlButton = ({ isTracking, onClick }: ControlButtonProps) => {
  return (
    <button 
      className={`${style.startButton} ${isTracking ? style.stopButton : ''}`}
      onClick={onClick}
    >
      {isTracking ? "Detener" : "Empezar"}
    </button>
  );
};