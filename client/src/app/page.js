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
                        <div className="w-auto px-2 h-10  rounded-lg flex items-center justify-center">
                            <span className="text-accent font-display font-bold text-xl">MNARS</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="/" className="text-primary-200 hover:text-accent transition-colors">Portfolio</a>
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
                        Saya merupakan mahasiswa dari Universitas Negeri Semarang jurusan S1 Arsitektur
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
                                        {(() => {
                                            const url = project.image_url;
                                            if (!url) {
                                                return (
                                                    <div className="w-full h-full bg-primary-800 flex items-center justify-center">
                                                        <span className="text-6xl">🏛️</span>
                                                    </div>
                                                );
                                            }

                                            const isVideo = url.match(/\.(mp4|webm|mov)$/i);
                                            const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;

                                            // Ensure we get a static image for the card
                                            const displayUrl = isVideo
                                                ? fullUrl.replace(/\.(mp4|webm|mov)$/i, '.jpg')
                                                : fullUrl;

                                            return (
                                                <>
                                                    <img
                                                        src={displayUrl}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        onError={(e) => {
                                                            // Fallback if video thumbnail generation fails
                                                            e.target.onerror = null;
                                                            if (isVideo) {
                                                                // Show video player as last resort or placeholder
                                                                e.target.style.display = 'none';
                                                                e.target.parentNode.classList.add('bg-black');
                                                            }
                                                        }}
                                                    />
                                                    {isVideo && (
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                            <div className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                                                                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
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
                    <p>&copy; 2025 <span className="text-accent">MNARS</span> Architecture. All rights reserved.</p>
                </div>
            </footer>

            {/* Project Detail Modal */}
            {selectedProject && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="modal-content max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ProjectCarousel project={selectedProject} onClose={() => setSelectedProject(null)} />
                    </div>
                </div>
            )}
        </main>
    );
}

function ProjectCarousel({ project, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Parse media
    const mediaList = project.media
        ? (typeof project.media === 'string' ? JSON.parse(project.media) : project.media)
        : (project.image_url ? [project.image_url] : []);

    const hasMedia = mediaList.length > 0;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    };

    // Auto-detect type based on extension (simple check)
    const isVideo = (url) => url.match(/\.(mp4|webm|mov)$/i);

    return (
        <div>
            <div className="aspect-video relative bg-black group">
                {hasMedia ? (
                    (() => {
                        const url = mediaList[currentIndex];
                        const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
                        return isVideo(url) ? (
                            <video
                                src={fullUrl}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                            />
                        ) : (
                            <img
                                src={fullUrl}
                                alt={project.title}
                                className="w-full h-full object-contain"
                            />
                        );
                    })()
                ) : (
                    <div className="w-full h-full bg-primary-800 flex items-center justify-center">
                        <span className="text-8xl">🏛️</span>
                    </div>
                )}

                {/* Navigation Buttons */}
                {mediaList.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            ←
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            →
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {mediaList.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-3">
                            {project.category}
                        </span>
                        <h2 className="text-2xl font-display font-semibold">
                            {project.title}
                        </h2>
                    </div>
                    {/* Close button (top right of content, typically users look for x) */}
                </div>

                <p className="text-primary-400 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {project.description || 'Deskripsi belum tersedia.'}
                </p>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary-800 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
