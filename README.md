# 🌟 Sadat's Anime Shelf - Premium Collection

> A stunning, modern web application for tracking and managing your anime collection with a beautiful glassmorphism UI and premium animations.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎨 Visual Excellence
- **Glassmorphism UI** - Transparent, frosted-glass effects throughout
- **Premium Gradients** - Vibrant, eye-catching color schemes
- **3D Card Transforms** - Interactive hover effects with depth
- **Smooth Animations** - Buttery smooth transitions and micro-interactions
- **Dark/Light Themes** - Seamless theme switching with localStorage persistence
- **Gradient Mesh Background** - Dynamic, animated background gradients

### 🏗️ Architecture
- **Backend**: Node.js + Express with MVC architecture
- **Database**: MySQL with connection pooling
- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Styling**: Modular CSS with custom properties

### 🚀 Core Functionality
- ✅ Add, edit, and delete anime entries
- ✅ Track watching progress for each series
- ✅ Filter by status (Watching, Completed, Plan to Watch)
- ✅ Beautiful anime cards with status badges
- ✅ Detailed anime view with synopsis
- ✅ Top 10 favorite anime list
- ✅ Real-time validation and error handling
- ✅ Responsive design for all devices


## 🛠️ Installation & Setup
### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd anime-shelf
```

### 2. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE anime_shelf;

USE anime_shelf;

CREATE TABLE anime (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    total_episodes INT DEFAULT 1,
    episodes_watched INT DEFAULT 0,
    status ENUM('watching', 'completed', 'plan') DEFAULT 'plan',
    genres VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Backend Setup
```bash
cd back-end

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=anime_shelf
NODE_ENV=development
EOL

# Start the server
npm start
```

Server will run on `http://localhost:3000`

### 4. Frontend Setup
Simply open `front-end/index.html` in your browser, or use a local server:

```bash
cd front-end

# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000
```

Frontend will be available at `http://localhost:8000`

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/anime` | Get all anime |
| GET | `/api/anime/:id` | Get anime by ID |
| GET | `/api/anime/status/:status` | Get anime by status |
| POST | `/api/anime` | Create new anime |
| PUT | `/api/anime/:id` | Update anime |
| DELETE | `/api/anime/:id` | Delete anime |
| GET | `/health` | Health check |

## 🎨 Design System

### Color Palette
```css
/* Premium Gradients */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
--gradient-success: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);

/* Solid Colors */
--premium-purple: #7c3aed;
--premium-pink: #ec4899;
--premium-blue: #3b82f6;
--premium-teal: #14b8a6;
```

### Typography
- **Headlines**: Outfit (Modern, geometric)
- **Body**: Inter (Clean, readable)
- **Accent**: Poppins (Friendly, rounded)

### Animations
- Smooth scroll animations on page load
- Card hover transformations (lift + scale)
- Shimmer effects on progress bars
- Ripple effects on buttons
- Modal slide-in animations

## 🔧 Development

### Adding New Features
1. **Backend**: Add routes in `back-end/src/routes/`, controllers in `controllers/`, models in `models/`
2. **Frontend**: Add UI logic to appropriate modules in `js/ui/`, update `main.js` if needed
3. **Styling**: Add component styles to `css/components.css`, keep base variables in `base.css`

### Code Style
- Use ES6+ features (const, let, arrow functions, async/await)
- Follow modular architecture - one responsibility per file
- Use semantic HTML5 elements
- Follow BEM naming for CSS classes where appropriate
- Add JSDoc comments for all functions

## 🌐 Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## 📝 License
MIT License - feel free to use this project for learning and personal use!

## 👨‍💻 Author
**Sadat**
- Instagram: [@sdrk_66](https://www.instagram.com/sdrk_66)
- Telegram: [@sdrk_66](https://t.me/sdrk_66)
- GitHub: [@s-a-d-a-t](https://github.com/s-a-d-a-t)

## 🙏 Acknowledgments
- Font Awesome for icons
- Google Fonts for typography
- Unsplash for placeholder images

---

**Built with ❤️ and lots of CSS gradients** 🌈
