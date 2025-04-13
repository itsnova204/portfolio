import { type PageProps } from "$fresh/server.ts";
import AppBar from "../islands/AppBar.tsx";
import { Icon, loadIcons } from "@iconify-icon/react"; // Import loadIcons if needed for footer icons

// Preload footer icons if not loaded elsewhere
loadIcons(["fa-brands:github", "fa-brands:linkedin"]);

function MetaTags(
  { credentials, url }: { credentials: { name: string }; url: string },
) {
  // --- Updated Metadata Content ---
  const siteTitle = `${credentials.name} - Network & Systems Engineer Portfolio`;
  const siteDescription = `Explore ${credentials.name}'s portfolio showcasing projects in network engineering, systems administration, and software development. Expertise in C/C++, Linux, Cisco IOS, networking protocols, and full-stack technologies.`;
  const imageUrl = `${url}meta-image.webp`; // Ensure this image exists in your static folder

  return (
    <>
      {/* Primary Meta Tags */}
      {/* Use a slightly more concise title for the <title> tag itself */}
      <title>{credentials.name} | Network & Systems Engineer</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={siteDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Optional: Add relevant keywords */}
      <meta name="keywords" content="Tiago Aleixo, Network Engineer, Systems Engineer, C++, C, Linux, Cisco IOS, Networking,   Portfolio, Software Development, Porto, Portugal" />

      {/* Meta Tags Generated with https://metatags.io */}
    </>
  );
}

export default function App({ Component }: PageProps) {
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

  const credentials = {
    name: "Tiago Aleixo",
  };

  // Ensure this URL is correct for deployment
  const url = "https://tiagoaleixo.dev/";

  return (
    <html lang="en" data-theme="dark"> {/* Optional: Set a default theme (e.g., dark) if using DaisyUI themes */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <MetaTags credentials={credentials} url={url} />
        {/* The <title> tag inside MetaTags will be used, this one is slightly redundant but okay */}
        {/* <title>Portfolio | {credentials.name}</title> */}
        <link rel="icon" href="/favicon.ico" sizes="any" /> {/* Optional: Add favicon link */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> {/* Optional: Add Apple touch icon */}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="min-h-screen flex flex-col max-w-screen-xl mx-auto px-2"> {/* Added horizontal padding */}
        <header class="sticky top-0 z-50"> {/* Made AppBar sticky */}
          <AppBar />
        </header>
        <main class="flex-grow"> {/* Ensure main takes up available space */}
          <Component />
        </main>
        <footer class="mt-auto footer w-auto m-2 p-4 bg-neutral text-neutral-content rounded-lg">
          <aside class="items-center grid-flow-col"> {/* Use grid-flow-col for alignment */}
             {/* Updated Footer Attribution */}
            <p>MIT licensed © {new Date().getFullYear()} - Template by <a href = "https://github.com/michael-pfister/deno-portfolio">Michael</a>, configured and expanded by {credentials.name}</p>
            {/* Keep 3D Art credit if the model is used */}
            <span class="text-xs text-neutral-content/70 ml-4"> {/* Slightly dimmed text */}
              3D Art by{" "}
              <a
                class="underline hover:text-primary" // Added hover effect
                href="https://sketchfab.com/KJLOYH"
                target="_blank"
                rel="noopener noreferrer" // Added rel attribute
              >
                Valery Kharitonov
              </a>
            </span>
          </aside>
          <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            {socials.map((social) => (
              <a
                key={social.name} // Added key prop
                href={social.url}
                target="_blank"
                rel="noopener noreferrer" // Added rel attribute
                aria-label={social.name}
                class="hover:text-primary transition-colors" // Added hover effect
              >
                <Icon icon={social.icon} width="24" height="24" />
              </a>
            ))}
          </nav>
        </footer>
      </body>
    </html>
  );
}