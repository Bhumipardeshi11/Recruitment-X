import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'GitHub user not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Unable to fetch GitHub projects' },
        { status: response.status }
      );
    }

    const repositories = await response.json();

    const projects = repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      language: repo.language || 'Not specified',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
    }));

    return NextResponse.json({
      username,
      total: projects.length,
      projects,
    });
  } catch (error) {
    console.error('GitHub API error:', error);

    return NextResponse.json(
      { error: 'Something went wrong while fetching GitHub projects' },
      { status: 500 }
    );
  }
}