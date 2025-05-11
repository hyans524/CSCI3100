import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <App />
  //</StrictMode>,
)

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu for mobile
  const navToggle = document.createElement('div');
  navToggle.classList.add('nav-toggle');
  navToggle.innerHTML = '<i class="fas fa-bars"></i>';
  document.querySelector('nav').appendChild(navToggle);

  navToggle.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
  });

  // Smooth scrolling (if needed)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Image slider for deals (example)
  // (Use libraries like Swiper.js for better sliders)
});