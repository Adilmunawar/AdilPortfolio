
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
  data?: {
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
  errors?: Array<{ message: string }>;
  message?: string;
}

export async function GET() {
  const GITHUB_USERNAME = "AdilMunawar";
  const GITHUB_PAT = process.env.GH_PAT; // Securely reads the secret from Vercel

  if (!GITHUB_PAT) {
    console.error('GitHub PAT not configured in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: GH_PAT is not set.' }, { status: 500 });
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
    
    const text = await res.text();
    let json: GitHubGraphQLResponse;

    try {
        json = JSON.parse(text);
    } catch(e) {
        console.error('Failed to parse GitHub API response as JSON:', text);
        return NextResponse.json({ error: "The GitHub API returned an invalid response. This may be due to an invalid Personal Access Token (GH_PAT)." }, { status: 500 });
    }

    if (!res.ok || json.errors) {
      console.error('GitHub API request failed:', json.errors || json.message);
      const errorMessage = json.errors?.[0]?.message || json.message || `GitHub API responded with ${res.status}`;
      return NextResponse.json({ error: `GitHub API Error: ${errorMessage}` }, { status: 500 });
    }

    if (!json.data || !json.data.user) {
      console.error('Invalid data structure from GitHub API:', json);
      return NextResponse.json({ error: 'Invalid data structure from GitHub API' }, { status: 500 });
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching GitHub stats:', errorMessage);
    return NextResponse.json({ error: `Failed to fetch GitHub stats: ${errorMessage}` }, { status: 500 });
  }
}
