// src/utils/performance/metrics.ts

/**
 * Module de métriques de performance pour ClickTalk
 */

interface ChatMetrics {
  messageProcessingTime: number[];
  messageRenderTime: number[];
  timeToFirstMessage: number | null;
  totalChatInteractions: number;
  averageResponseTime: number | null;
}

interface NavigationMetrics {
  pageLoadTimes: Record<string, number[]>;
  navigationStartTime: number | null;
}

interface ModelMetrics {
  inferenceTime: number[];
  tokenProcessingRate: number[];
}

interface UiMetrics {
  inputLatency: number[];
  renderBlockingTime: number[];
  animationFrameRate: number[];
}

interface MemorySnapshot {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  timestamp: number;
}

interface ResourceMetrics {
  apiCallDurations: Record<string, number[]>;
  memoryUsage: MemorySnapshot[];
}

// État global des métriques
const metrics = {
  chat: {
    messageProcessingTime: [],
    messageRenderTime: [],
    timeToFirstMessage: null,
    totalChatInteractions: 0,
    averageResponseTime: null
  } as ChatMetrics,
  
  navigation: {
    pageLoadTimes: {} as Record<string, number[]>,
    navigationStartTime: null
  } as NavigationMetrics,
  
  model: {
    inferenceTime: [],
    tokenProcessingRate: []
  } as ModelMetrics,
  
  ui: {
    inputLatency: [],
    renderBlockingTime: [],
    animationFrameRate: []
  } as UiMetrics,
  
  resources: {
    apiCallDurations: {} as Record<string, number[]>,
    memoryUsage: []
  } as ResourceMetrics
};

/**
 * Calcule la moyenne d'un tableau de nombres
 */
function calculateAverage(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Démarre le suivi des métriques personnalisées
 */
export function trackCustomMetrics(): void {
  // Observer les transitions de page
  observePageNavigation();
  
  // Track API calls
  monitorAPIPerformance();
  
  // Observer les performances de l'UI
  observeUIPerformance();
  
  // Observer les performances du chat
  if (window.PerformanceObserver) {
    observeAnimationPerformance();
  }
  
  // Rapport périodique des métriques
  if (process.env.NODE_ENV === 'production') {
    setInterval(reportMetrics, 60000); // rapport toutes les minutes
  }
}

/**
 * Enregistre le début d'une action de navigation
 */
export function startNavigation(pageName: string): void {
  metrics.navigation.navigationStartTime = performance.now();
}

/**
 * Enregistre la fin d'une action de navigation
 */
export function endNavigation(pageName: string): void {
  if (!metrics.navigation.navigationStartTime) return;
  
  const endTime = performance.now();
  const duration = endTime - metrics.navigation.navigationStartTime;
  
  // Initialiser le tableau si c'est la première navigation vers cette page
  if (!metrics.navigation.pageLoadTimes[pageName]) {
    metrics.navigation.pageLoadTimes[pageName] = [];
  }
  
  // Ajouter le temps de navigation
  metrics.navigation.pageLoadTimes[pageName].push(duration);
  
  // Réinitialiser le temps de début
  metrics.navigation.navigationStartTime = null;
}

/**
 * Enregistre une métrique de message de chat
 */
export function trackChatMessageMetrics(options: {
  processingTime?: number;
  renderTime?: number;
  isFirstMessage?: boolean;
  responseTime?: number;
}): void {
  // Mise à jour du nombre total d'interactions
  metrics.chat.totalChatInteractions++;
  
  // Enregistrer le temps de traitement du message si fourni
  if (options.processingTime !== undefined) {
    metrics.chat.messageProcessingTime.push(options.processingTime);
  }
  
  // Enregistrer le temps de rendu du message si fourni
  if (options.renderTime !== undefined) {
    metrics.chat.messageRenderTime.push(options.renderTime);
  }
  
  // Enregistrer le temps jusqu'au premier message si c'est le premier
  if (options.isFirstMessage && options.responseTime !== undefined) {
    metrics.chat.timeToFirstMessage = options.responseTime;
  }
  
  // Mettre à jour le temps de réponse moyen
  if (options.responseTime !== undefined) {
    const responseTimesCount = metrics.chat.messageProcessingTime.length;
    if (metrics.chat.averageResponseTime === null) {
      metrics.chat.averageResponseTime = options.responseTime;
    } else {
      // Calcul pondéré pour éviter de réinitialiser complètement la moyenne
      metrics.chat.averageResponseTime = 
        (metrics.chat.averageResponseTime * responseTimesCount + options.responseTime) / 
        (responseTimesCount + 1);
    }
  }
}

/**
 * Enregistre des métriques du modèle de ML
 */
export function trackModelMetrics(options: {
  inferenceTime?: number;
  tokensProcessed?: number;
  processingTimeMs?: number;
}): void {
  // Tracking du temps d'inférence
  if (options.inferenceTime !== undefined) {
    metrics.model.inferenceTime.push(options.inferenceTime);
  }
  
  // Calcul et tracking du taux de traitement des tokens
  if (options.tokensProcessed !== undefined && options.processingTimeMs !== undefined) {
    const tokensPerSecond = (options.tokensProcessed / options.processingTimeMs) * 1000;
    metrics.model.tokenProcessingRate.push(tokensPerSecond);
  }
}

/**
 * Observe les changements de page et les transitions
 */
function observePageNavigation(): void {
  // Utilisation de l'API History pour suivre les navigations
  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);
  
  window.history.pushState = function(...args) {
    startNavigation(args[2] as string);
    const result = originalPushState(...args);
    setTimeout(() => endNavigation(args[2] as string), 0);
    return result;
  };
  
  window.history.replaceState = function(...args) {
    startNavigation(args[2] as string);
    const result = originalReplaceState(...args);
    setTimeout(() => endNavigation(args[2] as string), 0);
    return result;
  };
  
  // Écouter les événements popstate (navigation arrière/avant)
  window.addEventListener('popstate', () => {
    startNavigation(window.location.pathname);
    setTimeout(() => endNavigation(window.location.pathname), 0);
  });
}

