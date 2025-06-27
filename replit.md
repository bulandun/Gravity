# replit.md

## Overview

This is a modern AI compliance monitoring platform built with React frontend and Express.js backend. The application provides real-time monitoring of AI model outputs, training data scanning, and regulatory compliance tracking for HIPAA and GDPR requirements. It features a dashboard-driven interface with comprehensive audit reporting and bias detection capabilities.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite for build tooling
- **Backend**: Express.js with TypeScript for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Shadcn/ui components with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management
- **Authentication**: Session-based authentication (implementation in progress)

## Key Components

### Frontend Architecture
- **Component Structure**: Organized into pages, components, and shared utilities
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **File Upload**: Custom file upload component with drag-and-drop support

### Backend Architecture
- **API Routes**: RESTful endpoints for compliance monitoring features
- **Database Layer**: Drizzle ORM with connection pooling via Neon
- **File Processing**: Multer for handling training data uploads
- **Validation**: Zod schemas for request/response validation

### Database Schema
Key tables include:
- `users`: User authentication and management
- `ai_output_checks`: AI model output monitoring logs
- `training_data_scans`: Training dataset scan results
- `audit_reports`: Compliance audit reports
- `compliance_metrics`: System-wide compliance metrics
- `model_drift_data`: Model performance drift tracking
- `bias_detection_results`: Bias detection analysis results
- `compliance_alerts`: System alerts and notifications

## Data Flow

1. **AI Output Monitoring**: Real-time analysis of AI model outputs for compliance violations
2. **Training Data Scanning**: Upload and scan training datasets for privacy risks and bias
3. **Compliance Reporting**: Generate comprehensive audit reports for regulatory requirements
4. **Dashboard Analytics**: Aggregate and visualize compliance metrics across all systems
5. **Alert System**: Proactive notifications for compliance violations and system issues

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **recharts**: Chart library for data visualization
- **wouter**: Lightweight React router
- **multer**: File upload middleware

### Development Tools
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- Uses Vite dev server with hot module replacement
- Express server runs on port 5000 with API routes
- PostgreSQL database connected via Neon serverless

### Production Build
- Frontend built with Vite to static assets
- Backend bundled with ESBuild for optimized Node.js execution
- Deployed to Replit with autoscale configuration
- Database migrations managed via Drizzle Kit

### Configuration
- Environment variables for database connection
- Replit-specific configuration for deployment
- Port configuration for both development and production

## Changelog

```
Changelog:
- June 27, 2025: Initial setup with React frontend and Express backend
- June 27, 2025: Added comprehensive API endpoints for AI compliance monitoring
- June 27, 2025: Integrated CORS support for external API access
- June 27, 2025: Created OpenAPI specification and ChatGPT plugin manifest
- June 27, 2025: Implemented database storage with PostgreSQL and Drizzle ORM
- June 27, 2025: Added comprehensive dashboard with compliance metrics visualization
- June 27, 2025: Completed ChatGPT plugin integration files for deployment
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```