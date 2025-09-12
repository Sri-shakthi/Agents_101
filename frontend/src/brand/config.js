import ackoLogo from '../assets/white-acko.svg';
import tricogLogo from '../assets/tricog-logo.webp';

export const BRAND_CONFIG = {
  acko: {
    name: 'ACKO',
    logoSrc: ackoLogo, // served from public
    href: 'https://www.acko.com',
    alt: 'ACKO',
  },
  tricog: {
    name: 'Tricog',
    logoSrc: tricogLogo, // using existing svg asset as placeholder
    href: 'https://tricog.com', 
    alt: 'Tricog',
  },
}

export function getBrandConfig(brand) {
  return BRAND_CONFIG[brand] || BRAND_CONFIG.acko
}


