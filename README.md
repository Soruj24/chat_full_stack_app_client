# Modern Chat Application

A real-time, feature-rich chat application built with Next.js, Redux, Socket.io, and MongoDB.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.io.
- **Group Chats**: Create and manage group conversations with multiple participants.
- **Message Interactions**:
  - Reactions (Emoji)
  - Forwarding
  - Replying
  - Pinning/Starring messages
  - Deletion (Delete for me/everyone)
- **Chat Management**:
  - Pin, Archive, and Mute chats.
  - Search messages and users.
  - Typing indicators.
- **Rich Media**: Support for images and voice messages.
- **Profile Management**: Customize your profile and settings.
- **Responsive UI**: Beautifully designed with Tailwind CSS, supporting dark/light modes.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Framer Motion
- **State Management**: Redux Toolkit
- **Backend**: Next.js API Routes (Serverless)
- **Real-time**: Socket.io (Standalone server)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & Bcryptjs

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Soruj24/chat-app.git
   cd chat-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application**:
   - Start the Socket server:
     ```bash
     npm run socket
     ```
   - Start the Next.js development server:
     ```bash
     npm run dev
     ```

## 📜 Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run socket`: Starts the Socket.io server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
