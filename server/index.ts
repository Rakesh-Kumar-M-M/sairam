import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";
import { connectToMongoDB, getConnectionStatus } from "./mongodb";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://your-app-name.onrender.com']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin as string) || corsOptions.origin.includes('*')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Function to find an available port
async function findAvailablePort(startPort: number): Promise<number> {
  const net = await import('net');

  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(startPort, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Try the next port
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// Function to serve static files
function serveStaticFiles() {
  const distPath = path.join(process.cwd(), 'dist');
  const clientDistPath = path.join(process.cwd(), 'client', 'dist');
  
  // Check if dist folder exists
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log(`📁 Serving static files from: ${distPath}`);
    return distPath;
  } else if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    console.log(`📁 Serving static files from: ${clientDistPath}`);
    return clientDistPath;
  } else {
    console.log('⚠️  No dist folder found for static files');
    return null;
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: getConnectionStatus() ? 'connected' : 'disconnected'
  });
});

// Register API routes
registerRoutes(app).then((server) => {
  // Serve static files (both development and production)
  const staticPath = serveStaticFiles();
  
  // Handle client-side routing (both development and production)
  if (staticPath) {
    app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      
      const indexPath = path.join(staticPath, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: 'index.html not found' });
      }
    });
  }

  // Start server
  const startServer = async () => {
    try {
      // Connect to MongoDB
      await connectToMongoDB();
      
      const preferredPort = parseInt(process.env.PORT || '5000', 10);
      const port = await findAvailablePort(preferredPort);

      if (port !== preferredPort) {
        console.log(`⚠️  Port ${preferredPort} is in use, using port ${port} instead`);
      }

      server.listen({
        port,
        host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
      }, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📊 MongoDB Status: ${getConnectionStatus() ? '✅ Connected' : '❌ Disconnected'}`);
        console.log(`🌐 Environment: ${app.get("env")}`);
        console.log(`🌐 Main Application: http://localhost:${port}/`);
        console.log(`🌐 Admin Dashboard: http://localhost:${port}/admin-login`);
        if (staticPath) {
          console.log(`📁 Serving static files from: ${staticPath}`);
        }
      }).on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`❌ Port ${port} is still in use. Please try again.`);
        } else {
          console.log(`❌ Server error: ${err.message}`);
        }
        process.exit(1);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}).catch((error) => {
  console.error('❌ Failed to register routes:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});
