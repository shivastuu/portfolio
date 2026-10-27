import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import About from "../components/About";
import Work from "../components/Work";
import Experience from "../components/Experience";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Work />
      <Experience />
      <Contact />
    </main>
  );
}
