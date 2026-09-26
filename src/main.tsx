import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { DashboardLayout } from './components/home/DashboardLayout.tsx'
import { TurmaDetailPage } from './components/home/TurmaDetailPage.tsx'
import { TemplateDetailPage } from './components/home/TemplateDetailPage.tsx'
import { MaterialDetailPage } from './components/home/MaterialDetailPage.tsx'
import { SuggestPage } from './components/editor/SuggestPage.tsx'
import { MaterialEditorPage } from './components/editor/MaterialEditorPage.tsx'
import { BackendDataProvider } from './context/BackendDataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<BackendDataProvider><DashboardLayout /></BackendDataProvider>}>
          <Route path="turmas" element={null} />
          <Route path="turmas/:id" element={<TurmaDetailPage />} />
          <Route path="templates" element={null} />
          <Route path="templates/:id" element={<TemplateDetailPage />} />
          <Route path="materiais" element={null} />
          <Route path="materiais/:id" element={<MaterialDetailPage />} />
          <Route path="editor" element={<SuggestPage />} />
          <Route path="editor/material" element={<MaterialEditorPage />} />
          <Route path="perfil" element={null} />
        </Route>
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
