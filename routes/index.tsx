import SpinningModel from "../islands/SpinningModel.tsx";
import Projects from "../islands/Projects.tsx";
import TypingAnimation from "../islands/TypingAnimation.tsx";
import { Icon, loadIcons } from "@iconify-icon/react";
import Wave from "../components/Wave.tsx";

// preload icons based on CV + common web tech + new sections
loadIcons([
  "majesticons:suitcase",
  "tabler:calendar-filled",
  "carbon:location-filled",
  "logos:html-5",
  "logos:css-3",
  "logos:javascript",
  "logos:typescript-icon",
  "skill-icons:react-dark",
  "logos:angular-icon",
  "logos:java",
  "logos:spring-icon",
  "logos:php",
  "devicon:c",
  "devicon:cplusplus",
  "devicon:haskell",
  "logos:python",
  "logos:bash-icon",
  "logos:git-icon",
  "devicon:linux",
  "logos:microsoft-azure",
  "mdi:pipe", // CI/CD
  "simple-icons:cisco", // Cisco
  "mdi:router-network", // Networking
  "mdi:firewall", // Firewalls
  "logos:postgresql",
  "skill-icons:docker",
  "mdi:brain", // AI
  "mdi:gamepad-variant", // Gaming/Emulator
  "skill-icons:laravel-dark",
  "devicon:devops",
  "mdi:school", // Education Icon
  "mdi:account-group", // Student Group Icon
  "mdi:heart-outline", // Volunteering Icon
  "mdi:trophy-award", // Award Icon
  "fa6-solid:graduation-cap", // Alt Education Icon
]);

// --- Hero Component (No Change) ---
function Hero() {
  return (
    <section class="p-4 flex justify-evenly items-center flex-wrap">
      <div class="max-w-lg mt-8">
        <h1 class="text-4xl font-bold text-primary">
          <TypingAnimation
            strings={[
              "Hi, I'm Tiago!",
              "Network & Systems Engineer.",
              "Lets make the world a better place.",
            ]}
            autoStart={true}
            loop={true}
          />
        </h1>
        <p class="text-xl mt-4">
          Driven by a love for learning how systems work, currently pursuing a Master's in Network and Information Systems Engineering and a CCNA (Cisco Certified Network Associate). 
        </p>
        <p class="text-xl mt-4">
          Passionate about building fast and resilient network infrastructure using C/C++, Linux and Cisco IOS.
        </p>
         {/* Optional: Add GitHub/LinkedIn links here if desired */}
      </div>
      <div className="hidden md:block">
        <SpinningModel />
      </div>
    </section>
  );
}

// --- Values Component (No Change) ---
interface Value {
  title: string;
  description: string;
  image: string;
}
function Values() {
  const values: Value[] = [
    {
      title: "Passion for Continuous Learning",
      description:
        "I actively seek out new technologies and stay up-to-date, especially in networking and systems.",
      image: "/img/pexels-pixabay-159711.webp",
    },
    {
      title: "Problem Solving Focus",
      description:
        "My goal is to build robust and efficient systems that solve complex technical challenges.",
      image: "/img/pexels-picjumbo-com-55570-196644.webp",
    },
    {
      title: "Collaboration and Communication",
      description:
        "I excel in team environments, contributing to shared goals and communicating effectively.",
      image: "/img/pexels-fauxels-3184418.webp",
    },
  ];
  return (
    <>
      <Wave flip={false} />
      <section class="p-4 flex justify-center items-center gap-4 flex-wrap bg-primary">
        {values.map((value, i) => (
          <div
            key={i}
            class={"card md:h-auto md:max-w-64 bg-base-100 flex-row md:flex-col shadow-lg" +
              (i % 2 ? " md:-translate-y-8" : "")}
          >
            <figure class="w-1/3 md:h-48 md:w-auto rounded-none rounded-l-box md:rounded-none md:rounded-t-box">
              <img
                class="w-full h-full object-cover"
                src={value.image}
                alt={value.title}
                loading="lazy"
              />
            </figure>
            <div class="card-body w-2/3 md:w-auto">
              <h2 class="card-title">{value.title}</h2>
              <p>{value.description}</p>
            </div>
          </div>
        ))}
      </section>
      <Wave flip={true} />
    </>
  );
}

  const projects: Project[] = [
    {
      title: "Nintendo NES Emulator",
      description:
        "Software clone of the iconic NES console in C. Supports real controllers via custom device drivers on Minix3. Video Demo: youtu.be/zcQ03VqHWBw",
      link: "projects/nes_emulator",
      type: "Personal Project",
      icon: "mdi:gamepad-variant",
    },
    {
      title: "AuctionPeer",
      description:
        "A fully functional, deployment-ready auction website built using Laravel and PostgreSQL.",
      link: "https://github.com/itsnova204/lbaw2451",
      type: "Academic Project",
      icon: "skill-icons:laravel-dark",
    },
    {
      title: "OwlSort AI",
      description:
        "A fun game tasking players to sort colored birds, featuring various AI algorithms to assist.",
      link: "https://github.com/itsnova204/OwlSort-AI",
      type: "Academic Project",
      icon: "mdi:brain",
    },
  ];


