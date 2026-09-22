import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { login, register } from '../../api/client';
import type { AuthUser } from '../../api/client';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onOpenForgotPassword: () => void;
  onSuccess?: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onOpenForgotPassword,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Feedback
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  React.useEffect(() => {
    setMode(initialMode);
    setFeedback(null);
    setFeedbackIsError(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const user = await login(loginEmail, loginPassword);
      setLoading(false);
      setFeedbackIsError(false);
      setFeedback('Login efetuado com sucesso!');
      onSuccess?.(user);
      onClose();
    } catch (error) {
      setLoading(false);
      setFeedbackIsError(true);
      setFeedback(error instanceof Error ? error.message : 'Não foi possível entrar.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert('As senhas não conferem.');
      return;
    }
    if (regPassword.length < 8) {
      setFeedbackIsError(true);
      setFeedback('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const user = await register(regName, regEmail, regPassword);
      setLoading(false);
      setFeedbackIsError(false);
      setFeedback(`Cadastro realizado com sucesso, Professor(a) ${regName}!`);
      onSuccess?.(user);
      onClose();
    } catch (error) {
      setLoading(false);
      setFeedbackIsError(true);
      setFeedback(error instanceof Error ? error.message : 'Não foi possível criar a conta.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl shadow-2xl border-2 p-8 sm:p-10 overflow-hidden"
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

        {/* Header Tabs (Transparent background active state) */}
        <div 
          className="flex p-1.5 rounded-2xl mb-8 border"
          style={{ backgroundColor: 'rgba(226, 221, 240, 0.6)', borderColor: THEME_COLORS.borderLight }}
        >
          <button
            type="button"
            onClick={() => { setMode('login'); setFeedback(null); }}
            className="flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer"
            style={{
              backgroundColor: mode === 'login' ? THEME_COLORS.bgLight : 'transparent',
              color: mode === 'login' ? THEME_COLORS.primary : THEME_COLORS.gray,
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Acessar Conta
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setFeedback(null); }}
            className="flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer"
            style={{
              backgroundColor: mode === 'register' ? THEME_COLORS.bgLight : 'transparent',
              color: mode === 'register' ? THEME_COLORS.primary : THEME_COLORS.gray,
              boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Criar Conta de Professor
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm animate-in fade-in ${feedbackIsError ? 'bg-red-100/70 border border-red-300 text-red-900' : 'bg-emerald-100/70 border border-emerald-300 text-emerald-900'}`}>
            <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${feedbackIsError ? 'text-red-700' : 'text-emerald-700'}`} />
            <div>
              <span className="font-bold">{feedbackIsError ? 'Não foi possível concluir' : 'Pronto!'}</span>
              <p className={`mt-0.5 ${feedbackIsError ? 'text-red-800' : 'text-emerald-800'}`}>{feedback}</p>
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: THEME_COLORS.textDark }}>
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenForgotPassword(); }}
                  className="text-xs font-semibold hover:underline cursor-pointer"
                  style={{ color: THEME_COLORS.secondaryText }}
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border focus:outline-none transition-all"
                  style={{ 
                    backgroundColor: THEME_COLORS.bgLight, 
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark 
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1" style={{ color: THEME_COLORS.gray }}>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span>Lembrar meu acesso neste computador</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              style={{ backgroundColor: THEME_COLORS.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.primary)}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Contraponto</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                Nome Completo do Educador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Prof. Mariana Siqueira"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all"
                  style={{ 
                    backgroundColor: THEME_COLORS.bgLight, 
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark 
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                E-mail Institucional ou Pessoal
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="mariana@educacao.gov.br"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all"
                  style={{ 
                    backgroundColor: THEME_COLORS.bgLight, 
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark 
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                  Criar Senha
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  minLength={8}
                  placeholder="Mín. 8 caracteres"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none"
                  style={{ 
                    backgroundColor: THEME_COLORS.bgLight, 
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark 
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none"
                  style={{ 
                    backgroundColor: THEME_COLORS.bgLight, 
                    borderColor: THEME_COLORS.borderLight,
                    color: THEME_COLORS.textDark 
                  }}
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs cursor-pointer select-none" style={{ color: THEME_COLORS.gray }}>
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-stone-300"
                />
                <span>
                  Concordo com as diretrizes de pluralismo pedagógico e termos de uso do <strong>Contraponto</strong>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF0044]/30"
              style={{ backgroundColor: THEME_COLORS.secondary, color: THEME_COLORS.textLight }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.secondaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.secondary)}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cadastrar Gratuitamente</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
