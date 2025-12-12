import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GH_USERNAME = process.env.GH_USERNAME;
const GH_PAT = process.env.GH_PAT; // Ensure this is set in your GitHub Actions secrets
const OUTPUT_PATH = path.join(__dirname, '../src/lib/github-contributions.json');

const fetchAllTimeContributions = async () => {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionYears
          }
        }
      }
    `;

    const contributionsByYear = {};
    let totalContributions = 0;

    const userResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${GH_PAT}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: { username: GH_USERNAME },
        }),
    });

    if (!userResponse.ok) {
        throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const years = userData.data.user.contributionsCollection.contributionYears;

    for (const year of years) {
        const yearQuery = `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                }
              }
            }
          }
        `;
        const from = new Date(year, 0, 1).toISOString();
        const to = new Date(year, 11, 31).toISOString();

        const yearResponse = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GH_PAT}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: yearQuery,
                variables: { username: GH_USERNAME, from, to },
            }),
        });

        if (!yearResponse.ok) {
            console.warn(`Failed to fetch contributions for year ${year}: ${yearResponse.statusText}`);
            continue;
        }

        const yearData = await yearResponse.json();
        const yearlyContributions = yearData.data.user.contributionsCollection.contributionCalendar.totalContributions;
        contributionsByYear[year] = yearlyContributions;
        totalContributions += yearlyContributions;
    }

    return totalContributions;
};


const fetchLastYearContributions = async () => {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
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
      Authorization: `Bearer ${GH_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username: GH_USERNAME },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  const calendar = data.data.user.contributionsCollection.contributionCalendar;

  const contributions = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: mapContributionLevel(day.contributionLevel),
    }))
  );

  return { contributions };
};

const mapContributionLevel = (level) => {
  switch (level) {
    case 'FIRST_QUARTILE': return 1;
    case 'SECOND_QUARTILE': return 2;
    case 'THIRD_QUARTILE': return 3;
    case 'FOURTH_QUARTILE': return 4;
    case 'NONE':
    default: return 0;
  }
};

const run = async () => {
  if (!GH_USERNAME || !GH_PAT) {
    throw new Error('GH_USERNAME and GH_PAT environment variables are required.');
  }

  try {
    console.log('Fetching all-time GitHub contributions...');
    const totalContributions = await fetchAllTimeContributions();

    console.log('Fetching last year GitHub contributions...');
    const { contributions } = await fetchLastYearContributions();

    const stats = {
      totalContributions,
      contributions,
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stats, null, 2));
    console.log(`Successfully wrote GitHub stats to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    process.exit(1);
  }
};

run();
