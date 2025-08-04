import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer } from "http";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectToMongoDB, getConnectionStatus } from "./mongodb";

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'http://localhost:5000'] 
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
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

// Function to serve static files from React build
function serveStaticFiles(app: express.Express) {
  const buildPath = path.join(process.cwd(), 'dist');
  
  // Check if build directory exists
  if (!fs.existsSync(buildPath)) {
    console.error(`❌ Build directory not found: ${buildPath}`);
    console.error('Please run "npm run build" to build the React app first');
    process.exit(1);
  }

  // Serve static files from the build directory
  app.use(express.static(buildPath, {
    maxAge: '1y', // Cache static assets for 1 year
    etag: true,
    lastModified: true
  }));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // Serve index.html for all other routes (client-side routing)
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Error loading application');
      }
    });
  });
}

(async () => {
  try {
    // Connect to MongoDB Atlas
    await connectToMongoDB();
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Serve static files and handle client-side routing
    if (app.get("env") === "development") {
      // Development: Use Vite dev server
      await setupVite(app, server);
    } else {
      // Production: Serve React build from dist folder
      serveStaticFiles(app);
    }

    // Find an available port starting from the specified port or default 5000
    const preferredPort = parseInt(process.env.PORT || '5000', 10);
    const port = await findAvailablePort(preferredPort);
    
    if (port !== preferredPort) {
      log(`⚠️  Port ${preferredPort} is in use, using port ${port} instead`, 'yellow');
    }
    
    server.listen({
      port,
      host: "localhost",
    }, () => {
      log(`🚀 Server running on port ${port}`);
      log(`📊 MongoDB Status: ${getConnectionStatus() ? '✅ Connected' : '❌ Disconnected'}`);
      log(`🌐 Environment: ${app.get("env")}`);
      log(`🌐 Main Application: http://localhost:${port}/`);
      log(`🌐 Admin Dashboard: http://localhost:${port}/admin-login`);
      if (app.get("env") === "production") {
        log(`📁 Serving static files from: ${path.join(process.cwd(), 'dist')}`);
      }
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log(`❌ Port ${port} is still in use. Please try again.`, 'red');
      } else {
        log(`❌ Server error: ${err.message}`, 'red');
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
