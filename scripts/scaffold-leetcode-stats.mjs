
import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const leetcodeApiUrl = 'https://leetcode.com/graphql';
const username = process.env.LEETCODE_USERNAME;

if (!username) {
  console.error('LEETCODE_USERNAME environment variable is not set.');
  process.exit(1);
}

const problemsQuery = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        difficulty
      }
    }
  }
`;

const userProfileQuery = `
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
  }
`;

const userContestRankingQuery = `
  query userContestRankingInfo($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
  }
`;

const fetchLeetCodeData = async (query: string, variables: object) => {
  try {
    const response = await fetch(leetcodeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      console.error(await response.text());
      throw new Error(`Failed to fetch data from LeetCode API. Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error('Error in GraphQL response.');
    }
    return data;
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    throw error;
  }
};

const getStats = async () => {
  try {
    console.log('Fetching total question counts...');
    const allProblemsData = await fetchLeetCodeData(problemsQuery, { categorySlug: "all-code-essentials" });
    const totalQuestions = allProblemsData.data.problemsetQuestionList.total;

    console.log('Fetching user profile data...');
    const userProfileData = await fetchLeetCodeData(userProfileQuery, { username });
    
    console.log('Fetching user contest ranking...');
    const contestRankingData = await fetchLeetCodeData(userContestRankingQuery, { username });
    
    const { allQuestionsCount, matchedUser } = userProfileData.data;
    const { userContestRanking } = contestRankingData.data;

    const totalSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'All').count;
    const totalAccepted = matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'All').submissions;
    const totalSubmissions = matchedUser.submitStatsGlobal.acSubmissionNum.reduce((acc: number, s: any) => acc + s.submissions, 0);

    const calculatedAcceptanceRate = totalSubmissions > 0 ? (totalAccepted / totalSubmissions) * 100 : 0;

    const easy = {
      total: allQuestionsCount.find(q => q.difficulty === 'Easy').count,
      solved: matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'Easy').count,
    };
    const medium = {
      total: allQuestionsCount.find(q => q.difficulty === 'Medium').count,
      solved: matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'Medium').count,
    };
    const hard = {
      total: allQuestionsCount.find(q => q.difficulty === 'Hard').count,
      solved: matchedUser.submitStatsGlobal.acSubmissionNum.find(s => s.difficulty === 'Hard').count,
    };

    const stats = {
      totalSolved,
      totalQuestions,
      acceptanceRate: userContestRanking.topPercentage ? (100 - userContestRanking.topPercentage) : calculatedAcceptanceRate,
      ranking: userContestRanking.globalRanking,
      easy,
      medium,
      hard,
    };

    const filePath = join(process.cwd(), 'src', 'lib', 'leetcode-stats.json');
    await writeFile(filePath, JSON.stringify(stats, null, 2));

    console.log('Successfully updated LeetCode stats.');
    console.log(JSON.stringify(stats, null, 2));

  } catch (error) {
    console.error('Failed to update LeetCode stats:', error);
    process.exit(1);
  }
};

getStats();
