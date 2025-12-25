'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchProjects();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/projects`);
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = selectedCategory === 'Semua'
        ? projects
        : projects.filter(p => p.category === selectedCategory);

    return (
        <main className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-primary-950/80 backdrop-blur-lg border-b border-primary-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-auto px-2 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-lg flex items-center justify-center">
                            <span className="text-primary-950 font-display font-bold text-xl">AIDY</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="/" className="text-primary-200 hover:text-accent transition-colors">Portfolio</a>
                        <a href="/admin" className="btn-secondary text-sm py-2 px-4">Admin</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-display font-semibold mb-6 animate-fade-in">
                        <span className="text-gradient">Architecture</span>
                        <br />
                        <span className="text-primary-200">Portfolio</span>
                    </h1>
                    <p className="text-primary-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-slide-up">
                        Koleksi proyek arsitektur terbaik kami. Dari desain perumahan minimalis
                        hingga ruang komersial yang memukau.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => setSelectedCategory('Semua')}
                            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === 'Semua'
                                ? 'bg-accent text-primary-950'
                                : 'bg-primary-800/50 text-primary-300 hover:bg-primary-700/50'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === cat.name
                                    ? 'bg-accent text-primary-950'
                                    : 'bg-primary-800/50 text-primary-300 hover:bg-primary-700/50'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>


            {/* Gallery Grid */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🏗️</div>
                            <p className="text-primary-400 text-lg">Belum ada proyek dalam kategori ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className="card card-hover cursor-pointer group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        {project.image_url ? (
                                            <img
                                                src={project.image_url.startsWith('http') ? project.image_url : `http://localhost:5000${project.image_url}`}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary-800 flex items-center justify-center">
                                                <span className="text-6xl">🏛️</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent opacity-60"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full mb-2">
                                                {project.category}
                                            </span>
                                            <h3 className="text-xl font-display font-medium text-white">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-primary-800 py-8 px-6">
                <div className="max-w-7xl mx-auto text-center text-primary-500">
                    <p>&copy; 2025 AIDY Architecture. All rights reserved.</p>
                </div>
            </footer>

            {/* Project Detail Modal */}
            {selectedProject && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="modal-content max-w-3xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="aspect-video relative">
                            {selectedProject.image_url ? (
                                <img
                                    src={selectedProject.image_url.startsWith('http') ? selectedProject.image_url : `http://localhost:5000${selectedProject.image_url}`}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary-800 flex items-center justify-center">
                                    <span className="text-8xl">🏛️</span>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-3">
                                {selectedProject.category}
                            </span>
                            <h2 className="text-2xl font-display font-semibold mb-4">
                                {selectedProject.title}
                            </h2>
                            <p className="text-primary-400 leading-relaxed">
                                {selectedProject.description || 'Deskripsi belum tersedia.'}
                            </p>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="mt-6 btn-secondary w-full"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
