import SpinningModel from "../islands/SpinningModel.tsx";
import Projects from "../islands/Projects.tsx";
import TypingAnimation from "../islands/TypingAnimation.tsx";
import { Icon, loadIcons } from "@iconify-icon/react";

loadIcons([
  "majesticons:suitcase",
  "tabler:calendar-filled",
  "carbon:location-filled",
  "logos:java",
  "logos:spring-icon",
  "devicon:c",
  "devicon:cplusplus",
  "logos:python",
  "logos:bash-icon",
  "devicon:linux",
  "logos:postgresql",
  "skill-icons:docker",
  "mdi:kubernetes",
  "mdi:terraform",
  "mdi:bluetooth",
  "mdi:chip",
  "mdi:network",
  "mdi:shield-check",
  "mdi:code-braces",
  "mdi:server-network",
  "mdi:gamepad-variant",
  "fa6-solid:graduation-cap",
  "mdi:account-group",
]);

interface Project {
  title: string;
  description: string;
  link: string;
  type: string;
  icon: string;
}

function Hero() {
  return (
    <section class="p-4 py-12 flex justify-between items-center gap-10 flex-wrap">
      <div class="max-w-2xl mt-8">
        <p class="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-4">
          Porto, Portugal · Systems & infrastructure
        </p>
        <h1 class="text-5xl md:text-6xl font-bold leading-tight">
          <TypingAnimation
            strings={[
              "Hi, I'm Tiago.",
              "Systems engineer.",
              "Embedded systems builder.",
            ]}
            autoStart
            loop
          />
        </h1>
        <p class="text-xl mt-6 leading-relaxed">
          I build reliable software and infrastructure at the boundary between
          embedded devices, distributed systems, and networks. Currently
          pursuing an MSc in Network & Information Systems Engineering at the
          University of Porto.
        </p>
        <div class="flex flex-wrap gap-3 mt-7">
          <a class="btn btn-primary" href="#experience">View experience</a>
          <a class="btn btn-outline" href="/tiagoaleixo-cv.pdf" download>
            Download CV
          </a>
        </div>
      </div>
      <div className="hidden md:block">
        <SpinningModel />
      </div>
    </section>
  );
}

const projects: Project[] = [
  {
    title: "Nintendo NES Emulator",
    description:
      "A C implementation on MINIX 3 with a 6502 CPU, cycle-accurate execution, PPU rendering, custom drivers, and physical controller input.",
    link: "projects/nes_emulator",
    type: "Systems",
    icon: "mdi:gamepad-variant",
  },
  {
    title: "Production Cluster & Perimeter Network",
    description:
      "Virtualization and network infrastructure with Proxmox VE, QEMU/KVM, TrueNAS, VLANs, WireGuard, and Suricata IDS/IPS for 50+ members.",
    link: "https://github.com/itsnova204",
    type: "Infrastructure",
    icon: "mdi:server-network",
  },
  {
    title: "Java Compiler",
    description:
      "An end-to-end Java-subset compiler covering parsing, semantic analysis, OLLIR optimization, register allocation, and JVM bytecode generation.",
    link: "https://github.com/itsnova204",
    type: "Compilers",
    icon: "mdi:code-braces",
  },
];

interface ExperienceEntry {
  title: string;
  company: string;
  timePeriod: string;
  location: string;
  description: string;
}

