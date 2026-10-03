import HeroSection7 from '../components/hero/HeroSection7';
import AboutSection from '../components/sections/AboutSection';
import { PrizesSection } from '../components/sections/PrizesSection';
import SkewCards from '../components/sections/SkewCards';
import ProblemStatements from '../components/problem-statements/ProblemStatements';
import GuidelinesSection from '../components/sections/GuidelinesSection';
import TimelineSection from '../components/sections/TimelineSection';
import InteractiveSection from '../components/sections/InteractiveSection';

function HomePage() {
  return (
    <main>
      <HeroSection7 />
      
      {/* ── Rest of the page ── */}
      <AboutSection />
      <PrizesSection />
      <SkewCards />
      <ProblemStatements />
      <GuidelinesSection />
      <TimelineSection />
      {/* <InteractiveSection /> */}
    </main>
  );
}

export default HomePage;
