import Hero from "../components/Hero";
import Work from "../components/Work";
import Marquee from "../components/Marquee";
import About from "../components/About";
import Services from "../components/Services";
import Experience from "../components/Experience";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <Marquee />
      <About />
      <Services />
      <Experience />
      <Contact />
    </main>
  );
}
