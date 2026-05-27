import { useEffect, useState } from 'react';
import { Shield, GraduationCap, BookOpen, Users, Award } from 'lucide-react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 3000);
    const t2 = setTimeout(onComplete, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'linear-gradient(135deg, #002561 0%, #2f6f7e 40%, #484848 100%)' }}>
      <div className="text-center text-white px-6 max-w-lg">
        {/* Shield Logo */}
        <div className="mb-6 relative inline-block">
          <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30 backdrop-blur-sm animate-pulse">
            <Shield className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#2f6f7e] flex items-center justify-center border border-white/40">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 tracking-wide">UNIVERSIDAD DE DEFENSA</h1>
        <h2 className="text-xl font-light mb-1 text-white/90">DE HONDURAS</h2>
        <div className="w-24 h-0.5 bg-white/40 mx-auto my-4" />
        <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-8">Vicerrectoria Academica</p>

        <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20 mb-8">
          <p className="text-lg font-semibold mb-1">Posgrado - Oficial en Servicio de Reporte</p>
          <p className="text-sm text-white/60">Sistema de Evaluacion Docente</p>
        </div>

        {/* Animated Icons */}
        <div className="flex justify-center gap-6 mb-8">
          {[BookOpen, Users, Award, BookOpen].map((Icon, i) => (
            <div key={i} className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"
              style={{ animation: `bounce 1.5s ${i * 0.2}s infinite` }}>
              <Icon className="w-5 h-5 text-white/80" />
            </div>
          ))}
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-white/80 rounded-full" style={{ animation: 'loading 3s ease-in-out forwards' }} />
        </div>
      </div>

      <style>{`
        @keyframes loading { from { width: 0% } to { width: 100% } }
        @keyframes bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
      `}</style>
    </div>
  );
}
