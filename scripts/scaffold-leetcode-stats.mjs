
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';
const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME || 'AdilMunawar';

const fetchLeetCodeStats = async () => {
    console.log(`Fetching LeetCode stats for user: ${LEETCODE_USERNAME}...`);

    const query = `
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

    const variables = {
        username: LEETCODE_USERNAME
    };

    try {
        const response = await fetch(LEETCODE_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': `https://leetcode.com/${LEETCODE_USERNAME}/`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch LeetCode data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors.map(e => e.message).join(', '));
        }

        const user = data.data.matchedUser;
        const allQuestions = data.data.allQuestionsCount;

        const totalSolved = user.submitStats.acSubmissionNum.find(d => d.difficulty === 'All').count;
        const totalQuestions = allQuestions.find(d => d.difficulty === 'All').count;

        const easy = {
            total: allQuestions.find(d => d.difficulty === 'Easy').count,
            solved: user.submitStats.acSubmissionNum.find(d => d.difficulty === 'Easy').count,
        };
        const medium = {
            total: allQuestions.find(d => d.difficulty === 'Medium').count,
            solved: user.submitStats.acSubmissionNum.find(d => d.difficulty === 'Medium').count,
        };
        const hard = {
            total: allQuestions.find(d => d.difficulty === 'Hard').count,
            solved: user.submitStats.acSubmissionNum.find(d => d.difficulty === 'Hard').count,
        };
        
        const totalSubmissions = user.submitStats.totalSubmissionNum.find(d => d.difficulty === 'All').submissions;
        const acceptanceRate = (totalSolved / totalSubmissions) * 100;


        return {
            totalSolved,
            totalQuestions,
            acceptanceRate,
            ranking: user.profile.ranking,
            easy,
            medium,
            hard,
        };

    } catch (error) {
        throw new Error(`Failed to fetch LeetCode data: ${error.message}`);
    }
};

const main = async () => {
    try {
        const stats = await fetchLeetCodeStats();
        const filePath = path.join(process.cwd(), 'src', 'lib', 'leetcode-stats.json');
        await fs.writeFile(filePath, JSON.stringify(stats, null, 2));
        console.log('Successfully fetched and saved LeetCode stats.');
    } catch (error) {
        console.error('Error fetching LeetCode stats:', error);
        // We will no longer throw an error here, but log it.
        // This prevents the workflow from failing if LeetCode is temporarily down.
        // The commit step will just see no changes and skip.
    }
};

main();
