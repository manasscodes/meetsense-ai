export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-[#111111] overflow-hidden">
      {children}
    </div>
  );
}
