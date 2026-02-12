# AVDPunks <3 AI

A modern, responsive blog powered by Jekyll for GitHub Pages. Features dark/light theme toggle, masonry grid layout, and Markdown-based content authoring.

## 🚀 Live Demo

Deploy to GitHub Pages and access at: `https://yourusername.github.io/repository-name/`

## 📁 Project Structure

```
├── index.html              # Main homepage (with Jekyll front matter)
├── _config.yml             # Jekyll site configuration
├── README.md               # This file
│
├── _layouts/               # Jekyll layout templates
│   ├── default.html        # Base HTML template
│   ├── post.html           # Blog post template
│   └── home.html           # Homepage template
│
├── _includes/              # Reusable components
│   └── sidebar.html        # Navigation sidebar
│
├── _posts/                 # Blog posts (Markdown)
│   ├── 2026-02-12-why-ai-projects-fail.md
│   ├── 2026-02-10-ai-failure-key-findings.md
│   ├── 2026-02-08-ai-project-recommendations.md
│   └── 2026-02-06-linkedin-ai-failure-post.md
│
├── _data/                  # Data files
│   └── categories.yml      # Post categories for filtering
│
├── css/
│   └── styles.css          # Main stylesheet
│
├── js/
│   └── main.js             # Theme, filters, search functionality
│
├── posts/                  # Legacy static HTML posts
│   └── *.html
│
├── assets/
│   ├── README.md           # Asset guidelines
│   └── images/
│       ├── posts/          # Post-specific images
│       └── icons/          # Favicons and site icons
│
└── Blog Post Idears/       # Original source markdown files
    └── *.md
```

## ✨ Features

- **Jekyll-Powered** - Write posts in Markdown, Jekyll generates HTML
- **Dark/Light Theme** - Toggle between themes with localStorage persistence
- **Responsive Design** - Optimized for mobile, tablet, desktop, and ultra-wide displays
- **Masonry Grid** - CSS columns-based responsive grid (1-5 columns based on viewport)
- **Search & Filter** - Real-time search and category filtering
- **SEO Optimized** - Meta tags, Open Graph, and Twitter Cards via jekyll-seo-tag

## 📝 Creating New Posts

1. Create a new file in `_posts/` with the naming format:
   ```
   YYYY-MM-DD-title-slug.md
   ```

2. Add front matter at the top:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   description: "A brief description for SEO"
   date: 2026-02-15
   category: ai          # ai, research, guide, or social
   tags:
     - AI
     - Machine Learning
   reading_time: "5 min read"
   source_url: "https://..."
   source_title: "Source Name"
   ---
   ```

3. Write your content in Markdown below the front matter.

## 🎨 Customization

### Colors & Gradients
Edit CSS custom properties in `css/styles.css`:

```css
:root {
    --bg-primary: #0d1117;
    --accent-primary: #58a6ff;
    --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Categories
Edit `_data/categories.yml` to modify filter options.

## 🌐 Deployment

### GitHub Pages
1. Push to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch" → `main`
4. GitHub will automatically process Jekyll
5. Your site will be live at `https://username.github.io/repo-name/`

### Local Development
```bash
# Install Jekyll
gem install bundler jekyll

# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve

# View at http://localhost:4000
```

## 📄 License

MIT License - feel free to use and modify for your own projects.