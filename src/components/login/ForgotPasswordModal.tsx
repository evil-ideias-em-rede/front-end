import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl shadow-2xl border-2 p-8 overflow-hidden"
        style={{ 
          backgroundColor: THEME_COLORS.bgLight, 
          borderColor: THEME_COLORS.borderLight 
        }}
      >
        {/* Decorative Top Line */}
        <div 
          className="absolute top-0 inset-x-0 h-2" 
          style={{ backgroundColor: THEME_COLORS.primary }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
              style={{ backgroundColor: THEME_COLORS.bgLight, color: THEME_COLORS.primary }}
            >
              <KeyRound className="w-7 h-7 stroke-[2.5]" />
            </div>

            <h3 className="text-2xl font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
              Recuperar Acesso
            </h3>
            <p className="text-sm mt-2 font-medium" style={{ color: THEME_COLORS.gray }}>
              Informe seu e-mail cadastrado. Enviaremos um link de redefinição para a sua conta de educador.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: THEME_COLORS.textDark }}>
                  E-mail do Educador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="professor@escola.gov.br"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none transition-all"
                    style={{ 
                      backgroundColor: THEME_COLORS.bgLight, 
                      borderColor: THEME_COLORS.borderLight,
                      color: THEME_COLORS.textDark 
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                style={{ backgroundColor: THEME_COLORS.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.primary)}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Enviar Link de Recuperação</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: THEME_COLORS.borderLight }}>
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline cursor-pointer"
                style={{ color: THEME_COLORS.primary }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar para o Login
              </button>
              <span className="text-xs font-medium" style={{ color: THEME_COLORS.gray }}>Contraponto</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black" style={{ color: THEME_COLORS.textDark }}>
              E-mail Enviado!
            </h3>
            <p className="text-sm mt-2 font-medium" style={{ color: THEME_COLORS.gray }}>
              Enviamos as orientações de redefinição para <strong style={{ color: THEME_COLORS.textDark }}>{email}</strong>.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-8 w-full py-3.5 px-4 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
              style={{ backgroundColor: THEME_COLORS.bgDark }}
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
