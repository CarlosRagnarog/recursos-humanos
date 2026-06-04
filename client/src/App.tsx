import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegistroPersonalPage from "./pages/RegistroPersonalPage";
import DatosPersonalesPage from "./pages/DatosPersonalesPage";
import SituacionAdministrativaPage from "./pages/SituacionAdministrativaPage";
import MeritosDemeritosPage from "./pages/MeritosDemeritosPage";
import ListaRevistasPage from "./pages/ListaRevistasPage";
import RecepcionDespachoPage from "./pages/RecepcionDespachoPage";
import RevisionJuridicaPage from "./pages/RevisionJuridicaPage";
import InstitucionesPage from "./pages/InstitucionesPage";
import ReportesPage from "./pages/ReportesPage";
import type { ReactElement } from "react";

function ProtectedRoute({ children }: { children: ReactElement }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/registro-personal" element={<ProtectedRoute><RegistroPersonalPage /></ProtectedRoute>} />
        <Route path="/datos-personales" element={<ProtectedRoute><DatosPersonalesPage /></ProtectedRoute>} />
        <Route path="/situacion-administrativa" element={<ProtectedRoute><SituacionAdministrativaPage /></ProtectedRoute>} />
        <Route path="/meritos-demeritos" element={<ProtectedRoute><MeritosDemeritosPage /></ProtectedRoute>} />
        <Route path="/lista-revistas" element={<ProtectedRoute><ListaRevistasPage /></ProtectedRoute>} />
        <Route path="/recepcion-despacho" element={<ProtectedRoute><RecepcionDespachoPage /></ProtectedRoute>} />
        <Route path="/revision-juridica" element={<ProtectedRoute><RevisionJuridicaPage /></ProtectedRoute>} />
        <Route path="/instituciones" element={<ProtectedRoute><InstitucionesPage /></ProtectedRoute>} />
        <Route path="/reportes" element={<ProtectedRoute><ReportesPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;