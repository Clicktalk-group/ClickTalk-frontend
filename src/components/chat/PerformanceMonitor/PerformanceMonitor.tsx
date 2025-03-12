// src/components/chat/PerformanceMonitor/PerformanceMonitor.tsx

import React, { useMemo } from 'react';
import './PerformanceMonitor.scss';
import { PerformanceMetrics } from '../../../hooks/usePerformanceMetrics/usePerformanceMetrics';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
  visible: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ metrics, visible }) => {
  // Utiliser useMemo pour éviter les calculs répétés à chaque render
  // Toujours appeler useMemo inconditionnellement
  const calculatedMetrics = useMemo(() => {
    // Fonction helper pour calculer la moyenne
    const calculateAverage = (values: number[]): number => {
      if (values.length === 0) return 0;
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    };

    // Extraire les valeurs de chaque métrique
    const messageDeliveryTimes = metrics.messageDeliveryTime.map(m => m.value);
    const renderTimes = metrics.renderTime.map(m => m.value);
    const streamingRates = metrics.streamingRate.map(m => m.value);
    const responseSizes = metrics.responseSize.map(m => m.value);

    // Limiter à 20 éléments maximum pour éviter les problèmes de performance
    const limitArray = (arr: number[]) => arr.slice(-20);

    return {
      messageDelivery: {
        average: calculateAverage(messageDeliveryTimes).toFixed(2),
        min: Math.min(...messageDeliveryTimes, Infinity).toFixed(2),
        max: Math.max(...messageDeliveryTimes, 0).toFixed(2),
        samples: messageDeliveryTimes.length
      },
      render: {
        average: calculateAverage(renderTimes).toFixed(2),
        min: Math.min(...renderTimes, Infinity).toFixed(2),
        max: Math.max(...renderTimes, 0).toFixed(2),
        samples: renderTimes.length
      },
      streaming: {
        average: calculateAverage(limitArray(streamingRates)).toFixed(2),
        min: Math.min(...streamingRates, Infinity).toFixed(2),
        max: Math.max(...streamingRates, 0).toFixed(2),
        samples: streamingRates.length
      },
      responseSize: {
        average: calculateAverage(responseSizes).toFixed(2),
        min: Math.min(...responseSizes, Infinity).toFixed(2),
        max: Math.max(...responseSizes, 0).toFixed(2),
        samples: responseSizes.length
      }
    };
  }, [metrics]);

  // Retourner null après avoir appelé les hooks
  if (!visible) return null;

  return (
    <div className="performance-monitor">
      <h3>Performance Metrics</h3>
      <div className="metrics-grid">
        <div className="metric-card metric-card--delivery">
          <h4>Message Delivery</h4>
          <p>Average: {calculatedMetrics.messageDelivery.average} ms</p>
          <p>Min: {calculatedMetrics.messageDelivery.min} ms</p>
          <p>Max: {calculatedMetrics.messageDelivery.max} ms</p>
          <p>Samples: {calculatedMetrics.messageDelivery.samples}</p>
        </div>
        
        <div className="metric-card metric-card--render">
          <h4>Component Render</h4>
          <p>Average: {calculatedMetrics.render.average} ms</p>
          <p>Min: {calculatedMetrics.render.min} ms</p>
          <p>Max: {calculatedMetrics.render.max} ms</p>
          <p>Samples: {calculatedMetrics.render.samples}</p>
        </div>
        
        <div className="metric-card metric-card--streaming">
          <h4>Streaming Rate</h4>
          <p>Average: {calculatedMetrics.streaming.average} chars/s</p>
          <p>Min: {calculatedMetrics.streaming.min} chars/s</p>
          <p>Max: {calculatedMetrics.streaming.max} chars/s</p>
          <p>Samples: {calculatedMetrics.streaming.samples}</p>
        </div>
        
        <div className="metric-card metric-card--response">
          <h4>Response Size</h4>
          <p>Average: {calculatedMetrics.responseSize.average} bytes</p>
          <p>Min: {calculatedMetrics.responseSize.min} bytes</p>
          <p>Max: {calculatedMetrics.responseSize.max} bytes</p>
          <p>Samples: {calculatedMetrics.responseSize.samples}</p>
        </div>
      </div>
    </div>
  );
};

// Utiliser React.memo pour éviter les rendus inutiles
export default React.memo(PerformanceMonitor);
