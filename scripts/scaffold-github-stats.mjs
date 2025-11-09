
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const GITHUB_USERNAME = 'AdilMunawar';
const OUTPUT_FILE_PATH = path.resolve(process.cwd(), 'src/components/GitHubStats.tsx');
const TEMPLATE_FILE_PATH = path.resolve(process.cwd(), 'scripts/templates/GitHubStats.tsx.template');

async function getGitHubContributions() {
  const token = process.env.GH_PAT;
  if (!token) {
    throw new Error('GitHub Personal Access Token (GH_PAT) not found in environment variables.');
  }

  const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        userName: GITHUB_USERNAME,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}\n${errorBody}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`GitHub API returned errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data.user.contributionsCollection.contributionCalendar;
}

function processContributions(calendar) {
  const totalContributions = calendar.totalContributions;
  
  const contributionLevelMap = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };

  const contributions = calendar.weeks.flatMap(week =>
    week.contributionDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: contributionLevelMap[day.contributionLevel] ?? 0,
    }))
  );

  return { totalContributions, contributions };
}

async function main() {
  try {
    console.log('Fetching GitHub contribution data...');
    const calendar = await getGitHubContributions();
    
    console.log('Processing contribution data...');
    const processedData = processContributions(calendar);
    const dataString = JSON.stringify(processedData, null, 2);

    console.log('Reading component template...');
    const template = await fs.readFile(TEMPLATE_FILE_PATH, 'utf-8');
    
    console.log('Injecting data into component...');
    const newComponentContent = template.replace(
      '//__DATA_PLACEHOLDER__',
      `const contributionData = ${dataString};`
    );

    console.log(`Writing updated component to ${OUTPUT_FILE_PATH}...`);
    await fs.writeFile(OUTPUT_FILE_PATH, newComponentContent);

    console.log('Successfully updated GitHubStats.tsx with the latest contribution data.');
  } catch (error) {
    console.error('Error during script execution:', error);
    process.exit(1);
  }
}

main();
