import { Icon } from "@iconify-icon/react";

interface Project {
  title: string;
  description: string;
  link: string;
  type: string;
  icon: string;
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <div class="flex flex-wrap justify-center items-stretch gap-4">
      {projects.map((project) => (
        <div class="card max-w-sm bg-base-100 shadow-md" key={project.title}>
          <div class="card-body p-4 flex flex-col">
            <h2 class="card-title">
              <Icon
                class="w-6 h-6 flex-shrink-0"
                icon={project.icon}
                width="none"
                height="none"
              />
              {project.title}
              <span class="badge badge-ghost badge-sm ml-auto">{project.type}</span>
            </h2>
            <p class="text-sm flex-grow mt-1">{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary btn-sm text-base-100 mt-4"
            >
              {project.link.startsWith("/") ? "Read More" : "View Project"}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}