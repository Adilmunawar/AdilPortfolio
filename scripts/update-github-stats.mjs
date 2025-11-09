
import fs from 'fs';
import path from 'path';

const GITHUB_USERNAME = "AdilMunawar";
const GITHUB_PAT = process.env.GH_PAT;

if (!GITHUB_PAT) {
  console.error('Error: GH_PAT environment variable not set.');
  process.exit(1);
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

async function fetchGitHubStats() {
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
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error('GitHub API returned errors:', json.errors);
      throw new Error('Error fetching data from GitHub GraphQL API.');
    }
    
    if (!json.data || !json.data.user) {
        throw new Error('Invalid data structure from GitHub API');
    }

    const { contributionCalendar } = json.data.user.contributionsCollection;

    const contributions = contributionCalendar.weeks.flatMap(
      (week) => week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount,
        level: parseInt(day.contributionLevel.replace('LEVEL_', '')) || 0,
      }))
    );
    
    const totalContributions = contributionCalendar.totalContributions;

    return {
      totalContributions,
      contributions,
    };

  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    process.exit(1);
  }
}

async function main() {
  const stats = await fetchGitHubStats();
  const outputPath = path.resolve(process.cwd(), 'src/lib/github-contributions.json');
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));
    console.log(`Successfully wrote GitHub stats to ${outputPath}`);
  } catch (error) {
    console.error(`Failed to write to ${outputPath}:`, error);
    process.exit(1);
  }
}

main();
