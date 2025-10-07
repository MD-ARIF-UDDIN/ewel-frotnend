import React, { createContext, useContext, useReducer } from 'react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { X } from 'lucide-react';

// Simple unique ID generator
let nextId = 1;
const generateId = () => nextId++;

const ToastContext = createContext();

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: generateId() }],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };
    default:
      return state;
  }
};

export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const addToast = (toast) => {
    const id = generateId();
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });

    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, toast.duration || 1500);
  };

  const removeToast = (id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const toast = {
    success: (title, description) => addToast({ variant: 'success', title, description }),
    error: (title, description) => addToast({ variant: 'destructive', title, description }),
    warning: (title, description) => addToast({ variant: 'warning', title, description }),
    info: (title, description) => addToast({ variant: 'info', title, description }),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={state.toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96">
      {toasts.map((toast) => (
        <Alert key={toast.id} variant={toast.variant} className="shadow-modern-lg animate-slide-up">
          <button onClick={() => removeToast(toast.id)} className="absolute right-2 top-2">
            <X className="h-4 w-4" />
          </button>
          <div className="pr-8">
            {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
            {toast.description && <AlertDescription>{toast.description}</AlertDescription>}
          </div>
        </Alert>
      ))}
    </div>
  );
};