import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroAuth } from './components/login/HeroAuth';
import { AboutInitiative } from './components/login/AboutInitiative';
import { TeachingGuide } from './components/login/TeachingGuide';
import { Footer } from './components/login/Footer';
import { AuthModal } from './components/login/AuthModal';
import { ForgotPasswordModal } from './components/login/ForgotPasswordModal';
import { THEME_COLORS } from './constants/colors';

export function App() {
  // Login Page Component
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenForgotPassword = () => {
    setIsAuthModalOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const handleBackToLoginFromModal = () => {
    setIsForgotPasswordOpen(false);
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  // Render the Landing / Login page
  return (
    <div 
      className="min-h-screen flex flex-col font-sans antialiased"
      style={{ 
        backgroundColor: THEME_COLORS.bgLight, 
        color: THEME_COLORS.textDark 
      }}
    >
      {/* Main Content (Desktop-First Layout) */}
      <main className="flex-grow">
        {/* Hero Section: Abstract Geometric Artwork on Left, Editorial Typography & CTAs on Right */}
        <HeroAuth onOpenAuth={handleOpenAuth} />

        {/* Sobre a Iniciativa */}
        <AboutInitiative />

        {/* Como Funciona o Contraponto */}
        <TeachingGuide />
      </main>

      {/* Footer com Contatos */}
      <Footer />

      {/* Modern Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenForgotPassword={handleOpenForgotPassword}
        onSuccess={() => navigate('/home')}
      />

      {/* Esqueci Minha Senha Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onBackToLogin={handleBackToLoginFromModal}
      />
    </div>
  );
}

export default App;
