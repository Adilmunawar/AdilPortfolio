
'use client';
import { Card } from '@/components/ui/card';

// This data is now static and will be updated by a GitHub Action.
const contributionData = {
  "totalContributions": 3371,
  "contributions": [
    {
      "date": "2024-11-10",
      "count": 4,
      "level": 1
    },
    {
      "date": "2024-11-11",
      "count": 8,
      "level": 2
    },
    {
      "date": "2024-11-12",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-11-13",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-11-14",
      "count": 10,
      "level": 2
    },
    {
      "date": "2024-11-15",
      "count": 4,
      "level": 1
    },
    {
      "date": "2024-11-16",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-11-17",
      "count": 3,
      "level": 1
    },
    {
      "date": "2024-11-18",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-11-19",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-11-20",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-11-21",
      "count": 15,
      "level": 3
    },
    {
      "date": "2024-11-22",
      "count": 15,
      "level": 3
    },
    {
      "date": "2024-11-23",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-11-24",
      "count": 9,
      "level": 2
    },
    {
      "date": "2024-11-25",
      "count": 14,
      "level": 3
    },
    {
      "date": "2024-11-26",
      "count": 9,
      "level": 2
    },
    {
      "date": "2024-11-27",
      "count": 11,
      "level": 3
    },
    {
      "date": "2024-11-28",
      "count": 2,
      "level": 1
    },
    {
      "date": "2024-11-29",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-11-30",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-01",
      "count": 15,
      "level": 3
    },
    {
      "date": "2024-12-02",
      "count": 3,
      "level": 1
    },
    {
      "date": "2024-12-03",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-04",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-05",
      "count": 15,
      "level": 3
    },
    {
      "date": "2024-12-06",
      "count": 11,
      "level": 3
    },
    {
      "date": "2024-12-07",
      "count": 1,
      "level": 1
    },
    {
      "date": "2024-12-08",
      "count": 12,
      "level": 3
    },
    {
      "date": "2024-12-09",
      "count": 1,
      "level": 1
    },
    {
      "date": "2024-12-10",
      "count": 8,
      "level": 2
    },
    {
      "date": "2024-12-11",
      "count": 11,
      "level": 3
    },
    {
      "date": "2024-12-12",
      "count": 14,
      "level": 3
    },
    {
      "date": "2024-12-13",
      "count": 9,
      "level": 2
    },
    {
      "date": "2024-12-14",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-15",
      "count": 1,
      "level": 1
    },
    {
      "date": "2024-12-16",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-17",
      "count": 16,
      "level": 4
    },
    {
      "date": "2024-12-18",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-19",
      "count": 19,
      "level": 4
    },
    {
      "date": "2024-12-20",
      "count": 11,
      "level": 3
    },
    {
      "date": "2024-12-21",
      "count": 5,
      "level": 2
    },
    {
      "date": "2024-12-22",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-23",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-24",
      "count": 25,
      "level": 4
    },
    {
      "date": "2024-12-25",
      "count": 14,
      "level": 3
    },
    {
      "date": "2024-12-26",
      "count": 15,
      "level": 3
    },
    {
      "date": "2024-12-27",
      "count": 7,
      "level": 2
    },
    {
      "date": "2024-12-28",
      "count": 3,
      "level": 1
    },
    {
      "date": "2024-12-29",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-12-30",
      "count": 13,
      "level": 3
    },
    {
      "date": "2024-12-31",
      "count": 14,
      "level": 3
    },
    {
      "date": "2025-01-01",
      "count": 13,
      "level": 3
    },
    {
      "date": "2025-01-02",
      "count": 23,
      "level": 4
    },
    {
      "date": "2025-01-03",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-04",
      "count": 16,
      "level": 4
    },
    {
      "date": "2025-01-05",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-06",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-07",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-01-08",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-01-09",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-01-10",
      "count": 18,
      "level": 4
    },
    {
      "date": "2025-01-11",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-12",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-13",
      "count": 16,
      "level": 4
    },
    {
      "date": "2025-01-14",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-15",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-01-16",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-17",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-18",
      "count": 14,
      "level": 3
    },
    {
      "date": "2025-01-19",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-20",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-21",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-01-22",
      "count": 15,
      "level": 3
    },
    {
      "date": "2025-01-23",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-01-24",
      "count": 18,
      "level": 4
    },
    {
      "date": "2025-01-25",
      "count": 24,
      "level": 4
    },
    {
      "date": "2025-01-26",
      "count": 15,
      "level": 3
    },
    {
      "date": "2025-01-27",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-01-28",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-01-29",
      "count": 22,
      "level": 4
    },
    {
      "date": "2025-01-30",
      "count": 18,
      "level": 4
    },
    {
      "date": "2025-01-31",
      "count": 13,
      "level": 3
    },
    {
      "date": "2025-02-01",
      "count": 18,
      "level": 4
    },
    {
      "date": "2025-02-02",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-02-03",
      "count": 15,
      "level": 3
    },
    {
      "date": "2025-02-04",
      "count": 8,
      "level": 2
    },
    {
      "date": "2025-02-05",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-02-06",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-02-07",
      "count": 19,
      "level": 4
    },
    {
      "date": "2025-02-08",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-02-09",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-02-10",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-02-11",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-02-12",
      "count": 12,
      "level": 3
    },
    {
      "date": "2025-02-13",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-02-14",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-02-15",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-02-16",
      "count": 13,
      "level": 3
    },
    {
      "date": "2025-02-17",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-02-18",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-02-19",
      "count": 16,
      "level": 4
    },
    {
      "date": "2025-02-20",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-02-21",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-02-22",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-02-23",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-02-24",
      "count": 13,
      "level": 3
    },
    {
      "date": "2025-02-25",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-02-26",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-02-27",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-02-28",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-03-01",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-03-02",
      "count": 16,
      "level": 4
    },
    {
      "date": "2025-03-03",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-03-04",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-03-05",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-03-06",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-03-07",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-03-08",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-03-09",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-03-10",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-03-11",
      "count": 16,
      "level": 4
    },
    {
      "date": "2025-03-12",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-03-13",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-03-14",
      "count": 8,
      "level": 2
    },
    {
      "date": "2025-03-15",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-03-16",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-03-17",
      "count": 27,
      "level": 4
    },
    {
      "date": "2025-03-18",
      "count": 19,
      "level": 4
    },
    {
      "date": "2025-03-19",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-03-20",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-03-21",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-03-22",
      "count": 3,
      "level": 1
    },
    {
      "date": "2025-03-23",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-03-24",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-03-25",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-03-26",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-03-27",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-03-28",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-03-29",
      "count": 9,
      "level": 2
    },
    {
      "date": "2025-03-30",
      "count": 19,
      "level": 4
    },
    {
      "date": "2025-03-31",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-01",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-04-02",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-03",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-04-04",
      "count": 16,
      "level": 4
    },
    {
      "date": "2025-04-05",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-04-06",
      "count": 19,
      "level": 4
    },
    {
      "date": "2025-04-07",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-04-08",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-04-09",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-04-10",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-04-11",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-04-12",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-04-13",
      "count": 9,
      "level": 2
    },
    {
      "date": "2025-04-14",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-04-15",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-16",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-17",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-18",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-19",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-04-20",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-21",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-22",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-04-23",
      "count": 9,
      "level": 2
    },
    {
      "date": "2025-04-24",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-04-25",
      "count": 18,
      "level": 4
    },
    {
      "date": "2025-04-26",
      "count": 18,
      "level": 4
    },
    {
      "date": "2025-04-27",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-04-28",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-04-29",
      "count": 12,
      "level": 3
    },
    {
      "date": "2025-04-30",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-05-01",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-05-02",
      "count": 16,
      "level": 4
    },
    {
      "date": "2025-05-03",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-05-04",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-05-05",
      "count": 14,
      "level": 3
    },
    {
      "date": "2025-05-06",
      "count": 14,
      "level": 3
    },
    {
      "date": "2025-05-07",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-05-08",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-05-09",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-05-10",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-05-11",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-05-12",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-05-13",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-05-14",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-05-15",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-05-16",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-05-17",
      "count": 25,
      "level": 4
    },
    {
      "date": "2025-05-18",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-05-19",
      "count": 12,
      "level": 3
    },
    {
      "date": "2025-05-20",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-05-21",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-05-22",
      "count": 13,
      "level": 3
    },
    {
      "date": "2025-05-23",
      "count": 12,
      "level": 3
    },
    {
      "date": "2025-05-24",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-05-25",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-05-26",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-05-27",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-05-28",
      "count": 27,
      "level": 4
    },
    {
      "date": "2025-05-29",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-05-30",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-05-31",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-01",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-06-02",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-03",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-04",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-05",
      "count": 15,
      "level": 3
    },
    {
      "date": "2025-06-06",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-06-07",
      "count": 34,
      "level": 4
    },
    {
      "date": "2025-06-08",
      "count": 28,
      "level": 4
    },
    {
      "date": "2025-06-09",
      "count": 38,
      "level": 4
    },
    {
      "date": "2025-06-10",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-06-11",
      "count": 21,
      "level": 4
    },
    {
      "date": "2025-06-12",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-06-13",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-06-14",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-15",
      "count": 9,
      "level": 2
    },
    {
      "date": "2025-06-16",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-17",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-18",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-19",
      "count": 19,
      "level": 4
    },
    {
      "date": "2025-06-20",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-06-21",
      "count": 35,
      "level": 4
    },
    {
      "date": "2025-06-22",
      "count": 25,
      "level": 4
    },
    {
      "date": "2025-06-23",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-06-24",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-06-25",
      "count": 22,
      "level": 4
    },
    {
      "date": "2025-06-26",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-27",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-06-28",
      "count": 3,
      "level": 1
    },
    {
      "date": "2025-06-29",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-06-30",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-07-01",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-02",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-03",
      "count": 27,
      "level": 4
    },
    {
      "date": "2025-07-04",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-07-05",
      "count": 21,
      "level": 4
    },
    {
      "date": "2025-07-06",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-07-07",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-07-08",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-09",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-07-10",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-07-11",
      "count": 19,
      "level": 4
    },
    {
      "date": "2025-07-12",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-13",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-07-14",
      "count": 3,
      "level": 1
    },
    {
      "date": "2025-07-15",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-07-16",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-07-17",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-07-18",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-19",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-20",
      "count": 23,
      "level": 4
    },
    {
      "date": "2025-07-21",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-07-22",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-23",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-07-24",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-25",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-26",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-07-27",
      "count": 22,
      "level": 4
    },
    {
      "date": "2025-07-28",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-29",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-07-30",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-07-31",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-08-01",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-08-02",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-08-03",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-08-04",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-08-05",
      "count": 20,
      "level": 4
    },
    {
      "date": "2025-08-06",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-08-07",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-08-08",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-08-09",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-08-10",
      "count": 89,
      "level": 4
    },
    {
      "date": "2025-08-11",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-08-12",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-08-13",
      "count": 3,
      "level": 1
    },
    {
      "date": "2025-08-14",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-08-15",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-08-16",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-08-17",
      "count": 66,
      "level": 4
    },
    {
      "date": "2025-08-18",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-08-19",
      "count": 24,
      "level": 4
    },
    {
      "date": "2025-08-20",
      "count": 7,
      "level": 2
    },
    {
      "date": "2025-08-21",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-08-22",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-08-23",
      "count": 3,
      "level": 1
    },
    {
      "date": "2025-08-24",
      "count": 16,
      "level": 4
    },
    {
      "date": "2025-08-25",
      "count": 13,
      "level": 3
    },
    {
      "date": "2025-08-26",
      "count": 19,
      "level": 4
    },
    {
      "date": "2025-08-27",
      "count": 23,
      "level": 4
    },
    {
      "date": "2025-08-28",
      "count": 61,
      "level": 4
    },
    {
      "date": "2025-08-29",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-08-30",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-08-31",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-01",
      "count": 58,
      "level": 4
    },
    {
      "date": "2025-09-02",
      "count": 15,
      "level": 3
    },
    {
      "date": "2025-09-03",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-09-04",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-09-05",
      "count": 78,
      "level": 4
    },
    {
      "date": "2025-09-06",
      "count": 83,
      "level": 4
    },
    {
      "date": "2025-09-07",
      "count": 24,
      "level": 4
    },
    {
      "date": "2025-09-08",
      "count": 62,
      "level": 4
    },
    {
      "date": "2025-09-09",
      "count": 22,
      "level": 4
    },
    {
      "date": "2025-09-10",
      "count": 52,
      "level": 4
    },
    {
      "date": "2025-09-11",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-09-12",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-13",
      "count": 30,
      "level": 4
    },
    {
      "date": "2025-09-14",
      "count": 35,
      "level": 4
    },
    {
      "date": "2025-09-15",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-09-16",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-17",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-18",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-19",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-20",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-21",
      "count": 14,
      "level": 3
    },
    {
      "date": "2025-09-22",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-23",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-24",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-25",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-26",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-27",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-09-28",
      "count": 41,
      "level": 4
    },
    {
      "date": "2025-09-29",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-09-30",
      "count": 11,
      "level": 3
    },
    {
      "date": "2025-10-01",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-02",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-03",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-10-04",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-05",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-06",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-10-07",
      "count": 3,
      "level": 1
    },
    {
      "date": "2025-10-08",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-09",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-10",
      "count": 5,
      "level": 2
    },
    {
      "date": "2025-10-11",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-12",
      "count": 21,
      "level": 4
    },
    {
      "date": "2025-10-13",
      "count": 9,
      "level": 2
    },
    {
      "date": "2025-10-14",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-10-15",
      "count": 6,
      "level": 2
    },
    {
      "date": "2025-10-16",
      "count": 49,
      "level": 4
    },
    {
      "date": "2025-10-17",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-10-18",
      "count": 2,
      "level": 1
    },
    {
      "date": "2025-10-19",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-10-20",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-10-21",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-10-22",
      "count": 3,
      "level": 1
    },
    {
      "date": "2025-10-23",
      "count": 4,
      "level": 1
    },
    {
      "date": "2025-10-24",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-10-25",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-10-26",
      "count": 46,
      "level": 4
    },
    {
      "date": "2025-10-27",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-28",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-29",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-30",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-10-31",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-11-01",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-11-02",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-11-03",
      "count": 17,
      "level": 4
    },
    {
      "date": "2025-11-04",
      "count": 1,
      "level": 1
    },
    {
      "date": "2025-11-05",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-11-06",
      "count": 23,
      "level": 4
    },
    {
      "date": "2025-11-07",
      "count": 10,
      "level": 2
    },
    {
      "date": "2025-11-08",
      "count": 0,
      "level": 0
    },
    {
      "date": "2025-11-09",
      "count": 17,
      "level": 4
    }
  ]
};

