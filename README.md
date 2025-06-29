# Arbitrum Analytics Chat System - Frontend

A modern React frontend application for the Arbitrum blockchain analytics chat system with multi-user support and advanced context management. This frontend connects to a fully operational NestJS backend deployed at `https://mcpclient-production.up.railway.app`.

## 🏗️ Architecture

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui
- **Graph Visualization**: react-force-graph-2d
- **Backend**: NestJS (deployed separately) with Redis Cloud KV, Pinecone Vector DB, Neo4j Graph DB, and Hugging Face LLM

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd ArbitrumAnalytics
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5174`

## � Backend Integration

This frontend is configured to connect to your deployed NestJS backend at:
- **Production URL**: `https://mcpclient-production.up.railway.app`
- **WebSocket URL**: `wss://mcpclient-production.up.railway.app`

### Available Backend Endpoints

The frontend utilizes these backend endpoints:

#### Chat & Conversation
- `POST /api/chat` - Main chat endpoint with user context
- `GET /api/chat/history/:sessionId` - Get conversation history

#### Context Graph Visualization  
- `GET /api/context/graph/visualization/:userId` - Get user graph data
- `GET /api/context/graph/insights/:userId` - Get context insights
- `GET /api/context/graph/visualization` - Get global graph

#### Storage & Context Management
- `GET/POST/DELETE /api/context/storage/kv` - KV store operations
- `POST /api/embeddings/search` - Search similar conversations
- `GET /api/embeddings/context/:query` - Get session context

#### Failsafe & Error Handling
- `GET /api/failsafe/test-fallback` - Test failsafe responses
- `GET /api/failsafe/stats` - Get failsafe statistics

## 👥 Test Users

The application comes with 3 pre-configured test users:

1. **Alice (Trader)** - `user-001`
   - Focus: Gas prices, trading optimization
   - Avatar: Trader persona

2. **Bob (Developer)** - `user-002`
   - Focus: Contract interactions, debugging, ABIs
   - Avatar: Developer persona

3. **Charlie (Analyst)** - `user-003`
   - Focus: Whale tracking, transaction analysis
   - Avatar: Analyst persona

## 🎯 Features

### Core Features
- **Multi-User Support**: Switch between specialized user profiles (Trader, Developer, Analyst)
- **AI Chat Interface**: Interactive chat with blockchain analytics AI agent
- **Context Graph Visualization**: Force-directed graph showing conversation relationships and insights
- **Real-time Updates**: WebSocket connections with HTTP fallback for reliability
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Support**: Fallback data ensures functionality without backend

### Accessibility & UX
- **Keyboard Shortcuts**: Full keyboard navigation support (Ctrl+1/2, Ctrl+/, Enter, Esc)
- **Screen Reader Support**: ARIA labels and semantic HTML for accessibility
- **Error Boundaries**: Graceful error handling with recovery options
- **Loading States**: Skeleton components and smooth loading transitions
- **Help System**: Built-in help modal with feature explanations and shortcuts
- **Toast Notifications**: Real-time feedback for user actions and status updates

### Technical Features
- **TypeScript**: Full type safety across the application
- **Performance**: Memoized components and optimized rendering
- **Theming**: Dark crypto-themed UI with CSS custom properties
- **State Management**: Zustand for efficient state management
- **API Layer**: Type-safe API calls with proper error handling

## 🎯 User Experience

### Keyboard Shortcuts
- `Ctrl + 1`: Navigate to Chat page
- `Ctrl + 2`: Navigate to Graph page  
- `Ctrl + /`: Focus message input
- `Esc`: Close modals/panels
- `Enter`: Send message
- `Shift + Enter`: New line in message

### Help & Support
- Click the help icon (?) in the chat header for feature explanations
- Tooltips and contextual help throughout the interface
- Comprehensive error messages with recovery suggestions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

### Backend Endpoints

The frontend integrates with these NestJS backend endpoints:

#### Chat & Conversation
- `POST /api/chat` - Send message
- `GET /api/chat/history/:sessionId` - Get conversation history

#### Context Graph Visualization
- `GET /api/context/graph/visualization/:userId` - User-specific graph
- `GET /api/context/graph/visualization` - Global graph
- `GET /api/context/graph/insights/:userId` - User insights

#### Storage & Context Management
- `GET /api/context/storage/kv/:key` - Get KV data
- `POST /api/context/storage/kv` - Set KV data
- `DELETE /api/context/storage/kv/:key` - Delete KV data

#### Embeddings & Search
- `POST /api/embeddings/search` - Search similar conversations
- `GET /api/embeddings/context/:query` - Get session context

#### Failsafe & Error Handling
- `GET /api/failsafe/test-fallback` - Test fallback responses
- `GET /api/failsafe/stats` - Get failsafe statistics

## 🎨 UI Components

The application uses a modern dark theme with crypto-inspired colors:

- **Primary**: Blue-purple gradient
- **Secondary**: Purple accent
- **Success**: Green highlights
- **Warning**: Orange alerts
- **Background**: Dark slate with subtle gradients

## 📱 Responsive Design

- **Mobile**: Optimized for touch interactions
- **Tablet**: Adaptive layout with collapsible sidebar
- **Desktop**: Full-featured with side panels

## 🔄 Real-time Features

- **WebSocket Connection**: Primary communication method
- **HTTP Fallback**: Automatic fallback when WebSocket unavailable
- **Typing Indicators**: Shows when AI is responding
- **Connection Status**: Visual indicators for connection state

## 🧪 Testing

The application includes fallback data for testing without the backend:

- Mock graph visualizations
- Sample chat responses
- User profiles and insights
- Simulated tool usage

## 🚀 Deployment

### Development
```bash
npm run dev        # Start frontend development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Production Build
```bash
npm run build
npm run start
```

## 📚 Key Technologies

- **React 18**: Modern React with hooks
- **TypeScript**: Full type safety
- **Vite**: Fast development and building
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management
- **React Query**: Server state management
- **Radix UI**: Accessible components
- **Force Graph**: Interactive visualizations

## 🤝 Integration

The frontend is designed to work seamlessly with the NestJS backend featuring:

- Multi-storage context system (Redis, Pinecone, Neo4j)
- Hugging Face LLM integration
- MCP (Model Context Protocol) support
- Failsafe QA system with intelligent fallbacks

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if backend is running on port 3000
   - Application will automatically fall back to HTTP

2. **Graph Not Loading**
   - Verify backend API endpoints
   - Mock data will be used as fallback

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check custom CSS variables in index.css

### Development Tips

- Use browser dev tools to monitor API calls
- Check console for WebSocket connection status
- Inspect network tab for failed requests
- Use React Developer Tools for component debugging

## 📄 License

MIT License - feel free to use this project for your own applications.
