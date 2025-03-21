import React, { useState } from 'react';
import styles from './navbar.module.css';

// Definición de los tipos para los items de navegación
type NavItem = {
  id: string;
  icon: string;
  label: string;
  url: string;
};

// Propiedades del componente
interface NavBarProps {
  onNavigate?: (page: string) => void;
  defaultActive?: string;
}

const NavBar: React.FC<NavBarProps> = ({ 
  onNavigate,
  defaultActive = 'home'
 
}) => {
  // Estado para controlar el item activo
  const [activeItem, setActiveItem] = useState<string>(defaultActive);

  // Definición de los items de navegación
  const navItems: NavItem[] = [
    { id: 'home', icon: '🏠', label: 'Inicio', url: '/home' },
    { id: 'challenge', icon: '🚶‍➡️', label: 'Reto', url: '/challenges' },
    { id: 'clasification', icon: '🏆', label: 'Clasificacion', url: '/clasification' },
    { id: 'profile', icon: '👤', label: 'Perfil', url: '/profile' },
  ];

  // Función para manejar el clic en un item
  const handleNavItemClick = (id: string) => {
    setActiveItem(id);
    if (onNavigate) {
      onNavigate(id);
    }
    console.log('Navegando a:', id);
  };

  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => (
        <a
          key={item.id}
          className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
          onClick={() => handleNavItemClick(item.id)}
          data-page={item.id}
          href={item.url}
        >
          {item.icon}
        </a>
      ))}
    </nav>
  );
};

export default NavBar;