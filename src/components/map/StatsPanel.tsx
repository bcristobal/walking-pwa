import React from 'react';
import { formatTime } from './TimeFormatter';
import style from "./myMap.module.css";

interface StatsPanelProps {
  distance: number;
  elapsedTime: number;
}

export const StatsPanel = ({ distance, elapsedTime }: StatsPanelProps) => {
  return (
    <div className={style.statsPanel}>
      <div className={style.statItem}>
        <div className={style.statLabel}>Distancia:</div>
        <div className={style.statValue}>{distance.toFixed(3)} km</div>
      </div>
      <div className={style.statItem}>
        <div className={style.statLabel}>Tiempo:</div>
        <div className={style.statValue}>{formatTime(elapsedTime)}</div>
      </div>
    </div>
  );
};