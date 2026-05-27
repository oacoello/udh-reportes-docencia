import { useState, useEffect, useCallback } from 'react';

interface LocalUser {
  id: number;
  usuario: string;
  nombre: string;
  apellido: string;
  role: string;
  email: string;
  serie: string;
}

const API_URL = '/api/trpc';

async function trpcCall(path: string, input?: any) {
  const url = input
    ? `${API_URL}/${path}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`
    : `${API_URL}/${path}`;
  const res = await fetch(url, { credentials: 'include' });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || 'Error desconocido');
  return json.result?.data?.json;
}

async function trpcMutate(path: string, input: any) {
  const res = await fetch(`${API_URL}/${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: input }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || 'Error desconocido');
  return json.result?.data?.json;
}

export function useLocalAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('udh_token');
    if (!token) { setLoading(false); return; }
    trpcCall('localAuth.me', { token })
      .then((data: LocalUser | null) => { if (data) setUser(data); })
      .catch(() => localStorage.removeItem('udh_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (usuario: string, serie: string, password: string) => {
    const result = await trpcMutate('localAuth.login', { usuario, serie, password });
    localStorage.setItem('udh_token', result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (data: { usuario: string; serie: string; email: string; password: string; nombre: string; apellido: string }) => {
    const result = await trpcMutate('localAuth.register', data);
    localStorage.setItem('udh_token', result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('udh_token');
    setUser(null);
    window.location.reload();
  }, []);

  return { user, loading, login, register, logout, isAdmin: user?.role === 'admin' };
}