/**
 * Surveille les performances des appels API
 */
function monitorAPIPerformance(): void {
  // Surcharge de fetch pour mesurer les performances
  const originalFetch = window.fetch;
  
  window.fetch = async function(input, init) {
    const startTime = performance.now();
    
    try {
      const response = await originalFetch.apply(this, [input, init]);
      const endTime = performance.now();
      
      // Détermine l'URL de l'appel
      let url: string;
      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof Request) {
        url = input.url;
      } else {
        // Cas de l'URL
        url = (input as URL).toString();
      }
      
      // Enregistrement des durées d'appel API
      const apiEndpoint = new URL(url, window.location.origin).pathname;
      if (!metrics.resources.apiCallDurations[apiEndpoint]) {
        metrics.resources.apiCallDurations[apiEndpoint] = [];
      }
      
      metrics.resources.apiCallDurations[apiEndpoint].push(endTime - startTime);
      
      return response;
    } catch (error) {
      const endTime = performance.now();
      throw error;
    }
  };
}

/**
 * Observe les performances de l'interface utilisateur
 */
function observeUIPerformance(): void {
  // Surveillance de l'utilisation de la mémoire si disponible
  const perfMemory = (performance as any).memory;
  if (perfMemory) {
    setInterval(() => {
      const memorySnapshot: MemorySnapshot = {
        usedJSHeapSize: perfMemory.usedJSHeapSize || 0,
        totalJSHeapSize: perfMemory.totalJSHeapSize || 0,
        timestamp: Date.now()
      };
      
      metrics.resources.memoryUsage.push(memorySnapshot);
    }, 30000); // Capture toutes les 30 secondes
  }
  
  // Mesure de la latence des entrées
  let lastInputTime = 0;
  
  const trackInputLatency = (): void => {
    const now = performance.now();
    if (lastInputTime !== 0) {
      const latency = now - lastInputTime;
      if (latency < 1000) { // Ignorer les latences excessives (inactivité)
        metrics.ui.inputLatency.push(latency);
      }
    }
    lastInputTime = now;
  };
  
  // Suivi des interactions utilisateur
  ['click', 'keydown', 'mousedown', 'touchstart'].forEach(eventType => {
    document.addEventListener(eventType, trackInputLatency, { passive: true });
  });
}

/**
 * Observe les performances d'animation
 */
