# Arbitrum Analytics Chat Interface

## Overview

This is a modern React-based chat interface for Arbitrum blockchain analytics, featuring AI-powered assistants that provide specialized insights into blockchain data. The application uses a full-stack TypeScript architecture with Express.js backend and React frontend, designed to deliver real-time analytics and interactive conversations about Arbitrum network activity.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Styling**: Tailwind CSS with a custom crypto-themed design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: Zustand for global state management
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: NestJS backend with MCP (Model Context Protocol)
- **API Base URL**: `http://localhost:3000/api`
- **WebSocket URL**: `ws://localhost:3000`
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: In-memory storage with plans for PostgreSQL persistence
- **API Design**: RESTful endpoints with real-time WebSocket capabilities

### Build and Development
- **Build Tool**: Vite for fast development and optimized production builds
- **Backend Build**: esbuild for server-side bundling
- **Development**: Hot module replacement with Vite dev server
- **TypeScript**: Strict mode enabled with path mapping for clean imports

## Key Components

### AI Assistants
Three specialized AI personas provide domain-specific expertise:
- **Alice (Trading Assistant)**: Gas prices, trading optimization, MEV protection
- **Bob (Developer Assistant)**: Contract interactions, debugging, ABIs, development tools  
- **Charlie (Analytics Assistant)**: Whale tracking, transaction analysis, market trends

### Chat System
- Real-time messaging interface with typing indicators
- Session-based conversation history
- Message persistence with metadata (tools used, confidence scores)
- Context-aware responses with fallback mechanisms

### Analytics Dashboard
- Real-time network statistics (TPS, gas usage)
- Gas price tracking (Arbitrum vs Ethereum comparison)
- Top contract monitoring
- Whale activity tracking
- Interactive graph visualization panel

### Database Schema
- **Messages**: Content, type, session, user, timestamp, tools used, confidence
- **Sessions**: Session management with user association and activity tracking  
- **Network Stats**: TPS and gas usage metrics with timestamps
- **Gas Prices**: Arbitrum and Ethereum gas price comparisons

## Data Flow

1. **User Interaction**: Users select an AI assistant and send messages through the chat interface
2. **Message Processing**: Frontend sends messages via API to backend, immediately displaying user message
3. **AI Response Generation**: Backend processes message, determines appropriate assistant response with simulated context awareness
4. **Real-time Updates**: Analytics data refreshes automatically (gas prices every 10s, network stats every 5s)
5. **State Management**: Zustand manages UI state, React Query handles server state caching and synchronization
6. **Session Persistence**: Chat sessions and messages stored in database for conversation continuity

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Express.js with middleware for JSON parsing and CORS
- PostgreSQL via Neon Database for serverless deployment

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Lucide React for consistent iconography
- Custom CSS variables for crypto-themed color palette

### Database and ORM
- Drizzle ORM for type-safe database operations
- Drizzle Kit for database migrations and schema management
- Zod for runtime type validation and schema generation

### Development Tools
- Vite with React plugin for development server and building
- esbuild for server-side bundling
- TypeScript with strict configuration
- PostCSS with Autoprefixer for CSS processing

## Deployment Strategy

### Development Environment
- Vite development server with HMR on port 5173
- Express server with nodemon-equivalent watching via tsx
- Database migrations via Drizzle Kit push command
- Environment variables for database connection

### Production Build
- Vite builds optimized React bundle to `dist/public`
- esbuild bundles Express server to `dist/index.js` 
- Static file serving from Express for single-page application
- PostgreSQL database with connection pooling via Neon

### Environment Configuration
- Development: Local development with remote Neon database
- Production: Node.js server serving built React app and API
- Database: Serverless PostgreSQL via Neon with environment-based connection strings

## Changelog
- June 28, 2025: Initial setup with complex analytics interface
- June 28, 2025: Simplified to two-page chat app with user selection
- June 28, 2025: Integrated NestJS backend with WebSocket support and HTTP fallback

## User Preferences

Preferred communication style: Simple, everyday language.