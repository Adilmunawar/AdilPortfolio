
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GH_PAT = process.env.GH_PAT;
const USERNAME = process.env.GH_USERNAME;
const OUTPUT_FILE = path.resolve(__dirname, '../src/lib/github-contributions.json');

if (!GH_PAT || !USERNAME) {
  console.error("Missing GH_PAT or GH_USERNAME environment variables.");
  process.exit(1);
}

const fetchContributions = async () => {
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
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${GH_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { userName: USERNAME },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.errors) {
        console.error('GitHub API Errors:', JSON.stringify(data.errors, null, 2));
        throw new Error('GraphQL query returned errors.');
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    const totalContributions = calendar.totalContributions;
    
    const contributions = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: mapLevel(day.contributionLevel),
      }))
    );

    return { totalContributions, contributions };

  } catch (error) {
    console.error('Error fetching contribution data:', error);
    process.exit(1);
  }
};

const mapLevel = (level) => {
  switch (level) {
    case 'FIRST_QUARTILE': return 1;
    case 'SECOND_QUARTILE': return 2;
    case 'THIRD_QUARTILE': return 3;
    case 'FOURTH_QUARTILE': return 4;
    case 'NONE':
    default:
      return 0;
  }
};

const main = async () => {
  console.log(`Fetching GitHub contribution data for ${USERNAME}...`);
  const contributionData = await fetchContributions();
  console.log(`Found ${contributionData.totalContributions} total contributions.`);

  const fileContent = JSON.stringify(contributionData, null, 2);

  try {
    await fs.writeFile(OUTPUT_FILE, fileContent);
    console.log(`Successfully wrote contribution data to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error writing file to ${OUTPUT_FILE}:`, error);
    process.exit(1);
  }
};

main();
