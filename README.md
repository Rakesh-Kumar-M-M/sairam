# Sairam MUN 2025 Registration Website

A modern, responsive website for Sairam Model United Nations 2025 registration and management.

## 🚀 Features

- **User Registration**: Complete registration form with committee selection
- **Admin Dashboard**: Manage registrations, view statistics, export data
- **Real-time Updates**: Live MongoDB connection status
- **Responsive Design**: Works on all devices
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **UI Components**: Radix UI, Lucide React Icons
- **State Management**: React Query, React Hook Form
- **Validation**: Zod

## 📁 Project Structure

```
SairamMunWebsite/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes.ts         # API routes
│   └── index.ts          # Server entry point
├── shared/               # Shared schemas
└── dist/                 # Build output
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SairamMunWebsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=development
   PORT=5000
   ```

4. **Development**
   ```bash
   # Start development server
   npm run dev
   
   # Start backend server
   npm run dev:server
   ```

5. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 🐳 Docker Deployment

### Using Docker

1. **Build the Docker image**
   ```bash
   # Using the build script
   ./scripts/build-docker.sh
   
   # Or manually
   docker build -t sairam-mun-website:latest .
   ```

2. **Run the container**
   ```bash
   docker run -p 10000:10000 \
     -e MONGODB_URI=your_mongodb_uri \
     -e NODE_ENV=production \
     sairam-mun-website:latest
   ```

### Using Docker Compose

1. **Set environment variables**
   ```bash
   export MONGODB_URI=your_mongodb_atlas_connection_string
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

### Docker Features

- ✅ **Multi-stage builds** for smaller production images
- ✅ **Native module support** with Alpine Linux
- ✅ **Health checks** for container monitoring
- ✅ **Non-root user** for security
- ✅ **Optimized caching** for faster builds
- ✅ **Cross-platform compatibility**

## 🌐 Deployment on Render

### Automatic Deployment

1. **Connect to Render**
   - Push your code to GitHub
   - Connect your repository to Render
   - Render will automatically detect the `render.yaml` configuration

2. **Environment Variables**
   Set these in Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)

3. **Deploy**
   - Render will automatically build and deploy your application
   - Health check endpoint: `/api/health`

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## 📊 Admin Access

- **URL**: `/admin-login`
- **Username**: `administration`
- **Password**: `SAIRAMMUN2025`

## 🔧 API Endpoints

- `GET /api/health` - Health check
- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Create new registration
- `POST /api/admin/login` - Admin authentication

## 📝 Registration Form Fields

- Full Name
- Year (I, II, III, IV)
- Department
- Section
- Student ID
- College
- Preferred Country
- Phone Number
- Committee Selection (UNEP/UNSC)

## 🎨 Customization

### Styling
- Edit `tailwind.config.js` for theme customization
- Modify `client/src/index.css` for global styles

### Components
- UI components are in `client/src/components/ui/`
- Pages are in `client/src/pages/`

### Database Schema
- Models are in `server/models/`
- Shared schemas in `shared/schema.ts`

## 🔒 Security

- Environment variables for sensitive data
- Input validation with Zod
- CORS configuration
- Admin authentication

## 📱 Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

## 🚀 Performance

- Vite for fast development
- ESBuild for production builds
- Optimized bundle sizes
- MongoDB indexing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, contact the Sairam MUN team or create an issue in the repository.

---

**Built with ❤️ for Sairam MUN 2025** 