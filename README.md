# Secure Group Chat System

A secure, real-time group chat application built with NestJS, featuring WebSocket support for live messaging and comprehensive REST API endpoints. This system implements strict security measures with admin-only group management and proper member visibility controls.

## Features

### Security & Access Control
- **Admin-Only Group Management**: Only admin users can create, view all groups, and delete groups
- **Member-Only Access**: Regular users can only view groups they are members of
- **JWT Authentication**: Secure token-based authentication for all operations
- **Role-Based Permissions**: Admin and User roles with different access levels

### Group Management
- **Group Creation**: Admin users can create new chat groups
- **Group Deletion**: Admin users can delete any group
- **Member Management**: Users can join and leave groups
- **Member Visibility**: Group members can see all other members in their groups

### Real-Time Chat
- **WebSocket Support**: Real-time messaging with Socket.IO
- **Group Chat**: Send messages to specific groups
- **Typing Indicators**: Real-time typing notifications
- **Online Users**: See who's currently online in a group
- **Message History**: Retrieve chat history via REST API

## Technology Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: MySQL with TypeORM
- **Real-time**: Socket.IO for WebSocket connections
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Security**: bcryptjs for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd group-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=group_chat
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Database Setup**
   - Create a MySQL database named `group_chat`
   - The application will automatically create tables on startup

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the interactive API documentation at:
```
http://localhost:3000/api/docs
```

## Authentication

The system uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Users (Created by Seeder)

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`
- Role: `user`

## Security Features

### Admin-Only Operations
- **Group Creation**: Only admin users can create new groups
- **Group Deletion**: Only admin users can delete groups
- **View All Groups**: Only admin users can see all groups in the system

### Member-Only Access
- **Group Viewing**: Regular users can only view groups they are members of
- **Message Access**: Users can only send/receive messages in groups they belong to
- **Member Visibility**: Users can only see members of groups they belong to

### WebSocket Security
- **Authentication Required**: All WebSocket connections require valid JWT tokens
- **Member Validation**: Users can only join chat rooms for groups they are members of
- **Message Validation**: Messages can only be sent to groups the user belongs to

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Groups (Admin-Only Management)
- `POST /api/groups` - Create a new group (Admin only)
- `GET /api/groups` - Get all groups (Admin only)
- `DELETE /api/groups/:id` - Delete a group (Admin only)

### Groups (Member Access)
- `GET /api/groups/my-groups` - Get user's groups
- `GET /api/groups/:id` - Get group details (Admin or member)
- `GET /api/groups/:id/members` - Get group members (Admin or member)
- `POST /api/groups/:id/join` - Join a group
- `POST /api/groups/:id/leave` - Leave a group

### Chat
- `GET /api/chat/groups/:groupId/messages` - Get group messages (Admin or member)
- `POST /api/chat/groups/:groupId/messages` - Send message to group (Member only)
- `DELETE /api/chat/messages/:messageId` - Delete message (Sender only)

## WebSocket Events

### Client Events (Send to Server)
- `joinGroup` - Join a group chat room (Member only)
- `leaveGroup` - Leave a group chat room
- `sendMessage` - Send a message to a group (Member only)
- `typing` - Send typing indicator (Member only)
- `getOnlineUsers` - Get online users in a group (Member only)

### Server Events (Receive from Server)
- `connected` - Connection confirmation
- `joinedGroup` - Successfully joined a group
- `userJoined` - Another user joined the group
- `userLeft` - Another user left the group
- `newMessage` - New message received
- `userTyping` - User typing indicator
- `onlineUsers` - List of online users
- `error` - Error messages

## Project Structure

```
src/
├── auth/                # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── entity/          # User entity
│   ├── guards/          # Authentication guards
│   └── strategies/      # JWT strategy
├── chat/                # Chat module
│   ├── dto/             # Message DTOs
│   ├── entity/          # Message entity
│   └── gateway/         # WebSocket gateway
├── group/               # Group management module
│   ├── dto/             # Group DTOs
│   ├── entities/        # Group entities
│   └── service/         # Group business logic
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators
│   ├── dto/             # Common DTOs
│   └── enum/            # Enums
└── config/              # Configuration files
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `DATABASE_HOST` | Database host | `localhost` |
| `DATABASE_PORT` | Database port | `3306` |
| `DATABASE_USERNAME` | Database username | `root` |
| `DATABASE_PASSWORD` | Database password | - |
| `DATABASE_NAME` | Database name | `group_chat` |
| `JWT_SECRET` | JWT secret key | - |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
