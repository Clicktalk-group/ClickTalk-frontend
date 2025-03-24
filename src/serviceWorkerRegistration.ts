// Fonction pour enregistrer le service worker
export function register() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      
      registerValidSW(swUrl);
      
      // Vérifier les mises à jour toutes les 4 heures
      setInterval(() => {
        checkForUpdates(swUrl);
      }, 4 * 60 * 60 * 1000);
    });
  }
}

function registerValidSW(swUrl: string) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Vérifie s'il y a une mise à jour en attente
      if (registration.waiting) {
        notifyUserOfUpdate(registration);
      }

      // Écoute les mises à jour futures
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              notifyUserOfUpdate(registration);
            } else {
              // Contenu mis en cache pour utilisation hors ligne
            }
          }
        };
      };
    })
    .catch((error) => {
      // Gestion silencieuse des erreurs lors de l'enregistrement du service worker
    });
}

// Vérification périodique des mises à jour
function checkForUpdates(swUrl: string) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Service worker introuvable. Probablement une autre app.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker trouvé. Procéder normalement.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      // Application en mode hors-ligne - connexion internet indisponible
    });
}

function notifyUserOfUpdate(registration: ServiceWorkerRegistration) {
  // Créer une notification pour informer l'utilisateur
  const shouldUpdate = window.confirm(
    'Une nouvelle version de ClickTalk est disponible ! Cliquez sur OK pour mettre à jour.'
  );

  if (shouldUpdate && registration.waiting) {
    // Envoie un message au service worker en attente pour qu'il prenne le contrôle
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Recharge la page après un court délai
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }
}

// Désinscription du service worker
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        // Gestion silencieuse des erreurs de désinscription
      });
  }
}
