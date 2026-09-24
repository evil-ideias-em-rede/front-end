import React from 'react';
import { FolderGit2, MapPin } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';

interface TeamMember {
  name: string;
  institution: string;
  city: string;
}

const MEMBERS: TeamMember[] = [
  {
    name: 'Iriedson Vilar',
    institution: 'Universidade Federal de Campina Grande',
    city: 'Campina Grande, PB',
  },
  {
    name: 'Emile Christie',
    institution: 'Universidade Federal de Campina Grande',
    city: 'Campina Grande, PB',
  },
  {
    name: 'Levi Junior',
    institution: 'Universidade Federal de Campina Grande',
    city: 'Campina Grande, PB',
  },
  {
    name: 'Vinicius Pereira',
    institution: 'Universidade Federal do Ceará',
    city: 'Fortaleza, CE',
  },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const TeamSection: React.FC = () => {
  return (
    <section id="sobre-time" className="py-24 relative overflow-hidden">
      {/* Background Abstract Geometric Shapes */}
      <div
        className="absolute top-10 -right-16 w-72 h-72 rounded-bl-[100%] pointer-events-none opacity-20"
        style={{ backgroundColor: THEME_COLORS.primary }}
      />
      <div
        className="absolute bottom-10 -left-16 w-72 h-72 rounded-full pointer-events-none opacity-20"
        style={{ backgroundColor: THEME_COLORS.secondary }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header with Mixed Outline and Solid Typography */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            <span className="text-outline-dark">Equipe de </span>
            <span style={{ color: THEME_COLORS.textDark }}>Pesquisa</span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
            Pesquisadores em inteligência artificial aplicada à educação, responsáveis pelo ecossistema multiagente e pela validação com docentes da Educação Básica.
          </p>
        </div>

        {/* Members Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEMBERS.map((member, idx) => (
            <div
              key={member.name}
              className="p-7 rounded-3xl shadow-md hover:shadow-lg transition-all text-center space-y-4 backdrop-blur-xs"
              style={{
                backgroundColor: 'rgba(255,255, 255, 0.4)',
                borderColor: THEME_COLORS.borderLight,
              }}
            >
              <span
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-black text-white shadow-sm"
                style={{
                  backgroundColor:
                    idx % 2 === 0 ? THEME_COLORS.primary : THEME_COLORS.secondary,
                }}
              >
                {getInitials(member.name)}
              </span>

              <div>
                <h4 className="text-lg font-black tracking-tight" style={{ color: THEME_COLORS.textDark }}>
                  {member.name}
                </h4>
                <p className="text-xs sm:text-sm mt-1.5 leading-relaxed font-medium" style={{ color: THEME_COLORS.gray }}>
                  {member.institution}
                </p>
                <p
                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold"
                  style={{ color: THEME_COLORS.gray }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {member.city}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Replication Package Link */}
        <div className="mt-10 flex justify-center">
          <a
            href="https://github.com/evil-ideias-em-rede"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: THEME_COLORS.bgDark }}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Pacote de replicação no GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;