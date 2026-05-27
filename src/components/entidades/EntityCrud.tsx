import { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type EntityType = 'docentes' | 'programas' | 'aulas' | 'clases';

interface Props {
  type: EntityType;
  data: any[];
  programas?: any[];
  docentes?: any[];
  aulas?: any[];
  onCreate: (data: any) => void;
  onUpdate: (id: number, data: any) => void;
  onDelete: (id: number) => void;
}

const config: Record<EntityType, { title: string; subtitle: string; fields: string[] }> = {
  docentes: { title: 'Docentes', subtitle: 'Gestion de docentes', fields: ['nombre', 'apellido', 'email', 'telefono', 'especialidad', 'gradoAcademico'] },
  programas: { title: 'Programas Academicos', subtitle: 'Gestion de programas de maestria', fields: ['nombre', 'descripcion', 'duracion'] },
  aulas: { title: 'Aulas', subtitle: 'Gestion de aulas', fields: ['nombre', 'ubicacion', 'capacidad', 'recursos'] },
  clases: { title: 'Clases', subtitle: 'Gestion de asignaturas', fields: ['nombre', 'programaId', 'docenteId', 'aulaId', 'horario', 'diaSemana'] },
};

export function EntityCrud({ type, data, programas, docentes, aulas, onCreate, onUpdate, onDelete }: Props) {
  const c = config[type];
  const [modo, setModo] = useState<'lista' | 'form'>('lista');
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<any>({ activo: true });
  const [success, setSuccess] = useState(false);

  const filtered = search ? data.filter((item: any) => (item.nombre || '').toLowerCase().includes(search.toLowerCase())) : data;

  const handleNew = () => { setForm({ activo: true }); setEditId(null); setModo('form'); };
  const handleEdit = (item: any) => { setForm({ ...item, recursos: Array.isArray(item.recursos) ? item.recursos.join(', ') : item.recursos }); setEditId(item.id); setModo('form'); };
  const handleSave = () => {
    const d = { ...form };
    if (type === 'aulas' && typeof d.recursos === 'string') d.recursos = d.recursos.split(',').map((r: string) => r.trim()).filter(Boolean);
    if (type === 'clases') { d.programaId = d.programaId ? Number(d.programaId) : null; d.docenteId = d.docenteId ? Number(d.docenteId) : null; d.aulaId = d.aulaId ? Number(d.aulaId) : null; }
    if (editId) onUpdate(editId, d); else onCreate(d);
    setSuccess(true); setTimeout(() => setSuccess(false), 2000); setModo('lista');
  };

  const renderField = (key: string) => {
    switch (key) {
      case 'nombre': return <div className="space-y-1"><Label>Nombre</Label><Input value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>;
      case 'apellido': return <div className="space-y-1"><Label>Apellido</Label><Input value={form.apellido || ''} onChange={e => setForm({ ...form, apellido: e.target.value })} /></div>;
      case 'email': return <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>;
      case 'telefono': return <div className="space-y-1"><Label>Telefono</Label><Input value={form.telefono || ''} onChange={e => setForm({ ...form, telefono: e.target.value })} /></div>;
      case 'especialidad': return <div className="space-y-1"><Label>Especialidad</Label><Input value={form.especialidad || ''} onChange={e => setForm({ ...form, especialidad: e.target.value })} /></div>;
      case 'gradoAcademico': return <div className="space-y-1"><Label>Grado Academico</Label><select value={form.gradoAcademico || ''} onChange={e => setForm({ ...form, gradoAcademico: e.target.value })} className="w-full border rounded-lg px-3 py-2"><option value="">Seleccione</option><option>Licenciatura</option><option>Maestria</option><option>Doctorado</option><option>Postdoctorado</option></select></div>;
      case 'descripcion': return <div className="space-y-1"><Label>Descripcion</Label><Textarea value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })} /></div>;
      case 'duracion': return <div className="space-y-1"><Label>Duracion</Label><Input value={form.duracion || ''} onChange={e => setForm({ ...form, duracion: e.target.value })} placeholder="Ej: 2 anios" /></div>;
      case 'ubicacion': return <div className="space-y-1"><Label>Ubicacion</Label><Input value={form.ubicacion || ''} onChange={e => setForm({ ...form, ubicacion: e.target.value })} /></div>;
      case 'capacidad': return <div className="space-y-1"><Label>Capacidad</Label><Input type="number" value={form.capacidad || ''} onChange={e => setForm({ ...form, capacidad: Number(e.target.value) })} /></div>;
      case 'recursos': return <div className="space-y-1"><Label>Recursos (separados por coma)</Label><Input value={form.recursos || ''} onChange={e => setForm({ ...form, recursos: e.target.value })} placeholder="Proyector, Computadora" /></div>;
      case 'programaId': return <div className="space-y-1"><Label>Programa</Label><select value={form.programaId || ''} onChange={e => setForm({ ...form, programaId: e.target.value })} className="w-full border rounded-lg px-3 py-2"><option value="">Seleccione</option>{programas?.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></div>;
      case 'docenteId': return <div className="space-y-1"><Label>Docente</Label><select value={form.docenteId || ''} onChange={e => setForm({ ...form, docenteId: e.target.value })} className="w-full border rounded-lg px-3 py-2"><option value="">Seleccione</option>{docentes?.map(d => <option key={d.id} value={d.id}>{d.nombre} {d.apellido}</option>)}</select></div>;
      case 'aulaId': return <div className="space-y-1"><Label>Aula</Label><select value={form.aulaId || ''} onChange={e => setForm({ ...form, aulaId: e.target.value })} className="w-full border rounded-lg px-3 py-2"><option value="">Seleccione</option>{aulas?.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select></div>;
      case 'horario': return <div className="space-y-1"><Label>Horario</Label><Input value={form.horario || ''} onChange={e => setForm({ ...form, horario: e.target.value })} placeholder="Ej: 18:00 - 21:00" /></div>;
      case 'diaSemana': return <div className="space-y-1"><Label>Dia</Label><select value={form.diaSemana || ''} onChange={e => setForm({ ...form, diaSemana: e.target.value })} className="w-full border rounded-lg px-3 py-2"><option value="">Seleccione</option>{['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'].map(d => <option key={d} value={d}>{d}</option>)}</select></div>;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-[#002561]">{c.title}</h2><p className="text-sm text-gray-500">{c.subtitle}</p></div>
        <div className="flex gap-2">
          {modo === 'form' && <button onClick={() => setModo('lista')} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>}
          {modo === 'lista' && <button onClick={handleNew} className="px-4 py-2 bg-[#002561] text-white rounded-lg text-sm font-medium hover:bg-[#001d4a] flex items-center gap-2"><Plus className="w-4 h-4" />Nuevo</button>}
        </div>
      </div>

      {modo === 'lista' ? (
        <Card><CardContent className="p-4">
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
          {filtered.length === 0 ? <div className="p-8 text-center"><p className="text-gray-500">No hay registros</p></div> : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50">{type === 'docentes' && <><th className="text-left py-3 px-4">Nombre</th><th className="text-left py-3 px-4">Especialidad</th><th className="text-left py-3 px-4">Grado</th></>}{type === 'programas' && <><th className="text-left py-3 px-4">Nombre</th><th className="text-left py-3 px-4">Duracion</th></>}{type === 'aulas' && <><th className="text-left py-3 px-4">Nombre</th><th className="text-left py-3 px-4">Ubicacion</th><th className="text-center py-3 px-4">Cap.</th></>}{type === 'clases' && <><th className="text-left py-3 px-4">Nombre</th><th className="text-left py-3 px-4">Programa</th><th className="text-left py-3 px-4">Docente</th></>}<th className="text-center py-3 px-4 w-16">Est.</th><th className="text-right py-3 px-4 w-20">Acc.</th></tr></thead>
              <tbody>{filtered.map((item: any) => (<tr key={item.id} className="border-b hover:bg-gray-50">{type === 'docentes' && <><td className="py-3 px-4 font-medium">{item.nombre} {item.apellido}</td><td className="py-3 px-4 text-gray-600">{item.especialidad}</td><td className="py-3 px-4"><span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{item.gradoAcademico}</span></td></>}{type === 'programas' && <><td className="py-3 px-4 font-medium">{item.nombre}</td><td className="py-3 px-4 text-gray-600">{item.duracion}</td></>}{type === 'aulas' && <><td className="py-3 px-4 font-medium">{item.nombre}</td><td className="py-3 px-4 text-gray-600">{item.ubicacion}</td><td className="py-3 px-4 text-center">{item.capacidad}</td></>}{type === 'clases' && <><td className="py-3 px-4 font-medium">{item.nombre}</td><td className="py-3 px-4 text-gray-600">{programas?.find(p => p.id === item.programaId)?.nombre}</td><td className="py-3 px-4 text-gray-600">{docentes?.find(d => d.id === item.docenteId)?.nombre} {docentes?.find(d => d.id === item.docenteId)?.apellido}</td></>}<td className="py-3 px-4 text-center"><span className={`text-xs px-2 py-0.5 rounded-full ${item.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{item.activo ? 'Activo' : 'Inactivo'}</span></td><td className="py-3 px-4 text-right"><div className="flex justify-end gap-1"><button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button><button onClick={() => onDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
            </table></div>)}
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-6 space-y-4">
          <div className={`grid grid-cols-1 ${type === 'clases' ? '' : 'md:grid-cols-2'} gap-4`}>
            {c.fields.map(f => <div key={f}>{renderField(f)}</div>)}
          </div>
          <div className="flex items-center gap-2 pt-2"><input type="checkbox" checked={form.activo !== false} onChange={e => setForm({ ...form, activo: e.target.checked })} className="w-4 h-4" /><span className="text-sm">Activo</span></div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => setModo('lista')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button><button onClick={handleSave} disabled={!form.nombre} className="px-6 py-2 bg-[#002561] text-white rounded-lg font-medium hover:bg-[#001d4a] disabled:opacity-50 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{editId ? 'Actualizar' : 'Guardar'}</button></div>
        </CardContent></Card>
      )}
      {success && <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"><CheckCircle className="w-5 h-5" />Guardado exitosamente</div>}
    </div>
  );
}
