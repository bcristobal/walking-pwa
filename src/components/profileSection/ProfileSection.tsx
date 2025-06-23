import React, { useState, useEffect } from 'react';
import styles from './ProfileSection.module.css';
import { AuthService } from '../../services/authService';

const apiUrl = "http://127.0.0.1:8000/gamification-api";

interface ProfileSectionProps {
  
}

const ProfileSection: React.FC<ProfileSectionProps> = ({}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = AuthService.getToken();
      if (!token) return;

      // Updated to use the correct endpoint
      const response = await fetch(apiUrl + '/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUsername(userData.username || '');
        setEmail(userData.email || '');
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validations
    if (newPassword && newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // Updated payload structure to match API expectations
      const updateData: any = {
        username: username
      };

      // Only include password if it's being changed
      if (newPassword) {
        updateData.password = newPassword;
      }

      // Updated to use the correct endpoint
      const response = await fetch(apiUrl + '/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || 'Error al actualizar el perfil');
      }

      setSuccess('Perfil actualizado correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Reload user data
      await loadUserData();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileBox}>
        <h2 className={styles.profileTitle}>Mi Perfil</h2>
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información Personal</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="username">Nombre de Usuario</label>
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
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                className={`${styles.input} ${styles.disabledInput}`}
                title="El email no puede ser modificado desde este formulario"
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Cambiar Contraseña</h3>
            <p className={styles.sectionSubtitle}>Deja estos campos vacíos si no deseas cambiar tu contraseña</p>
            
            <div className={styles.inputGroup}>
              <label htmlFor="currentPassword">Contraseña Actual</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
                placeholder="Solo requerida si cambias la contraseña"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                minLength={6}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                minLength={6}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.updateButton}
            disabled={isLoading}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSection;