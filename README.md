# Realtime Chat Application

A modern, real-time chat application built with **Next.js 16**, **Socket.IO**, and **Tailwind CSS**. This project features instant messaging, user authentication, group chats, and a polished UI using **Shadcn UI**.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.IO.
- **Authentication**: Secure login system using NextAuth.js with protected routes (Middleware).
- **Group Chats**: Create group chats with multiple members.
- **Contact Search**: Search for other users to start conversations.
- **Interactive UI**:
  - Polished message bubbles (Right for sender, Left for receiver).
  - Toast notifications for errors and success states (Sonner).
  - Responsive Sidebar with Logout functionality.
- **State Management**: Efficient data fetching and caching with TanStack Query.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Real-time Server**: [Socket.IO](https://socket.io/) (Custom Node.js Server)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Form Handling**: React Hook Form & Zod
- **Language**: TypeScript

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd realtime-chat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    Since this project uses a custom server for Socket.IO, use the following command:
    ```bash
    npm run dev
    ```
    This runs `ts-node server.ts`.

4.  **Open the application:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication (Demo Accounts)

The project uses dummy authentication for demonstration purposes. You can log in using the following credentials:

| User | Email | Password |
|------|-------|----------|
| **Alice** | `alice@example.com` | `password` |
| **Bob** | `bob@example.com` | `password` |
| **Charlie** | `charlie@example.com` | `password` |

*(Note: Password validation is mocked, you can use any string for now, but these emails are pre-configured).*

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Authentication pages (Login)
│   ├── (chat)/           # Main chat application layout
│   └── api/              # API Routes (Auth, Contacts, Direct Data)
├── components/           # React components
│   ├── ui/               # Reusable UI components (Shadcn)
│   ├── features/         # Feature-specific components (Chat, Auth)
│   └── layouts/          # Layout components
├── contexts/             # React Contexts (ChatContext)
├── hooks/                # Custom Hooks (useSocket, useChatData)
├── lib/                  # Utilities and API functions
├── types/                # TypeScript definitions
├── auth.ts               # NextAuth configuration
├── middleware.ts         # Route protection middleware
└── socket.ts             # Socket.IO client instance
server.ts                 # Custom Node.js server with Socket.IO
```

## 📝 Usage

1.  **Login**: Enter one of the demo emails to log in.
2.  **Start Chatting**: Select a contact from the sidebar or search for a user.
3.  **Create Group**: Click the "+" icon in the sidebar to create a new group.
4.  **Logout**: Click the "Settings" (Gear) icon in the sidebar and select "Log out".

## 🔧 Troubleshooting

- **Socket Connection**: If messages aren't sending, ensure the server is running via `npm run dev` (not just `next dev`).
- **Build Errors**: Run `npm run build` to check for TypeScript errors.

## 📄 License

This project is open-source and available under the MIT License.
