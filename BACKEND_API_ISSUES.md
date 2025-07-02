# Backend API Issues - Context Graph System

## 🚨 Current Issue

The frontend is displaying **"(Demo Data)"** in the context graph because the backend API endpoints are not responding. The system is falling back to static demo data instead of real dynamic context.

## 📋 Missing Backend Endpoints

The frontend is making requests to these endpoints that are **NOT IMPLEMENTED** or **NOT WORKING**:

### 1. Context Storage Endpoint
```
POST /api/context/users/{userId}/context
```

**Expected Payload:**
```json
{
  "query": "What's the current gas price?",
  "toolsUsed": ["gas-tracker", "price-analyzer"],
  "addressesInvolved": ["0x1234567890abcdef1234567890abcdef12345678"],
  "insights": [
    {
      "content": "User interested in gas optimization",
      "confidence": 0.8
    }
  ],
  "metadata": {
    "sessionId": "session-1234567890",
    "timestamp": "2025-07-02T09:59:25.000Z",
    "confidence": 0.9,
    "personality": "alice"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "contextId": "ctx-uuid-here",
  "message": "Context stored successfully"
}
```

### 2. Graph Visualization Endpoint (User-Specific)
```
GET /api/context/graph/visualization?userId={userId}
```

**Expected Response Structure:**
```json
{
  "nodes": [
    {
      "id": "alice",
      "label": "Alice (Trader)",
      "type": "user",
      "properties": {
        "id": "alice",
        "name": "Alice (Trader)",
        "role": "trader",
        "lastActivity": "2025-07-02T09:59:25.000Z"
      },
      "size": 40,
      "color": "#2196F3"
    },
    {
      "id": "alice-query-gas",
      "label": "What's the current gas price?",
      "type": "query",
      "properties": {
        "id": "alice-query-gas",
        "content": "What's the current gas price?",
        "timestamp": "2025-07-02T09:59:25.000Z",
        "confidence": 0.9
      },
      "size": 25,
      "color": "#4CAF50"
    },
    {
      "id": "tool-gas-tracker",
      "label": "Gas Price Tracker",
      "type": "tool",
      "properties": {
        "id": "tool-gas-tracker",
        "name": "Gas Price Tracker",
        "category": "defi"
      },
      "size": 30,
      "color": "#FF5722"
    }
  ],
  "edges": [
    {
      "id": "alice-to-query-gas",
      "from": "alice",
      "to": "alice-query-gas",
      "label": "asked",
      "type": "QUERIES",
      "weight": 1.0,
      "color": "#4CAF50"
    },
    {
      "id": "query-gas-to-tool",
      "from": "alice-query-gas",
      "to": "tool-gas-tracker",
      "label": "used",
      "type": "USED_TOOL",
      "weight": 1.0,
      "color": "#FF5722"
    }
  ],
  "metadata": {
    "totalNodes": 3,
    "totalEdges": 2,
    "userCount": 1,
    "toolCount": 1,
    "queryCount": 1,
    "insightCount": 0,
    "addressCount": 0,
    "generatedAt": "2025-07-02T09:59:25.000Z",
    "userId": "alice"
  }
}
```

### 3. Graph Visualization Endpoint (Global)
```
GET /api/context/graph/visualization
```

**Expected Response:** Same structure as above but with `userId: "global"` and aggregated data from all users.

### 4. Graph Insights Endpoint
```
GET /api/context/graph/insights/{userId}
```

**Expected Response:**
```json
{
  "userProfile": {
    "experience": "intermediate",
    "focus": "trading"
  },
  "topTools": [
    {
      "tool": "Gas Price Tool",
      "usage": 15
    },
    {
      "tool": "Contract Analyzer",
      "usage": 8
    }
  ],
  "relationshipStrength": [
    {
      "target": "bob",
      "strength": 0.7
    }
  ],
  "recommendations": [
    "Try using the DeFi analyzer for better trading insights"
  ]
}
```

## 🔧 Node and Edge Types Required

