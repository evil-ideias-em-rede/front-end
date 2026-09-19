import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Material, Template, Turma } from '../types';
import * as api from '../api/client';

interface BackendDataValue {
  turmas: Turma[];
  templates: Template[];
  materiais: Material[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  createTurma: (turma: Turma) => Promise<Turma>;
  updateTurma: (turma: Turma) => Promise<Turma>;
  deleteTurma: (id: string) => Promise<void>;
  createTemplate: (template: Template) => Promise<Template>;
  updateTemplate: (template: Template) => Promise<Template>;
  deleteTemplate: (id: string) => Promise<void>;
  createMaterial: (material: Material) => Promise<Material>;
  updateMaterial: (material: Material) => Promise<Material>;
  deleteMaterial: (id: string) => Promise<void>;
}

const BackendDataContext = createContext<BackendDataValue | null>(null);

export const BackendDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!api.isAuthenticated()) {
      setTurmas([]);
      setTemplates([]);
      setMateriais([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [nextTurmas, nextTemplates, nextMateriais] = await Promise.all([
        api.listTurmas(), api.listTemplates(), api.listMateriais(),
      ]);
      setTurmas(nextTurmas);
      setTemplates(nextTemplates);
      setMateriais(nextMateriais);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar seus dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const value = useMemo<BackendDataValue>(() => ({
    turmas, templates, materiais, loading, error, reload,
    createTurma: async (turma) => { const saved = await api.createTurma(turma); setTurmas((current) => [...current, saved]); return saved; },
    updateTurma: async (turma) => { const saved = await api.updateTurma(turma); setTurmas((current) => current.map((item) => item.id === saved.id ? saved : item)); return saved; },
    deleteTurma: async (id) => { await api.deleteTurma(id); setTurmas((current) => current.filter((item) => item.id !== id)); setTemplates((current) => current.map((item) => ({ ...item, turmaIds: item.turmaIds?.filter((turmaId) => turmaId !== id) ?? [], qtd: item.turmaIds?.filter((turmaId) => turmaId !== id).length ?? 0 }))); setMateriais((current) => current.map((item) => ({ ...item, turmaIds: item.turmaIds?.filter((turmaId) => turmaId !== id) ?? [], qtd: item.turmaIds?.filter((turmaId) => turmaId !== id).length ?? 0 }))); },
    createTemplate: async (template) => { const saved = await api.createTemplate(template); setTemplates((current) => [...current, saved]); return saved; },
    updateTemplate: async (template) => { const saved = await api.updateTemplate(template); setTemplates((current) => current.map((item) => item.id === saved.id ? saved : item)); return saved; },
    deleteTemplate: async (id) => { await api.deleteTemplate(id); setTemplates((current) => current.filter((item) => item.id !== id)); },
    createMaterial: async (material) => { const saved = await api.createMaterial(material); setMateriais((current) => [...current, saved]); return saved; },
    updateMaterial: async (material) => { const saved = await api.updateMaterial(material); setMateriais((current) => current.map((item) => item.id === saved.id ? saved : item)); return saved; },
    deleteMaterial: async (id) => { await api.deleteMaterial(id); setMateriais((current) => current.filter((item) => item.id !== id)); },
  }), [turmas, templates, materiais, loading, error, reload]);

  return <BackendDataContext.Provider value={value}>{children}</BackendDataContext.Provider>;
};

export function useBackendData(): BackendDataValue {
  const context = useContext(BackendDataContext);
  if (!context) throw new Error('useBackendData precisa estar dentro de BackendDataProvider');
  return context;
}

