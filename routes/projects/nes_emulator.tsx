import { Icon } from "@iconify-icon/react";
import Projects from "../../islands/Projects.tsx";

const projects: Project[] = [
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

export default function NESEmulatorBlog() {
  return (
    <section class="p-6 md:p-12">
      <h1 class="text-5xl font-extrabold text-primary text-center mb-8">
        Developing an NES Emulator
      </h1>

      {/* Table of Contents and Image */}
      <div class="prose max-w-4xl mx-auto mb-12 flex flex-col md:flex-row items-start gap-8">
        {/* Table of Contents */}
        <div class="flex-1">
          <h2 class="text-3xl font-bold text-secondary">Table of Contents</h2>
          <ul class="list-disc list-inside">
            <li><a href="#introduction" class="text-blue-600 hover:underline">Introduction</a></li>
            <li><a href="#architecture" class="text-blue-600 hover:underline">Understanding the NES Architecture</a></li>
            <li><a href="#cpu-emulation" class="text-blue-600 hover:underline">CPU Emulation</a></li>
            <li><a href="#graphics-rendering" class="text-blue-600 hover:underline">Graphics Rendering</a></li>
            <li><a href="#input-handling" class="text-blue-600 hover:underline">Input Handling</a></li>
            <li><a href="#challenges" class="text-blue-600 hover:underline">Challenges and Lessons Learned</a></li>
            <li><a href="#final-thoughts" class="text-blue-600 hover:underline">Final Thoughts</a></li>
          </ul>
        </div>

        {/* NES Console Image */}
        <div class="flex-shrink-0 w-full md:w-1/3 h-full">
          <img
            src="/NES-Console.png"
            alt="NES Console"
            class="rounded-lg shadow-lg w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Introduction */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="introduction" class="text-3xl font-bold text-secondary">Introduction</h2>
        <p>
          Developing an NES emulator was a challenging yet rewarding experience. Our goal was to replicate the functionality of the iconic Nintendo Entertainment System (NES) inside Minix using our own device drivers for the timer, mouse, keyboard, graphics card, and even UART. The project was written entirely in C and supports real physical controllers.
        </p>
      </div>

      {/* NES Architecture */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="architecture" class="text-3xl font-bold text-secondary">1. Understanding the NES Architecture</h2>
        <p>
          The NES is built around an 8-bit Ricoh 2A03 processor (a modified MOS 6502, the processor used in the Apple II) and a Picture Processing Unit (PPU) for graphics. To emulate it, I had to study its instruction set, memory layout, and hardware quirks, including replicating some bugs!
        </p>
        <p>
          The <a href="https://www.nesdev.org/wiki/Nesdev_Wiki" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">NES Dev Wiki</a> was invaluable for this, providing detailed documentation on the CPU and PPU.
        </p>
      </div>

      {/* CPU Emulation */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="cpu-emulation" class="text-3xl font-bold text-secondary">2. CPU Emulation</h2>
        <p>
          The first step was to emulate the CPU. This involved implementing the 6502 instruction set, handling memory addressing modes, and simulating the CPU clock cycles.
        </p>
      </div>

        {/* NES TEST PASSING */}
        <div class="prose max-w-4xl mx-auto mb-12">
            <h2 id="nes-test-passing" class="text-3xl font-bold text-secondary">NES Test Passing</h2>
            <p>
                Below is a demonstration of the NES emulator successfully passing the NESTest ROM.
            </p>
            <div class="flex justify-center items-center rounded-lg overflow-hidden">
                <video
                src="/nestestpass.mp4"
                class="w-1/2 h-auto"
                autoplay
                loop
                muted
                playsInline
                ></video>
            </div>
        </div>

      {/* Graphics Rendering */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="graphics-rendering" class="text-3xl font-bold text-secondary">3. Graphics Rendering</h2>
        <p>
          The PPU was the next challenge. I implemented a framebuffer to simulate the NES's 256x240 resolution and wrote code to render sprites and tiles based on the PPU's memory.
        </p>

        {/* Side-by-Side Images */}
        <div class="flex flex-col md:flex-row gap-4 mt-6">
            <div class="flex-1">
            <img
                src="/ppu_bug.jpeg"
                alt="PPU Bug"
                class="rounded-lg shadow-lg w-full h-auto"
            />
            <p class="text-center mt-2 text-sm text-gray-600">PPU Buged</p>
            </div>
            <div class="flex-1">
            <img
                src="/ppu_almost_working.jpeg"
                alt="PPU Almost Working"
                class="rounded-lg shadow-lg w-full h-auto"
            />
            <p class="text-center mt-2 text-sm text-gray-600">PPU Almost Working</p>
            </div>
        </div>
      </div>
      <br></br>

      {/* Input Handling */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="input-handling" class="text-3xl font-bold text-secondary">4. Input Handling</h2>
        <p>
          To support real NES controllers, I developed custom device drivers on Minix3. This allowed the emulator to read input directly from the hardware.
        </p>
      </div>

        {/* Side-by-Side Images */}
        <div class="flex flex-col md:flex-row gap-4 mt-6">
            <div class="flex-1">
            <img
                src="/adding_controller_headers.jpeg"
                alt="PPU Bug"
                class="rounded-lg shadow-lg w-full h-auto"
            />
            <p class="text-center mt-2 text-sm text-gray-600">Adding header pins to the controller</p>
            </div>
            <div class="flex-1">
            <img
                src="/controller_and_bridge.jpeg"
                alt="PPU Almost Working"
                class="rounded-lg shadow-lg w-full h-auto"
            />
            <p class="text-center mt-2 text-sm text-gray-600">Controller and serial bride built!</p>
            </div>
        </div>
        <div class="flex justify-center items-center rounded-lg overflow-hidden">
            <video
            src="/controller_test.mp4"
            class="w-1/2 h-auto"
            autoplay
            loop
            muted
            playsInline
            ></video>
        </div>
        <br></br>


      {/* Challenges */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="challenges" class="text-3xl font-bold text-secondary">5. Challenges and Lessons Learned</h2>
        <p>
          One of the biggest challenges was the PPU. The NES relies on the PPU to generate graphics however I severly underestimated the complexity of this. I had to implement a lot of features, including sprite rendering, background scrolling, and palette management. Debugging was also tricky, at one point running the emulator for 4 frames was creating about 2GB of logs and took arroung 5min.
        </p>
      </div>

      {/* Final Thoughts */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="final-thoughts" class="text-3xl font-bold text-secondary">6. Final Thoughts</h2>
        <p>
          This project deepened my understanding of low-level programming, hardware emulation, and operating systems. It was a great way to combine my passion for retro gaming with my technical skills.
        </p>
        <br></br>
        <p>Thanks to my colleagues @feup for the amazing main menu to choose games!</p>
        <p>
            Thank you for reading! If you're interested in the code, you can find it on my GitHub. I hope this inspires you to take on your own projects and challenges!
        </p>
        <div class="flex justify-center items-center rounded-lg overflow-hidden">
            <video
            src="/finalworking.mp4"
            class="w-1/2 h-auto"
            autoplay
            loop
            muted
            playsInline
            ></video>
        </div>
        <div class="mt-8 text-center">
          <a
            href="https://github.com/itsnova204/NES_Emulator-LCOM"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary btn-lg"
          >
            View the Project on GitHub
          </a>
        </div>
      </div>

      {/* Related Projects */}
      <div class="mt-16">
        <h2 class="text-4xl font-extrabold text-primary text-center mb-8">
          Other Projects
        </h2>
        <Projects projects={projects} />
      </div>
    </section>
  );
}