import { useState } from 'react';
import { FileBarChart, Save, CheckCircle, Calendar, User, Building2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/providers/trpc';
import { cn } from '@/lib/utils';

const periodos = ['I Periodo 2025', 'II Periodo 2025', 'I Periodo 2026', 'II Periodo 2026'];

interface Props { docentes: any[]; aulas: any[]; clases: any[]; evaluaciones: any[]; criterios: Record<string, any[]>; refetch: () => void; }

function calcPromedio(califs: Record<string, number>, ids: number[]): number {
  const vals = ids.map(id => califs[id] || 0).filter(v => v > 0);
  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

export function EvalSupervisionView({ docentes, aulas, clases, evaluaciones, criterios, refetch }: Props) {
  const [modo, setModo] = useState<'lista' | 'nueva'>('lista');
  const [docenteId, setDocenteId] = useState('');
  const [aulaId, setAulaId] = useState('');
  const [claseId, setClaseId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [periodo, setPeriodo] = useState(periodos[0]);
  const [califDoc, setCalifDoc] = useState<Record<string, number>>({});
  const [califEst, setCalifEst] = useState<Record<string, number>>({});
  const [califEsp, setCalifEsp] = useState<Record<string, number>>({});
  const [comentario, setComentario] = useState('');
  const [success, setSuccess] = useState(false);

  const createMut = trpc.evalSupervision.create.useMutation({ onSuccess: () => { setSuccess(true); setTimeout(() => { setSuccess(false); reset(); setModo('lista'); refetch(); }, 2000); } });
  const deleteMut = trpc.evalSupervision.delete.useMutation({ onSuccess: () => refetch() });

  const reset = () => { setDocenteId(''); setAulaId(''); setClaseId(''); setFecha(new Date().toISOString().split('T')[0]); setPeriodo(periodos[0]); setCalifDoc({}); setCalifEst({}); setCalifEsp({}); setComentario(''); };

  const docIds = (criterios['Criterios del Docente'] || []).map(c => c.id);
  const estIds = (criterios['Criterios de los Estudiantes'] || []).map(c => c.id);
  const espIds = (criterios['Criterios del Espacio Fisico'] || []).map(c => c.id);

  const nd = calcPromedio(califDoc, docIds);
  const ne = calcPromedio(califEst, estIds);
  const nes = calcPromedio(califEsp, espIds);

  const handleGuardar = () => {
    if (!docenteId || !aulaId) return;
    const aulaSel = aulas.find((a: any) => a.id === Number(aulaId));
    const claseSel = clases.find((c: any) => c.id === Number(claseId));
    createMut.mutate({ docenteId: Number(docenteId), aula: aulaSel?.nombre, programaAcademico: claseSel ? docentes.find((d: any) => d.id === claseSel.docenteId)?.especialidad : undefined, clase: claseSel?.nombre, fecha, periodo, calificacionesDocente: califDoc, calificacionesEstudiantes: califEst, calificacionesEspacio: califEsp, notaDocente: nd, notaEstudiantes: ne, notaEspacioFisico: nes, comentarioGeneral: comentario });
  };

  const renderSeccion = (titulo: string, califs: Record<string, number>, setCalifs: React.Dispatch<React.SetStateAction<Record<string, number>>>, ids: number[]) => {
    const prom = calcPromedio(califs, ids);
    const crits = criterios[titulo] || [];
    return (<div className="space-y-4">
      <div className="flex items-center justify-between bg-orange-50 p-3 rounded-lg"><h4 className="font-semibold text-orange-700">{titulo}</h4><span className="font-bold text-lg text-orange-700">{prom.toFixed(2)}</span></div>
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="w-12">No.</th><th className="text-left py-2 px-3">Criterios Evaluados</th><th className="text-center" colSpan={4}>Calif. (1-4)</th><th className="w-16 text-center">Nota</th></tr></thead><tbody>
        {crits.map((c: any) => (<tr key={c.id} className="border-b hover:bg-gray-50"><td className="py-3 px-3 font-medium">{c.orden}</td><td className="py-3 px-3">{c.descripcion}</td>
          {[1, 2, 3, 4].map(v => (<td key={v} className="py-3 px-2 text-center"><button onClick={() => setCalifs(prev => ({ ...prev, [c.id]: v }))} className={cn('w-10 h-10 rounded-full text-sm font-bold transition-all', califs[c.id] === v ? (v <= 2 ? 'bg-red-500 text-white' : v === 3 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white') : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>{v}</button></td>))}
          <td className="py-3 px-3 text-center font-bold text-orange-700">{califs[c.id] || '-'}</td></tr>))}
      </tbody></table></div></div>);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-[#002561] flex items-center gap-2"><FileBarChart className="w-7 h-7 text-orange-600" />Supervision Diaria - Oficial Supervisor</h2><p className="text-sm text-gray-500">{modo === 'lista' ? 'Visitas registradas' : 'Registre los criterios observados'}</p></div>
        <div className="flex gap-2">
          {modo !== 'lista' && <button onClick={() => setModo('lista')} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Volver</button>}
          {modo === 'lista' && <button onClick={() => { reset(); setModo('nueva'); }} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">+ Nueva Supervision</button>}
        </div>
      </div>

      {modo === 'lista' ? (
        <Card><CardContent className="p-0">
          {evaluaciones.length === 0 ? <div className="p-12 text-center"><FileBarChart className="w-16 h-16 text-gray-200 mx-auto mb-4" /><p className="text-gray-500">No hay supervisiones</p></div> : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50"><th className="text-left py-3 px-4">Docente</th><th className="text-left py-3 px-4">Clase</th><th className="text-left py-3 px-4">Aula</th><th className="text-left py-3 px-4">Fecha</th><th className="text-center py-3 px-4">Doc.</th><th className="text-center py-3 px-4">Est.</th><th className="text-center py-3 px-4">Esp.</th><th className="text-right py-3 px-4">Acc.</th></tr></thead>
              <tbody>{evaluaciones.map((ev: any) => (<tr key={ev.id} className="border-b hover:bg-gray-50"><td className="py-3 px-4 font-medium">{ev.docente ? `${ev.docente.nombre} ${ev.docente.apellido}` : 'N/A'}</td><td className="py-3 px-4 text-gray-600">{ev.clase || '-'}</td><td className="py-3 px-4 text-gray-600">{ev.aula || '-'}</td><td className="py-3 px-4 text-gray-600">{ev.fecha}</td>
                <td className="py-3 px-4 text-center font-medium text-orange-600">{(ev.notaDocente || 0).toFixed(2)}</td><td className="py-3 px-4 text-center font-medium text-blue-600">{(ev.notaEstudiantes || 0).toFixed(2)}</td><td className="py-3 px-4 text-center font-medium text-emerald-600">{(ev.notaEspacioFisico || 0).toFixed(2)}</td>
                <td className="py-3 px-4 text-right"><button onClick={() => deleteMut.mutate({ id: ev.id })} className="text-red-500 hover:underline text-xs">Eliminar</button></td></tr>))}</tbody>
            </table></div>)}
        </CardContent></Card>
      ) : (
        <div className="space-y-6">
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building2 className="w-5 h-5 text-orange-600" />Datos de la Visita</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label className="flex items-center gap-2"><BookOpen className="w-4 h-4" />Clase</Label>
                  <Select value={claseId} onValueChange={(v) => { setClaseId(v); const c = clases.find((cl: any) => cl.id === Number(v)); if (c) { setDocenteId(String(c.docenteId)); setAulaId(String(c.aulaId)); } }}><SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent>{clases.filter((c: any) => c.activo).map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="flex items-center gap-2"><User className="w-4 h-4" />Docente</Label>
                  <Select value={docenteId} onValueChange={setDocenteId}><SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent>{docentes.filter((d: any) => d.activo).map((d: any) => <SelectItem key={d.id} value={String(d.id)}>{d.nombre} {d.apellido}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="flex items-center gap-2"><Building2 className="w-4 h-4" />Aula</Label>
                  <Select value={aulaId} onValueChange={setAulaId}><SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent>{aulas.filter((a: any) => a.activo).map((a: any) => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="flex items-center gap-2"><Calendar className="w-4 h-4" />Fecha</Label><Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} /></div>
                <div className="space-y-2"><Label>Periodo</Label><Select value={periodo} onValueChange={setPeriodo}><SelectContent>{periodos.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
              </div>
            </CardContent></Card>
          <Card><CardContent className="p-6 space-y-8">
            {renderSeccion('Criterios del Docente', califDoc, setCalifDoc, docIds)}
            {renderSeccion('Criterios de los Estudiantes', califEst, setCalifEst, estIds)}
            {renderSeccion('Criterios del Espacio Fisico', califEsp, setCalifEsp, espIds)}
            <div className="space-y-2"><Label className="font-semibold text-orange-700">Comentario General</Label><Textarea value={comentario} onChange={e => setComentario(e.target.value)} rows={4} /></div>
            <div className="grid grid-cols-3 gap-4"><div className="bg-orange-50 p-4 rounded-xl text-center"><p className="text-xs text-gray-500">Docente</p><p className="text-3xl font-bold text-orange-700">{nd.toFixed(2)}</p></div><div className="bg-blue-50 p-4 rounded-xl text-center"><p className="text-xs text-gray-500">Estudiantes</p><p className="text-3xl font-bold text-blue-700">{ne.toFixed(2)}</p></div><div className="bg-emerald-50 p-4 rounded-xl text-center"><p className="text-xs text-gray-500">Espacio Fisico</p><p className="text-3xl font-bold text-emerald-700">{nes.toFixed(2)}</p></div></div>
            <div className="flex justify-end gap-3"><button onClick={() => setModo('lista')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button><button onClick={handleGuardar} disabled={!docenteId || !aulaId} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"><Save className="w-4 h-4" />Guardar</button></div>
          </CardContent></Card>
        </div>
      )}
      {success && <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"><CheckCircle className="w-5 h-5" />Supervision guardada</div>}
    </div>
  );
}
