import { Icon, loadIcon } from "@iconify-icon/react";
import axios from "axios";
import { useEffect, useState } from "preact/hooks";

// preload icons
loadIcon("fa6-brands:dev");
loadIcon("ri:dice-line");

function toggleTheme(themes: string[]) {
  const html = document.querySelector("html");
  const theme = html?.getAttribute("data-theme");
  // assign a random theme except the current one
  const filteredThemes = themes.filter((t) => t !== theme);
  const randomTheme = filteredThemes[Math.floor(Math.random() * themes.length)];

  html?.setAttribute("data-theme", randomTheme);
  localStorage.setItem("theme", randomTheme);
}
export default function AppBar() {
  const [themes, setThemes] = useState([]);
  useEffect(() => {
    axios.get("/api/themes").then((res) => {
      setThemes(res.data);
    });
  }, []);
  const socials = [
    {
      name: "GitHub",
      url: "https://github.com/itsnova204",
      icon: "fa-brands:github", // Font Awesome Brand icon via Iconify
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/tiagosaleixo",
      icon: "fa-brands:linkedin", // Font Awesome Brand icon via Iconify
    },
  ];

  return (
    <nav class="flex justify-between items-center p-2 shadow bg-base-100/80 backdrop-blur-sm">
      <a href="/" class="text-xl font-bold flex items-center gap-2 hover:text-primary transition-colors">
        <Icon
          icon="fa6-brands:dev"
          class="w-6 h-6" 
          width="none"
          height="none"
        />
        Tiago Aleixo
      </a>
      <ul class="flex gap-4 items-center">
        {/* Map directly inside the UL to generate LIs */}
        {socials.map((social) => (
          <li key={social.name}> {/* Each social icon gets its own LI */}
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              class="btn btn-ghost btn-square text-xl" // Button styling
            >
              <Icon icon={social.icon} class="w-6 h-6" width="none" height="none" />
            </a>
          </li>
        ))}

        {/* CV Button LI */}
        <li>
          <a
            // Consider btn-sm for consistency if icons are small
            class="btn btn-primary btn-sm text-base-100 flex items-center gap-1"
            href="/tiagoaleixo-cv.pdf"
            download
          >
            {/* Optional Icon */}
            {/* <Icon icon="mdi:download-outline" width="1.1em" height="1.1em" /> */}
            <span>Download CV</span> {/* Keep text short */}
          </a>
        </li>
      </ul>
    </nav>
  );
}
