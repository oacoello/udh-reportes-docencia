import { useState } from 'react';
import { Shield, User, Hash, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onLogin: (usuario: string, serie: string, password: string) => Promise<void>;
  onRegister: (data: { usuario: string; serie: string; email: string; password: string; nombre: string; apellido: string }) => Promise<void>;
}

export function LoginForm({ onLogin, onRegister }: LoginFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login fields
  const [lUsuario, setLUsuario] = useState('');
  const [lSerie, setLSerie] = useState('');
  const [lPassword, setLPassword] = useState('');

  // Register fields
  const [rUsuario, setRUsuario] = useState('');
  const [rSerie, setRSerie] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rNombre, setRNombre] = useState('');
  const [rApellido, setRApellido] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await onLogin(lUsuario, lSerie, lPassword); }
    catch (err: any) { setError(err.message || 'Error al iniciar sesion'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await onRegister({ usuario: rUsuario, serie: rSerie, email: rEmail, password: rPassword, nombre: rNombre, apellido: rApellido }); }
    catch (err: any) { setError(err.message || 'Error al registrar'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #002561 0%, #2f6f7e 50%, #484848 100%)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">Universidad de Defensa de Honduras</h1>
          <p className="text-sm text-white/70 mt-1">Sistema de Evaluacion Docente</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button onClick={() => { setMode('login'); setError(''); }} className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-[#002561] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <LogIn className="w-4 h-4 inline mr-2" />Iniciar Sesion
            </button>
            <button onClick={() => { setMode('register'); setError(''); }} className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'register' ? 'bg-[#002561] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <UserPlus className="w-4 h-4 inline mr-2" />Registrarse
            </button>
          </div>

          <div className="p-6">
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><User className="w-3 h-3" />Usuario</Label>
                  <Input value={lUsuario} onChange={e => setLUsuario(e.target.value)} required className="border-gray-300" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><Hash className="w-3 h-3" />Numero de Serie</Label>
                  <Input value={lSerie} onChange={e => setLSerie(e.target.value)} required className="border-gray-300" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><Lock className="w-3 h-3" />Contrasena</Label>
                  <Input type="password" value={lPassword} onChange={e => setLPassword(e.target.value)} required className="border-gray-300" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#002561] text-white rounded-lg font-medium hover:bg-[#001d4a] transition-colors disabled:opacity-50">
                  {loading ? 'Cargando...' : 'Iniciar Sesion'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label className="text-xs text-gray-500">Nombre</Label><Input value={rNombre} onChange={e => setRNombre(e.target.value)} required /></div>
                  <div className="space-y-1"><Label className="text-xs text-gray-500">Apellido</Label><Input value={rApellido} onChange={e => setRApellido(e.target.value)} required /></div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><User className="w-3 h-3" />Usuario</Label>
                  <Input value={rUsuario} onChange={e => setRUsuario(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><Hash className="w-3 h-3" />Numero de Serie</Label>
                  <Input value={rSerie} onChange={e => setRSerie(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />Correo Electronico</Label>
                  <Input type="email" value={rEmail} onChange={e => setREmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 flex items-center gap-1"><Lock className="w-3 h-3" />Contrasena</Label>
                  <Input type="password" value={rPassword} onChange={e => setRPassword(e.target.value)} required minLength={6} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#002561] text-white rounded-lg font-medium hover:bg-[#001d4a] transition-colors disabled:opacity-50">
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>
            )}
            {error && <p className="mt-3 text-sm text-red-500 text-center bg-red-50 p-2 rounded">{error}</p>}
          </div>
        </div>

        <p className="text-center text-xs text-white/50 mt-4">&copy; 2025 Universidad de Defensa de Honduras - Posgrado</p>
      </div>
    </div>
  );
}
