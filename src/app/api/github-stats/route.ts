
// File: src/app/api/github-stats/route.ts

import { NextResponse } from 'next/server';

// This configures the route to re-fetch data at most once every 24 hours (86400 seconds).
// This is the automatic daily "trigger".
export const revalidate = 86400; 

interface GitHubContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string; // e.g., "LEVEL_0", "LEVEL_1"
}

interface GitHubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: GitHubContributionDay[];
          }>;
        };
      };
    };
  };
}

export async function GET() {
  const GITHUB_USERNAME = "AdilMunawar";
  const GITHUB_PAT = process.env.GITHUB_PAT; // Securely reads the secret from Vercel

  if (!GITHUB_PAT) {
    console.error('GitHub PAT not configured in environment variables.');
    return NextResponse.json({ error: 'GitHub PAT not configured' }, { status: 500 });
  }

  const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${GITHUB_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          userName: GITHUB_USERNAME,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('GitHub API request failed:', res.status, errorText);
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const json: GitHubGraphQLResponse = await res.json();

    if (!json.data || !json.data.user) {
      console.error('Invalid GitHub API response:', json);
      throw new Error('Invalid data structure from GitHub API');
    }

    const { contributionCalendar } = json.data.user.contributionsCollection;
    
    // Flatten the weeks array into a single array of contribution days
    const contributions = contributionCalendar.weeks.flatMap(
      (week) => week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount,
        // Map GitHub's enum (e.g., "LEVEL_1") to a number (e.g., 1)
        level: parseInt(day.contributionLevel.replace('LEVEL_', '')) || 0,
      }))
    );
    
    const totalContributions = contributionCalendar.totalContributions;

    // Return the processed data
    return NextResponse.json({
      totalContributions,
      contributions,
    });

  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub stats' }, { status: 500 });
  }
}
