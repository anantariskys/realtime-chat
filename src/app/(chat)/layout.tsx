import ChatLayout from "@/components/layouts/chatLayout";
import { ChatProvider } from "@/contexts/chat-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <ChatLayout>{children}</ChatLayout>
    </ChatProvider>
  );
}
