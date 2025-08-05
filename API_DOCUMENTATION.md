# Secure Group Chat API Documentation

## Overview

This is a secure, real-time group chat application built with NestJS, featuring WebSocket support for live messaging and REST API endpoints. The system implements strict security measures with admin-only group management and proper member visibility controls.

## Security Features

### Admin-Only Operations
- **Group Creation**: Only admin users can create new groups
- **Group Deletion**: Only admin users can delete groups  
- **View All Groups**: Only admin users can see all groups in the system

### Member-Only Access
- **Group Viewing**: Regular users can only view groups they are members of
- **Message Access**: Users can only send/receive messages in groups they belong to
- **Member Visibility**: Users can only see members of groups they belong to

### Authentication
- **JWT Tokens**: All operations require valid JWT authentication
- **Role-Based Access**: Different permissions for admin and user roles
- **WebSocket Security**: All WebSocket connections require JWT authentication

## Base URL

```
http://localhost:3000/api
```

## API Documentation

The interactive API documentation is available at:
```
http://localhost:3000/api/docs
```
## Testing the Security Features

### Admin User Testing
1. Login as admin (`admin@example.com` / `admin123`)
2. Create a new group
3. View all groups in the system
4. Delete any group
5. Access any group's messages and members

### Regular User Testing
1. Login as regular user (`user@example.com` / `user123`)
2. Try to create a group (should fail with 403)
3. Try to view all groups (should fail with 403)
4. Join a group created by admin
5. Send messages to the group
6. View only groups you're a member of
7. View only members of groups you belong to 