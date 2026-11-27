import Hero from "../components/Hero";
import Moksha from "../components/Moksha";
import Work from "../components/Work";
import Marquee from "../components/Marquee";
import About from "../components/About";
import Services from "../components/Services";
import OpenSource from "../components/OpenSource";
import Experience from "../components/Experience";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Moksha />
      <Work />
      <Marquee />
      <About />
      <Services />
      <OpenSource />
      <Experience />
      <Contact />
    </main>
  );
}
