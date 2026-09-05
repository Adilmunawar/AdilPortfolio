import { Reveal } from './Reveal';
import GitHubStats from './GitHubStats';
import LeetCodeStats from './LeetCodeStats';
import BadgesShowcase from './BadgesShowcase';

const StatsSection = () => {
  return (
    <section id="stats" className="px-5 py-10 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mb-6 lg:mb-12">
          <h2 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f2f4f8] lg:text-[40px]">
            Activity
          </h2>
          <p className="mt-3 max-w-[680px] text-[15px] leading-normal text-[#a4adbe] lg:text-[20px]">
            Public commits and problem-solving over the last year, plus the credentials behind them. Updated automatically.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
          <Reveal className="min-w-0">
            <GitHubStats />
          </Reveal>
          <Reveal delay={60} className="min-w-0">
            <LeetCodeStats />
          </Reveal>
        </div>

        <div className="mt-12 lg:mt-16">
          <Reveal className="mb-6 lg:mb-8">
            <h3 className="text-lg font-semibold tracking-[-0.01em] text-[#f2f4f8] lg:text-xl">Credentials</h3>
            <p className="mt-1.5 text-[15px] text-[#a4adbe]">
              Badges and learning paths from GitHub, LeetCode, Microsoft, AWS and Google.
            </p>
          </Reveal>
          <BadgesShowcase />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
