export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={setActiveChatId}
      /> */}
    {children}
    </div>
  );
}