### Node Types (with required properties):
- **user**: `{ id, name, role, lastActivity }`
- **query**: `{ id, content, timestamp, confidence }`
- **tool**: `{ id, name, category }`
- **insight**: `{ id, content, confidence }`
- **address**: `{ id, address, type }`
- **pattern**: `{ id, content, confidence }`
- **other**: `{ id, description }`

### Edge Types:
- **QUERIES**: User asks query
- **USED_TOOL**: Query uses tool
- **GENERATED_INSIGHT**: Query generates insight
- **INVOLVES_ADDRESS**: Query involves address
- **RELATED_TO**: General relationship
- **LEARNED_PATTERN**: Query learns pattern
- **HAS_QUERY**: Legacy support

## 🎯 Expected Behavior

### When Chat Message is Sent:
1. **Frontend calls:** `POST /api/chat` (this works)
2. **Frontend then calls:** `POST /api/context/users/{userId}/context` (this fails)
3. **Context should be stored** with user ID, query, tools used, addresses, and insights

### When Graph Page is Loaded:
1. **Frontend calls:** `GET /api/context/graph/visualization?userId={userId}` (this fails)
2. **Should return:** Dynamic graph based on stored context for that user
3. **Different users should have different graphs**

### Current Problem:
- All API calls to context endpoints return **404** or **500** errors
- Frontend falls back to static demo data
- All users see the same graph because real data isn't stored/retrieved

## 🚀 Test URLs

The frontend is configured to use:
```
Base URL: http://localhost:3000
```

### Test these endpoints:
```bash
# Health check (should work)
curl -X GET "http://localhost:3000/health"

# Context storage (currently fails)
curl -X POST "http://localhost:3000/api/context/users/alice/context" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is gas price?",
    "toolsUsed": ["gas-tracker"],
    "addressesInvolved": [],
    "insights": [{"content": "Gas query", "confidence": 0.8}],
    "metadata": {"sessionId": "test", "timestamp": "2025-07-02T10:00:00.000Z"}
  }'

# Graph visualization (currently fails)
curl -X GET "http://localhost:3000/api/context/graph/visualization?userId=alice"

# Global graph (currently fails)
curl -X GET "http://localhost:3000/api/context/graph/visualization"
```

## 💡 Backend Implementation Requirements

### 1. Data Storage
- Store user context data (queries, tools, insights, addresses)
- Link context to specific user IDs
- Store relationships between entities
- Support for different personalities (alice, bob, charlie)

### 2. Graph Generation
- Generate nodes from stored context data
- Create edges based on relationships
- Calculate metadata (counts, timestamps)
- Filter by user ID vs global view

### 3. API Endpoints
- Implement all 4 missing endpoints above
- Return proper JSON structures
- Handle errors gracefully
- Support CORS for frontend requests

## 🔍 Debugging Info

### Frontend Console Logs Show:
```
=== FETCHING GRAPH VISUALIZATION ===
Endpoint: /api/context/graph/visualization?userId=alice
User ID: alice
=== GRAPH API FAILED, USING FALLBACK ===
Error: API request failed: 404 Not Found
=== USING FALLBACK DATA ===
```

### Frontend Context Storage Logs Show:
```
=== STORING CONTEXT DATA ===
User ID: alice
Query: What's the current gas price?
=== CONTEXT STORAGE FAILED ===
Error: API request failed: 404 Not Found
```

## ✅ Success Criteria

When working correctly:
1. **Different users show different graphs** (Alice = gas/trading, Bob = contracts, Charlie = whale tracking)
2. **Graph updates in real-time** as users send messages
3. **Console shows successful API calls** instead of fallback messages
4. **"(Demo Data)" indicator disappears** from graph overlay
5. **Context storage succeeds** after each chat message

## 📝 Quick Fix Checklist

- [ ] Implement `POST /api/context/users/{userId}/context`
- [ ] Implement `GET /api/context/graph/visualization?userId={userId}`
- [ ] Implement `GET /api/context/graph/visualization` (global)
- [ ] Implement `GET /api/context/graph/insights/{userId}`
- [ ] Test all endpoints return expected JSON structures
- [ ] Verify different users get different graph data
- [ ] Confirm context storage works after chat messages

---

**Priority:** HIGH - Frontend is fully ready, only backend endpoints missing!
