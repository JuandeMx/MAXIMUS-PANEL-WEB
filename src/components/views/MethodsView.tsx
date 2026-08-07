import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConnectionMethod, MethodCategory } from '../../types';
import {
  Zap,
  Plus,
  Search,
  Terminal,
  Copy,
  Check,
  Edit,
  Trash2,
  Globe,
  Layers,
  Shield,
  AlertTriangle,
  FolderPlus,
  ChevronRight,
  Folder,
  Image as ImageIcon,
} from 'lucide-react';

export const MethodsView: React.FC = () => {
  const {
    methods,
    categories,
    servers,
    deleteConnectionMethod,
    deleteCategory,
    setActiveModal,
    setSelectedMethod,
    setSelectedCategory,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deletion modals
  const [methodToDelete, setMethodToDelete] = useState<ConnectionMethod | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<MethodCategory | null>(null);

  const safeCategories = categories || [];
  const safeMethods = methods || [];
  const q = (searchTerm || '').toLowerCase();

  const filteredCategories = safeCategories.filter((cat) =>
    (cat.name || '').toLowerCase().includes(q) ||
    (cat.description || '').toLowerCase().includes(q)
  );

  const filteredMethods = safeMethods.filter((m) => {
    const matchesCat = selectedCatId === 'ALL' || m.categoryId === selectedCatId;
    const matchesSearch =
      (m.name || '').toLowerCase().includes(q) ||
      (m.description || '').toLowerCase().includes(q) ||
      (m.sshHost || '').toLowerCase().includes(q) ||
      (m.payload || '').toLowerCase().includes(q) ||
      (m.sni || '').toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const handleCopyPayload = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateNewCategory = () => {
    setSelectedCategory(null);
    setActiveModal('new-category');
  };

  const handleEditCategory = (cat: MethodCategory) => {
    setSelectedCategory(cat);
    setActiveModal('edit-category');
  };

  const handleCreateNewMethod = (catId?: string) => {
    setSelectedMethod(null);
    if (catId && categories.some((c) => c.id === catId)) {
      // Pre-select category
      const dummyMethod: any = { categoryId: catId };
      setSelectedMethod(dummyMethod);
    }
    setActiveModal('new-method');
  };

  const handleEditMethod = (method: ConnectionMethod) => {
    setSelectedMethod(method);
    setActiveModal('edit-method');
  };

  const confirmDeleteMethod = () => {
    if (methodToDelete) {
      deleteConnectionMethod(methodToDelete.id);
      setMethodToDelete(null);
    }
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      if (selectedCatId === categoryToDelete.id) {
        setSelectedCatId('ALL');
      }
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner & Global Actions */}
      <div className="p-5 rounded-2xl glass-panel border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-xs uppercase tracking-wider">
            <Zap size={18} />
            <span>MÉTODOS & CATEGORÍAS DE LA APP MÓVIL</span>
          </div>
          <h2 className="text-xl font-black text-[var(--text)] tracking-tight">
            Gestor Estructurado por Categorías y Servidores
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-xl leading-relaxed">
            Organiza las configuraciones por regiones o categorías de tu app. Cada método soporta las etiquetas automáticas <code className="text-cyan-300 font-mono">[IP]</code>, <code className="text-amber-300 font-mono">[CF]</code> y <code className="text-purple-300 font-mono">[CFT]</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleCreateNewCategory}
            className="px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <FolderPlus size={16} />
            <span>Nueva Categoría</span>
          </button>
          <button
            onClick={() => handleCreateNewMethod()}
            className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-fg)] font-bold text-xs hover:opacity-90 shadow-lg flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            <span>Nuevo Método</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar por categoría, nombre o payload..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCatId('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCatId === 'ALL'
                ? 'bg-[var(--accent)] text-[var(--accent-fg)] shadow-md'
                : 'bg-white/5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10'
            }`}
          >
            Todas ({safeMethods.length})
          </button>
          {safeCategories.map((cat) => {
            const catMethodsCount = safeMethods.filter((m) => m.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCatId === cat.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-white/5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10'
                }`}
              >
                <span>{cat.name}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                  {catMethodsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Categories & Methods Content */}
      {safeCategories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-500/20">
            <FolderPlus size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--text)]">
              No hay Categorías de Métodos creadas
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              Crea tu primera categoría (Ej: SERVIDORES DE ARGENTINA 🇦🇷, COLOMBIA 🇨🇴) para organizar los métodos de tu aplicación.
            </p>
          </div>
          <button
            onClick={handleCreateNewCategory}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-extrabold hover:bg-cyan-400 inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <FolderPlus size={16} />
            <span>Crear Primera Categoría</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCategories
            .filter((cat) => selectedCatId === 'ALL' || cat.id === selectedCatId)
            .map((cat) => {
              const catMethods = filteredMethods.filter((m) => m.categoryId === cat.id);

              return (
                <div key={cat.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
                  {/* Category Header Card */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3.5">
                      {cat.iconUrl ? (
                        <img
                          src={cat.iconUrl}
                          alt={cat.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10 bg-slate-900"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
                          <Folder size={20} />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white tracking-tight">
                            {cat.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                            {catMethods.length} configuraciones
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => handleCreateNewMethod(cat.id)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center gap-1.5 border border-cyan-500/30 transition-all"
                      >
                        <Plus size={14} />
                        <span>Añadir Método</span>
                      </button>
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all"
                        title="Editar Categoría"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(cat)}
                        className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 transition-all"
                        title="Eliminar Categoría"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Methods Grid for this Category */}
                  {catMethods.length === 0 ? (
                    <div className="p-6 text-center rounded-xl bg-white/5 border border-dashed border-white/10">
                      <p className="text-xs text-[var(--text-subtle)] italic">
                        No hay métodos agregados en esta categoría todavía.
                      </p>
                      <button
                        onClick={() => handleCreateNewMethod(cat.id)}
                        className="mt-2 text-xs text-cyan-400 hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <Plus size={13} />
                        <span>Agregar el primer método aquí</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {catMethods.map((method) => (
                        <div
                          key={method.id}
                          className="p-4 rounded-xl bg-[#090f1e]/80 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-2.5">
                            {/* Top Bar */}
                            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Zap size={15} className="text-[#06b6d4]" />
                                  <h4 className="text-sm font-extrabold text-white">
                                    {method.name}
                                  </h4>
                                </div>
                                {method.description && (
                                  <p className="text-[11px] text-cyan-300/80 font-medium mt-0.5">
                                    {method.description}
                                  </p>
                                )}
                              </div>

                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                {method.protocol}
                              </span>
                            </div>

                            {/* Host & SNI */}
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                              <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                                <span className="text-[10px] text-slate-400 block font-sans">SSH Host / Port:</span>
                                <span className="text-white font-bold">{method.sshHost || '[IP]'}</span>:{method.sshPort}
                              </div>
                              <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                                <span className="text-[10px] text-slate-400 block font-sans">Host SNI:</span>
                                <span className="text-amber-300 font-bold">{method.sni || '(Vacio)'}</span>
                              </div>
                            </div>

                            {/* Payload Container */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)] font-mono">
                                <span>Payload Struct:</span>
                                <button
                                  onClick={() => handleCopyPayload(method.id, method.payload)}
                                  className="text-cyan-400 hover:underline flex items-center gap-1"
                                >
                                  {copiedId === method.id ? (
                                    <>
                                      <Check size={12} className="text-emerald-400" />
                                      <span className="text-emerald-400 font-bold">¡Copiado!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>Copiar Payload</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="p-2.5 rounded-lg bg-black/80 border border-white/10 font-mono text-[10px] text-emerald-300 break-all select-all leading-relaxed max-h-24 overflow-y-auto">
                                {method.payload || <span className="text-slate-500 italic">(Payload Vacío)</span>}
                              </div>
                            </div>
                          </div>

                          {/* Method Actions */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                            <button
                              onClick={() => handleEditMethod(method)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 border border-amber-500/30"
                            >
                              <Edit size={13} />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => setMethodToDelete(method)}
                              className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all border border-red-500/30"
                              title="Eliminar Método"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Modal Confirmación Eliminación Método */}
      {methodToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f172a] space-y-4 border border-red-500/30 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">¿Eliminar Método de Conexión?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Estás a punto de eliminar <strong className="text-white">"{methodToDelete.name}"</strong>. Esta acción se reflejará inmediatamente en la app móvil.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setMethodToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteMethod}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg"
              >
                Sí, Eliminar Método
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminación Categoría */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f172a] space-y-4 border border-red-500/30 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">¿Eliminar Categoría Completa?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Estás eliminando la categoría <strong className="text-white">"{categoryToDelete.name}"</strong>. Se eliminarán también todos los métodos asociados a ella.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg"
              >
                Sí, Eliminar Categoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
