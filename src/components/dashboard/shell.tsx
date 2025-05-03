import { ReactNode } from 'react';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="container mx-auto py-6">
      <main className="bg-white p-6 rounded-lg shadow-sm">{children}</main>
    </div>
  );
}
