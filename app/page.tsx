import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import Projects from "./components/Projects";
import Hobbies from "./components/Hobbies";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="main">
      <Navbar />
      <Hero />
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10">
        <AboutMe />
        <Projects />
        <Hobbies />
        <Resume />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
