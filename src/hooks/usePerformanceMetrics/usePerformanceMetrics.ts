// src/hooks/usePerformanceMetrics/usePerformanceMetrics.ts

import { useState, useRef, useCallback } from 'react';

export interface PerformanceMetric {
  name: string;
  timestamp: number;
  value: number;
  unit: string;
}

export interface PerformanceMetrics {
  messageDeliveryTime: PerformanceMetric[];
  renderTime: PerformanceMetric[];
  streamingRate: PerformanceMetric[];
  responseSize: PerformanceMetric[];
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    messageDeliveryTime: [],
    renderTime: [],
    streamingRate: [],
    responseSize: [],
  });

  const messageTimings = useRef<Map<string, number>>(new Map());
  const renderTimings = useRef<Map<string, number>>(new Map());
  const streamStartTime = useRef<number | null>(null);
  const streamCharsCount = useRef<number>(0);
  const isRecordingStream = useRef<boolean>(false);
  
  const recordMessageStart = useCallback((messageId: string) => {
    messageTimings.current.set(messageId, performance.now());
  }, []);

  const recordMessageEnd = useCallback((messageId: string, size: number) => {
    const startTime = messageTimings.current.get(messageId);
    if (startTime) {
      const endTime = performance.now();
      const deliveryTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        messageDeliveryTime: [
          ...prev.messageDeliveryTime,
          {
            name: `Message ${messageId}`,
            timestamp: endTime,
            value: deliveryTime,
            unit: 'ms'
          }
        ],
        responseSize: [
          ...prev.responseSize,
          {
            name: `Message ${messageId}`,
            timestamp: endTime,
            value: size,
            unit: 'bytes'
          }
        ]
      }));
      
      messageTimings.current.delete(messageId);
    }
  }, []);
  
  const recordStreamingChunk = useCallback((chunk: string) => {
    // Prévenir le traitement multiple du même chunk
    if (isRecordingStream.current) return;
    isRecordingStream.current = true;
    
    try {
      const currentTime = performance.now();
      
      if (streamStartTime.current === null) {
        streamStartTime.current = currentTime;
        streamCharsCount.current = 0;
      }
      
      streamCharsCount.current += chunk.length;
      const timeElapsed = (currentTime - streamStartTime.current) / 1000;
      
      if (timeElapsed > 0.5) { // Record rate every 0.5 seconds
        const charsPerSecond = streamCharsCount.current / timeElapsed;
        
        setMetrics(prev => ({
          ...prev,
          streamingRate: [
            ...prev.streamingRate,
            {
              name: `Streaming ${Date.now()}`,
              timestamp: currentTime,
              value: charsPerSecond,
              unit: 'chars/s'
            }
          ]
        }));
        
        streamStartTime.current = currentTime;
        streamCharsCount.current = 0;
      }
    } finally {
      isRecordingStream.current = false;
    }
  }, []);
  
  const recordRenderStart = useCallback((componentId: string) => {
    renderTimings.current.set(componentId, performance.now());
  }, []);
  
  const recordRenderEnd = useCallback((componentId: string) => {
    const startTime = renderTimings.current.get(componentId);
    if (startTime) {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        renderTime: [
          ...prev.renderTime,
          {
            name: componentId,
            timestamp: endTime,
            value: renderTime,
            unit: 'ms'
          }
        ]
      }));
      
      renderTimings.current.delete(componentId);
    }
  }, []);
  
  const clearMetrics = useCallback(() => {
    setMetrics({
      messageDeliveryTime: [],
      renderTime: [],
      streamingRate: [],
      responseSize: [],
    });
    messageTimings.current.clear();
    renderTimings.current.clear();
    streamStartTime.current = null;
    streamCharsCount.current = 0;
  }, []);
  
  return {
    metrics,
    recordMessageStart,
    recordMessageEnd,
    recordStreamingChunk,
    recordRenderStart,
    recordRenderEnd,
    clearMetrics
  };
};

export default usePerformanceMetrics;
