# Christian Raro Portfolio

A modern, responsive portfolio website built with Next.js, React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 14, React 18, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive across all devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Smooth Animations**: Powered by Framer Motion for engaging interactions
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Performance**: Optimized for speed and accessibility
- **Contact Form**: Functional contact form with validation
- **Project Showcase**: Beautiful project cards with links and descriptions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter + Custom Display Font
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
my-portfolio/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── sections/          # Page sections
│   ├── ui/               # UI components
│   ├── navigation.tsx    # Navigation component
│   ├── footer.tsx        # Footer component
│   └── theme-provider.tsx # Theme provider
├── lib/                  # Utility functions
│   ├── data.ts          # Portfolio data
│   └── utils.ts         # Utility functions
├── types/               # TypeScript types
├── assets/              # Static assets
│   ├── images/          # Images
│   ├── fonts/           # Fonts
│   └── resume/          # Resume files
└── public/              # Public assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chrisraro/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Customization

### Personal Information
Update your personal information in `lib/data.ts`:
- Projects
- Skills
- Social links
- Contact information

### Styling
- Colors: Modify the color palette in `tailwind.config.js`
- Fonts: Update font imports in `app/globals.css`
- Animations: Customize animations in `app/globals.css`

### Images
Replace images in the `assets/images/` directory:
- Profile photo: `assets/images/about/christian-profile.png`
- Project screenshots: `assets/images/projects/`
- Resume: `assets/resume/`

## 🎨 Features Overview

### Sections
1. **Hero Section**: Introduction with animated background
2. **About Section**: Personal information and photo
3. **Works Section**: Project showcase with cards
4. **Skills Section**: Technology skills display
5. **Contact Section**: Contact form and information

### Components
- **Navigation**: Responsive navbar with theme toggle
- **Project Cards**: Interactive project showcase
- **Contact Form**: Functional form with validation
- **Theme Toggle**: Dark/light mode switcher
- **Animations**: Smooth scroll animations

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for performance
- **SEO**: Meta tags and structured data
- **Accessibility**: WCAG 2.1 compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Christian Raro**
- Email: rarochristian029@gmail.com
- LinkedIn: [Christian Raro](https://www.linkedin.com/in/christian-raro)
- GitHub: [@chrisraro](https://github.com/chrisraro)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Icon library

---

Made with ❤️ by Christian Raro
