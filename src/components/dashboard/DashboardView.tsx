import { useMemo } from 'react';
import { Users, BookOpen, Building2, ClipboardCheck, Star, TrendingUp, TrendingDown, Award, FileBarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type EvalCoord = { id: number; docenteId: number; calificacionTotal: number | null; notaCarpeta: number | null; notaDesempeno: number | null; notaPerfil: number | null; docente?: { nombre: string; apellido: string } | null };
type EvalSup = { id: number; docenteId: number; notaDocente: number | null; notaEstudiantes: number | null; notaEspacioFisico: number | null; docente?: { nombre: string; apellido: string } | null };

interface Props {
  docentes: any[];
  programas: any[];
  aulas: any[];
  clases: any[];
  evalCoord: EvalCoord[];
  evalSup: EvalSup[];
  onNavigate: (tab: string) => void;
}

export function DashboardView({ docentes, programas, aulas, clases, evalCoord, evalSup, onNavigate }: Props) {
  const stats = useMemo(() => {
    const td = docentes.filter((d: any) => d.activo).length;
    const tp = programas.filter((p: any) => p.activo).length;
    const ta = aulas.filter((a: any) => a.activo).length;
    const tc = clases.filter((c: any) => c.activo).length;
    const tec = evalCoord.length;
    const tes = evalSup.length;

    let sum = 0, cnt = 0;
    evalCoord.forEach(e => { if (e.calificacionTotal) { sum += e.calificacionTotal; cnt++; } });
    evalSup.forEach(e => { if (e.notaDocente) { sum += e.notaDocente; cnt++; } });
    const prom = cnt > 0 ? sum / cnt : 0;

    const ranking: Record<string, { nombre: string; suma: number; count: number }> = {};
    evalCoord.forEach(e => {
      const d = e.docente;
      if (!d || !e.calificacionTotal) return;
      const key = `${d.nombre} ${d.apellido}`;
      if (!ranking[key]) ranking[key] = { nombre: key, suma: 0, count: 0 };
      ranking[key].suma += e.calificacionTotal; ranking[key].count++;
    });
    const ranked = Object.values(ranking).map(d => ({ nombre: d.nombre, promedio: d.suma / d.count })).sort((a, b) => b.promedio - a.promedio);

    return { td, tp, ta, tc, tec, tes, prom, mejores: ranked.slice(0, 3), peores: [...ranked].reverse().slice(0, 3) };
  }, [docentes, programas, aulas, clases, evalCoord, evalSup]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#002561]">Dashboard</h2>
        <p className="text-sm text-gray-500">Resumen del Sistema de Evaluacion Docente</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#002561] cursor-pointer hover:shadow-md" onClick={() => onNavigate('docentes')}>
          <CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Docentes</p><p className="text-2xl font-bold text-[#002561]">{stats.td}</p></div><Users className="w-8 h-8 text-[#002561]/20" /></div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#2f6f7e] cursor-pointer hover:shadow-md" onClick={() => onNavigate('programas')}>
          <CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Programas</p><p className="text-2xl font-bold text-[#2f6f7e]">{stats.tp}</p></div><BookOpen className="w-8 h-8 text-[#2f6f7e]/20" /></div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#484848] cursor-pointer hover:shadow-md" onClick={() => onNavigate('aulas')}>
          <CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Aulas</p><p className="text-2xl font-bold text-[#484848]">{stats.ta}</p></div><Building2 className="w-8 h-8 text-[#484848]/20" /></div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-600 cursor-pointer hover:shadow-md" onClick={() => onNavigate('clases')}>
          <CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Clases</p><p className="text-2xl font-bold text-teal-700">{stats.tc}</p></div><BookOpen className="w-8 h-8 text-teal-200" /></div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-600 cursor-pointer hover:shadow-md" onClick={() => onNavigate('coordinador')}>
          <CardContent className="p-4"><div className="flex justify-between mb-2"><ClipboardCheck className="w-6 h-6 text-blue-600" /><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Coordinador</span></div><p className="text-3xl font-bold">{stats.tec}</p><p className="text-sm text-gray-500">Evaluaciones registradas</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-600 cursor-pointer hover:shadow-md" onClick={() => onNavigate('supervision')}>
          <CardContent className="p-4"><div className="flex justify-between mb-2"><FileBarChart className="w-6 h-6 text-orange-600" /><span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Supervision</span></div><p className="text-3xl font-bold">{stats.tes}</p><p className="text-sm text-gray-500">Visitas de supervision</p></CardContent>
        </Card>
        <Card>
          <CardContent className="p-4"><div className="flex justify-between mb-2"><Star className="w-6 h-6 text-[#002561]" /><span className="text-xs bg-[#002561]/10 text-[#002561] px-2 py-0.5 rounded-full">Promedio</span></div><p className="text-3xl font-bold">{stats.prom.toFixed(2)}</p><p className="text-sm text-gray-500">de 4.00 maximo</p><Progress value={(stats.prom / 4) * 100} className="mt-2" /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Award className="w-5 h-5 text-emerald-500" />Mejores Docentes</CardTitle></CardHeader>
          <CardContent>{stats.mejores.length === 0 ? <p className="text-sm text-gray-400 text-center py-6">Sin evaluaciones</p> : <div className="space-y-3">{stats.mejores.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div><span className="font-medium text-sm">{d.nombre}</span></div>
              <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /><span className="font-bold text-emerald-700">{d.promedio.toFixed(2)}</span></div>
            </div>))}</div>}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-500" />Areas de Mejora</CardTitle></CardHeader>
          <CardContent>{stats.peores.length === 0 ? <p className="text-sm text-gray-400 text-center py-6">Sin evaluaciones</p> : <div className="space-y-3">{stats.peores.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div><span className="font-medium text-sm">{d.nombre}</span></div>
              <div className="flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500" /><span className="font-bold text-red-700">{d.promedio.toFixed(2)}</span></div>
            </div>))}</div>}</CardContent>
        </Card>
      </div>
    </div>
  );
}
