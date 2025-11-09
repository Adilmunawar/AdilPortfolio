
import fs from 'fs';
import fetch from 'node-fetch';

const GITHUB_USERNAME = "AdilMunawar";
const GITHUB_PAT = process.env.GH_PAT;

// The GraphQL query to fetch contribution data
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

/**
 * Maps GitHub's contribution level enum to a number from 0 to 4.
 * @param {string} level - e.g., "NONE", "FIRST_QUARTILE"
 * @returns {number}
 */
function mapLevelToNumber(level) {
  switch (level) {
    case 'NONE':
      return 0;
    case 'FIRST_QUARTILE':
      return 1;
    case 'SECOND_QUARTILE':
      return 2;
    case 'THIRD_QUARTILE':
      return 3;
    case 'FOURTH_QUARTILE':
      return 4;
    default:
      return 0;
  }
}

async function fetchGitHubStats() {
  if (!GITHUB_PAT) {
    throw new Error('GitHub PAT not found in environment variables. Please set the GH_PAT secret.');
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
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

    const textResponse = await response.text();

    if (!response.ok) {
      console.error('GitHub API request failed:', response.status, textResponse);
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const json = JSON.parse(textResponse);

    if (json.errors || !json.data || !json.data.user) {
        console.error('Invalid GitHub API response:', json.errors || 'No data.user found');
        throw new Error('Invalid data structure from GitHub API. Check if the GH_PAT is valid and has the `read:user` scope.');
    }
    
    const { contributionCalendar } = json.data.user.contributionsCollection;
    
    // Flatten the weeks array and map the contribution levels to numbers
    const contributions = contributionCalendar.weeks.flatMap(
      (week) => week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount,
        level: mapLevelToNumber(day.contributionLevel),
      }))
    );
    
    const totalContributions = contributionCalendar.totalContributions;

    const data = {
      totalContributions,
      contributions,
    };

    fs.writeFileSync('src/lib/github-contributions.json', JSON.stringify(data, null, 2));
    console.log('Successfully wrote GitHub stats to src/lib/github-contributions.json');

  } catch (error) {
    console.error('Error in fetchGitHubStats:', error);
    process.exit(1); // Exit with an error code to fail the GitHub Action
  }
}

fetchGitHubStats();
