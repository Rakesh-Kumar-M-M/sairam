# Sairam MUN Website

## Overview

This is a professional, responsive website for Sairam MUN (Model United Nations) built with React.js, featuring smooth animations, a dark theme, and seamless full-page transitions. The application allows students to learn about the MUN event and register online for participation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing
- **Framer Motion** for smooth animations and page transitions
- **Tailwind CSS** with **shadcn/ui** components for consistent, modern UI design
- **React Hook Form** with **Zod** validation for form handling
- **TanStack Query** for server state management and API interactions

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design for clean endpoint structure
- In-memory storage implementation (MemStorage) for development/testing
- Prepared for PostgreSQL integration with Drizzle ORM

### Database Design
- **Drizzle ORM** configured for PostgreSQL with type-safe schema definitions
- Two main entities:
  - `users`: Basic user authentication (id, username, password)
  - `registrations`: MUN registration data (personal info, academic details, preferences)
- Schema validation using `drizzle-zod` for runtime type checking

## Key Components

### Pages
- **Home**: Hero section with countdown timer, event details, and feature carousel
- **About**: Information about MUN program with statistics and objectives
- **Register**: Multi-field registration form with validation

### UI Components
- **Navbar**: Sticky navigation with logo, branding, and menu items
- **Footer**: Contact information, quick links, and social media
- **CountdownTimer**: Live countdown to registration deadline
- **CardCarousel**: Auto-sliding feature showcase with navigation controls
- **ThemeProvider**: Dark/light theme management with persistence

### Form Handling
- Comprehensive registration form with fields for:
  - Personal information (name, academic year, department)
  - Institution details (college, section, SEC ID)
  - MUN preferences (preferred country representation)
- Real-time validation with user-friendly error messages
- Success/error toast notifications

## Data Flow

1. **Client-Side Routing**: Wouter handles navigation between pages
2. **Form Submission**: React Hook Form collects and validates data using Zod schemas
3. **API Communication**: TanStack Query manages HTTP requests to Express endpoints
4. **Server Processing**: Express routes handle registration creation and validation
5. **Data Storage**: Currently uses in-memory storage, prepared for PostgreSQL migration
6. **Response Handling**: Success/error states communicated back to UI with toast notifications

## External Dependencies

### UI and Styling
- **@radix-ui** components for accessible, unstyled UI primitives
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built, customizable component library
- **Framer Motion** for declarative animations

### Database and Validation
- **Drizzle ORM** for type-safe database operations
- **Zod** for runtime schema validation
- **@neondatabase/serverless** for PostgreSQL connection (prepared)

### Development Tools
- **TypeScript** for static type checking
- **Vite** for fast development server and building
- **ESBuild** for production server bundling

## Deployment Strategy

### Development
- **Vite dev server** for frontend with hot module replacement
- **tsx** for running TypeScript server files directly
- **Concurrent development** setup with both frontend and backend

### Production Build
1. **Frontend**: Vite builds optimized static assets
2. **Backend**: ESBuild bundles server code for Node.js runtime
3. **Static serving**: Express serves built frontend assets
4. **Environment variables**: Database URL and other config through environment

### Database Setup
- **Migration system** using Drizzle Kit for schema changes
- **Environment-based configuration** for different deployment stages
- **PostgreSQL** ready for production deployment

The application is designed to be easily deployable to cloud platforms with minimal configuration changes, particularly for the database connection setup.