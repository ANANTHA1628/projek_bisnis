import React from 'react';

export default function ProductIcon({ type }) {
  switch (type) {
    case 'fries':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 11V6M10 11V4M13 11V7M16 11V5M19 11V8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 11H19L17 21H7L5 11Z" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'toast':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="6" width="16" height="14" rx="3" fill="#b45309" stroke="#d97706" strokeWidth="1.5" />
          <path d="M8 10L16 16M16 10L8 16" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case 'croissant':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 4C8 4 5 7 4 12C3 15 4 18 6 19C7.5 19.5 9 18 10 16C11 14 13 14 14 16C15 18 16.5 19.5 18 19C20 18 21 15 20 12C19 7 16 4 12 4Z" fill="#d97706" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M10 8C11 7 13 7 14 8" stroke="#fef3c7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'tea':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 8H18L16.5 19C16.5 20.1 15.6 21 14.5 21H9.5C8.4 21 7.5 20.1 7.5 19L6 8Z" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
          <path d="M14 4L12 8" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="14" r="2" fill="#6ee7b7" opacity="0.6" />
        </svg>
      );
    case 'chocolate':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="8" width="12" height="12" rx="2" fill="#78350f" stroke="#92400e" strokeWidth="1.5" />
          <path d="M18 11C19.5 11 20 12 20 13.5C20 15 19.5 16 18 16" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 5C9 6.5 10 6.5 10 8M14 5C14 6.5 15 6.5 15 8" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'matcha':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 9H17C17 15 14 19 11 19C8 19 5 15 5 9Z" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
          <path d="M17 11H19C20.1 11 21 11.9 21 13C21 14.1 20.1 15 19 15H17" stroke="#22c55e" strokeWidth="1.5" />
          <ellipse cx="11" cy="9" rx="6" ry="2" fill="#86efac" />
        </svg>
      );
    case 'aren':
    case 'cappuccino':
    case 'latte':
    case 'americano':
    default:
      // Stylized warm coffee cup with cream / foam
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 9H17V15C17 17.2 15.2 19 13 19H9C6.8 19 5 17.2 5 15V9Z" fill="#854d0e" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M17 11C18.5 11 19.5 11.8 19.5 13C19.5 14.2 18.5 15 17 15" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 5C8 6 9 6.5 9 7.5M12 4C12 5 13 5.5 13 6.5M16 5C16 6 15 6.5 15 7.5" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        </svg>
      );
  }
}
