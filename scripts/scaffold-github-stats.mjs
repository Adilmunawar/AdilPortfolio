
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
const GITHUB_USERNAME = process.env.GH_USERNAME;
const GITHUB_TOKEN = process.env.GH_PAT;
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'lib', 'github-contributions.json');

// --- GraphQL Query ---
// This query now fetches the total contribution count across all years,
// as well as the detailed calendar for the last year.
const GITHUB_GRAPHQL_QUERY = `
  query($userName:String!) {
    user(login: $userName) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
              color
            }
          }
        }
      }
    }
  }
`;

// --- Helper Functions ---

/**
 * Fetches contribution data from the GitHub GraphQL API.
 * @returns {Promise<any>} The user's contribution data.
 */
async function fetchContributionData() {
  if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
    throw new Error('Missing GitHub username or token in environment variables.');
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GITHUB_GRAPHQL_QUERY,
      variables: { userName: GITHUB_USERNAME },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API request failed with status ${response.status}: ${errorBody}`);
  }

  return response.json();
}

/**
 * Maps the color from the GitHub API to a numeric level for the UI.
 * @param {string} color - The hex color string from the API.
 * @returns {number} The corresponding level (0-4).
 */
function mapColorToLevel(color) {
  const levelMap = {
    '#ebedf0': 0, // No contributions
    '#9be9a8': 1,
    '#40c463': 2,
    '#30a14e': 3,
    '#216e39': 4,
    // New color scheme from GitHub
    '#161b22': 0, // No contributions
    '#0e4429': 1,
    '#006d32': 2,
    '#26a641': 3,
    '#39d353': 4,
  };
  return levelMap[color.toLowerCase()] ?? 0;
}


/**
 * Transforms the raw API data into the desired JSON structure.
 * @param {any} apiData - The raw data from the GitHub API.
 * @returns {object} The transformed data.
 */
function transformData(apiData) {
  const contributionCalendar = apiData.data.user.contributionsCollection.contributionCalendar;

  if (!contributionCalendar) {
    throw new Error('Could not find contribution calendar in API response.');
  }
  
  const totalContributions = contributionCalendar.totalContributions;

  const contributions = contributionCalendar.weeks.flatMap(week => 
    week.contributionDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: mapColorToLevel(day.color),
    }))
  );

  return { totalContributions, contributions };
}

/**
 * Writes the data to the specified output file.
 * @param {object} data - The data to write.
 */
async function writeDataToFile(data) {
  try {
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote GitHub stats to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
    process.exit(1);
  }
}

// --- Main Execution ---

/**
 * Main function to orchestrate fetching, transforming, and writing the data.
 */
async function main() {
  console.log('Starting GitHub contribution data fetch...');
  try {
    const apiData = await fetchContributionData();
    const transformedData = transformData(apiData);
    await writeDataToFile(transformedData);
    console.log('GitHub contribution data updated successfully.');
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

main();
