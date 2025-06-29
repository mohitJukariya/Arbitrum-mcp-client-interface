# Test Scenarios for Arbitrum Analytics Chat System

## 🧪 Manual Testing Guide

### User Selection Tests
1. **Load Application**
   - Open http://localhost:5173
   - Verify user selection screen appears
   - Check that all 3 user profiles are displayed

2. **User Profile Selection**
   - Click on Alice (Trader) - verify profile description shows
   - Click on Bob (Developer) - verify profile description shows  
   - Click on Charlie (Analyst) - verify profile description shows

### Chat Interface Tests

#### Alice (Trader) - user-001
**Sample queries to test:**
```
What are the current gas prices on Arbitrum?
Help me optimize my trading strategy
Show me gas price trends
What's the best time to make transactions?
Compare Arbitrum gas fees to Ethereum
```

#### Bob (Developer) - user-002  
**Sample queries to test:**
```
How do I debug a smart contract on Arbitrum?
Show me contract interaction examples
What are the most used contracts on Arbitrum?
Help me analyze this contract ABI
Explain Arbitrum's sequencer architecture
```

#### Charlie (Analyst) - user-003
**Sample queries to test:**
```
Show me recent whale activity
Track large ETH transfers
What are the top DeFi protocols by volume?
Analyze cross-chain bridge activity
Find unusual trading patterns
```

### Graph Visualization Tests

1. **User Graph View**
   - Navigate to Context Graph page
   - Ensure "User Graph" tab is selected
   - Verify graph loads with user-specific nodes
   - Test node click interactions
   - Test node hover effects

2. **Global Graph View**
   - Click "Global Graph" tab
   - Verify global network visualization loads
   - Test graph controls (zoom, pan, drag)
   - Check node and edge rendering

3. **Interactive Features**
   - Click on different node types (user, tool, query)
   - Verify selected node info appears in sidebar
   - Test graph refresh functionality
   - Check insights panel updates

### Connection Tests

1. **WebSocket Connection**
   - Monitor browser console for connection status
   - Check connection indicator in message input
   - Verify typing indicators work

2. **HTTP Fallback**
   - Test with backend offline
   - Verify fallback responses are received
   - Check error handling

### UI/UX Tests

1. **Responsive Design**
   - Test on different screen sizes
   - Verify mobile compatibility
   - Check sidebar collapse behavior

2. **Theme and Styling**
   - Verify dark theme applies correctly
   - Check crypto color scheme
   - Test hover and focus states

3. **Message Display**
   - Send multiple messages
   - Verify message ordering
   - Check timestamp formatting
   - Test tool usage indicators

### Performance Tests

1. **Graph Rendering**
   - Test with multiple nodes/edges
   - Verify smooth animations
   - Check zoom/pan performance

2. **Message Handling**
   - Send rapid messages
   - Test message history loading
   - Verify memory usage

## 🤖 Expected Behaviors

### With Backend Connected
- Real AI responses from Hugging Face LLM
- Actual context graph data from Neo4j
- WebSocket real-time communication
- Proper session management
- Tool usage tracking

### With Backend Offline (Fallback Mode)
- Fallback chat responses
- Mock graph visualization data
- HTTP-only communication
- Local session simulation
- Sample tool usage data

## 🔍 What to Look For

### ✅ Success Indicators
- User selection works smoothly
- Chat messages send and receive
- Graph visualization renders correctly
- Navigation between pages works
- No console errors
- Responsive design adapts

### ❌ Potential Issues
- WebSocket connection failures
- Graph rendering errors
- TypeScript compilation errors
- Missing API responses
- UI layout breaking
- Performance degradation

## 📊 Test Data Examples

### Sample Graph Data Structure
```json
{
  "nodes": [
    {"id": "user-001", "label": "Alice", "type": "user"},
    {"id": "gas-tool", "label": "Gas Analyzer", "type": "tool"},
    {"id": "query-1", "label": "Gas optimization", "type": "query"}
  ],
  "edges": [
    {"from": "user-001", "to": "gas-tool", "label": "uses"}
  ]
}
```

### Sample Chat Response
```json
{
  "response": "Current Arbitrum gas prices are...",
  "toolsUsed": ["gas-price-tracker"],
  "sessionId": "session-123",
  "confidence": 0.95,
  "metadata": {
    "contextUsed": true,
    "fallbackLevel": "none"
  }
}
```

## 🚀 Quick Test Commands

```bash
# Start the application
npm run dev:client

# Check for TypeScript errors
npm run check

# Run in different modes
VITE_API_BASE_URL=http://localhost:3000/api npm run dev:client
```

This comprehensive test suite ensures all features work correctly in both connected and offline modes.
