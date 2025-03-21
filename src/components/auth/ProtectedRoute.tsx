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
    // Verificar autenticación de forma asíncrona
    const checkAuth = () => {
      if (!AuthService.isAuthenticated()) {
        window.location.href = '/login';
        return;
      }
      
      // Si hay token, verificar si ha expirado
      if (AuthService.isTokenExpired()) {
        AuthService.logout(); // Limpiar el token expirado
        window.location.href = '/login';
        return;
      }
      
      // Si llegamos aquí, el usuario está autenticado
      setIsAuthenticated(true);
    };
    
    checkAuth();
  }, []);
  
  // Mostrar un loader mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return <div></div>;
  }
  
  // Renderizar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;