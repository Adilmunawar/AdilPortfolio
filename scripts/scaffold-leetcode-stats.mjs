
import fetch from 'node-fetch';
import fs from 'fs/promises';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';
const USERNAME = process.env.LEETCODE_USERNAME || 'AdilMunawar';

const query = `
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
      profile {
        ranking
        userAvatar
      }
    }
  }
`;

const fetchLeetCodeStats = async () => {
  try {
    console.log(`Fetching LeetCode stats for user: ${USERNAME}`);
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      },
      body: JSON.stringify({
        query: query,
        variables: {
          username: USERNAME,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch LeetCode data: ${response.statusText}. Body: ${errorBody}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error('Error fetching LeetCode stats due to GraphQL errors.');
    }
    
    const { allQuestionsCount, matchedUser } = data.data;

    const totalQuestions = allQuestionsCount.find(q => q.difficulty === 'All')?.count || 0;
    const totalSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'All')?.count || 0;

    const easy = {
      total: allQuestionsCount.find(q => q.difficulty === 'Easy')?.count || 0,
      solved: matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'Easy')?.count || 0,
    };
    const medium = {
      total: allQuestionsCount.find(q => q.difficulty === 'Medium')?.count || 0,
      solved: matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'Medium')?.count || 0,
    };
    const hard = {
      total: allQuestionsCount.find(q => q.difficulty === 'Hard')?.count || 0,
      solved: matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'Hard')?.count || 0,
    };

    const acceptanceRate = (totalSolved / (matchedUser.submitStatsGlobal.acSubmissionNum.reduce((acc, curr) => acc + curr.count, 0) || 1)) * 100;
    
    // Recalculating acceptance rate based on total solved submissions vs total submissions
    const totalSubmissions = matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === "All")?.submissions;
    const totalAccepted = matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === "All")?.count;

    const calculatedAcceptanceRate = (totalAccepted / totalSubmissions) * 100 if totalSubmissions > 0 else 0;
    
    const ranking = matchedUser.profile.ranking;

    const stats = {
      totalSolved,
      totalQuestions,
      acceptanceRate: (totalSolved / (matchedUser.submitStatsGlobal.acSubmissionNum[0].submissions || 1)) * 100, // This is a more direct calculation if available
      ranking,
      easy,
      medium,
      hard,
    };

    const totalSubmissionsAll = matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'All')?.submissions || 1;
    stats.acceptanceRate = (stats.totalSolved / totalSubmissionsAll) * 100;
    
    const finalStats = {
        totalSolved: stats.totalSolved,
        totalQuestions: stats.totalQuestions,
        acceptanceRate: (matchedUser.submitStatsGlobal.acSubmissionNum[0].count / matchedUser.submitStatsGlobal.acSubmissionNum[0].submissions) * 100,
        ranking: stats.ranking,
        easy: stats.easy,
        medium: stats.medium,
        hard: stats.hard
    }


    await fs.writeFile('src/lib/leetcode-stats.json', JSON.stringify(finalStats, null, 2));
    console.log('Successfully updated LeetCode stats.');

  } catch (error) {
    console.error('Error fetching or writing LeetCode stats:', error);
    process.exit(1);
  }
};

fetchLeetCodeStats();
