import React, { useState, useEffect } from 'react';
import { Blurhash } from 'react-blurhash';
import './OptimizedImage.scss';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  blurhash?: string; // Blurhash pour l'aperçu pendant le chargement
  fallbackSrc?: string; // Image de secours si l'image principale échoue
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  blurhash = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  fallbackSrc,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
    setImgSrc(src);
  }, [src]);

  // Tentative de charger une version WebP de l'image si possible
  useEffect(() => {
    // Uniquement pour les images JPG ou PNG
    if (!src.match(/\.(jpe?g|png)$/i)) return;
    
    // Créer le chemin vers la version WebP
    const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');
    
    // Vérifier si la version WebP existe
    const img = new Image();
    img.onload = () => {
      setImgSrc(webpSrc);
    };
    img.onerror = () => {
      // WebP n'existe pas, on utilise l'original
      setImgSrc(src);
    };
    img.src = webpSrc;
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  // Calculer des classes CSS au lieu de styles en ligne
  const containerSizeClass = width || height ? 'has-dimensions' : 'auto-dimensions';

  return (
    <div 
      className={`optimized-image-container ${containerSizeClass} ${className}`}
      data-width={width}
      data-height={height}
    >
      {!isLoaded && !error && (
        <div className="blurhash-container">
          <Blurhash
            hash={blurhash}
            width={width || 400}
            height={height || 300}
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        className={`optimized-image ${isLoaded ? 'loaded' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        // Le loading="lazy" a été supprimé pour la compatibilité avec tous les navigateurs
      />
    </div>
  );
};

export default OptimizedImage;
