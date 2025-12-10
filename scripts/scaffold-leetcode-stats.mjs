
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';
const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME || "AdilMunawar";

const leetcodeQuery = `
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
        submissions
      }
    }
  }
  userContestRanking(username: $username) {
    ranking
  }
}
`;

async function fetchLeetCodeStats() {
    console.log(`Fetching LeetCode stats for user: ${LEETCODE_USERNAME}...`);

    try {
        const response = await fetch(LEETCODE_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': `https://leetcode.com/${LEETCODE_USERNAME}`
            },
            body: JSON.stringify({
                query: leetcodeQuery,
                variables: {
                    username: LEETCODE_USERNAME,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch LeetCode data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.errors) {
            throw new Error(`GraphQL Errors: ${JSON.stringify(data.errors)}`);
        }

        const stats = data.data;

        const totalSolved = stats.matchedUser.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'All').count;
        const totalSubmissions = stats.matchedUser.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'All').submissions;
        const totalQuestions = stats.allQuestionsCount.find(d => d.difficulty === 'All').count;

        const formattedStats = {
            totalSolved,
            totalQuestions,
            acceptanceRate: (totalSolved / totalSubmissions) * 100,
            ranking: stats.userContestRanking?.ranking ?? 0,
            easy: {
                total: stats.allQuestionsCount.find(d => d.difficulty === 'Easy').count,
                solved: stats.matchedUser.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Easy').count,
            },
            medium: {
                total: stats.allQuestionsCount.find(d => d.difficulty === 'Medium').count,
                solved: stats.matchedUser.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Medium').count,
            },
            hard: {
                total: stats.allQuestionsCount.find(d => d.difficulty === 'Hard').count,
                solved: stats.matchedUser.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Hard').count,
            },
        };
        
        console.log('Successfully fetched and processed LeetCode stats.');
        return formattedStats;

    } catch (error) {
        console.error('Error fetching LeetCode stats:', error);
        return null;
    }
}


async function main() {
    const stats = await fetchLeetCodeStats();
    if (stats) {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'leetcode-stats.json');
        try {
            await fs.writeFile(filePath, JSON.stringify(stats, null, 2));
            console.log(`LeetCode stats successfully saved to ${filePath}`);
        } catch (error) {
            console.error(`Error writing to file ${filePath}:`, error);
        }
    } else {
        console.log('Skipping file write due to fetch error.');
    }
}

main();
