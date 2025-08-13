# Portfolio Website Documentation

## Project Overview
This is a modern, responsive portfolio website built with HTML5, CSS3, and JavaScript. The website features a clean design, smooth animations, and a dark/light theme toggle.

## Technology Stack

### Frontend Technologies
- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)**: Interactive functionality and animations
- **Bootstrap 5.3.0**: Responsive grid system and components
- **AOS (Animate On Scroll)**: Scroll-triggered animations
- **Animate.css**: Pre-built CSS animations
- **Font Awesome 6.4.0**: Icon library
- **Phosphor Icons**: Additional icon set

### External Services
- **Formspree**: Contact form handling
- **Google Fonts**: Typography (Clash Grotesk)
- **Custom Font**: ndot-47-inspired-by-nothing (local)

## File Structure
```
my-portfolio/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   ├── fonts/
│   │   ├── ndot-47-inspired-by-nothing.otf
│   │   ├── ndot-47-inspired-by-nothing.woff2
│   │   ├── license.txt
│   │   └── readme.txt
│   ├── images/
│   │   ├── about me section/  # Profile images
│   │   ├── hero section/      # Hero background
│   │   ├── projects section/  # Project screenshots
│   │   ├── Site icon/         # Favicon and logos
│   │   └── Additional Logo/   # Additional branding
│   └── resume/
│       └── Raro, Christian F - Resume.pdf
└── README.md
```

## Features

### 1. Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 991px
- Flexible grid layouts using CSS Grid and Flexbox
- Responsive typography with clamp()

### 2. Theme System
- Light/Dark theme toggle
- CSS custom properties for theme variables
- Smooth transitions between themes
- Persistent theme preference (localStorage)

### 3. Navigation
- Fixed navigation bar with blur effect
- Smooth scrolling to sections
- Active link highlighting
- Mobile hamburger menu
- Back to top button

### 4. Animations
- AOS (Animate On Scroll) integration
- Custom CSS animations
- Hover effects and transitions
- Loading animations
- Reduced motion support

### 5. Sections

#### Hero Section
- Full-screen landing area
- Animated text and social links
- Scroll indicator with glow effect
- Gradient background

#### About Section
- Bento-style avatar container
- Animated border glow
- Downloadable resume
- Location information

#### Works Section
- Project cards with hover effects
- Image overlays with project details
- Technology tags
- External links to live projects

#### Skills Section
- Grid layout of skill items
- Icon-based representation
- Hover animations
- Technology stack display

#### Contact Section
- Contact form with Formspree integration
- Social media links
- Form validation
- Success message animations

### 6. Performance Optimizations
- Optimized images
- Minified external libraries
- Efficient CSS selectors
- Lazy loading considerations
- Reduced motion support

## CSS Architecture

### Custom Properties (CSS Variables)
```css
:root {
  --primary: #000000;
  --secondary: #666666;
  --background: #ffffff;
  --accent: #e5e5e5;
  --spacing: clamp(1rem, 2vw, 2rem);
  /* ... more variables */
}
```

### Theme Variables
- Light theme (default)
- Dark theme with `[data-theme="dark"]` selector
- Smooth transitions between themes

### Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox layouts
- Fluid typography with clamp()
- Breakpoint-specific adjustments

## JavaScript Functionality

### 1. Theme Toggle
```javascript
// Theme switching with localStorage persistence
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});
```

### 2. Navigation
- Smooth scrolling to sections
- Active link highlighting with Intersection Observer
- Mobile menu toggle
- Back to top button functionality

### 3. Animations
- AOS initialization with custom settings
- Scroll-triggered animations
- Hover effects and transitions

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach

## Accessibility Features
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion support
- High contrast theme options

## Performance Considerations
- Optimized images and assets
- Efficient CSS selectors
- Minimal JavaScript footprint
- Lazy loading for better performance
- Caching strategies

## SEO Optimization
- Semantic HTML structure
- Meta tags and descriptions
- Open Graph tags
- Structured data markup
- Fast loading times

## Deployment
- Static site hosting ready
- No build process required
- CDN for external resources
- Formspree for contact form handling

## Maintenance
- Regular updates for external libraries
- Image optimization
- Performance monitoring
- Content updates
- Security updates

## Future Enhancements
- Blog section
- Project filtering
- Advanced animations
- CMS integration
- Analytics integration
- PWA features

## Contact Information
- **Developer**: Christian Raro
- **Email**: rarochristian029@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/christian-raro
- **GitHub**: https://github.com/chrisraro

## License
This project is for personal portfolio use. All rights reserved.
