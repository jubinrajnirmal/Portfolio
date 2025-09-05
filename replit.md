# Jubin Raj Nirmal - Portfolio Website

## Overview

This is a modern, single-page portfolio website showcasing DevOps and Quality Assurance expertise. The project is built with a hybrid architecture combining a vanilla JavaScript frontend with a React-based component system and an Express.js backend. The portfolio features a dark bluish theme with glassmorphism effects, responsive design, and professional presentation of technical skills and experience.

The application serves as a personal portfolio for Jubin Raj Nirmal, highlighting experience in software engineering, quality assurance, DevOps practices, and information security. It includes sections for about, experience, education, projects, and contact information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The project uses a dual frontend approach:

1. **Vanilla JavaScript Implementation**: Located in the root directory with `index.html`, `src/styles.css`, and `src/main.js`. This provides the primary portfolio presentation with smooth animations, scrollspy navigation, and mobile-responsive design.

2. **React/TypeScript Implementation**: Located in the `client/` directory using modern React with TypeScript, Vite build system, and shadcn/ui components. This provides a more robust component system with state management and better development experience.

**Design System**: Features a carefully crafted dark bluish color palette with CSS custom properties for consistent theming. Uses Inter font family and implements glassmorphism effects with soft shadows and subtle transparency.

**Responsive Strategy**: Mobile-first approach supporting screens from 320px to ultrawide displays with breakpoint-based layout adjustments.

### Backend Architecture

**Express.js Server**: Minimal REST API server with middleware for JSON parsing, request logging, and error handling. Currently implements basic routing structure with placeholder for future API endpoints.

**Storage Interface**: Implements an in-memory storage system with a clean interface pattern, allowing for easy migration to persistent databases. Includes user management functionality as a foundation.

### Data Management

**Database Integration**: Configured with Drizzle ORM for PostgreSQL, including migration support and schema management. The schema defines user tables with proper constraints and relationships.

**Content Management**: Portfolio data is structured in JSON format (`src/data.json`) containing all professional information, making content updates straightforward without code changes.

**Query Management**: Uses TanStack Query for client-side state management and API communication with proper error handling and caching strategies.

### Build and Development

**Vite Configuration**: Modern build system with React plugin, path aliases, and development optimizations. Includes Replit-specific plugins for enhanced development experience.

**TypeScript Integration**: Comprehensive TypeScript configuration with strict settings, proper module resolution, and shared type definitions between client and server.

**Styling System**: Combines Tailwind CSS with custom CSS variables, PostCSS processing, and shadcn/ui component system for consistent design implementation.

### Development Tools

**Component Library**: Extensive shadcn/ui component collection providing consistent, accessible UI elements including forms, dialogs, navigation, and data display components.

**Development Experience**: Includes hot reloading, error overlay, runtime error handling, and development banners for improved debugging and development workflow.

## External Dependencies

### Frontend Libraries

- **React Ecosystem**: React 18 with TypeScript, React DOM, and Wouter for client-side routing
- **UI Components**: Complete shadcn/ui component library including Radix UI primitives for accessibility
- **Styling**: Tailwind CSS for utility-first styling with PostCSS for processing
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Hookform Resolvers for form validation
- **Animations**: Embla Carousel for carousels and smooth component transitions

### Backend Dependencies

- **Server Framework**: Express.js for REST API development
- **Database**: Drizzle ORM with PostgreSQL support via Neon serverless
- **Session Management**: Connect-pg-simple for PostgreSQL-based session storage
- **Development Tools**: TSX for TypeScript execution and Vite for development server

### Development and Build Tools

- **Build System**: Vite with React plugin and Replit-specific enhancements
- **Code Quality**: TypeScript with strict configuration and ESBuild for production builds
- **Database Tools**: Drizzle Kit for schema management and migrations
- **Utilities**: Date-fns for date manipulation, nanoid for ID generation, clsx and class-variance-authority for conditional styling

### External Services

- **Database Hosting**: Configured for Neon PostgreSQL serverless database
- **Font Services**: Google Fonts integration for Inter and other typography
- **Development Platform**: Replit-optimized with specific plugins and configurations for seamless cloud development