const GitHubStats = () => {
  const { totalContributions, contributions } = contributionData;

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-indigo-900';
      case 2: return 'bg-indigo-700';
      case 3: return 'bg-indigo-500';
      case 4: return 'bg-indigo-400';
      case 0:
      default:
        return 'bg-gray-800/80';
    }
  };

  const getContributionDays = () => {
    if (!contributions || contributions.length === 0) {
      return [];
    }
  
    const contributionsMap = new Map(contributions.map(day => [day.date, day]));
    const days = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(today.getDate() - 365);
    
    // Add padding for days before the first day of the week
    const firstDayOfWeek = oneYearAgo.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
    }
    
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayData = contributionsMap.get(dateStr);
        days.push(dayData || { date: dateStr, count: 0, level: 0 });
    }
  
    return days;
  };
  
  const contributionDays = getContributionDays();

  if (!totalContributions || totalContributions === 0) {
    return (
      <Card className="p-8 bg-cyber-gray/20 border-cyber-purple/30 backdrop-blur-xl">
        <div className="text-center text-gray-400">
          <p className="font-semibold text-lg mb-2">Loading GitHub Contributions...</p>
          <p className="text-sm">If this persists, run the 'Update GitHub Contribution Stats' action in your repository's Actions tab.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-8 bg-cyber-gray/20 border-cyber-purple/30 backdrop-blur-xl hover:border-cyber-purple/60 transition-all duration-500 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 via-cyber-blue/5 to-indigo-900/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-purple via-cyber-blue to-indigo-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white animate-fade-in-up">
            GitHub Contributions
          </h3>
          <div className="text-gray-300 font-mono text-lg font-bold animate-scale-in">
            <span className="inline-block text-indigo-400">
              {totalContributions.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-gray-400">contributions</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            @AdilMunawar - Last 12 months
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2 custom-scrollbar">
           <div className="grid grid-flow-col grid-rows-7 gap-1">
            {contributionDays.map((day, dayIndex) => {
              if (!day) {
                return <div key={`empty-${dayIndex}`} className="w-3 h-3 rounded-sm bg-gray-800/20" />;
              }
              return (
                <div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} hover:ring-2 hover:ring-white/50 transition-all duration-300 cursor-pointer group/day hover:scale-125`}
                  title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}`}
                >
                  <div className="w-full h-full rounded-sm group-hover/day:animate-pulse transition-all duration-200"></div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-xs text-gray-400 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <span className="hover:text-gray-300 transition-colors">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div 
                key={level} 
                className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
              ></div>
            ))}
          </div>
          <span className="hover:text-gray-300 transition-colors">More</span>
        </div>
      </div>
    </Card>
  );
};

export default GitHubStats;