// --- Experience Component (No Change) ---
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
      title: "Intern",
      company: "Schmitt + Sohn Elevadores",
      timePeriod: "Feb 2025 - May 2025",
      location: "Porto, Portugal",
      description: "Developing and implementing clustering, TSP, and simulated annealing algorithms within a full-stack application (Angular, Java Spring Boot, PostgreSQL)."
    },
    {
      title: "Intern",
      company: "BindTuning",
      timePeriod: "Aug 2022",
      location: "Porto, Portugal",
      description: "Developed a system for potential clients to test company features via automatically generated, customized trial websites matching their existing business site."
    },
  ];
  return (
    <section class="p-4 flex flex-col justify-evenly items-center gap-8 my-8"> {/* Changed items-center to items-start */}
      <div class="w-full md:w-auto text-center md:text-left mb-4 md:mb-0"> {/* Wrapper for title responsiveness */}
         <h1 class="text-3xl font-bold text-primary">Work Experience</h1>
      </div>
      <div class="flex flex-col gap-4 max-w-md">
        {experiences.map((experience, i) => (
          <div class="card bg-base-100 shadow-md" key={i}>
            <div class="card-body p-4">
              <h2 class="card-title">{experience.title}</h2>
              <span class="flex items-center gap-2 text-gray-600 text-sm">
                <Icon icon="majesticons:suitcase" width="1em" height="1em" />
                {experience.company}
              </span>
              <span class="flex items-center gap-2 text-gray-600 text-sm">
                <Icon icon="tabler:calendar-filled" width="1em" height="1em" />
                {experience.timePeriod}
              </span>
              <span class="flex items-center gap-2 text-gray-600 text-sm">
                <Icon icon="carbon:location-filled" width="1em" height="1em" />
                {experience.location}
              </span>
              <p class="mt-2 text-sm">{experience.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


// --- NEW: Education Component ---
interface EducationEntry {
  degree: string;
  institution: string;
  faculty: string;
  timePeriod?: string;
  relevantCoursework?: string[]; // Make coursework optional and an array
}

function Education() {
  const educationData: EducationEntry[] = [
    {
      degree: "Master in Network and Information Systems Engineering",
      institution: "University of Porto",
      faculty: "FCUP - Faculty of Sciences",
      timePeriod: "Expected: June 2027", // Example with timePeriod
      relevantCoursework: ["Cryptography", "Network Administration", "Network Security", "Systems Administration"],
    },
    {
      degree: "Bachelor in Informatics and Computing Engineering",
      institution: "University of Porto",
      faculty: "FEUP - Faculty of Engineering",
      // timePeriod: undefined, // Example: No timePeriod provided or explicitly undefined
      relevantCoursework: ["Compilers", "Computer Networks", "Design of Algorithms", "Distributed Systems"],
    }
  ];

  return (
    <section class="p-4 my-8">
      <h1 class="text-3xl font-bold text-primary text-center mb-6">
        Education
      </h1>
      <div class="flex flex-col md:flex-row flex-wrap justify-center items-start gap-6">
        {educationData.map((edu, index) => (
          <div class="card w-full md:max-w-md bg-base-100 shadow-md" key={index}>
            <div class="card-body p-4">
              <h2 class="card-title text-lg font-semibold">
                <Icon icon="fa6-solid:graduation-cap" class="w-5 h-5 mr-1 text-primary" />
                {edu.degree}
              </h2>
              <p class="text-md font-medium mt-1">{edu.faculty}</p>
              <p class="text-sm text-gray-600">{edu.institution}</p>

              {/* --- Conditional Rendering Applied Here --- */}
              {edu.timePeriod && ( // Only render the span if edu.timePeriod is truthy (not undefined, null, or empty string)
                <span class="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <Icon icon="tabler:calendar-filled" width="1em" height="1em" />
                  {edu.timePeriod}
                </span>
              )}
              {/* --- End of Conditional Rendering --- */}

              {edu.relevantCoursework && (
                <div class="mt-2">
                  <h4 class="text-sm font-semibold mb-1">Relevant Coursework:</h4>
                  <ul class="list-disc list-inside text-sm text-gray-700">
                    {edu.relevantCoursework.map((course, i) => (
                      <li key={i}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- NEW: Student Groups Component ---
interface GroupMembership {
  groupName: string;
  organization?: string; // Optional organization (like IEEE)
  role: string;
  timePeriod: string;
  description: string;
  award?: string; // Optional award
}

function StudentGroups() {
  const groupsData: GroupMembership[] = [
    {
      groupName: "IEEE UP SB Computer Society",
      organization: "Institute of Electrical and Electronics Engineers - UP Student Branch",
      role: "Member",
      timePeriod: "Mar 2025 - Ongoing",
      description: "Currently leading the development a scalable server cluster and secure network infrastructure using Proxmox and Linux routing to host internal services, improving team collaboration and resource efficiency.",
    },
    {
      groupName: "Nucleus of Computer Graphics and Multimedia",
      role: "Member",
      timePeriod: "Sep 2023 - Oct 2024",
      description: "Participated in organizing events, workshops, and collaborative projects focused on enhancing students' understanding of visual computing and interactive media.",
    },
    {
      groupName: "Nucleus of Computer Science",
      role: "Member",
      timePeriod: "Mar 2021 - Dec 2022",
      description: "Participated in organizing events, workshops, and collaborative projects focused on increasing students' excitement in computer science related topics.",
    },
    {
      groupName: "Club of Informatics",
      role: "President",
      timePeriod: "Apr 2016 - May 2019",
      description: "Led a Highschool club focused on bringing students excited about computer science and electronic engineering together to create events and participate in competitions.",
      award: "3rd Place at the national engineering competition Ilídio Pinho Foundation “Ciência na escola” award.",
    },
  ];

  return (
    <section class="p-4 my-8 bg-base-200 py-8"> {/* Added background and padding */}
      <h1 class="text-3xl font-bold text-primary text-center mb-6">
        Student Groups & Activities
      </h1>
      <div class="flex flex-col gap-4 max-w-3xl mx-auto"> {/* Centered content */}
        {groupsData.map((group, index) => (
           <div class="card card-compact bg-base-100 shadow" key={index}> {/* Compact card */}
             <div class="card-body p-4">
               <h2 class="card-title text-md font-semibold">
                 <Icon icon="mdi:account-group" class="w-5 h-5 mr-1 text-primary" />
                 {group.groupName} {group.organization && <span class="text-sm font-normal text-gray-500">{group.organization}</span>}
                 <span class="badge badge-outline badge-sm ml-auto">{group.role}</span>
               </h2>
               <span class="flex items-center gap-2 text-gray-600 text-xs mt-1"> {/* Smaller time text */}
                 <Icon icon="tabler:calendar-filled" width="0.8em" height="0.8em" />
                 {group.timePeriod}
               </span>
               <p class="text-sm mt-2">{group.description}</p>
               {group.award && (
                 <div class="mt-2 flex items-center gap-2 text-sm text-amber-400 font-medium">
                    <Icon icon="mdi:trophy-award" class="w-4 h-4" /> {/* Icon should inherit the color */}
                    <span>{group.award}</span>
                 </div>
               )}
             </div>
           </div>
        ))}
      </div>
    </section>
  );
}


// --- NEW: Volunteering Component ---
interface VolunteerRole {
  organization: string;
  timePeriod: string;
  description: string;
}

function Volunteering() {
  const volunteeringData: VolunteerRole[] = [
    {
      organization: "Code Children",
      timePeriod: "Early 2020",
      description: "Taught coding fundamentals to kindergarten students using visual programming tools like ScratchJr.",
    },
    // Add more volunteer roles here if applicable
  ];

   if (volunteeringData.length === 0) return null; // Don't render section if no data

  return (
    <section class="p-4 my-8">
      <h1 class="text-3xl font-bold text-primary text-center mb-6">
        Volunteering
      </h1>
      <div class="flex flex-col gap-4 max-w-xl mx-auto"> {/* Centered content */}
        {volunteeringData.map((role, index) => (
           <div class="card card-compact bg-base-100 shadow" key={index}>
             <div class="card-body p-4">
               <h2 class="card-title text-md font-semibold">
                 <Icon icon="mdi:heart-outline" class="w-5 h-5 mr-1 text-secondary" /> {/* Using secondary color */}
                 {role.organization}
               </h2>
               <span class="flex items-center gap-2 text-gray-600 text-xs mt-1">
                 <Icon icon="tabler:calendar-filled" width="0.8em" height="0.8em" />
                 {role.timePeriod}
               </span>
               <p class="text-sm mt-2">{role.description}</p>
             </div>
           </div>
        ))}
      </div>
    </section>
  );
}


// --- Technologies Component (No Change) ---
function Technologies() {
  const technologies = [
    "devicon:c", "devicon:cplusplus", "logos:java", "logos:javascript", "logos:php",
    "devicon:haskell", "logos:python", "logos:bash-icon", "logos:git-icon", "devicon:linux",
    "logos:microsoft-azure", "mdi:pipe", "simple-icons:cisco", "mdi:router-network",
    "mdi:firewall", "logos:angular-icon", "logos:spring-icon", "logos:postgresql",
    "skill-icons:docker", "devicon:devops",
  ];
  const techTooltips: { [key: string]: string } = {
    "devicon:c": "C", "devicon:cplusplus": "C++", "logos:java": "Java",
    "logos:javascript": "JavaScript", "logos:php": "PHP", "devicon:haskell": "Haskell",
    "logos:python": "Python", "logos:bash-icon": "Bash", "logos:git-icon": "Git",
    "devicon:linux": "Linux", "logos:microsoft-azure": "Microsoft Azure",
    "mdi:pipe": "CI/CD Pipelines", "simple-icons:cisco": "Cisco IOS",
    "mdi:router-network": "Networking & Routing (OSPF, VLAN)", "mdi:firewall": "Firewalls",
    "logos:angular-icon": "Angular", "logos:spring-icon": "Java Spring Boot",
    "logos:postgresql": "PostgreSQL", "skill-icons:docker": "Docker", "devicon:devops": "DevOps",
  };
  return (
    <section class="my-16">
      <h1 class="text-3xl font-bold text-primary text-center mb-8">
        Skills & Technologies
      </h1>
      <div class="p-4 flex justify-center items-center flex-wrap gap-6 md:gap-8">
        {technologies.map((technology) => (
          <div key={technology} class="tooltip" data-tip={techTooltips[technology] || 'Technology'}>
            <Icon
              class="w-10 h-10 md:w-12 md:h-12 text-gray-700 hover:text-primary transition-colors"
              icon={technology}
              width="none"
              height="none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Main Home Component ---
export default function Home() {
  return (
    <>
      <Hero />
      
      <Projects projects={projects} />
      <Technologies />
      <Experience />
      <Education />      {/* Added Education */}
      <StudentGroups />  {/* Added Student Groups */}
      {/*<Values />*/}
      <Volunteering />   {/* Added Volunteering */}
    </>
  );
}