'use client';

import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { ProjectContext } from '../../context/ProjectContext';
import ProjectCard from '../../components/projects/ProjectCard';

export default function Home() {
  const { projects, loading, getProjects } = useContext(ProjectContext);

  useEffect(() => {
    getProjects();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-primary-50 rounded-xl p-8 mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary-800 mb-4">Fund Ideas That Matter</h1>
        <p className="text-xl text-secondary-900 mb-6">Support creative projects and help bring them to life</p>
        <Link
          href="/projects/create"
          className="btn bg-red-500 text-lg px-8 py-3"
        >
          Start a Project
        </Link>
      </div>

      {/* Projects Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-secondary-400 mb-6">Featured Projects</h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-secondary-400">No projects found. Be the first to create one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-secondary-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-block px-5 py-[10px] bg-primary-200 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary-900">Start a Project</h3>
            <p className="text-secondary-900">Create your project and set a funding goal</p>
          </div>
          <div className="text-center">
            <div className="inline-block px-5 py-[10px] bg-primary-200 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary-900">Share</h3>
            <p className="text-secondary-900">Spread the word about your project</p>
          </div>
          <div className="text-center">
            <div className="inline-block px-5 py-[10px] bg-primary-200 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary-900">Fund</h3>
            <p className="text-secondary-900">Get funded and bring your project to life</p>
          </div>
        </div>
      </div>
    </div>
  );
}
