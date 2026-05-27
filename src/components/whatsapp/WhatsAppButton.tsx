import { useState } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const telefonoDestino = '50400000000'; // Telefono del coordinador academico

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    const url = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    setMensaje('');
    setOpen(false);
  };

  const mensajesRapidos = [
    'Solicito informacion sobre evaluaciones docentes',
    'Notificacion: Supervision programada para hoy',
    'Recordatorio: Entrega de calificaciones',
    'Solicitud de reunion con coordinacion',
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #002561, #2f6f7e)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Coordinacion Academica UDH</p>
                <p className="text-xs text-white/70">WhatsApp Directo</p>
              </div>
            </div>
          </div>

          {/* Quick Messages */}
          <div className="p-3 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Mensajes rapidos:</p>
            <div className="flex flex-wrap gap-1.5">
              {mensajesRapidos.map((msg, i) => (
                <button key={i} onClick={() => setMensaje(msg)}
                  className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-[#002561] hover:text-white transition-colors">
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2">
            <input
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
              placeholder="Escriba su mensaje..."
              className="flex-1 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002561]"
            />
            <button onClick={enviarMensaje}
              className="p-2 rounded-lg text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