function observeAnimationPerformance(): void {
  // Observer les long tasks
  if (window.PerformanceObserver) {
    try {
      const longTaskObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          metrics.ui.renderBlockingTime.push(entry.duration);
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      
      // Mesurer la fluidité des animations (FPS)
      let frameCounter = 0;
      let lastReportTime = performance.now();
      
      const frameCallback = (): void => {
        const now = performance.now();
        frameCounter++;
        
        // Calculer et enregistrer le taux d'images toutes les secondes
        if (now - lastReportTime >= 1000) {
          const fps = Math.round(frameCounter * 1000 / (now - lastReportTime));
          metrics.ui.animationFrameRate.push(fps);
          
          frameCounter = 0;
          lastReportTime = now;
        }
        
        requestAnimationFrame(frameCallback);
      };
      
      requestAnimationFrame(frameCallback);
    } catch (e) {
      // Silently handle errors in performance observation
    }
  }
}

/**
 * Interface pour les statistiques d'API
 */
interface ApiStats {
  average: number | null;
  max: number | null;
  min: number | null;
  count: number;
}

/**
 * Rapporte les métriques collectées
 */
function reportMetrics(): void {
  // Calcul des statistiques de métriques
  const averagePageLoadTimes: Record<string, number | null> = {};
  Object.entries(metrics.navigation.pageLoadTimes).forEach(([page, times]) => {
    averagePageLoadTimes[page] = calculateAverage(times);
  });
    
  // Performance des API
  const apiPerformance: Record<string, ApiStats> = {};
  Object.entries(metrics.resources.apiCallDurations).forEach(([api, durations]) => {
    apiPerformance[api] = {
      average: calculateAverage(durations),
      max: durations.length ? Math.max(...durations) : null,
      min: durations.length ? Math.min(...durations) : null,
      count: durations.length
    };
  });

  const summaryMetrics = {
    chat: {
      averageMessageProcessingTime: calculateAverage(metrics.chat.messageProcessingTime),
      averageMessageRenderTime: calculateAverage(metrics.chat.messageRenderTime),
      totalInteractions: metrics.chat.totalChatInteractions,
      timeToFirstMessage: metrics.chat.timeToFirstMessage
    },
    navigation: { averagePageLoadTimes },
    model: {
      averageInferenceTime: calculateAverage(metrics.model.inferenceTime),
      averageTokenProcessingRate: calculateAverage(metrics.model.tokenProcessingRate)
    },
    ui: {
      averageInputLatency: calculateAverage(metrics.ui.inputLatency),
      averageRenderBlockingTime: calculateAverage(metrics.ui.renderBlockingTime),
      averageFrameRate: calculateAverage(metrics.ui.animationFrameRate)
    },
    resources: {
      apiPerformance,
      latestMemoryUsage: metrics.resources.memoryUsage.length ? 
        metrics.resources.memoryUsage[metrics.resources.memoryUsage.length - 1] : null
    }
  };
  
  // En production, envoi à un service d'analyse (simulé ici)
  if (process.env.NODE_ENV === 'production') {
    // Code pour envoyer les métriques à votre backend ou service d'analytics
    // fetch('/api/metrics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(summaryMetrics),
    // });
  }
  
  // Réinitialisation des métriques temporaires pour éviter la consommation excessive de mémoire
  // Nous gardons les valeurs moyennes mais réinitialisons les tableaux
  if (metrics.ui.inputLatency.length > 100) metrics.ui.inputLatency = [];
  if (metrics.ui.renderBlockingTime.length > 50) metrics.ui.renderBlockingTime = [];
  if (metrics.ui.animationFrameRate.length > 10) metrics.ui.animationFrameRate = [];
  if (metrics.resources.memoryUsage.length > 10) metrics.resources.memoryUsage.splice(0, metrics.resources.memoryUsage.length - 5);
  
  // Réinitialiser certaines métriques d'API pour économiser de la mémoire
  Object.keys(metrics.resources.apiCallDurations).forEach(key => {
    if (metrics.resources.apiCallDurations[key].length > 50) {
      metrics.resources.apiCallDurations[key] = metrics.resources.apiCallDurations[key].slice(-20);
    }
  });
}

// Exporter l'objet metrics pour un accès direct si nécessaire
export const perfMetrics = metrics;