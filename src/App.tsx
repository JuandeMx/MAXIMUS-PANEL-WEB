import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ClientsView } from './components/views/ClientsView';
import { ServersView } from './components/views/ServersView';
import { MethodsView } from './components/views/MethodsView';
import { ResellersView } from './components/views/ResellersView';
import { MonitorView } from './components/views/MonitorView';
import { NotificationsView } from './components/views/NotificationsView';
import { SalesView } from './components/views/SalesView';
import { ReportsView } from './components/views/ReportsView';
import { ActivityView } from './components/views/ActivityView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { NewClientModal } from './components/modals/NewClientModal';
import { ClientQrModal } from './components/modals/ClientQrModal';
import { NewServerModal } from './components/modals/NewServerModal';
import { NewResellerModal } from './components/modals/NewResellerModal';
import { ResellerClientsModal } from './components/modals/ResellerClientsModal';
import { NewAdminModal } from './components/modals/NewAdminModal';
import { EditAdminModal } from './components/modals/EditAdminModal';
import { NewMethodModal } from './components/modals/NewMethodModal';
import { NewCategoryModal } from './components/modals/NewCategoryModal';

import { LoginView } from './components/views/LoginView';

const MainContent: React.FC = () => {
  const { activeTab, activeModal, currentUser } = useApp();

  if (!currentUser) {
    return <LoginView />;
  }

  const isReseller = currentUser.role === 'reseller';

  const renderActiveView = () => {
    if (isReseller) {
      return <ClientsView />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'clients':
        return <ClientsView />;
      case 'servers':
        return <ServersView />;
      case 'methods':
        return <MethodsView />;
      case 'resellers':
        return <ResellersView />;
      case 'monitor':
        return <MonitorView />;
      case 'notifications':
        return <NotificationsView />;
      case 'sales':
        return <SalesView />;
      case 'reports':
        return <ReportsView />;
      case 'activity':
        return <ActivityView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] select-none">
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <Header />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {renderActiveView()}
        </main>
      </div>

      {/* 3. Global Modals */}
      {(activeModal === 'new-client' || activeModal === 'edit-client') && <NewClientModal />}
      {activeModal === 'client-qr' && <ClientQrModal />}
      {activeModal === 'new-server' && <NewServerModal />}
      {activeModal === 'new-reseller' && <NewResellerModal />}
      {activeModal === 'reseller-clients' && <ResellerClientsModal />}
      {activeModal === 'new-admin' && <NewAdminModal />}
      {activeModal === 'edit-admin' && <EditAdminModal />}
      {(activeModal === 'new-method' || activeModal === 'edit-method') && <NewMethodModal />}
      {(activeModal === 'new-category' || activeModal === 'edit-category') && <NewCategoryModal />}
    </div>
  );
};

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MAXIMUS PANEL Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070c18] flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0d1527] border border-red-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30 font-bold text-xl">
              ⚠️
            </div>
            <h2 className="text-lg font-bold">Se ha producido un error al cargar la vista</h2>
            <p className="text-xs text-slate-400 bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-left overflow-x-auto max-h-32">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-lg"
            >
              Limpiar Caché y Recargar Panel
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </GlobalErrorBoundary>
  );
}
