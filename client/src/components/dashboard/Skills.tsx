import { PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ProgressBar } from '../ui/ProgressBar';
import { clsx } from 'clsx';
import { useState } from 'react';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience?: number;
  isTopSkill?: boolean;
}

interface SkillsProps {
  skills: Skill[];
  categories?: string[];
  onAddSkill?: () => void;
  onEditSkill?: (skill: Skill) => void;
  onDeleteSkill?: (skillId: string) => void;
  editable?: boolean;
  grouped?: boolean;
}

const proficiencyLabels = [
  { min: 0, max: 20, label: 'Beginner', color: 'error' as const },
  { min: 21, max: 40, label: 'Basic', color: 'warning' as const },
  { min: 41, max: 60, label: 'Intermediate', color: 'primary' as const },
  { min: 61, max: 80, label: 'Advanced', color: 'success' as const },
  { min: 81, max: 100, label: 'Expert', color: 'success' as const },
];

const getProficiencyInfo = (proficiency: number) => {
  return proficiencyLabels.find(p => proficiency >= p.min && proficiency <= p.max) || proficiencyLabels[0];
};

const categoryIcons: Record<string, string> = {
  'Frontend': '🎨',
  'Backend': '⚙️',
  'Database': '🗄️',
  'DevOps': '☁️',
  'Mobile': '📱',
  'Testing': '🧪',
  'Design': '🎨',
  'Soft Skills': '💬',
  'Other': '📦',
};

export const Skills: React.FC<SkillsProps> = ({
  skills,
  categories = [],
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
  editable = false,
  grouped = true,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'name' | 'proficiency' | 'category'>('proficiency');

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || '📦';
  };

  const groupedSkills = grouped && categories.length > 0
    ? categories.reduce((acc, cat) => {
        acc[cat] = skills.filter(s => s.category === cat);
        return acc;
      }, {} as Record<string, Skill[]>)
    : { 'All Skills': skills };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const sortedSkills = (skillList: Skill[]) => {
    return [...skillList].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'proficiency') return b.proficiency - a.proficiency;
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  };

  if (skills.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
            <span className="text-4xl">🛠️</span>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No skills added yet</h3>
          <p className="text-secondary-500 mb-6">Add your skills to showcase your expertise</p>
          {onAddSkill && (
            <button onClick={onAddSkill} className="btn-primary">
              <PlusIcon className="w-4 h-4" />
              Add Skill
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
            <span className="text-2xl">🛠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Skills</h3>
            <p className="text-sm text-secondary-500">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input text-sm py-1.5 w-auto"
          >
            <option value="proficiency">Sort by Proficiency</option>
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
          </select>
          {onAddSkill && editable && (
            <button onClick={onAddSkill} className="btn-primary text-sm">
              <PlusIcon className="w-4 h-4" />
              Add Skill
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-0">
        <div className="divide-y divide-secondary-200">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => {
            const sorted = sortedSkills(categorySkills);
            const isExpanded = expandedCategories[category] !== false;
            const avgProficiency = sorted.reduce((sum, s) => sum + s.proficiency, 0) / sorted.length;

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <div>
                      <h4 className="font-medium text-secondary-900">{category}</h4>
                      <p className="text-sm text-secondary-500">
                        {sorted.length} skill{sorted.length !== 1 ? 's' : ''} • Avg: {Math.round(avgProficiency)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar
                      value={avgProficiency}
                      width={100}
                      height={6}
                      showLabel
                    />
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-secondary-400" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-secondary-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6 space-y-4 bg-secondary-50/50">
                    {sorted.map((skill) => {
                      const info = getProficiencyInfo(skill.proficiency);
                      return (
                        <div
                          key={skill.id}
                          className={clsx(
                            'p-4 rounded-lg border transition-all',
                            skill.isTopSkill
                              ? 'border-primary-200 bg-primary-50'
                              : 'border-secondary-200 hover:border-primary-300'
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {skill.isTopSkill && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                                  Top Skill
                                </span>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium text-secondary-900 truncate">{skill.name}</h5>
                                  <span
                                    className={clsx(
                                      'px-2 py-0.5 text-xs font-medium rounded-full',
                                      `${info.color}-100 ${info.color}-700`
                                    )}
                                  >
                                    {info.label}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-secondary-500">
                                  {skill.yearsOfExperience !== undefined
                                    ? `${skill.yearsOfExperience} year${skill.yearsOfExperience !== 1 ? 's' : ''} experience`
                                    : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 lg:flex-shrink-0">
                              <div className="hidden lg:block w-32">
                                <ProgressBar
                                  value={skill.proficiency}
                                  height={6}
                                  color={info.color}
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                {editable && onEditSkill && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditSkill(skill);
                                    }}
                                    className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                                    aria-label="Edit skill"
                                  >
                                    <PencilIcon className="w-4 h-4" />
                                  </button>
                                )}
                                {editable && onDeleteSkill && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteSkill(skill.id);
                                    }}
                                    className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-error-600 transition-colors"
                                    aria-label="Delete skill"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="lg:hidden mt-3 pt-3 border-t border-secondary-200">
                            <ProgressBar
                              value={skill.proficiency}
                              height={6}
                              showLabel
                              color={info.color}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};