import React, { useEffect, useState } from 'react';
import { User, Mail, School, ChartBar, Settings, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { Toast } from '../general/Toast';
import { updateCurrentUser } from '../../api/client';
import type { AuthUser } from '../../api/client';
import { useBackendData } from '../../context/BackendDataContext';

interface PersonalDataTabProps {
  user: AuthUser;
  onUserChange: (user: AuthUser) => void;
}

export const PersonalDataTab: React.FC<PersonalDataTabProps> = ({ user, onUserChange }) => {
  const { turmas, templates, materiais } = useBackendData();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [schools, setSchools] = useState<string[]>(user.schools || []);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSchool, setNewSchool] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
    setSchools(user.schools || []);
  }, [user.id, user.name, user.email, user.schools]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    try {
      const saved = await updateCurrentUser({
        name: name.trim(),
        email: email.trim(),
        picture_url: user.picture_url || null,
        schools,
      });
      onUserChange(saved);
      setShowSuccessToast(true);
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSchool = () => {
    const value = newSchool.trim();
    if (!value) return;
    if (schools.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setNewSchool('');
      return;
    }
    setSchools((current) => [...current, value]);
    setNewSchool('');
  };

  const startEditSchool = (index: number) => {
    setEditingIndex(index);
    setEditingValue(schools[index]);
  };

  const saveSchoolEdit = () => {
    if (editingIndex === null) return;
    const value = editingValue.trim();
    setSchools(schools.map((s, i) =>
        i === editingIndex ? value || s : s
      ));
    setEditingIndex(null);
  };

  const cancelSchoolEdit = () => setEditingIndex(null);

  const removeSchool = (index: number) => {
    setSchools(schools.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  return (
    <>
    
    <div
      className="flex flex-wrap gap-2 mb-4"
      style={{ borderColor: THEME_COLORS.borderLight }}
    >
      <button
        type="button"
        style={{
          color: THEME_COLORS.primary
        }}
        className="pb-3 px-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 inline-flex items-center gap-2"
      >
        <User className="w-3.5 h-3.5" />
        Informações Pessoais
      </button>
    </div>
    <form onSubmit={handleSave} className="space-y-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
            Nome Completo
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10"
              style={{
                backgroundColor: THEME_COLORS.bgLight,
                borderColor: THEME_COLORS.borderLight,
                color: THEME_COLORS.textDark,
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
            E-mail Institucional
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10"
              style={{
                backgroundColor: THEME_COLORS.bgLight,
                borderColor: THEME_COLORS.borderLight,
                color: THEME_COLORS.textDark,
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: THEME_COLORS.textDark }}>
          Escolas / Instituições de Ensino
        </label>

        {schools.length > 0 ? (
          <ul className="space-y-2">
            {schools.map((school, index) => (
              <li
                key={`${school}-${index}`}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  border
                "
                style={{
                  backgroundColor: THEME_COLORS.bgLight,
                  borderColor: THEME_COLORS.borderLight,
                }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: THEME_COLORS.lightPrimary,
                    color: THEME_COLORS.primary,
                  }}
                >
                  <School className="w-4 h-4" />
                </span>

                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingValue}
                      autoFocus
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveSchoolEdit();
                        }
                        if (e.key === 'Escape') cancelSchoolEdit();
                      }}
                      className="
                        flex-1
                        min-w-0
                        px-3
                        py-2
                        rounded-lg
                        border
                        text-sm
                        font-semibold
                        outline-none
                        focus:border-[#7C3AED]
                        focus:ring-2
                        focus:ring-[#7C3AED]/10
                      "
                      style={{
                        backgroundColor: 'white',
                        borderColor: THEME_COLORS.borderLight,
                        color: THEME_COLORS.textDark,
                      }}
                    />
                    <button
                      type="button"
                      onClick={saveSchoolEdit}
                      className="p-2 rounded-lg text-white transition-colors cursor-pointer hover:opacity-90 shrink-0"
                      style={{ backgroundColor: THEME_COLORS.secondary }}
                      aria-label="Salvar instituição"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelSchoolEdit}
                      className="p-2 rounded-lg text-stone-500 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
                      aria-label="Cancelar edição"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className="flex-1 min-w-0 text-sm font-semibold truncate"
                      style={{ color: THEME_COLORS.textDark }}
                    >
                      {school}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEditSchool(index)}
                      className="p-2 rounded-lg text-stone-500 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
                      aria-label={`Editar ${school}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSchool(index)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      aria-label={`Excluir ${school}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p
            className="px-4 py-3 rounded-xl border text-xs font-semibold"
            style={{
              backgroundColor: THEME_COLORS.bgLight,
              borderColor: THEME_COLORS.borderLight,
              color: THEME_COLORS.gray,
            }}
          >
            Nenhuma instituição cadastrada ainda. Adicione uma
            abaixo.
          </p>
        )}

        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <School className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={newSchool}
              onChange={(e) => setNewSchool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSchool();
                }
              }}
              placeholder="Ex: E.E. Cecília Meireles"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10"
              style={{
                backgroundColor: THEME_COLORS.bgLight,
                borderColor: THEME_COLORS.borderLight,
                color: THEME_COLORS.textDark,
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleAddSchool}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              text-xs
              font-black
              uppercase
              tracking-wider
              text-white
              shadow-sm
              transition-all
              hover:scale-105
              cursor-pointer
            "
            style={{ backgroundColor: THEME_COLORS.primary }}
          >
            <Plus className="w-4 h-4" />
            Adicionar instituição
          </button>
        </div>
      </div>
    
    <div
      className="flex flex-wrap gap-2 mb-4"
      style={{ borderColor: THEME_COLORS.borderLight }}
    >
      <button
        type="button"
        style={{
          color: THEME_COLORS.primary
        }}
        className="pb-3 px-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 inline-flex items-center gap-2"
      >
        <ChartBar className="w-3.5 h-3.5" />
        Uso da plataforma
      </button>
    </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: THEME_COLORS.bgLight, borderColor: THEME_COLORS.borderLight }}>
          <span className="text-2xl font-black" style={{ color: THEME_COLORS.primary }}>{turmas.length}</span>
          <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: THEME_COLORS.gray }}>Turmas Ativas</p>
        </div>
        <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: THEME_COLORS.bgLight, borderColor: THEME_COLORS.borderLight }}>
          <span className="text-2xl font-black" style={{ color: THEME_COLORS.secondary }}>{templates.length}</span>
          <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: THEME_COLORS.gray }}>Planos Criados</p>
        </div>
        <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: THEME_COLORS.bgLight, borderColor: THEME_COLORS.borderLight }}>
          <span className="text-2xl font-black" style={{ color: THEME_COLORS.primary }}>{materiais.length}</span>
          <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: THEME_COLORS.gray }}>Materiais Gerados</p>
        </div>
        <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: THEME_COLORS.bgLight, borderColor: THEME_COLORS.borderLight }}>
          <span className="text-2xl font-black" style={{ color: THEME_COLORS.secondaryHover}}>{materiais.filter((item) => item.category === 'atividade').length}</span>
          <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: THEME_COLORS.gray }}>Atividades Criadas</p>
        </div>
      </div>
    
    <div
      className="flex flex-wrap gap-2 mb-4"
      style={{ borderColor: THEME_COLORS.borderLight }}
    >
      <button
        type="button"
        style={{
          color: THEME_COLORS.primary
        }}
        className="pb-3 px-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 inline-flex items-center gap-2"
      >
        <Settings className="w-3.5 h-3.5" />
        Opções da Conta
      </button>
    </div>

      <div className="flex flex-col w-fit space-y-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all hover:scale-105 cursor-pointer"
          style={{ backgroundColor: THEME_COLORS.primary }}
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>

    {showSuccessToast && (
      <Toast
        message="Configurações do professor atualizadas com sucesso!"
        onClose={() => setShowSuccessToast(false)}
      />
    )}
    {errorMessage && (
      <Toast
        message={errorMessage}
        variant="error"
        onClose={() => setErrorMessage(null)}
      />
    )}
    </>
  );
};

export default PersonalDataTab;