function Experience() {
  const experiences: ExperienceEntry[] = [
    {
      title: "Software / Operations Engineering Intern",
      company: "Google",
      timePeriod: "Jul 2026 - Sep 2026",
      location: "Groningen, Netherlands",
      description:
        "Engineered an event-driven workflow and milestone platform unifying 60+ data sources, with two-way synchronization, fault-tolerant checkpoints, and diagnostics tooling. Delivered 5,000+ lines of production code and 4,000+ lines of tests.",
    },
    {
      title: "Embedded Systems Researcher",
      company: "Fraunhofer AICOS",
      timePeriod: "Jul 2025 - Jul 2026",
      location: "Porto, Portugal",
      description:
        "Architected an indoor real-time location system on Zephyr RTOS and Nordic nRF52 hardware, reaching sub-2m accuracy and tracking 20+ medical assets in a live hospital environment. Built the ingestion platform, REST/WebSocket APIs, and visualizations.",
    },
    {
      title: "Software Engineering Intern",
      company: "Schmitt + Sohn Elevadores",
      timePeriod: "Feb 2025 - May 2025",
      location: "Porto, Portugal",
      description:
        "Developed Java Spring Boot backend services and REST APIs backed by PostgreSQL, including database query optimization.",
    },
  ];
  return (
    <section id="experience" class="p-4 flex flex-col items-center gap-8 my-8">
      <h1 class="text-3xl font-bold text-primary">Work Experience</h1>
      <div class="flex flex-col gap-4 max-w-3xl w-full">
        {experiences.map((experience) => (
          <div class="card bg-base-100 shadow-md" key={experience.company}>
            <div class="card-body p-5">
              <h2 class="card-title">{experience.title}</h2>
              <div class="flex flex-wrap gap-x-5 gap-y-1 text-gray-600 text-sm">
                <span class="flex items-center gap-2">
                  <Icon icon="majesticons:suitcase" />
                  {experience.company}
                </span>
                <span class="flex items-center gap-2">
                  <Icon icon="tabler:calendar-filled" />
                  {experience.timePeriod}
                </span>
                <span class="flex items-center gap-2">
                  <Icon icon="carbon:location-filled" />
                  {experience.location}
                </span>
              </div>
              <p class="mt-2 text-sm leading-relaxed">
                {experience.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface EducationEntry {
  degree: string;
  faculty: string;
  timePeriod: string;
  average: string;
  coursework: string[];
}
function Education() {
  const education: EducationEntry[] = [
    {
      degree: "MSc Network & Information Systems Engineering",
      faculty: "University of Porto · Faculty of Sciences",
      timePeriod: "Expected June 2027",
      average: "Current average: 14/20",
      coursework: [
        "Embedded Systems",
        "Network Security",
        "Distributed Systems",
        "Cloud Systems Administration",
        "Advanced Computer Networks",
      ],
    },
    {
      degree: "BSc Informatics & Computing Engineering",
      faculty: "University of Porto · Faculty of Engineering",
      timePeriod: "Completed June 2025",
      average: "Final average: 13/20",
      coursework: [
        "Computer Architecture",
        "Operating Systems",
        "Computer Networks",
        "Compilers",
        "Parallel & Distributed Computing",
        "Computer Security",
      ],
    },
  ];
  return (
    <section class="p-4 my-12">
      <h1 class="text-3xl font-bold text-primary text-center mb-6">
        Education
      </h1>
      <div class="flex flex-col md:flex-row justify-center items-stretch gap-6">
        {education.map((item) => (
          <div
            class="card w-full md:max-w-md bg-base-100 shadow-md"
            key={item.degree}
          >
            <div class="card-body p-5">
              <h2 class="card-title text-lg">
                <Icon icon="fa6-solid:graduation-cap" class="text-primary" />
                {item.degree}
              </h2>
              <p class="font-medium mt-1">{item.faculty}</p>
              <p class="text-sm text-gray-600">
                {item.timePeriod} · {item.average}
              </p>
              <p class="text-sm mt-3">
                <span class="font-semibold">Relevant coursework:</span>{" "}
                {item.coursework.join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Leadership() {
  return (
    <section class="p-4 my-12 bg-base-200 py-10 rounded-box">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold text-primary text-center mb-5">
          Leadership
        </h1>
        <div class="card bg-base-100 shadow">
          <div class="card-body p-5">
            <h2 class="card-title">
              <Icon icon="mdi:account-group" class="text-primary" />Computer
              Society Chair · IEEE UP Student Branch
            </h2>
            <p class="text-sm text-gray-600">
              Mar 2025 - Present · Porto, Portugal
            </p>
            <p class="text-sm mt-2 leading-relaxed">
              As Computer Society Chair, I lead infrastructure initiatives with
              IEEE Portugal IT Systems, including a Proxmox/TrueNAS cluster
              supporting 50+ members. I also organize technical workshops and
              hands-on sessions for 40+ students.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Technologies() {
  const technologies: Record<string, string> = {
    "devicon:c": "C",
    "devicon:cplusplus": "C++",
    "logos:python": "Python",
    "logos:java": "Java",
    "logos:javascript": "JavaScript",
    "logos:bash-icon": "Bash",
    "devicon:linux": "Linux",
    "skill-icons:docker": "Docker",
    "mdi:kubernetes": "Kubernetes",
    "mdi:terraform": "Terraform",
    "logos:spring-icon": "Java Spring Boot",
    "logos:postgresql": "PostgreSQL",
    "mdi:bluetooth": "BLE",
    "mdi:chip": "Zephyr RTOS · Nordic nRF52 · ESP32",
    "mdi:network": "TCP/IP · VLANs · WireGuard",
    "mdi:shield-check": "OPNsense · Suricata IDS/IPS",
    "mdi:code-braces": "WebGL · GLSL · 3D rendering",
  };
  return (
    <section class="my-16">
      <h1 class="text-3xl font-bold text-primary text-center mb-8">
        Skills & Technologies
      </h1>
      <div class="p-4 flex justify-center items-center flex-wrap gap-6 md:gap-8">
        {Object.entries(technologies).map(([icon, label]) => (
          <div key={icon} class="tooltip" data-tip={label} aria-label={label}>
            <Icon
              class="w-10 h-10 md:w-12 md:h-12 text-gray-700 hover:text-primary transition-colors"
              icon={icon}
              width="none"
              height="none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Projects projects={projects} />
      <Technologies />
      <Experience />
      <Education />
      <Leadership />
    </>
  );
}
