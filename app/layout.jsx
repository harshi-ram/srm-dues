import { AuthProvider } from '@/components/AuthProvider';

export const metadata = {
  title: 'SRM Dues',
  description: 'Class deadline tracker with task planner',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f9fafb' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

