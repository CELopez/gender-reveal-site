# 🎰 Gender Reveal Site

A beautiful, interactive gender reveal website built with Jekyll and hosted on GitHub Pages. Create magical moments with stunning slot machine animations and share the excitement with your loved ones!

## ✨ Features

- **🎰 Slot Machine Animation**: Realistic casino-style spinning reels
- **📱 Mobile-Friendly**: Responsive design that works on all devices
- **🖥️ Fullscreen Experience**: Immersive reveal animations
- **🎨 Beautiful Design**: Modern UI with smooth transitions
- **🔊 Sound Effects**: Audio feedback for enhanced experience
- **🎊 Confetti Celebration**: Animated confetti on reveal
- **📊 Analytics Ready**: Built-in tracking for future analytics integration

## 🚀 Quick Start

### Option 1: Use This Template
1. Click "Use this template" on GitHub
2. Name your repository (e.g., `gender-reveal-site`)
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://yourusername.github.io/gender-reveal-site/`

### Option 2: Clone and Deploy
```bash
git clone https://github.com/yourusername/gender-reveal-site.git
cd gender-reveal-site
```

## 🛠️ Local Development

### Prerequisites
- Ruby 2.7+
- Bundler
- Git

### Setup
```bash
# Install dependencies
bundle install

# Start development server
bundle exec jekyll serve

# Open in browser
open http://localhost:4000/gender-reveal-site/
```

## 📁 Project Structure

```
gender-reveal-site/
├── _config.yml              # Jekyll configuration
├── _layouts/
│   └── default.html         # Default page layout
├── index.html               # Landing page
├── choose.html              # Selection page
├── reveal.html              # Reveal animation page
├── assets/
│   ├── css/
│   │   └── style.css        # Custom styles
│   └── js/
│       ├── main.js          # Landing page logic
│       ├── choose.js        # Selection page logic
│       ├── reveal.js        # Reveal page logic
│       └── animations/
│           ├── slot.js      # Slot machine animation
│           └── fireworks.js # Future: Fireworks animation
└── README.md
```

## 🎮 How It Works

### User Flow
1. **Landing Page** (`/`): Welcome screen with preview and CTA
2. **Choose Page** (`/choose.html`): 3-step selection process
   - Step 1: Choose animation style (Slot Machine)
   - Step 2: Select gender (Boy/Girl)
   - Step 3: Confirm selections
3. **Reveal Page** (`/reveal.html`): Countdown and fullscreen animation

### Data Flow
- Selections stored in `sessionStorage`
- URL parameters for direct sharing
- No backend required - fully client-side

## 🎰 Slot Machine Animation

### Features
- Realistic spinning reels with physics
- Staggered reel stopping for drama
- Sound effects during spin
- Visual feedback on win
- Confetti celebration
- Screen flash effect
- Replay functionality

### Customization
Edit `assets/js/animations/slot.js` to modify:
- Spin duration and timing
- Visual effects
- Sound integration
- Reel symbols

## 🎨 Styling

### CSS Framework
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Custom CSS**: Additional styles in `assets/css/style.css`

### Color Schemes
- **Boy Theme**: Blue gradients (`#3b82f6`, `#1d4ed8`)
- **Girl Theme**: Pink gradients (`#ec4899`, `#be185d`)
- **Neutral**: Purple/gradient (`#8b5cf6`, `#ec4899`)

### Responsive Breakpoints
- Mobile: `< 480px`
- Tablet: `480px - 768px` 
- Desktop: `> 768px`

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select source: "Deploy from a branch"
4. Choose branch: `main` or `master`
5. Site will be available at: `https://yourusername.github.io/repository-name/`

### Custom Domain (Optional)
1. Add `CNAME` file with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

## 🔧 Configuration

### Jekyll Config (`_config.yml`)
```yaml
baseurl: "/gender-reveal-site"  # Update to match your repo name
title: "Gender Reveal"
description: "Create magical gender reveal moments"
```

### Important Notes
- Always use `{{ site.baseurl }}` for asset paths
- Test locally with the correct baseurl
- Ensure all links are relative to baseurl

## 📱 Mobile Optimization

- Touch-friendly interface
- Fullscreen API support
- Responsive typography
- Optimized animations for mobile devices
- Progressive enhancement for older browsers

## 🔊 Audio Integration

### Current Implementation
- Base64 encoded fallback sounds
- Multiple audio instances for overlapping effects
- Volume controls and error handling

### Adding Custom Sounds
1. Add audio files to `assets/audio/`
2. Update file paths in `reveal.html`
3. Ensure files are optimized for web

## 📊 Analytics Integration

### Built-in Tracking Events
- Page views
- Animation selections
- Gender choices
- Reveal completions
- Replay actions

### Add Analytics Service
Replace the placeholder `trackEvent` function in `assets/js/main.js` with your preferred service:
- Google Analytics
- PostHog
- Plausible
- Custom solution

## 🛡️ Browser Support

- **Modern Browsers**: Full experience with all animations
- **Safari**: Fullscreen API may require user gesture
- **Mobile**: Touch-optimized interface
- **Progressive Enhancement**: Core functionality works everywhere

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Maintain mobile-first responsive design
- Test all animations on different devices
- Ensure accessibility compliance
- Follow existing code style

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🎉 Future Enhancements

### Planned Features
- 🎆 Fireworks animation
- 🎈 Balloon pop animation  
- 🌈 Custom color themes
- 📱 Progressive Web App features
- 🔗 Social media sharing
- 💾 Save reveal videos
- 🎵 Custom music uploads

### Ideas Welcome!
Have an idea for a new animation or feature? Open an issue or submit a pull request!

## 📞 Support

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions and ideas
- **Documentation**: This README and inline code comments

---

**Made with ❤️ for creating magical moments**

Share your gender reveals using `#GenderRevealSite` - we'd love to see them!