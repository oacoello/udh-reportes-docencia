import { useState, useMemo } from 'react';
import { FileText, Download, Calendar, TrendingUp, Award, BookOpen, FileBarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/providers/trpc';
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';

interface Props { evalCoord: any[]; evalSup: any[]; docentes: any[]; }

export function ReportesView({ evalCoord, evalSup, docentes }: Props) {
  const [fechaInicio, setFechaInicio] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0]; });
  const [fechaFin, setFechaFin] = useState(() => new Date().toISOString().split('T')[0]);
  const [tipoReporte, setTipoReporte] = useState<'semanal' | 'mensual'>('mensual');
  const [generando, setGenerando] = useState(false);

  const reporteData = trpc.reportes.dataReporte.useQuery({ tipo: tipoReporte, fechaInicio, fechaFin }, { enabled: false });

  const stats = useMemo(() => {
    let sum = 0, cnt = 0;
    evalCoord.forEach(e => { if (e.calificacionTotal) { sum += e.calificacionTotal; cnt++; } });
    const prom = cnt > 0 ? sum / cnt : 0;
    const ranking: Record<string, { nombre: string; suma: number; count: number }> = {};
    evalCoord.forEach(e => { const d = docentes.find((doc: any) => doc.id === e.docenteId); if (!d || !e.calificacionTotal) return; const k = `${d.nombre} ${d.apellido}`; if (!ranking[k]) ranking[k] = { nombre: k, suma: 0, count: 0 }; ranking[k].suma += e.calificacionTotal; ranking[k].count++; });
    const ranked = Object.values(ranking).map(d => ({ nombre: d.nombre, promedio: d.suma / d.count })).sort((a, b) => b.promedio - a.promedio);
    return { totalEvals: evalCoord.length + evalSup.length, totalCoord: evalCoord.length, totalSup: evalSup.length, promedio: prom, mejores: ranked.slice(0, 5), peores: [...ranked].reverse().slice(0, 3) };
  }, [evalCoord, evalSup, docentes]);

  const generarWord = async () => {
    setGenerando(true);
    try {
      const data = await reporteData.refetch();
      const d = data.data;
      if (!d) return;

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({ text: 'UNIVERSIDAD DE DEFENSA DE HONDURAS', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
            new Paragraph({ text: 'Vicerrectoria Academica - Posgrado', alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
            new Paragraph({ text: `Informe ${tipoReporte === 'semanal' ? 'Semanal' : 'Mensual'} de Evaluacion Docente`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
            new Paragraph({ text: `Periodo: ${fechaInicio} al ${fechaFin}`, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),

            new Paragraph({ text: '1. Resumen Ejecutivo', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: `Total de evaluaciones registradas: ` }), new TextRun({ text: String(d.totalCoordinador + d.totalSupervision), bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: `Evaluaciones de Coordinador: ` }), new TextRun({ text: String(d.totalCoordinador), bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: `Visitas de Supervision: ` }), new TextRun({ text: String(d.totalSupervision), bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: `Promedio general del sistema: ` }), new TextRun({ text: stats.promedio.toFixed(2), bold: true })] }),

            new Paragraph({ text: '2. Ranking de Docentes', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({ children: ['#', 'Docente', 'Promedio'].map(h => new TableCell({ children: [new Paragraph({ text: h, bold: true })] })) }),
                ...d.rankingDocentes.map((doc: any, i: number) => new TableRow({
                  children: [String(i + 1), doc.nombre, doc.promedio.toFixed(2)].map(t => new TableCell({ children: [new Paragraph(t)] }))
                })),
              ],
            }),

            new Paragraph({ text: '3. Evaluaciones por Coordinador', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
            ...d.evaluacionesCoordinador.flatMap((ev: any) => [
              new Paragraph({ children: [new TextRun({ text: `Docente: `, bold: true }), new TextRun({ text: ev.docente ? `${ev.docente.nombre} ${ev.docente.apellido}` : 'N/A' })] }),
              new Paragraph({ children: [new TextRun({ text: `Fecha: ${ev.fecha} | Periodo: ${ev.periodo}` })] }),
              new Paragraph({ children: [new TextRun({ text: `Calificacion Total: `, bold: true }), new TextRun({ text: (ev.calificacionTotal || 0).toFixed(2) })] }),
              new Paragraph({ text: '', spacing: { after: 100 } }),
            ]),

            new Paragraph({ text: '4. Conclusiones y Recomendaciones', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
            new Paragraph('El presente informe refleja el estado actual de las evaluaciones docentes en el programa de posgrado. Se recomienda implementar planes de mejora para los docentes con calificaciones inferiores a 3.0 y reconocer el desempeno sobresaliente de los docentes con calificaciones superiores a 3.5.'),

            new Paragraph({ text: '', spacing: { before: 400 } }),
            new Paragraph({ text: `Generado el ${new Date().toLocaleDateString('es-HN')} - Sistema de Evaluacion Docente UDH`, alignment: AlignmentType.CENTER, italics: true }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Informe_${tipoReporte}_UDH_${fechaInicio}_${fechaFin}.docx`);
    } finally { setGenerando(false); }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-[#002561] flex items-center gap-2"><FileText className="w-7 h-7" />Reportes e Informes</h2><p className="text-sm text-gray-500">Generacion de informes Word detallados</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#002561]"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Evals</p><p className="text-2xl font-bold text-[#002561]">{stats.totalEvals}</p></div><FileText className="w-8 h-8 text-[#002561]/20" /></div></CardContent></Card>
        <Card className="border-l-4 border-l-blue-600"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Coordinador</p><p className="text-2xl font-bold text-blue-600">{stats.totalCoord}</p></div><BookOpen className="w-8 h-8 text-blue-200" /></div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-600"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Supervision</p><p className="text-2xl font-bold text-orange-600">{stats.totalSup}</p></div><FileBarChart className="w-8 h-8 text-orange-200" /></div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Promedio</p><p className="text-2xl font-bold text-emerald-600">{stats.promedio.toFixed(2)}</p></div><TrendingUp className="w-8 h-8 text-emerald-200" /></div></CardContent></Card>
      </div>

      {/* Generar Reporte */}
      <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Download className="w-5 h-5" />Generar Informe Word</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2"><Label>Tipo de Informe</Label>
              <div className="flex gap-2">
                <button onClick={() => setTipoReporte('semanal')} className={`flex-1 py-2 text-sm rounded-lg border ${tipoReporte === 'semanal' ? 'bg-[#002561] text-white border-[#002561]' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Semanal</button>
                <button onClick={() => setTipoReporte('mensual')} className={`flex-1 py-2 text-sm rounded-lg border ${tipoReporte === 'mensual' ? 'bg-[#002561] text-white border-[#002561]' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Mensual</button>
              </div>
            </div>
            <div className="space-y-2"><Label className="flex items-center gap-1"><Calendar className="w-3 h-3" />Fecha Inicio</Label><Input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-1"><Calendar className="w-3 h-3" />Fecha Fin</Label><Input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} /></div>
            <div className="flex items-end">
              <button onClick={generarWord} disabled={generando} className="w-full py-2.5 bg-[#002561] text-white rounded-lg font-medium hover:bg-[#001d4a] disabled:opacity-50 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />{generando ? 'Generando...' : 'Descargar Word'}
              </button>
            </div>
          </div>
        </CardContent></Card>

      {/* Mejores Docentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Award className="w-5 h-5 text-emerald-500" />Top 5 Docentes</CardTitle></CardHeader>
          <CardContent>{stats.mejores.length === 0 ? <p className="text-sm text-gray-400 text-center py-6">Sin datos</p> : <div className="space-y-3">{stats.mejores.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div><span className="font-medium text-sm">{d.nombre}</span></div><span className="font-bold text-emerald-700">{d.promedio.toFixed(2)}</span></div>))}</div>}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-red-500" />Docentes con Areas de Mejora</CardTitle></CardHeader>
          <CardContent>{stats.peores.length === 0 ? <p className="text-sm text-gray-400 text-center py-6">Sin datos</p> : <div className="space-y-3">{stats.peores.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div><span className="font-medium text-sm">{d.nombre}</span></div><span className="font-bold text-red-700">{d.promedio.toFixed(2)}</span></div>))}</div>}</CardContent></Card>
      </div>
    </div>
  );
}
