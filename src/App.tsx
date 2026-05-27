import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { EvalCoordinadorView } from '@/components/evaluacion/EvalCoordinadorView';
import { EvalSupervisionView } from '@/components/evaluacion/EvalSupervisionView';
import { EntityCrud } from '@/components/entidades/EntityCrud';
import { ReportesView } from '@/components/reportes/ReportesView';
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { trpc } from '@/providers/trpc';
import './App.css';

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading: authLoading, login, register, logout } = useLocalAuth();

  // tRPC queries
  const docentesQ = trpc.docentes.list.useQuery(undefined, { enabled: splashDone && !!user });
  const programasQ = trpc.programas.list.useQuery(undefined, { enabled: splashDone && !!user });
  const aulasQ = trpc.aulas.list.useQuery(undefined, { enabled: splashDone && !!user });
  const clasesQ = trpc.clases.listWithDetails.useQuery(undefined, { enabled: splashDone && !!user });
  const criteriosCoordQ = trpc.criterios.coordinador.useQuery(undefined, { enabled: splashDone && !!user });
  const criteriosSupQ = trpc.criterios.supervision.useQuery(undefined, { enabled: splashDone && !!user });
  const evalCoordQ = trpc.evalCoordinador.list.useQuery(undefined, { enabled: splashDone && !!user });
  const evalSupQ = trpc.evalSupervision.list.useQuery(undefined, { enabled: splashDone && !!user });

  // tRPC mutations
  const docCreate = trpc.docentes.create.useMutation({ onSuccess: () => docentesQ.refetch() });
  const docUpdate = trpc.docentes.update.useMutation({ onSuccess: () => docentesQ.refetch() });
  const docDelete = trpc.docentes.delete.useMutation({ onSuccess: () => docentesQ.refetch() });
  const progCreate = trpc.programas.create.useMutation({ onSuccess: () => programasQ.refetch() });
  const progUpdate = trpc.programas.update.useMutation({ onSuccess: () => programasQ.refetch() });
  const progDelete = trpc.programas.delete.useMutation({ onSuccess: () => programasQ.refetch() });
  const aulaCreate = trpc.aulas.create.useMutation({ onSuccess: () => aulasQ.refetch() });
  const aulaUpdate = trpc.aulas.update.useMutation({ onSuccess: () => aulasQ.refetch() });
  const aulaDelete = trpc.aulas.delete.useMutation({ onSuccess: () => aulasQ.refetch() });
  const claseCreate = trpc.clases.create.useMutation({ onSuccess: () => clasesQ.refetch() });
  const claseUpdate = trpc.clases.update.useMutation({ onSuccess: () => clasesQ.refetch() });
  const claseDelete = trpc.clases.delete.useMutation({ onSuccess: () => clasesQ.refetch() });

  if (!splashDone) return <SplashScreen onComplete={() => setSplashDone(true)} />;
  if (authLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #002561, #2f6f7e)' }}><div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" /></div>;
  if (!user) return <LoginForm onLogin={login} onRegister={register} />;

  const d = docentesQ.data || [];
  const p = programasQ.data || [];
  const a = aulasQ.data || [];
  const c = clasesQ.data || [];
  const cc = criteriosCoordQ.data || {};
  const cs = criteriosSupQ.data || {};
  const ec = evalCoordQ.data || [];
  const es = evalSupQ.data || [];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView docentes={d} programas={p} aulas={a} clases={c} evalCoord={ec} evalSup={es} onNavigate={setActiveTab} />;
      case 'coordinador': return <EvalCoordinadorView docentes={d} evaluaciones={ec} criterios={cc} refetch={() => { evalCoordQ.refetch(); docentesQ.refetch(); }} />;
      case 'supervision': return <EvalSupervisionView docentes={d} aulas={a} clases={c} evaluaciones={es} criterios={cs} refetch={() => { evalSupQ.refetch(); docentesQ.refetch(); aulasQ.refetch(); clasesQ.refetch(); }} />;
      case 'docentes': return <EntityCrud type="docentes" data={d} onCreate={(data) => docCreate.mutate(data)} onUpdate={(id, data) => docUpdate.mutate({ id, ...data })} onDelete={(id) => docDelete.mutate({ id })} />;
      case 'programas': return <EntityCrud type="programas" data={p} onCreate={(data) => progCreate.mutate(data)} onUpdate={(id, data) => progUpdate.mutate({ id, ...data })} onDelete={(id) => progDelete.mutate({ id })} />;
      case 'aulas': return <EntityCrud type="aulas" data={a} onCreate={(data) => aulaCreate.mutate(data)} onUpdate={(id, data) => aulaUpdate.mutate({ id, ...data })} onDelete={(id) => aulaDelete.mutate({ id })} />;
      case 'clases': return <EntityCrud type="clases" data={c} programas={p} docentes={d} aulas={a} onCreate={(data) => claseCreate.mutate(data)} onUpdate={(id, data) => claseUpdate.mutate({ id, ...data })} onDelete={(id) => claseDelete.mutate({ id })} />;
      case 'reportes': return <ReportesView evalCoord={ec} evalSup={es} docentes={d} />;
      default: return <DashboardView docentes={d} programas={p} aulas={a} clases={c} evalCoord={ec} evalSup={es} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-['Poppins',sans-serif]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} userName={`${user.nombre} ${user.apellido}`} onLogout={logout} />
      <main>{renderContent()}</main>
      <WhatsAppButton />
      <footer className="mt-12" style={{ background: 'linear-gradient(135deg, #002561, #2f6f7e)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div><p className="font-semibold">Universidad de Defensa de Honduras</p><p className="text-sm text-white/70">Vicerrectoria Academica - Posgrado</p></div>
          <div className="text-center md:text-right text-sm text-white/60"><p>Sistema de Evaluacion Docente - Oficial en Servicio de Reporte</p><p>&copy; 2025 Todos los derechos reservados</p></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
