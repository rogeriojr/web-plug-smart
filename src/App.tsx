import { FunctionComponent, JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// PAGES
import LoginPage from "./pages/login/login.page";
import DashboardPage from "./pages/dashboard/dashboard.page";
import Layout from "./components/Layout";
import UsersPage from "./pages/users/UsersList/users-list.page";
import UserCreatePage from "./pages/users/UsersCreate/users-create.page";
import TravasPage from "./pages/travas/TravasList/travas-list.page";
import AcessosPage from "./pages/acessos/AcessosList/acessos-list.page";
import TravaCreatePage from "./pages/travas/TravasCreate/travas-create-page";
import UserEditPage from "./pages/users/UsersEdit/users-edit.page";
import TravaEditPage from "./pages/travas/TravasEdit/travas-edit-page";
import SmsSendPage from "./pages/sms/sms-page";
import AcessoEditPage from "./pages/acessos/AcessosList/AcessosEdit/acessos-edit-list";
import PrivacyPolicy from "./pages/privacy/privacy-page";
import AccountDeletion from "./pages/delete-account/delete-account-page";
import { AuthProvider, useAuth } from "./hooks/auth-context";

// Componente de rota protegida
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App: FunctionComponent = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
          <Route path="/exclusao-conta" element={<AccountDeletion />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserCreatePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserEditPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/travas"
            element={
              <ProtectedRoute>
                <Layout>
                  <TravasPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/travas/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <TravaCreatePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/travas/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <TravaEditPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/travas/acessos"
            element={
              <ProtectedRoute>
                <Layout>
                  <AcessosPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/acessos/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <AcessoEditPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms"
            element={
              <ProtectedRoute>
                <Layout>
                  <SmsSendPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Rota padrão: redireciona para /dashboard se autenticado, senão /login */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* Fallback para rotas inexistentes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
