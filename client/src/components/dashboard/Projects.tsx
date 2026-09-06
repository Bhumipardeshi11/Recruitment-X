import { GlobeAltIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  featured: boolean;
}

interface ProjectsProps {
  projects: Project[];
  onAddProject?: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  editable?: boolean;
  maxVisible?: number;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  onAddProject,
  onEditProject,
  onDeleteProject,
  editable = false,
  maxVisible = 3,
}) => {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll || projects.length <= maxVisible ? projects : projects.slice(0, maxVisible);

  if (projects.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
            <GlobeAltIcon className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No projects yet</h3>
          <p className="text-secondary-500 mb-6">Showcase your work and achievements</p>
          {onAddProject && (
            <button onClick={onAddProject} className="btn-primary">
              <PlusIcon className="w-4 h-4" />
              Add Project
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary-100 text-secondary-600">
            <GlobeAltIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Projects</h3>
            <p className="text-sm text-secondary-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {onAddProject && editable && (
          <button onClick={onAddProject} className="btn-primary text-sm">
            <PlusIcon className="w-4 h-4" />
            Add Project
          </button>
        )}
      </div>

      <div className="card-body p-0">
        <div className="divide-y divide-secondary-200">
          {visibleProjects.map((project) => (
            <div key={project.id} className="p-6 hover:bg-secondary-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={clsx(
                    'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                    project.featured ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-400'
                  )}>
                    {project.featured ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <GlobeAltIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <h4 className="font-medium text-secondary-900 truncate">{project.name}</h4>
                      {project.featured && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-secondary-600 line-clamp-2">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 5).map((tech, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-secondary-100 text-secondary-700 rounded">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-2 py-0.5 text-xs bg-secondary-100 text-secondary-500 rounded">
                          +{project.technologies.length - 5} more
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-secondary-500">
                      <span>
                        {project.startDate.toLocaleDateString()} - {project.current ? 'Present' : project.endDate?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:flex-shrink-0">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                      aria-label="View project"
                    >
                      <GlobeAltIcon className="w-5 h-5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                      aria-label="View code"
                    >
                      <CodeBracketIcon className="w-5 h-5" />
                    </a>
                  )}
                  {editable && onEditProject && (
                    <button
                      onClick={() => onEditProject(project)}
                      className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                      aria-label="Edit project"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                  {editable && onDeleteProject && (
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-error-600 transition-colors"
                      aria-label="Delete project"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {projects.length > maxVisible && !showAll && (
            <div className="p-6 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center gap-1 mx-auto"
              >
                Show all {projects.length} projects
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {showAll && projects.length > maxVisible && (
            <div className="p-6 text-center">
              <button
                onClick={() => setShowAll(false)}
                className="text-secondary-600 hover:text-secondary-700 font-medium text-sm flex items-center justify-center gap-1 mx-auto"
              >
                Show less
                <ChevronUpIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';