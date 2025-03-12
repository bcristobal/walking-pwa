
/**
 * Clase de servicio para manejar la autenticación de usuario
 */
export class AuthService {
    private static TOKEN_KEY = 'authToken';
    
    /**
     * Obtiene el token de autenticación almacenado
     */
    static getToken(): string | null {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(this.TOKEN_KEY);
      }
      return null;
    }
    
    /**
     * Guarda el token de autenticación
     */
    static setToken(token: string): void {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    
    /**
     * Elimina el token y cierra la sesión
     */
    static logout(): void {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    
    /**
     * Verifica si el usuario está autenticado
     */
    static isAuthenticated(): boolean {
      return !!this.getToken();
    }
    
    /**
     * Obtiene los datos del token JWT (si es un JWT)
     */
    static getTokenData(): any {
      const token = this.getToken();
      if (!token) return null;
      
      try {
        // Decodifica el token JWT (formato: header.payload.signature)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    
    /**
     * Verifica si el token ha expirado
     */
    static isTokenExpired(): boolean {
      const tokenData = this.getTokenData();
      if (!tokenData) return true;
  
      // Si no hay campo exp, asumimos que el token no expira
      if (!tokenData.exp) return false;
  
      // Exp está en segundos, Date.now() en milisegundos
      const expirationTime = tokenData.exp * 1000;
      return Date.now() >= expirationTime;
    }
  }