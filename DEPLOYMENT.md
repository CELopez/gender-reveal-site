# 🚀 Deployment Guide

## Quick GitHub Pages Deployment

### Step 1: Update Repository Name
1. If your repository name is not `gender-reveal-site`, update the `baseurl` in `_config.yml`:
   ```yaml
   baseurl: "/your-repository-name"
   ```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch (or **master** if using older Git)
5. Keep **/ (root)** selected
6. Click **Save**

### Step 3: Access Your Site
Your site will be available at:
```
https://yourusername.github.io/your-repository-name/
```

### Step 4: Test the Site
1. Visit the landing page
2. Click "Start Your Reveal"
3. Select slot machine animation
4. Choose boy or girl
5. Click "Start the Reveal!"
6. Enjoy the fullscreen slot machine animation! 🎰

## Troubleshooting

### Common Issues

**CSS/JS not loading:**
- Check that `baseurl` in `_config.yml` matches your repository name
- Ensure all asset paths use `{{ site.baseurl }}`

**Animations not working:**
- Check browser console for JavaScript errors
- Ensure modern browser with fullscreen API support

**GitHub Pages not updating:**
- Check the **Actions** tab for build status
- Allow 5-10 minutes for changes to deploy

### Local Testing
```bash
# Install Jekyll
bundle install

# Serve locally
bundle exec jekyll serve

# Open in browser
open http://localhost:4000/gender-reveal-site/
```

## Features Included

✅ **Complete Slot Machine Animation**
✅ **Fullscreen Experience**
✅ **Mobile Responsive Design**
✅ **Sound Effects (with fallbacks)**
✅ **Confetti Celebration**
✅ **3-Step Selection Process**
✅ **GitHub Pages Ready**
✅ **Analytics Placeholder**

## Next Steps

1. **Customize Colors**: Edit CSS variables in `assets/css/style.css`
2. **Add Analytics**: Replace placeholder functions in `assets/js/main.js`
3. **Add Audio**: Place MP3 files in `assets/audio/` folder
4. **Future Animations**: Implement fireworks in `assets/js/animations/fireworks.js`

---

🎉 **Enjoy creating magical gender reveal moments!**