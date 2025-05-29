// src/hooks/useMobileMenu.js
import { useEffect } from 'react';

const useMobileMenu = () => {
  useEffect(() => {
    const button = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');

    const toggleMenu = () => {
      menu.classList.toggle('hidden');
    };

    button?.addEventListener('click', toggleMenu);
    return () => button?.removeEventListener('click', toggleMenu);
  }, []);
};

export default useMobileMenu;
