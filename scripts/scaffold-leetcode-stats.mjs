import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

const GITHUB_STATS_FILE = path.join(process.cwd(), 'src', 'lib', 'leetcode-stats.json');

const GET_USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
`;

const fetchLeetCodeData = async (query, variables) => {
  try {
    const response = await fetch(LEETCODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${variables.username}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error fetching LeetCode data: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch LeetCode data. Status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.errors) {
        console.error("GraphQL Errors:", data.errors);
        throw new Error("Error in GraphQL response from LeetCode API.");
    }
    return data;
  } catch (error) {
    console.error('An error occurred during fetch:', error);
    throw error;
  }
};

async function getLeetCodeStats(username) {
  if (!username) {
    throw new Error("LeetCode username is not provided in environment variables.");
  }

  const variables = { username };
  const data = await fetchLeetCodeData(GET_USER_PROFILE_QUERY, variables);

  const user = data.data.matchedUser;
  if (!user) {
    throw new Error(`User with username '${username}' not found on LeetCode.`);
  }

  const allQuestions = data.data.allQuestionsCount;
  const totalQuestions = allQuestions.find(q => q.difficulty === 'All')?.count || 0;

  const totalSolved = user.submitStats.acSubmissionNum.find(s => s.difficulty === 'All')?.count || 0;
  
  const totalSubmissions = user.submitStats.totalSubmissionNum.find(s => s.difficulty === 'All')?.submissions || 0;
  const acSubmissions = user.submitStats.acSubmissionNum.find(s => s.difficulty === 'All')?.submissions || 0;
  
  const acceptanceRate = totalSubmissions > 0 ? (acSubmissions / totalSubmissions) * 100 : 0;
  
  const ranking = user.profile.ranking || 0;

  const easy = {
    total: allQuestions.find(q => q.difficulty === 'Easy')?.count || 0,
    solved: user.submitStats.acSubmissionNum.find(s => s.difficulty === 'Easy')?.count || 0
  };

  const medium = {
    total: allQuestions.find(q => q.difficulty === 'Medium')?.count || 0,
    solved: user.submitStats.acSubmissionNum.find(s => s.difficulty === 'Medium')?.count || 0
  };

  const hard = {
    total: allQuestions.find(q => q.difficulty === 'Hard')?.count || 0,
    solved: user.submitStats.acSubmissionNum.find(s => s.difficulty === 'Hard')?.count || 0
  };

  return {
    totalSolved,
    totalQuestions,
    acceptanceRate,
    ranking,
    easy,
    medium,
    hard
  };
}

async function main() {
  try {
    console.log('Fetching LeetCode stats...');
    const stats = await getLeetCodeStats(process.env.LEETCODE_USERNAME);
    
    console.log('Successfully fetched stats:', JSON.stringify(stats, null, 2));

    await fs.writeFile(GITHUB_STATS_FILE, JSON.stringify(stats, null, 2));
    console.log(`Successfully wrote LeetCode stats to ${GITHUB_STATS_FILE}`);

  } catch (error) {
    console.error('Error updating LeetCode stats:', error.message);
    process.exit(1); // Exit with error code to fail the GitHub Action
  }
}

main();
