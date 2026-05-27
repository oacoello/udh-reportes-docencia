import { useState } from 'react';
import { ClipboardCheck, Save, CheckCircle, Calendar, User, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/providers/trpc';
import { cn } from '@/lib/utils';

const periodos = ['I Periodo 2025', 'II Periodo 2025', 'I Periodo 2026', 'II Periodo 2026'];

interface Props {
  docentes: any[];
  evaluaciones: any[];
  criterios: Record<string, any[]>;
  refetch: () => void;
}

function calcPromedio(califs: Record<string, number>, ids: number[]): number {
  const vals = ids.map(id => califs[id] || 0).filter(v => v > 0);
  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

export function EvalCoordinadorView({ docentes, evaluaciones, criterios, refetch }: Props) {
  const [modo, setModo] = useState<'lista' | 'nueva'>('lista');
  const [docenteId, setDocenteId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [periodo, setPeriodo] = useState(periodos[0]);
  const [calificaciones, setCalificaciones] = useState<Record<string, number>>({});
  const [comentarios, setComentarios] = useState('');
  const [success, setSuccess] = useState(false);

  const createMut = trpc.evalCoordinador.create.useMutation({ onSuccess: () => { setSuccess(true); setTimeout(() => { setSuccess(false); reset(); setModo('lista'); refetch(); }, 2000); } });
  const deleteMut = trpc.evalCoordinador.delete.useMutation({ onSuccess: () => refetch() });

  const reset = () => { setDocenteId(''); setFecha(new Date().toISOString().split('T')[0]); setPeriodo(periodos[0]); setCalificaciones({}); setComentarios(''); };

  const carpetaIds = (criterios['Carpeta Docente'] || []).map(c => c.id);
  const desempenoIds = (criterios['Desempeno Docente'] || []).map(c => c.id);
  const perfilIds = (criterios['Perfil Docente'] || []).map(c => c.id);

  const nc = calcPromedio(calificaciones, carpetaIds);
  const nd = calcPromedio(calificaciones, desempenoIds);
  const np = calcPromedio(calificaciones, perfilIds);
  const total = (nc + nd + np) / 3;

  const handleGuardar = () => {
    if (!docenteId) return;
    createMut.mutate({ docenteId: Number(docenteId), fecha, periodo, calificaciones, notaCarpeta: nc, notaDesempeno: nd, notaPerfil: np, calificacionTotal: total, comentarios });
  };

  const getNivel = (n: number) => n >= 3.5 ? { l: 'Excelente', c: 'text-emerald-600 bg-emerald-50' } : n >= 3 ? { l: 'Bueno', c: 'text-blue-600 bg-blue-50' } : n >= 2 ? { l: 'Regular', c: 'text-amber-600 bg-amber-50' } : { l: 'Deficiente', c: 'text-red-600 bg-red-50' };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#002561] flex items-center gap-2"><ClipboardCheck className="w-7 h-7" />Evaluacion - Coordinador Academico</h2>
          <p className="text-sm text-gray-500">{modo === 'lista' ? 'Evaluaciones registradas' : 'Complete todos los criterios'}</p>
        </div>
        <div className="flex gap-2">
          {modo !== 'lista' && <button onClick={() => setModo('lista')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Volver</button>}
          {modo === 'lista' && <button onClick={() => { reset(); setModo('nueva'); }} className="px-4 py-2 bg-[#002561] text-white rounded-lg text-sm font-medium hover:bg-[#001d4a]">+ Nueva Evaluacion</button>}
        </div>
      </div>

      {modo === 'lista' ? (
        <Card><CardContent className="p-0">
          {evaluaciones.length === 0 ? <div className="p-12 text-center"><ClipboardCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" /><p className="text-gray-500">No hay evaluaciones registradas</p></div> : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50"><th className="text-left py-3 px-4">Docente</th><th className="text-left py-3 px-4">Periodo</th><th className="text-left py-3 px-4">Fecha</th><th className="text-center py-3 px-4">Carpeta</th><th className="text-center py-3 px-4">Desempeno</th><th className="text-center py-3 px-4">Perfil</th><th className="text-center py-3 px-4">Total</th><th className="text-right py-3 px-4">Acc.</th></tr></thead>
              <tbody>{evaluaciones.map((ev: any) => { const nvl = getNivel(ev.calificacionTotal || 0); return (
                <tr key={ev.id} className="border-b hover:bg-gray-50"><td className="py-3 px-4 font-medium">{ev.docente ? `${ev.docente.nombre} ${ev.docente.apellido}` : 'N/A'}</td><td className="py-3 px-4 text-gray-600">{ev.periodo}</td><td className="py-3 px-4 text-gray-600">{ev.fecha}</td>
                  <td className="py-3 px-4 text-center font-medium text-amber-600">{(ev.notaCarpeta || 0).toFixed(2)}</td><td className="py-3 px-4 text-center font-medium text-blue-600">{(ev.notaDesempeno || 0).toFixed(2)}</td><td className="py-3 px-4 text-center font-medium text-purple-600">{(ev.notaPerfil || 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-center"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${nvl.c}`}>{(ev.calificacionTotal || 0).toFixed(2)}</span></td>
                  <td className="py-3 px-4 text-right"><button onClick={() => deleteMut.mutate({ id: ev.id })} className="text-red-500 hover:underline text-xs">Eliminar</button></td></tr>); })}</tbody>
            </table></div>)}
        </CardContent></Card>
      ) : (
        <div className="space-y-6">
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#002561]" />Datos Generales</CardTitle></CardHeader>
            <CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label className="flex items-center gap-2"><User className="w-4 h-4" />Docente</Label>
                <Select value={docenteId} onValueChange={setDocenteId}><SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent>{docentes.filter((d: any) => d.activo).map((d: any) => <SelectItem key={d.id} value={String(d.id)}>{d.nombre} {d.apellido}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Calendar className="w-4 h-4" />Fecha</Label><Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} /></div>
              <div className="space-y-2"><Label>Periodo</Label><Select value={periodo} onValueChange={setPeriodo}><SelectContent>{periodos.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
            </div></CardContent></Card>

          <Card><CardContent className="p-6 space-y-8">
            {Object.entries(criterios).map(([seccion, crits]) => {
              const ids = crits.map(c => c.id);
              const prom = calcPromedio(calificaciones, ids);
              return (<div key={seccion} className="space-y-4">
                <div className="flex items-center justify-between bg-[#002561]/10 p-3 rounded-lg"><h4 className="font-semibold text-[#002561]">{seccion}</h4><span className="font-bold text-lg text-[#002561]">{prom.toFixed(2)}</span></div>
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="w-12">No.</th><th className="text-left py-2 px-3">Aspectos Evaluados</th><th className="text-center" colSpan={4}>Calif. (1-4)</th><th className="w-16 text-center">Nota</th></tr></thead><tbody>
                  {crits.map((c: any) => (<tr key={c.id} className="border-b hover:bg-gray-50"><td className="py-3 px-3 font-medium">{c.orden}</td><td className="py-3 px-3">{c.descripcion}</td>
                    {[1, 2, 3, 4].map(v => (<td key={v} className="py-3 px-2 text-center"><button onClick={() => setCalificaciones(prev => ({ ...prev, [c.id]: v }))} className={cn('w-10 h-10 rounded-full text-sm font-bold transition-all', calificaciones[c.id] === v ? (v <= 2 ? 'bg-red-500 text-white' : v === 3 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white') : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>{v}</button></td>))}
                    <td className="py-3 px-3 text-center font-bold text-[#002561]">{calificaciones[c.id] || '-'}</td></tr>))}
                </tbody></table></div></div>);
            })}
            <div className="space-y-2"><Label>Comentarios</Label><Textarea value={comentarios} onChange={e => setComentarios(e.target.value)} rows={3} /></div>
            <div className="bg-[#002561]/10 p-6 rounded-xl text-center space-y-2"><p className="text-sm text-gray-600">CALIFICACION TOTAL</p><p className="text-5xl font-bold text-[#002561]">{total.toFixed(2)}</p><div className="flex justify-center gap-6 text-sm"><span className="text-amber-600">Carpeta: {nc.toFixed(2)}</span><span className="text-blue-600">Desempeno: {nd.toFixed(2)}</span><span className="text-purple-600">Perfil: {np.toFixed(2)}</span></div></div>
            <div className="flex justify-end gap-3"><button onClick={() => setModo('lista')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button><button onClick={handleGuardar} disabled={!docenteId} className="px-6 py-2 bg-[#002561] text-white rounded-lg font-medium hover:bg-[#001d4a] disabled:opacity-50 flex items-center gap-2"><Save className="w-4 h-4" />Guardar</button></div>
          </CardContent></Card>
        </div>
      )}
      {success && <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"><CheckCircle className="w-5 h-5" />Evaluacion guardada</div>}
    </div>
  );
}
