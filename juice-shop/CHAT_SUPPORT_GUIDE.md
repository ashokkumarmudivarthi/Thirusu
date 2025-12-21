# Chat Support Testing Guide

## Fixed Issues:
1. ✅ Chat widget height reduced from 600px to 500px with responsive max-height
2. ✅ Added clear visual indicators for customer vs agent messages
3. ✅ Customer messages appear on LEFT in blue boxes with 👤 icon
4. ✅ Agent messages appear on RIGHT in orange boxes with 🎧 icon
5. ✅ Wait time messaging (2-5 minutes) when agents busy
6. ✅ Status indicators showing connection state

## How to Test:

### 1. As a Customer:
1. Go to home page (http://localhost:5173)
2. Click orange chat button (bottom right)
3. Click "Chat with Us"
4. **If no agents online:**
   - You'll see: "All agents are busy. Estimated wait: 2-5 minutes"
   - Send your message anyway - it will be queued
   - Status shows: "⏳ Waiting for agent..."
5. **If agents online:**
   - You'll see: "Connected with support agent"
   - Status shows: "✓ Connected with support agent"
   - Messages delivered instantly

### 2. As Support Agent:
1. Login as admin (http://localhost:5173/login)
2. Go to Admin Dashboard
3. Click "Support Dashboard" button (blue button)
4. Toggle status to "🟢 Online"
5. You'll see:
   - **Waiting chats** - customers waiting for assignment
   - **Active chats** - your assigned conversations
   - Customer messages appear on **LEFT** in **blue boxes** 👤
   - Your replies appear on **RIGHT** in **orange boxes** 🎧
6. Click any chat session to view/reply
7. Type reply in bottom box and press Enter or click Send
8. Customer sees your message instantly

### 3. Multiple Agents:
- Create support users: `UPDATE users SET role = 'support' WHERE email = 'agent@example.com';`
- Each agent can handle up to 5 chats (configurable in agent_status table)
- New chats auto-assign to least busy online agent
- Agents can manually assign waiting chats to themselves

### 4. Visual Indicators:

**Customer Side:**
- 🟢 Green = Agent available
- 🔴 Red = All agents busy
- ⏳ Yellow = Waiting for agent
- ✓ Green = Connected

**Agent Side:**
- 👤 Blue box on left = Customer message
- 🎧 Orange box on right = Your reply
- Numbers show unread messages
- Real-time updates every 3 seconds

## Database Setup:
Already completed! Tables created:
- ✅ chat_sessions
- ✅ chat_messages  
- ✅ agent_status
- ✅ predefined_queries (6 default FAQs)

## Quick Start:
1. Backend: `cd juice-shop/backend && npm run dev`
2. Frontend: `cd juice-shop && npm run dev`
3. Test customer chat from home page
4. Test support from /support route
