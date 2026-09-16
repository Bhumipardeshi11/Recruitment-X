import { CodeBracketIcon, ServerStackIcon, FireIcon, UserGroupIcon, ArrowPathIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  contributionsThisYear: number;
  longestStreak: number;
  currentStreak: number;
}

interface LanguageStats {
  language: string;
  percentage: number;
  color: string;
  bytes: number;
}

interface TopRepo {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  updatedAt: Date;
}

interface GitHubInsightsProps {
  stats?: GitHubStats;
  languages?: LanguageStats[];
  topRepos?: TopRepo[];
  isLoading?: boolean;
  onSync?: () => void;
  lastSynced?: Date;
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
};

export const GitHubInsights: React.FC<GitHubInsightsProps> = ({
  stats,
  languages = [],
  topRepos = [],
  isLoading = false,
  onSync,
  lastSynced,
}) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary-100 text-secondary-600">
                <CodeBracketIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">GitHub Insights</h3>
                <p className="text-sm text-secondary-500">Your coding activity and repositories</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-secondary-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
            <CodeBracketIcon className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Connect GitHub</h3>
          <p className="text-secondary-500 mb-6">Sync your GitHub account to see insights</p>
          {onSync && (
            <button onClick={onSync} className="btn-primary">
              <ArrowPathIcon className="w-4 h-4" />
              Connect GitHub
            </button>
          )}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Repositories', value: stats.totalRepos, icon: ServerStackIcon, color: 'primary' as const },
    { label: 'Stars', value: stats.totalStars, icon: FireIcon, color: 'warning' as const },
    { label: 'Forks', value: stats.totalForks, icon: ArrowPathIcon, color: 'secondary' as const },
    { label: 'Followers', value: stats.followers, icon: UserGroupIcon, color: 'success' as const },
  ];

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary-100 text-secondary-600">
            <CodeBracketIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">GitHub Insights</h3>
            <p className="text-sm text-secondary-500">Your coding activity and repositories</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastSynced && (
            <span className="text-xs text-secondary-500">
              Synced {lastSynced.toLocaleDateString()}
            </span>
          )}
          {onSync && (
            <button onClick={onSync} className="btn-outline text-sm gap-1.5">
              <ArrowPathIcon className="w-4 h-4" />
              Sync
            </button>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-secondary-900">{stat.value.toLocaleString()}</p>
                </div>
                <div className={clsx('p-3 rounded-xl', `bg-${stat.color}-100 text-${stat.color}-600`)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h4 className="font-medium text-secondary-900 mb-4 flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-warning-500" />
              Contribution Streaks
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-success-50">
                <p className="text-3xl font-bold text-success-600">{stats.currentStreak}</p>
                <p className="text-sm text-secondary-500">Current Streak</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary-50">
                <p className="text-3xl font-bold text-primary-600">{stats.longestStreak}</p>
                <p className="text-sm text-secondary-500">Longest Streak</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-secondary-50">
              <p className="text-3xl font-bold text-secondary-900">{stats.contributionsThisYear.toLocaleString()}</p>
              <p className="text-sm text-secondary-500">Contributions This Year</p>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-medium text-secondary-900 mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-primary-500" />
              Top Languages
            </h4>
            <div className="space-y-3">
              {languages.slice(0, 8).map((lang, index) => (
                <div key={lang.language} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: languageColors[lang.language] || '#6366f1' }}
                      />
                      <span className="text-sm font-medium text-secondary-900">{lang.language}</span>
                    </div>
                    <span className="text-sm font-semibold text-secondary-700">{lang.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: languageColors[lang.language] || '#6366f1',
                      }}
                    />
                  </div>
                </div>
              ))}
              {languages.length > 8 && (
                <p className="text-sm text-secondary-500 text-center">
                  +{languages.length - 8} more languages
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="font-medium text-secondary-900 mb-4 flex items-center gap-2">
            <ServerStackIcon className="w-5 h-5 text-secondary-500" />
            Top Repositories
          </h4>
          <div className="space-y-3">
            {topRepos.slice(0, 5).map((repo, index) => (
              <div key={repo.name} className="p-4 rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-medium text-secondary-900 hover:text-primary-600">
                        {repo.name}
                      </a>
                      {repo.language && (
                        <span
                          className="px-2 py-0.5 text-xs rounded bg-secondary-100 text-secondary-700"
                          style={{ backgroundColor: `${languageColors[repo.language] || '#6366f1'}20`, color: languageColors[repo.language] || '#6366f1' }}
                        >
                          {repo.language}
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="mt-1 text-sm text-secondary-500 truncate">{repo.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondary-500">
                    <span className="flex items-center gap-1">
                      <FireIcon className="w-4 h-4" />
                      {repo.stars.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowPathIcon className="w-4 h-4" />
                      {repo.forks.toLocaleString()}
                    </span>
                    <span>{repo.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {topRepos.length === 0 && (
              <p className="text-center text-secondary-500 py-4">No repositories yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};