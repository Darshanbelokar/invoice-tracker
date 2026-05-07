import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout({ children, title, topbarProps }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-60 flex flex-col min-h-screen">
        <Topbar title={title} {...topbarProps} />
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
