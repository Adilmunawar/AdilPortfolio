
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';
const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME || 'AdilMunawar';

const STATS_QUERY = `
  query userProblemsSolved($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      problemsSolvedBeatsStats {
        difficulty
        percentage
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

const PROFILE_QUERY = `
    query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
            profile {
                ranking
            }
            submissionCalendar
        }
    }
`;

async function fetchLeetCodeStats() {
  try {
    const statsResponse = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/', 
      },
      body: JSON.stringify({
        query: STATS_QUERY,
        variables: { username: LEETCODE_USERNAME },
      }),
    });

    if (!statsResponse.ok) {
      throw new Error(`Failed to fetch stats: ${statsResponse.statusText}`);
    }

    const statsData = await statsResponse.json();

    const profileResponse = await fetch(LEETCODE_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com/',
        },
        body: JSON.stringify({
            query: PROFILE_QUERY,
            variables: { username: LEETCODE_USERNAME },
        }),
    });

    if (!profileResponse.ok) {
        throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
    }
    
    const profileData = await profileResponse.json();

    if (statsData.errors || profileData.errors) {
        throw new Error('Error in LeetCode API response:', statsData.errors || profileData.errors);
    }
    
    const { allQuestionsCount, matchedUser } = statsData.data;
    const { submitStatsGlobal } = matchedUser;
    
    const totalSolved = submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'All').count;
    const totalQuestions = allQuestionsCount.find(d => d.difficulty === 'All').count;

    const easySolved = submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Easy').count;
    const mediumSolved = submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Medium').count;
    const hardSolved = submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Hard').count;

    const totalEasy = allQuestionsCount.find(d => d.difficulty === 'Easy').count;
    const totalMedium = allQuestionsCount.find(d => d.difficulty === 'Medium').count;
    const totalHard = allQuestionsCount.find(d => d.difficulty === 'Hard').count;

    const acceptanceRate = (totalSolved / (profileData.data.matchedUser.submissionCalendar ? (Object.values(JSON.parse(profileData.data.matchedUser.submissionCalendar)).reduce((a, b) => a + b, 0)) : 1)) * 100;
    
    return {
      totalSolved,
      totalQuestions,
      acceptanceRate: isNaN(acceptanceRate) ? 0 : acceptanceRate,
      ranking: profileData.data.matchedUser.profile.ranking || 0,
      easy: { total: totalEasy, solved: easySolved },
      medium: { total: totalMedium, solved: mediumSolved },
      hard: { total: totalHard, solved: hardSolved },
    };

  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    // Return a default structure on error to avoid breaking the site
    return {
      totalSolved: 0,
      totalQuestions: 0,
      acceptanceRate: 0,
      ranking: 0,
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 },
    };
  }
}

async function main() {
  const stats = await fetchLeetCodeStats();
  const filePath = path.join(process.cwd(), 'src', 'lib', 'leetcode-stats.json');
  await fs.writeFile(filePath, JSON.stringify(stats, null, 2));
  console.log('Successfully updated LeetCode stats.');
}

main();
