import { Shield, LayoutDashboard, ClipboardCheck, FileBarChart, Users, BookOpen, Building2, Calendar, FileText, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName: string;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'coordinador', label: 'Eval. Coordinador', icon: ClipboardCheck },
  { id: 'supervision', label: 'Supervision Diaria', icon: FileBarChart },
  { id: 'docentes', label: 'Docentes', icon: Users },
  { id: 'programas', label: 'Programas', icon: BookOpen },
  { id: 'aulas', label: 'Aulas', icon: Building2 },
  { id: 'clases', label: 'Clases', icon: Calendar },
  { id: 'reportes', label: 'Reportes', icon: FileText },
];

export function Header({ activeTab, onTabChange, userName, onLogout }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-[#002561] text-white shadow-lg">
      {/* Top bar */}
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-white/15 p-2 rounded-lg">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Universidad de Defensa de Honduras</h1>
            <p className="text-xs text-white/70">Vicerrectoria Academica - Posgrado</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-white/80">{userName}</span>
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Cerrar Sesion">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-lg">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`bg-[#002561]/90 backdrop-blur-sm ${mobileOpen ? 'block' : 'hidden md:block'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors hover:bg-white/10 ${activeTab === item.id ? 'bg-white/15 border-b-2 border-[#2f6f7e]' : ''}`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
