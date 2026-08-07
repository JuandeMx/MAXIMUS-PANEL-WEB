import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FolderPlus, Image as ImageIcon, FileText, AlertTriangle } from 'lucide-react';

export const NewCategoryModal: React.FC = () => {
  const {
    addCategory,
    updateCategory,
    selectedCategory,
    setSelectedCategory,
    activeModal,
    setActiveModal,
  } = useApp();

  const isEditing = activeModal === 'edit-category' && !!selectedCategory;

  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setErrorMsg('');
    if (isEditing && selectedCategory) {
      setName(selectedCategory.name || '');
      setIconUrl(selectedCategory.iconUrl || '');
      setDescription(selectedCategory.description || '');
    } else {
      setName('');
      setIconUrl('');
      setDescription('');
    }
  }, [isEditing, selectedCategory?.id]);

  const handleClose = () => {
    setActiveModal(null);
    setSelectedCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa un nombre para la categoría.');
      return;
    }

    if (isEditing && selectedCategory) {
      updateCategory(selectedCategory.id, {
        name: name.trim(),
        iconUrl: iconUrl.trim(),
        description: description.trim(),
      });
    } else {
      addCategory({
        name: name.trim(),
        iconUrl: iconUrl.trim(),
        description: description.trim(),
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f172a] border border-cyan-500/20 text-slate-100 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <FolderPlus size={18} className="text-[#06b6d4]" />
            <span>{isEditing ? 'Editar Categoría' : 'Nueva Categoría de Métodos'}</span>
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 flex items-center gap-2.5 font-semibold text-xs animate-in fade-in">
              <AlertTriangle size={18} className="shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nombre de la Categoría */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold text-[11px]">
              Nombre de la Categoría (Ej: SERVIDORES DE ARGENTINA 🇦🇷 I)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: COLOMBIA 🇨🇴, PERU 🇵🇪, etc."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090f1e] border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:border-[#06b6d4] focus:outline-none transition-colors"
            />
          </div>

          {/* URL de Imagen / Icono */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold text-[11px]">
              URL de Imagen / Logotipo (Opcional)
            </label>
            <div className="relative">
              <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://ejemplo.com/logo.png"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#090f1e] border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:border-[#06b6d4] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Descripción Corta */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold text-[11px]">
              Descripción Corta (Opcional)
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Métodos y VPS para la región Argentina"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#090f1e] border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:border-[#06b6d4] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1e293b] text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#06b6d4] hover:bg-[#0891b2] text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
