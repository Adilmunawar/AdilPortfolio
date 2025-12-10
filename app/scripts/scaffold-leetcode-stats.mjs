import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql/';
const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME || 'AdilMunawar';

const query = `
  query userProfilePublicProfile($username: String!) {
    userProfilePublicProfile(username: $username) {
      username
      profile {
        ranking
        userAvatar
        realName
        aboutMe
        school
        countryName
        company
        jobTitle
        skillTags
        reputation
        postNum
        solutionNum
        contestRanking {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
      }
      submissionProgress {
        totalSubmissions
        waSubmissions
        acSubmissions
        reSubmissions
        questionTotal
        questionSolved
      }
    }
    userProblemsSolved: userProfileUserQuestionProgress(username: $username) {
      numAcceptedQuestions {
        count
        difficulty
      }
      numFailedQuestions {
        count
        difficulty
      }
      numUntouchedQuestions {
        count
        difficulty
      }
    }
    allQuestions: allQuestionsCount {
      difficulty
      count
    }
  }
`;

async function fetchLeetCodeStats() {
  try {
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${LEETCODE_USERNAME}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      },
      body: JSON.stringify({
        query,
        variables: { username: LEETCODE_USERNAME },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch LeetCode data: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const { data } = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL Errors: ${JSON.stringify(data.errors)}`);
    }

    if (!data.userProfilePublicProfile) {
        console.error("No profile data found for user:", LEETCODE_USERNAME);
        return;
    }

    const allQuestions = data.allQuestions.reduce((acc, q) => {
        acc[q.difficulty.toLowerCase()] = q.count;
        return acc;
    }, {});
    
    const solvedQuestions = data.userProblemsSolved.numAcceptedQuestions.reduce((acc, q) => {
        acc[q.difficulty.toLowerCase()] = q.count;
        return acc;
    }, {});
    
    const totalSolved = data.userProfilePublicProfile.submissionProgress.questionSolved;
    const totalSubmissions = data.userProfilePublicProfile.submissionProgress.totalSubmissions;
    const acSubmissions = data.userProfilePublicProfile.submissionProgress.acSubmissions;
    
    const stats = {
      totalSolved,
      totalQuestions: data.userProfilePublicProfile.submissionProgress.questionTotal,
      acceptanceRate: (acSubmissions / totalSubmissions) * 100,
      ranking: data.userProfilePublicProfile.profile.ranking,
      easy: {
        total: allQuestions.easy,
        solved: solvedQuestions.easy || 0,
      },
      medium: {
        total: allQuestions.medium,
        solved: solvedQuestions.medium || 0,
      },
      hard: {
        total: allQuestions.hard,
        solved: solvedQuestions.hard || 0,
      }
    };
    
    const filePath = path.join(process.cwd(), 'src', 'lib', 'leetcode-stats.json');
    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2));

    console.log('Successfully fetched and saved LeetCode stats.');

  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    process.exit(1);
  }
}

fetchLeetCodeStats();
