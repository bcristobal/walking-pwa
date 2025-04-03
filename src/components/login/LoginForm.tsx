import React, { useState } from 'react';
import styles from './loginForm.module.css';
import { AuthService } from '../../services/authService';

const apiUrl = "http://127.0.0.1:8000/gamification-api";

interface LoginFormProps {
  
}

const LoginForm: React.FC<LoginFormProps> = ({}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    

    try {
      const response = await fetch(apiUrl+'/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: new URLSearchParams({
          'username': username,
          'password': password,
          'scope': '',
          'client_id': '',
          'client_secret': ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Usuario o contraseña incorrecta');
      }

      const data = await response.json();
      AuthService.setToken(data.access_token);
      window.location.href = "/home"

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Entrar'}
          </button>
          
          <div className={styles.loginFooter}>
            <a href="#registrarse" className={styles.registerLink}>
              ¿No tienes cuenta? Regístrate
            </a>
          </div>
        </form>
      </div>
    
  );
};

export default LoginForm;