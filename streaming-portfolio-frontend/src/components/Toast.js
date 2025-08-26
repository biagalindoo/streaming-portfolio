import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({
  success: (_msg) => {},
  error: (_msg) => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => remove(id), 2500);
  }, [remove]);

  const success = useCallback((msg) => push('success', msg), [push]);
  const error = useCallback((msg) => push('error', msg), [push]);

  const value = useMemo(() => ({ success, error }), [success, error]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'grid', gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            background: t.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: 8,
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);


