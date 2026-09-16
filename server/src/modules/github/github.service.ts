import axios from 'axios';
import { prisma } from '../../config/prisma';
import { config } from '../../config';
import { NotFoundError } from '../../middleware/errorHandler';

const GITHUB_API = 'https://api.github.com';
const GITHUB_OAUTH = 'https://github.com';

export class GitHubService {
  // ── OAuth: Generate authorization URL ────────────────────────────────────────
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: config.github.clientId!,
      redirect_uri: config.github.callbackUrl,
      scope: 'read:user user:email repo',
      state,
    });
    return `${GITHUB_OAUTH}/login/oauth/authorize?${params}`;
  }

  // ── OAuth: Exchange code for access token ─────────────────────────────────────
  async exchangeCode(code: string): Promise<{ access_token: string; scope: string; token_type: string }> {
    const response = await axios.post(
      `${GITHUB_OAUTH}/login/oauth/access_token`,
      {
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
        redirect_uri: config.github.callbackUrl,
      },
      { headers: { Accept: 'application/json' } },
    );
    return response.data;
  }

  // ── Fetch GitHub user ─────────────────────────────────────────────────────────
  private async fetchGitHubUser(token: string) {
    const { data } = await axios.get(`${GITHUB_API}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
    });
    return data;
  }

  // ── Fetch repositories ────────────────────────────────────────────────────────
  private async fetchRepos(token: string) {
    const { data } = await axios.get(`${GITHUB_API}/user/repos`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
      params: { per_page: 100, sort: 'updated', type: 'owner' },
    });
    return data;
  }

  // ── Compute language stats from repos ────────────────────────────────────────
  private computeLanguageStats(repos: any[]): { stats: Record<string, number>; top: string[] } {
    const stats: Record<string, number> = {};
    let totalStars = 0;
    let totalForks = 0;

    for (const repo of repos) {
      if (repo.language) {
        stats[repo.language] = (stats[repo.language] ?? 0) + 1;
      }
      totalStars += repo.stargazers_count ?? 0;
      totalForks += repo.forks_count ?? 0;
    }

    const top = Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([lang]) => lang);

    return { stats, top };
  }

  // ── Connect: link GitHub account to user ──────────────────────────────────────
  async connect(userId: string, code: string) {
    const tokenData = await this.exchangeCode(code);
    const ghUser = await this.fetchGitHubUser(tokenData.access_token);
    const repos = await this.fetchRepos(tokenData.access_token);
    const { stats, top } = this.computeLanguageStats(repos);

    const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count ?? 0), 0);
    const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count ?? 0), 0);

    const repoSummary = repos.slice(0, 30).map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      isPrivate: r.private,
      updatedAt: r.updated_at,
    }));

    const profile = await prisma.gitHubProfile.upsert({
      where: { userId },
      create: {
        userId,
        githubId: String(ghUser.id),
        username: ghUser.login,
        displayName: ghUser.name,
        bio: ghUser.bio,
        company: ghUser.company,
        blog: ghUser.blog,
        location: ghUser.location,
        email: ghUser.email,
        avatarUrl: ghUser.avatar_url,
        htmlUrl: ghUser.html_url,
        publicRepos: ghUser.public_repos,
        publicGists: ghUser.public_gists,
        followers: ghUser.followers,
        following: ghUser.following,
        accessToken: tokenData.access_token,
        scope: tokenData.scope,
        syncStatus: 'COMPLETED',
        lastSyncedAt: new Date(),
        repositories: repoSummary,
        languageStats: stats,
        topLanguages: top,
        totalStars,
        totalForks,
      },
      update: {
        username: ghUser.login,
        displayName: ghUser.name,
        bio: ghUser.bio,
        company: ghUser.company,
        blog: ghUser.blog,
        location: ghUser.location,
        email: ghUser.email,
        avatarUrl: ghUser.avatar_url,
        publicRepos: ghUser.public_repos,
        publicGists: ghUser.public_gists,
        followers: ghUser.followers,
        following: ghUser.following,
        accessToken: tokenData.access_token,
        scope: tokenData.scope,
        syncStatus: 'COMPLETED',
        lastSyncedAt: new Date(),
        repositories: repoSummary,
        languageStats: stats,
        topLanguages: top,
        totalStars,
        totalForks,
      },
    });

    return profile;
  }

  // ── Get profile ───────────────────────────────────────────────────────────────
  async getProfile(userId: string) {
    const profile = await prisma.gitHubProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('GitHub account not connected');
    return profile;
  }

  // ── Sync (re-fetch latest data) ───────────────────────────────────────────────
  async sync(userId: string) {
    const profile = await prisma.gitHubProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('GitHub account not connected');

    await prisma.gitHubProfile.update({ where: { userId }, data: { syncStatus: 'SYNCING' } });

    const repos = await this.fetchRepos(profile.accessToken);
    const ghUser = await this.fetchGitHubUser(profile.accessToken);
    const { stats, top } = this.computeLanguageStats(repos);
    const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count ?? 0), 0);
    const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count ?? 0), 0);
    const repoSummary = repos.slice(0, 30).map((r: any) => ({
      id: r.id, name: r.name, description: r.description,
      url: r.html_url, language: r.language, stars: r.stargazers_count,
      forks: r.forks_count, isPrivate: r.private, updatedAt: r.updated_at,
    }));

    return prisma.gitHubProfile.update({
      where: { userId },
      data: {
        displayName: ghUser.name, bio: ghUser.bio,
        publicRepos: ghUser.public_repos, followers: ghUser.followers,
        following: ghUser.following, repositories: repoSummary,
        languageStats: stats, topLanguages: top,
        totalStars, totalForks, syncStatus: 'COMPLETED', lastSyncedAt: new Date(),
      },
    });
  }

  // ── Disconnect ────────────────────────────────────────────────────────────────
  async disconnect(userId: string) {
    await prisma.gitHubProfile.delete({ where: { userId } });
    return { success: true };
  }
}

export const githubService = new GitHubService();
