import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import './NotFound.scss';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link to="/">
          <Button variant="primary">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
