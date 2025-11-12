"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center items-center p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
