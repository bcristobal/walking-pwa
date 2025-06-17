import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { AuthService } from '../../services/authService';

const apiUrl = "http://127.0.0.1:8000/gamification-api";

interface RegisterFormProps {
  
}

const RegisterForm: React.FC<RegisterFormProps> = ({}) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      // Create user registration request
      const response = await fetch(`${apiUrl}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar usuario');
      }

      const userData = await response.json();
      setSuccess('¡Usuario registrado exitosamente! Ya puedes iniciar sesión.');
      
      // Clear form
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      
      // Optionally auto-login after successful registration
      // You can uncomment this section if you want to automatically log in the user
      /*
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

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        AuthService.setToken(loginData.access_token);
        window.location.href = "/home";
      }
      */

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>¡Registro Exitoso!</h2>
        <p>Tu cuenta ha sido creada correctamente.</p>
        <a href="/login" className={styles.registerLink}>
          Ir a Iniciar Sesión
        </a>
      </div>
    );
  }

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