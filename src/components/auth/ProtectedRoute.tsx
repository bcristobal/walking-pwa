import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Verificar autenticación
    if (!AuthService.isAuthenticated() || AuthService.isTokenExpired()) {
      // Redirigir al login
      window.location.href = '/login';
    } else {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Mostrar nada mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }
  
  // Renderizar el contenido protegido si está autenticado
  return <>{children}</>;
};

export default ProtectedRoute;