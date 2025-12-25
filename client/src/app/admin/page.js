'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Upload } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Category Management
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryError, setCategoryError] = useState(null);
    const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState(null);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [addingCategory, setAddingCategory] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchCategories(), fetchProjects()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            const data = await res.json();
            const cats = Array.isArray(data) ? data : [];
            setCategories(cats);
            if (cats.length > 0 && !formData.category) {
                setFormData(prev => ({ ...prev, category: cats[0].name }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/projects`);
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // --- Actions ---

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setAddingCategory(true);
        setCategoryError(null);

        try {
            const res = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName.trim() })
            });
            const data = await res.json();

            if (res.ok) {
                setNewCategoryName('');
                await fetchCategories();
            } else {
                setCategoryError(data.error || 'Gagal menambah kategori');
            }
        } catch (err) {
            setCategoryError('Kesalahan koneksi');
        } finally {
            setAddingCategory(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchCategories();
                setDeleteCategoryConfirm(null);
            } else {
                const data = await res.json();
                setCategoryError(data.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveProject = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage(null);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            if (formData.image) data.append('image', formData.image);

            const url = editingProject ? `${API_URL}/projects/${editingProject.id}` : `${API_URL}/projects`;
            const method = editingProject ? 'PUT' : 'POST';

            const res = await fetch(url, { method, body: data });
            if (res.ok) {
                await fetchProjects();
                closeModal();
            } else {
                const err = await res.json();
                setErrorMessage(err.error || 'Gagal menyimpan');
            }
        } catch (err) {
            setErrorMessage('Kesalahan koneksi');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchProjects();
                setDeleteConfirm(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // --- Helpers ---

    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description || '',
                category: project.category,
                image: null
            });
            setImagePreview(project.image_url ? (project.image_url.startsWith('http') ? project.image_url : `http://localhost:5000${project.image_url}`) : null);
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                category: categories[0]?.name || '',
                image: null
            });
            setImagePreview(null);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setErrorMessage(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen bg-primary-50 text-primary-900 font-sans selection:bg-accent/20">
            {/* Top Navigation */}
            <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-primary-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-accent to-accent-dark flex items-center justify-center text-primary-50 font-bold font-display">
                            A
                        </div>
                        <h1 className="font-display font-semibold text-lg tracking-tight text-primary-900">Admin Console</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-primary-500 hover:text-primary-900 transition-colors">
                            View Site
                        </Link>
                        <div className="h-4 w-px bg-primary-200"></div>
                        <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-600 rounded border border-primary-200">
                            v1.0
                        </span>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Stats & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-primary-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-primary-500 text-sm font-medium mb-1">Total Projects</p>
                            <h2 className="text-4xl font-display font-bold text-primary-900">{projects.length}</h2>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            📁
                        </div>
                    </div>

                    <div className="md:col-span-1 p-6 rounded-2xl bg-white border border-primary-200 shadow-sm cursor-pointer hover:border-accent/50 transition-colors group"
                        onClick={() => setIsCategoryManagerOpen(!isCategoryManagerOpen)}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-primary-500 text-sm font-medium">Categories</p>
                            <span className="text-primary-400 group-hover:text-accent transition-colors">→</span>
                        </div>
                        <h2 className="text-4xl font-display font-bold text-primary-900">{categories.length}</h2>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="md:col-span-1 p-6 rounded-2xl bg-accent text-white hover:bg-accent-dark transition-all active:scale-95 flex flex-col items-center justify-center gap-2 shadow-lg shadow-accent/20"
                    >
                        <span className="text-2xl">+</span>
                        <span className="font-semibold">New Project</span>
                    </button>
                </div>

                {/* Categories Panel (Collapsible) */}
                {isCategoryManagerOpen && (
                    <div className="mb-10 p-6 rounded-2xl bg-white border border-primary-200 shadow-sm animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-medium text-lg text-primary-900">Manage Categories</h3>
                            <button onClick={() => setIsCategoryManagerOpen(false)} className="text-primary-400 hover:text-primary-600">✕</button>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6">
                            {categories.map(cat => (
                                <div key={cat.id} className="group flex items-center gap-2 pl-4 pr-2 py-2 bg-primary-50 rounded-full border border-primary-200 hover:border-primary-300 transition-colors">
                                    <span className="text-sm font-medium text-primary-700">{cat.name}</span>
                                    <button
                                        onClick={() => setDeleteCategoryConfirm(cat)}
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-primary-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder="New category name..."
                                className="flex-1 bg-primary-50 border border-primary-200 rounded-lg px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 text-primary-900 overlay"
                            />
                            <button
                                type="submit"
                                disabled={addingCategory}
                                className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors"
                            >
                                {addingCategory ? 'Adding...' : 'Add'}
                            </button>
                        </form>
                        {categoryError && <p className="mt-2 text-sm text-red-500">{categoryError}</p>}
                    </div>
                )}

                {/* Projects List */}
                <div className="space-y-4">
                    <h3 className="font-display font-medium text-lg text-primary-600 px-1">All Projects</h3>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-primary-200 border-dashed">
                            <p className="text-primary-500">No projects found. Create your first one.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-primary-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-primary-100 text-xs uppercase text-primary-500 font-medium tracking-wider bg-primary-50/50">
                                        <th className="px-6 py-4 font-normal">Project</th>
                                        <th className="px-6 py-4 font-normal">Category</th>
                                        <th className="px-6 py-4 font-normal">Date</th>
                                        <th className="px-6 py-4 font-normal text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary-100">
                                    {projects.map(project => (
                                        <tr key={project.id} className="group hover:bg-primary-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-primary-100 overflow-hidden flex-shrink-0">
                                                        {project.image_url ? (
                                                            <img src={project.image_url.startsWith('http') ? project.image_url : `http://localhost:5000${project.image_url}`} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-primary-400">🏛️</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-primary-900 group-hover:text-accent transition-colors">{project.title}</h4>
                                                        <p className="text-xs text-primary-500 line-clamp-1 max-w-[200px]">{project.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-600 border border-primary-200">
                                                    {project.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-primary-500">
                                                {new Date(project.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openModal(project)}
                                                        className="p-2 text-primary-400 hover:text-primary-900 transition-colors"
                                                        title="Edit"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(project)}
                                                        className="p-2 text-primary-400 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* --- Modals --- */}

            {/* Project Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white border border-primary-200 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-primary-100 flex justify-between items-center">
                            <h2 className="font-display font-semibold text-lg text-primary-900">{editingProject ? 'Edit Project' : 'New Project'}</h2>
                            <button onClick={closeModal} className="text-primary-400 hover:text-primary-600">✕</button>
                        </div>

                        <form onSubmit={handleSaveProject} className="p-6 space-y-4">
                            {errorMessage && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-primary-500 mb-1.5 uppercase tracking-wide">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-primary-50 border border-primary-200 rounded-lg px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors text-primary-900 placeholder:text-primary-400"
                                    placeholder="e.g. Modern Villa Design"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-primary-500 mb-1.5 uppercase tracking-wide">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-primary-50 border border-primary-200 rounded-lg px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors text-primary-900"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-primary-500 mb-1.5 uppercase tracking-wide">Image</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="modalImageInput"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <label
                                            htmlFor="modalImageInput"
                                            className="flex items-center justify-center gap-2 w-full h-[42px] px-4 bg-primary-50 border border-primary-200 rounded-lg cursor-pointer hover:border-primary-400 transition-colors text-sm text-primary-500 truncate hover:bg-primary-100"
                                        >
                                            <Upload className="w-4 h-4" />
                                            {formData.image ? 'File Selected' : 'Choose File'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {imagePreview && (
                                <div className="h-40 bg-primary-50 rounded-lg border border-primary-200 overflow-hidden relative group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-primary-500 mb-1.5 uppercase tracking-wide">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full bg-primary-50 border border-primary-200 rounded-lg px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors resize-none text-primary-900 placeholder:text-primary-400"
                                    placeholder="Project details..."
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 text-sm font-medium text-primary-500 hover:text-primary-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20"
                                >
                                    {submitting ? 'Saving...' : 'Save Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modals */}
            {(deleteConfirm || deleteCategoryConfirm) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white border border-primary-200 w-full max-w-sm rounded-xl p-6 text-center shadow-2xl animate-scale-in">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
                        <h3 className="font-display font-semibold text-lg mb-2 text-primary-900">Are you sure?</h3>
                        <p className="text-primary-500 text-sm mb-6">
                            {deleteConfirm
                                ? `Usually this action cannot be undone. Delete "${deleteConfirm.title}"?`
                                : `Delete category "${deleteCategoryConfirm?.name}"? Projects in this category might be affected.`
                            }
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => { setDeleteConfirm(null); setDeleteCategoryConfirm(null); }}
                                className="px-5 py-2 bg-primary-100 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteConfirm ? handleDeleteProject(deleteConfirm.id) : handleDeleteCategory(deleteCategoryConfirm.id)}
                                className="px-5 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
