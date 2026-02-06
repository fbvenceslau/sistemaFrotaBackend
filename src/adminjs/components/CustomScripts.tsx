import React, { useEffect } from 'react';

const CustomScripts: React.FC = () => {
  useEffect(() => {
    // Intercepta e traduz os alertas do sistema
    const originalAlert = window.alert;
    const translations: Record<string, string> = {
      'Your session expired. You will be redirected to login screen': 
        '🔒 Sua sessão expirou. Você será redirecionado para a tela de login.',
      'Your session expired': 
        '🔒 Sua sessão expirou. Por favor, faça login novamente.',
      'Session expired': 
        '🔒 Sessão expirada. Redirecionando para o login...',
      'Network error':
        '⚠️ Erro de conexão. Por favor, verifique sua internet e tente novamente.',
      'Server error':
        '⚠️ Erro no servidor. Por favor, tente novamente em alguns instantes.',
    };
    
    window.alert = function(message: string) {
      const translatedMessage = translations[message] || message;
      originalAlert.call(window, translatedMessage);
    };

    // Intercepta erros não tratados e mostra mensagens amigáveis
    const handleError = (event: ErrorEvent) => {
      if (event.message.toLowerCase().includes('session')) {
        event.preventDefault();
        alert('🔒 Sua sessão expirou. Redirecionando para o login...');
        window.location.href = '/admin/login';
      }
    };

    window.addEventListener('error', handleError);

    return () => {
      window.alert = originalAlert;
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
};

export default CustomScripts;
