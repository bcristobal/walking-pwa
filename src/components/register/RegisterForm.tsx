import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { AuthService } from '../../services/authService';

const apiUrl = "http://127.0.0.1:8000/gamification-api";

interface RegisterFormProps {
  
}

const RegisterForm: React.FC<RegisterFormProps> = ({}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Primero registrar al usuario
      const registerResponse = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          "email": email,
          "username": username,
          "password": password
        })
      });

      if (!registerResponse.ok) {
        let errorMessage = 'Error al registrar usuario';
        try {
          const errorData = await registerResponse.json();
          errorMessage = errorData?.detail || errorData?.message || errorMessage;
        } catch (jsonError) {
          // Si no podemos parsear el JSON, mantenemos el mensaje de error genérico
        }
        throw new Error(errorMessage);
      }

      setSuccess('Usuario registrado correctamente. Iniciando sesión...');
      
      // Después obtener el token de acceso
      const loginResponse = await fetch(`${apiUrl}/token`, {
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

      if (!loginResponse.ok) {
        let errorMessage = 'Usuario registrado pero error al iniciar sesión';
        try {
          const errorData = await loginResponse.json();
          errorMessage = errorData?.detail || errorData?.message || errorMessage;
        } catch (jsonError) {
          // Si no podemos parsear el JSON, mantenemos el mensaje de error genérico
        }
        throw new Error(errorMessage);
      }

      const data = await loginResponse.json();
      AuthService.setToken(data.access_token);
      window.location.href = "/home";

    } catch (err) {
      console.error('Error durante el registro:', err);
      setError(err instanceof Error ? err.message : 'Error en el proceso de registro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerBox}>
      <h2 className={styles.registerTitle}>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        
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
        
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.registerButton}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Registrarse'}
        </button>
        
        <div className={styles.registerFooter}>
          <a href="/login" className={styles.loginLink}>
            ¿Ya tienes cuenta? Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;