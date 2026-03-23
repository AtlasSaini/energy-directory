// Dashboard has its own top bar — exclude global Header and Footer
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
