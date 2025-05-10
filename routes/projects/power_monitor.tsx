import { Icon } from "@iconify-icon/react"; // Keep if you use Iconify elsewhere
import Projects from "../../islands/Projects.tsx"; // Assuming this component lists other projects

// Define your other projects if you want to display them at the bottom
const otherProjects: Project[] = [
  {
    title: "NES Emulator",
    description:
      "A NES emulator for Minix3 with custom C device drivers for timer, mouse, keyboard, graphics, and UART.",
    link: "https://github.com/itsnova204/NES_Emulator-LCOM", // Link to your NES emulator GitHub
    type: "Academic Project",
    icon: "ion:game-controller-outline", // Example icon
  },
  {
    title: "AuctionPeer",
    description:
      "A fully functional, deployment-ready auction website built using Laravel and PostgreSQL.",
    link: "https://github.com/itsnova204/lbaw2451",
    type: "Academic Project",
    icon: "skill-icons:laravel-dark",
  },
  // Add more projects if you like
];

// Define an interface for Project if it's not already globally available
interface Project {
  title: string;
  description: string;
  link: string;
  type: string;
  icon: string; // Iconify icon name
}


export default function EnergyMonitorBlog() {
  return (
    <section class="p-6 md:p-12">
      <h1 class="text-5xl font-extrabold text-primary text-center mb-8">
        Real-Time Energy Monitoring with ESP8266, PZEM-004T & Grafana
      </h1>

      {/* Table of Contents and Image */}
      <div class="prose max-w-4xl mx-auto mb-12 flex flex-col md:flex-row items-start gap-8">
        {/* Table of Contents */}
        <div class="flex-1">
          <h2 class="text-3xl font-bold text-secondary">Table of Contents</h2>
          <ul class="list-disc list-inside">
            <li><a href="#introduction" class="text-blue-600 hover:underline">Introduction</a></li>
            <li><a href="#project-goals" class="text-blue-600 hover:underline">Project Goals</a></li>
            <li><a href="#architecture-overview" class="text-blue-600 hover:underline">Architecture Overview</a></li>
            <li><a href="#hardware-setup" class="text-blue-600 hover:underline">Hardware Setup & ESP8266</a></li>
            <li><a href="#data-pipeline" class="text-blue-600 hover:underline">Data Pipeline: Python, PostgreSQL, Docker</a></li>
            <li><a href="#visualization" class="text-blue-600 hover:underline">Visualization with Grafana</a></li>
            <li><a href="#key-features" class="text-blue-600 hover:underline">Key Features Implemented</a></li>
            <li><a href="#conclusion" class="text-blue-600 hover:underline">Conclusion</a></li>
          </ul>
        </div>

        {/* Project Image - Grafana Dashboard Screenshot */}
        <div class="flex-shrink-0 w-full md:w-1/2 h-auto"> {/* Adjusted width for better balance */}
          <img
            src="/power_monitor/dashboard.png" 
            alt="Energy Monitor Grafana Dashboard"
            class="rounded-lg shadow-lg w-full h-auto object-contain" // object-contain might be better
          />
        </div>
      </div>

      {/* Introduction */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="introduction" class="text-3xl font-bold text-secondary">Introduction</h2>
        <p>
          Understanding and managing energy consumption is crucial, whether for cost savings or environmental awareness. This project outlines the development of a comprehensive real-time energy monitoring system. Using an ESP8266 microcontroller and a PZEM-004T energy sensor, the system captures detailed electrical data, processes it through a containerized backend, and visualizes it on dynamic Grafana dashboards.
        </p>
      </div>

      {/* Project Goals */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="project-goals" class="text-3xl font-bold text-secondary">Project Goals</h2>
        <ul class="list-disc list-inside">
            <li>Accurately measure key electrical parameters: Voltage, Current, Active Power, Accumulated Energy, Frequency, and Power Factor.</li>
            <li>Transmit sensor data wirelessly using an ESP8266.</li>
            <li>Develop a robust backend to receive, store, and process time-series data.</li>
            <li>Provide intuitive and interactive visualizations of energy consumption patterns.</li>
            <li>Utilize Docker for easy deployment and management of backend services.</li>
        </ul>
      </div>

      {/* Architecture Overview */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="architecture-overview" class="text-3xl font-bold text-secondary">Architecture Overview</h2>
        <p>
          The system follows a modular architecture:
        </p>
        <ol class="list-decimal list-inside">
            <li><strong>Sensor Node (ESP8266 + PZEM-004T):</strong> The PZEM-004T measures electrical parameters. The ESP8266 reads this data via Modbus RTU (SoftwareSerial) and transmits it as a JSON payload over Wi-Fi using HTTP POST requests.</li>
            <li><strong>Data Ingester (Python Flask App):</strong> A lightweight Flask application, running in a Docker container, listens for incoming data from the ESP8266, validates it, and inserts it into the database.</li>
            <li><strong>Database (PostgreSQL):</strong> A PostgreSQL database, also containerized, stores the time-series energy readings. Its robust nature is ideal for handling structured data and time-based queries.</li>
            <li><strong>Visualization (Grafana):</strong> Grafana, running in its own Docker container, connects to the PostgreSQL database to query and display the data in customizable dashboards featuring graphs, stats, and gauges.</li>
            <li><strong>Orchestration (Docker Compose):</strong> The entire backend (Flask app, PostgreSQL, Grafana) is defined and managed by a `docker-compose.yml` file, simplifying setup and ensuring services can communicate.</li>
        </ol>
        {<img src="/power_monitor/architecture.png" alt="System Architecture" class="rounded-lg shadow-lg mt-4 w-full"/>}
      </div>

      {/* Hardware Setup & ESP8266 */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="hardware-setup" class="text-3xl font-bold text-secondary">Hardware Setup & ESP8266 Firmware</h2>
        <p>
          The core of the data acquisition involves an ESP8266 microcontroller (like a NodeMCU or Wemos D1 Mini) interfaced with a PZEM-004T v3.0/v4.0 (Modbus version) energy sensor.
        </p>
        <p class="font-bold text-red-600">
            ⚠️ Safety First! Working with mains voltage (220-240V AC) is dangerous. Ensure you understand electrical safety practices or consult a qualified electrician before attempting any wiring.
        </p>
        <p>
            The PZEM-004T's TX/RX pins are connected to the ESP8266's GPIO pins configured for SoftwareSerial communication. The ESP8266 firmware, written in C++ using the Arduino framework, handles:
        </p>
        <ul class="list-disc list-inside">
            <li>Initializing SoftwareSerial for Modbus communication.</li>
            <li>Using the ModbusMaster library to read input registers from the PZEM-004T.</li>
            <li>Parsing the raw register data into meaningful values (Voltage, Current, etc.).</li>
            <li>Connecting to Wi-Fi.</li>
            <li>Constructing a JSON payload with the sensor data.</li>
            <li>Sending the JSON payload via an HTTP POST request to the Python ingester application.</li>
        </ul>
        { <div class="flex flex-col md:flex-row gap-4 mt-6">
            <div class="flex-1">
            <img src="/power_monitor/hardware_pre_assembly.png" class="rounded-lg shadow-lg"/>
            <p class="text-center mt-2 text-sm text-gray-600">ESP8266 and PZEM-004T</p>
            </div>
            <div class="flex-1">
            <img src="/power_monitor/hardware.png" class="rounded-lg shadow-lg"/>
            <p class="text-center mt-2 text-sm text-gray-600">ESP8266 wired to PZEM-004T</p>
            </div>
        </div> }
      </div>

      {/* Data Pipeline */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="data-pipeline" class="text-3xl font-bold text-secondary">Data Pipeline: Python, PostgreSQL, Docker</h2>
        <p>
          Once the ESP8266 sends data, it enters our Dockerized backend:
        </p>
        <p>
            <strong>Python Flask Ingester:</strong> A simple Flask web server exposes an HTTP endpoint (e.g., `/data`). When a POST request with JSON data arrives, the application:
            <ul class="list-disc list-inside ml-4">
                <li>Parses the JSON payload.</li>
                <li>Performs basic validation (e.g., checks for required fields).</li>
                <li>Connects to the PostgreSQL database using `psycopg2`.</li>
                <li>Constructs and executes an SQL `INSERT` statement to store the readings in a `sensor_readings` table. This table includes a `reading_time` timestamp (with time zone) which defaults to `CURRENT_TIMESTAMP`.</li>
            </ul>
        </p>
        <p>
            <strong>PostgreSQL Database:</strong> The `sensor_readings` table is structured to efficiently store the time-series data, with columns for each metric (voltage, current, power, energy, frequency, power_factor, alarm_status) and a device ID. Indexes on `reading_time` and `device_id` help optimize query performance for Grafana.
        </p>
        <p>
            <strong>Docker & Docker Compose:</strong> All backend services (Flask app, PostgreSQL, Grafana) are defined in a `docker-compose.yml` file. This allows for:
            <ul class="list-disc list-inside ml-4">
                <li>Easy one-command startup (`docker-compose up --build -d`).</li>
                <li>Isolated environments for each service.</li>
                <li>Defined networking, allowing services to communicate (e.g., Flask app connects to `postgres_db` by its service name).</li>
                <li>Persistent data storage for PostgreSQL and Grafana using Docker volumes.</li>
                <li>Simplified dependency management for the Python app through its `Dockerfile` and `requirements.txt`.</li>
            </ul>
        </p>
      </div>

      {/* Visualization with Grafana */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="visualization" class="text-3xl font-bold text-secondary">Visualization with Grafana</h2>
        <p>
            Grafana is the final piece, providing a powerful and flexible way to visualize the collected energy data. After setting up PostgreSQL as a data source in Grafana, dashboards are created with various panels:
        </p>
        <ul class="list-disc list-inside">
            <li><strong>Time Series Graphs:</strong> For Voltage, Current, Active Power, Frequency, and Power Factor, showing trends over time. These heavily utilize Grafana's `$__timeFilter()` macro in SQL queries to dynamically adjust to the selected time range. Y-axis scaling is adjusted for better readability of small fluctuations.</li>
            <li><strong>Stat Panels:</strong> To display current or summarized values like "Total Accumulated Energy," "Energy Used Today," and the current "Alarm Status" (with value mappings for "Normal"/"ALARM!").</li>
            <li><strong>Gauge Panels:</strong> (Optional) Could be used for instantaneous power or voltage.</li>
        </ul>
        <p>
            The dashboard is configured with auto-refresh to provide a near real-time view of energy consumption. Timezone settings are crucial for ensuring data is displayed correctly relative to the user's local time, given that the database stores timestamps in UTC.
        </p>
        {/* Main Dashboard Screenshot/Video */}
        <div class="flex justify-center items-center rounded-lg overflow-hidden my-6">
            {/* Replace with a video if you have one, or use the image */}
            <img src="/power_monitor/dashboard.png" alt="Live Grafana Dashboard" class="w-full md:w-3/4 h-auto rounded-lg shadow-lg"/>
            {/* <video src="/grafana_live_demo.mp4" class="w-full md:w-3/4 h-auto rounded-lg shadow-lg" autoplay loop muted playsInline></video> */}
        </div>
        <p class="text-center text-sm text-gray-600">A snapshot of the main Grafana dashboard in action.</p>
      </div>

      {/* Key Features Implemented */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="key-features" class="text-3xl font-bold text-secondary">Key Features Implemented</h2>
        <ul class="list-disc list-inside">
            <li>End-to-end data flow from sensor to visual dashboard.</li>
            <li>Robust Modbus communication with the PZEM-004T.</li>
            <li>Containerized and easily deployable backend services using Docker Compose.</li>
            <li>Persistent storage of historical energy data in PostgreSQL.</li>
            <li>Dynamic and interactive Grafana dashboards for multiple metrics.</li>
            <li>Calculation of derived metrics like "Energy Used Today."</li>
            <li>Clear separation of concerns: data acquisition (ESP), data ingestion (Flask), storage (PostgreSQL), and visualization (Grafana).</li>
        </ul>
      </div>
      
      {/* Conclusion */}
      <div class="prose max-w-4xl mx-auto mb-12">
        <h2 id="conclusion" class="text-3xl font-bold text-secondary">Conclusion</h2>
        <p>
          This project successfully demonstrates a complete pipeline for monitoring and visualizing energy consumption. It combines embedded programming, backend development, database management, and data visualization, offering valuable insights into energy usage patterns. The use of Docker makes the entire system portable and easy to manage.
        </p>
        <p>
          Thank you for reading! The complete source code and setup instructions are available on GitHub. I hope this project serves as a useful example or inspiration for your own IoT and data projects.
        </p>
        <div class="mt-8 text-center">
          <a
            href="https://github.com/itsnova204/power_monitor" // UPDATE THIS TO YOUR ACTUAL GITHUB REPO LINK
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary btn-lg" // Make sure your site has these CSS classes or adapt
          >
            View Project on GitHub
          </a>
        </div>
      </div>

      {/* Related Projects */}
      <div class="mt-16">
        <h2 class="text-4xl font-extrabold text-primary text-center mb-8">
          Other Projects
        </h2>
        <Projects projects={otherProjects} />
      </div>
    </section>
  );
}