# Group Chat API Documentation

## Overview

This is a real-time group chat application built with NestJS, featuring WebSocket support for live messaging and REST API endpoints for user management and group operations.

## Base URL

```
http://localhost:3000/api
```

## API Documentation

The interactive API documentation is available at:
```
http://localhost:3000/api/docs
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## REST API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Description**: Register a new user account
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "user" // optional, defaults to "user"
  }
  ```
- **Response**: User object with created user details

#### Login User
- **POST** `/auth/login`
- **Description**: Authenticate user and get JWT token
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    }
  }
  ```

### Groups

All group endpoints require authentication.

#### Create Group
- **POST** `/groups`
- **Description**: Create a new chat group
- **Body**:
  ```json
  {
    "title": "General Discussion",
    "description": "A group for general discussions" // optional
  }
  ```
- **Response**: Created group object

#### Get All Groups
- **GET** `/groups`
- **Description**: Get list of all available groups
- **Response**: Array of group objects

#### Get User's Groups
- **GET** `/groups/my-groups`
- **Description**: Get groups where the current user is a member
- **Response**: Array of group objects

#### Get Group by ID
- **GET** `/groups/:id`
- **Description**: Get details of a specific group
- **Response**: Group object

#### Join Group
- **POST** `/groups/:id/join`
- **Description**: Join a group as a member
- **Response**:
  ```json
  {
    "message": "Successfully joined the group",
    "groupId": 1
  }
  ```

#### Leave Group
- **POST** `/groups/:id/leave`
- **Description**: Leave a group
- **Response**:
  ```json
  {
    "message": "Successfully left the group",
    "groupId": 1
  }
  ```

#### Delete Group
- **DELETE** `/groups/:id`
- **Description**: Delete a group (only group creator can delete)
- **Response**:
  ```json
  {
    "message": "Group successfully deleted",
    "groupId": 1
  }
  ```

## WebSocket Events

The WebSocket server runs on the same port as the HTTP server. Connect to:
```
ws://localhost:3000/chat
```

### Authentication

Connect to WebSocket with JWT token in the auth object:
```javascript
const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client Events (Send to Server)

#### Join Group
```javascript
socket.emit('joinGroup', { groupId: 1 });
```

#### Leave Group
```javascript
socket.emit('leaveGroup', { groupId: 1 });
```

#### Send Message
```javascript
socket.emit('sendMessage', {
  content: 'Hello everyone!',
  groupId: 1
});
```

#### Typing Indicator
```javascript
socket.emit('typing', {
  groupId: 1,
  isTyping: true // or false
});
```

#### Get Online Users
```javascript
socket.emit('getOnlineUsers', { groupId: 1 });
```

### Server Events (Receive from Server)

#### Connection Confirmation
```javascript
socket.on('connected', (data) => {
  console.log('Connected:', data.message);
  console.log('User:', data.user);
});
```

#### Joined Group
```javascript
socket.on('joinedGroup', (data) => {
  console.log('Joined group:', data.groupId);
  console.log('Message:', data.message);
});
```

#### User Joined Group
```javascript
socket.on('userJoined', (data) => {
  console.log('User joined:', data.user.name);
  console.log('Group:', data.groupId);
  console.log('Message:', data.message);
});
```

#### User Left Group
```javascript
socket.on('userLeft', (data) => {
  console.log('User left:', data.user.name);
  console.log('Group:', data.groupId);
  console.log('Message:', data.message);
});
```

#### New Message
```javascript
socket.on('newMessage', (data) => {
  console.log('New message from:', data.sender.name);
  console.log('Content:', data.content);
  console.log('Group:', data.groupId);
  console.log('Timestamp:', data.createdAt);
});
```

#### User Typing
```javascript
socket.on('userTyping', (data) => {
  console.log('User typing:', data.user.name);
  console.log('Is typing:', data.isTyping);
  console.log('Group:', data.groupId);
});
```

#### Online Users
```javascript
socket.on('onlineUsers', (data) => {
  console.log('Online users in group:', data.groupId);
  console.log('Users:', data.users);
});
```

#### Error
```javascript
socket.on('error', (data) => {
  console.error('Error:', data.message);
});
```

## Data Models

### User
```typescript
{
  id: number;
  name: string;
  email: string;
  password: string; // hashed
  role: 'admin' | 'user';
  createdAt: Date;
}
```

### ChatGroup
```typescript
{
  id: number;
  title: string;
  description: string | null;
  createdById: number;
  createdAt: Date;
}
```

### Message
```typescript
{
  id: number;
  content: string;
  senderId: number;
  groupId: number;
  createdAt: Date;
}
```

### GroupUser
```typescript
{
  id: number;
  userId: number;
  groupId: number;
  joinedAt: Date;
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": ["email must be an email", "password must be longer than or equal to 6 characters"]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file:
   ```
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=password
   DATABASE_NAME=group_chat
   JWT_SECRET=your-secret-key
   ```

3. Start the application:
   ```bash
   npm run start:dev
   ```

4. Access the API documentation at `http://localhost:3000/api/docs`

## WebSocket Connection Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('connected', (data) => {
  console.log('Authenticated:', data.user.name);
});

// Join a group
socket.emit('joinGroup', { groupId: 1 });

// Send a message
socket.emit('sendMessage', {
  content: 'Hello everyone!',
  groupId: 1
});

// Listen for new messages
socket.on('newMessage', (data) => {
  console.log(`${data.sender.name}: ${data.content}`);
});
``` 