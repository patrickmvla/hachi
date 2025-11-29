export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--muted)]/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-[var(--primary)] rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Hachi</h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            The Agentic AI Coding Assistant Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
