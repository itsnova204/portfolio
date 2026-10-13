import { useEffect, useRef, useState } from "preact/hooks";

/**
 * Runs the NES emulator from https://github.com/itsnova204/NES_Emulator-LCOM
 * in the browser. The C core (CPU, PPU, bus, cartridge) is compiled to
 * WebAssembly with Emscripten (see web/ in that repo) and served from /nes/nes.js.
 */

interface HomebrewRom {
  id: string;
  title: string;
  author: string;
  license: string;
  source: string;
  description: string;
  howTo: string;
}

// Every ROM here is free/open-source homebrew, verified to boot and accept
// input on this emulator (NTSC). License texts: /roms/licenses/
// The first entry is the default cartridge, booted when the emulator scrolls into view.
const ROMS: HomebrewRom[] = [
  {
    id: "2048",
    title: "2048",
    author: "mmuszkow",
    license: "Unlicense",
    source: "https://github.com/mmuszkow/2048-nes",
    description: "The sliding-tile puzzle: merge numbers until you reach 2048.",
    howTo: "Start, then slide the tiles with the D-pad.",
  },
  {
    id: "nova",
    title: "Nova the Squirrel",
    author: "NovaSquirrel",
    license: "GPL-3.0 / CC BY-NC-SA",
    source: "https://github.com/NovaSquirrel/NovaTheSquirrel",
    description:
      "A full side-scrolling platformer with Kirby-style copy abilities.",
    howTo: "Start, pick Start! in the level menu, A to jump, Up to read signs.",
  },
  {
    id: "snake",
    title: "openNES Snake",
    author: "Sebastian Dine",
    license: "zlib",
    source: "https://github.com/sebastiandine/openNES-Snake",
    description: "The classic: eat, grow, and don't bite your own tail.",
    howTo: "Start, then steer with the D-pad.",
  },
];

// Controller bits, in the order the NES shifts them out of $4016 / $4017
const BTN = {
  A: 0x80,
  B: 0x40,
  SELECT: 0x20,
  START: 0x10,
  UP: 0x08,
  DOWN: 0x04,
  LEFT: 0x02,
  RIGHT: 0x01,
} as const;
type Button = keyof typeof BTN;

const KEYMAP: Record<string, number> = {
  KeyW: BTN.UP,
  KeyA: BTN.LEFT,
  KeyS: BTN.DOWN,
  KeyD: BTN.RIGHT,
  KeyJ: BTN.B,
  KeyK: BTN.A,
  KeyN: BTN.SELECT,
  KeyM: BTN.START,
  ArrowUp: BTN.UP,
  ArrowLeft: BTN.LEFT,
  ArrowDown: BTN.DOWN,
  ArrowRight: BTN.RIGHT,
};

const LOAD_ERRORS: Record<number, string> = {
  1: "Could not read the ROM file.",
  2: "That file is not an iNES (.nes) ROM.",
  3: "This ROM uses a cartridge mapper the emulator does not implement yet (supported: mapper 0 / NROM and mapper 1 / MMC1).",
  4: "The emulator failed to initialise the cartridge.",
};

const NES_W = 256;
const NES_H = 240;
const FRAME_MS = 1000 / 60.0988; // NTSC frame rate
const MAX_ROM_BYTES = 1024 * 1024;

interface NesModule {
  FS: { writeFile(path: string, data: Uint8Array): void };
  HEAPU8: Uint8Array;
  ccall(name: string, ret: string, types: string[], args: unknown[]): number;
  _nes_frame(): number;
  _nes_framebuffer(): number;
  _nes_set_buttons(player: number, mask: number): void;
  _nes_reset(): void;
}

let modulePromise: Promise<NesModule> | null = null;
function loadModule(): Promise<NesModule> {
  if (!modulePromise) {
    // Non-literal specifier: served as-is from /static, not bundled by Fresh.
    const url = "/nes/nes.js";
    modulePromise = import(url)
      .then((m) => m.default({ print() {}, printErr() {} }))
      .catch((e) => {
        modulePromise = null;
        throw e;
      });
  }
  return modulePromise;
}

function gamepadMask(gp: Gamepad | null): number {
  if (!gp) return 0;
  const pressed = (i: number) => gp.buttons[i]?.pressed ?? false;
  const [x = 0, y = 0] = gp.axes;
  let mask = 0;
  // Standard mapping: Nintendo layout, right face button is A.
  if (pressed(1) || pressed(3)) mask |= BTN.A;
  if (pressed(0) || pressed(2)) mask |= BTN.B;
  if (pressed(8)) mask |= BTN.SELECT;
  if (pressed(9)) mask |= BTN.START;
  if (pressed(12) || y < -0.5) mask |= BTN.UP;
  if (pressed(13) || y > 0.5) mask |= BTN.DOWN;
  if (pressed(14) || x < -0.5) mask |= BTN.LEFT;
  if (pressed(15) || x > 0.5) mask |= BTN.RIGHT;
  return mask;
}

const isTouch = () => globalThis.matchMedia?.("(pointer: coarse)").matches;

type Status = "idle" | "loading" | "running" | "paused" | "error";

export default function NesEmulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const nesRef = useRef<NesModule | null>(null);
  const pausedRef = useRef(false);
  const loadId = useRef(0); // newest load wins if two overlap
  const keyMask = useRef(0);
  const touchMask = useRef(0);
  const dpadMask = useRef(0);
  // Buttons pressed since the last emulated frame, so a tap shorter than one
  // frame (~16 ms) still reaches the game.
  const tapMask = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [current, setCurrent] = useState("");
  const [fps, setFps] = useState(0);
  const [focused, setFocused] = useState(false);
  const [pads, setPads] = useState(0);
  const [canFullscreen, setCanFullscreen] = useState(false);

  // Main loop: fixed 60 Hz emulation regardless of the display refresh rate.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(NES_W, NES_H);
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let frames = 0;
    let fpsSince = last;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const nes = nesRef.current;
      const delta = Math.min(now - last, 100); // don't fast-forward after a stall
      last = now;
      if (!nes || pausedRef.current) return;

      const gamepads = (navigator.getGamepads?.() ?? []).filter(
        (g): g is Gamepad => g !== null,
      );
      nes._nes_set_buttons(
        0,
        keyMask.current | touchMask.current | dpadMask.current |
          tapMask.current | gamepadMask(gamepads[0] ?? null),
      );
      nes._nes_set_buttons(1, gamepadMask(gamepads[1] ?? null));

      acc += delta;
      let ran = false;
      while (acc >= FRAME_MS) {
        nes._nes_frame();
        acc -= FRAME_MS;
        frames++;
        ran = true;
      }
      if (ran) {
        tapMask.current = 0;
        const ptr = nes._nes_framebuffer();
        image.data.set(nes.HEAPU8.subarray(ptr, ptr + NES_W * NES_H * 4));
        ctx.putImageData(image, 0, 0);
      }
      if (now - fpsSince >= 1000) {
        setFps(Math.round((frames * 1000) / (now - fpsSince)));
        frames = 0;
        fpsSince = now;
      }
    };
    raf = requestAnimationFrame(tick);
    setCanFullscreen(document.fullscreenEnabled === true);

    const releaseKeys = () => {
      keyMask.current = 0;
      touchMask.current = 0;
      dpadMask.current = 0;
    };
    const countPads = () =>
      setPads(
        (navigator.getGamepads?.() ?? []).filter((g) => g !== null).length,
      );
    document.addEventListener("visibilitychange", releaseKeys);
    globalThis.addEventListener("blur", releaseKeys);
    globalThis.addEventListener("gamepadconnected", countPads);
    globalThis.addEventListener("gamepaddisconnected", countPads);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", releaseKeys);
      globalThis.removeEventListener("blur", releaseKeys);
      globalThis.removeEventListener("gamepadconnected", countPads);
      globalThis.removeEventListener("gamepaddisconnected", countPads);
    };
  }, []);

  async function start(
    title: string,
    getBytes: () => Promise<ArrayBuffer>,
    interactive = true,
  ) {
    const id = ++loadId.current;
    setStatus("loading");
    setError("");
    try {
      const [nes, bytes] = await Promise.all([loadModule(), getBytes()]);
      if (id !== loadId.current) return;
      if (bytes.byteLength > MAX_ROM_BYTES) {
        throw new Error("That file is too large for a supported cartridge.");
      }
      nesRef.current = null;
      nes.FS.writeFile("/rom.nes", new Uint8Array(bytes));
      const code = nes.ccall("nes_load", "number", ["string"], ["/rom.nes"]);
      if (code !== 0) throw new Error(LOAD_ERRORS[code] ?? `Error ${code}`);
      nesRef.current = nes;
      pausedRef.current = false;
      setCurrent(title);
      setStatus("running");
      const screen = screenRef.current;
      if (screen) {
        screen.classList.remove("crt-boot");
        void screen.offsetWidth; // restart the CSS animation
        screen.classList.add("crt-boot");
      }
      if (!interactive) {
        // auto-boot: don't steal keyboard focus or scroll the page
      } else if (isTouch()) {
        // bring the whole console (screen + pad) into view on phones
        screenRef.current?.closest(".gb-shell")?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      } else {
        screenRef.current?.focus();
      }
    } catch (e) {
      if (id !== loadId.current) return;
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  function playBundled(rom: HomebrewRom, interactive = true) {
    start(rom.title, async () => {
      const res = await fetch(`/roms/${rom.id}.nes`);
      if (!res.ok) throw new Error(`Could not download ${rom.title}.`);
      return res.arrayBuffer();
    }, interactive);
  }

  // Boot the default cartridge once the emulator first scrolls into view, so
  // the WASM is only downloaded by visitors who reach this section.
  useEffect(() => {
    const el = screenRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      if (!nesRef.current) playBundled(ROMS[0], false);
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function playUpload(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (file) start(file.name, () => file.arrayBuffer());
  }

  function togglePause() {
    if (!nesRef.current) return;
    pausedRef.current = !pausedRef.current;
    setStatus(pausedRef.current ? "paused" : "running");
    screenRef.current?.focus();
  }

  function reset() {
    nesRef.current?._nes_reset();
    screenRef.current?.focus();
  }

  function fullscreen() {
    // On touch screens the pad must stay visible, so the whole console goes fullscreen
    const target = isTouch()
      ? screenRef.current?.closest(".gb-shell")
      : screenRef.current;
    target?.requestFullscreen?.();
    screenRef.current?.focus();
  }

  function onKey(e: KeyboardEvent, down: boolean) {
    const bit = KEYMAP[e.code];
    if (bit === undefined || !nesRef.current) return;
    e.preventDefault(); // keep arrows / enter from scrolling the page
    keyMask.current = down ? keyMask.current | bit : keyMask.current & ~bit;
    if (down) tapMask.current |= bit;
  }

  const touch = (button: Button) => ({
    onPointerDown: (e: PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      touchMask.current |= BTN[button];
      tapMask.current |= BTN[button];
    },
    onPointerUp: () => (touchMask.current &= ~BTN[button]),
    onPointerCancel: () => (touchMask.current &= ~BTN[button]),
    onContextMenu: (e: Event) => e.preventDefault(),
  });

  // Whole-cross D-pad: direction comes from where the thumb is, so it can
  // roll between directions (and diagonals) without lifting, like a real pad.
  function dpadAt(e: PointerEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const dead = 0.12;
    let mask = 0;
    if (y < -dead && Math.abs(x) < Math.abs(y) * 2.2) mask |= BTN.UP;
    if (y > dead && Math.abs(x) < Math.abs(y) * 2.2) mask |= BTN.DOWN;
    if (x < -dead && Math.abs(y) < Math.abs(x) * 2.2) mask |= BTN.LEFT;
    if (x > dead && Math.abs(y) < Math.abs(x) * 2.2) mask |= BTN.RIGHT;
    dpadMask.current = mask;
    tapMask.current |= mask;
  }
  const dpad = {
    onPointerDown: (e: PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      dpadAt(e);
    },
    onPointerMove: (e: PointerEvent) => {
      if (e.buttons || e.pointerType === "touch") dpadAt(e);
    },
    onPointerUp: () => (dpadMask.current = 0),
    onPointerCancel: () => (dpadMask.current = 0),
    onContextMenu: (e: Event) => e.preventDefault(),
  };

  const running = status === "running" || status === "paused";

  return (
    <div class="not-prose grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div class="gb-shell flex flex-col gap-3 min-w-0">
        <div class="crt" data-power={running ? "on" : "off"}>
          <div
            ref={screenRef}
            tabIndex={0}
            aria-label="NES screen. Focus it to use the keyboard controls."
            onKeyDown={(e) => onKey(e, true)}
            onKeyUp={(e) => onKey(e, false)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              keyMask.current = 0;
            }}
            class="crt-screen relative w-full mx-auto bg-black overflow-hidden outline-none flex items-center justify-center"
          >
            <canvas
              ref={canvasRef}
              width={NES_W}
              height={NES_H}
              class="crt-canvas w-full h-auto max-h-screen aspect-[256/240] object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <div class="crt-glass" aria-hidden="true" />
            {!running && (
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center text-neutral-content bg-neutral/80">
                {status === "loading"
                  ? <span class="loading loading-spinner loading-lg" />
                  : (
                    <>
                      <p class="text-lg font-bold">
                        Pick a homebrew game to boot the emulator
                      </p>
                      <p class="text-sm opacity-80">
                        The C core from the Minix project, compiled to
                        WebAssembly.
                      </p>
                    </>
                  )}
              </div>
            )}
            {status === "paused" && (
              <div class="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-2xl font-bold tracking-widest">
                PAUSED
              </div>
            )}
            {running && !focused && status === "running" && (
              <button
                type="button"
                class="gb-hide-touch absolute bottom-2 left-1/2 -translate-x-1/2 btn btn-xs btn-neutral opacity-90"
                onClick={() => screenRef.current?.focus()}
              >
                Click here to use the keyboard
              </button>
            )}
          </div>
          <div class="crt-panel" aria-hidden="true">
            <span class="crt-brand">LCOM·VISION</span>
            <span class="crt-grille" />
            <span class="crt-led-group">
              <span class={`crt-led ${focused ? "crt-led-amber" : ""}`} />
              KBD
            </span>
            <span class="crt-led-group">
              <span class={`crt-led ${running ? "crt-led-green" : ""}`} />
              PWR
            </span>
            <span class="crt-knob" />
            <span class="crt-knob" />
          </div>
        </div>

        {error && (
          <div role="alert" class="alert alert-error max-w-3xl mx-auto w-full">
            <span>{error}</span>
          </div>
        )}

        <div class="gb-status flex flex-wrap items-center justify-center gap-2">
          <span class="text-sm opacity-80 mr-auto truncate">
            {running
              ? (
                <>
                  Playing <b>{current}</b> · {fps} fps
                  {pads > 0 && ` · ${pads} gamepad${pads > 1 ? "s" : ""}`}
                </>
              )
              : "No cartridge inserted"}
          </span>
          <button
            type="button"
            class="btn btn-sm"
            disabled={!running}
            onClick={togglePause}
          >
            {status === "paused" ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            class="btn btn-sm"
            disabled={!running}
            onClick={reset}
          >
            Reset
          </button>
          {canFullscreen && (
            <button
              type="button"
              class="btn btn-sm"
              disabled={!running}
              onClick={fullscreen}
            >
              Fullscreen
            </button>
          )}
        </div>

        {/* Game Boy style controller, shown on touch screens only (see styles.css) */}
        <div class="gb-controls" aria-label="Touch controller">
          <div class="gb-dpad" role="group" aria-label="D-pad" {...dpad}>
            <span class="gb-dpad-v" />
            <span class="gb-dpad-h" />
          </div>
          <div class="gb-ab">
            <div class="gb-btn-wrap gb-b">
              <button
                type="button"
                class="gb-btn"
                aria-label="B"
                {...touch("B")}
              />
              <span>B</span>
            </div>
            <div class="gb-btn-wrap gb-a">
              <button
                type="button"
                class="gb-btn"
                aria-label="A"
                {...touch("A")}
              />
              <span>A</span>
            </div>
          </div>
          <div class="gb-menu">
            <div class="gb-pill-wrap">
              <button
                type="button"
                class="gb-pill"
                aria-label="Select"
                {...touch("SELECT")}
              />
              <span>SELECT</span>
            </div>
            <div class="gb-pill-wrap">
              <button
                type="button"
                class="gb-pill"
                aria-label="Start"
                {...touch("START")}
              />
              <span>START</span>
            </div>
          </div>
        </div>
      </div>

      <aside class="flex flex-col gap-3">
        <h3 class="text-xl font-bold">Free &amp; open-source homebrew</h3>
        <ul class="flex flex-col gap-2">
          {ROMS.map((rom) => (
            <li key={rom.id} class="card card-compact bg-base-200">
              <div class="card-body gap-1">
                <div class="flex items-start gap-2">
                  <div class="min-w-0">
                    <h4 class="font-bold leading-tight">{rom.title}</h4>
                    <p class="text-xs opacity-70">by {rom.author}</p>
                  </div>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm ml-auto"
                    disabled={status === "loading"}
                    onClick={() =>
                      playBundled(rom)}
                  >
                    {current === rom.title && running ? "Restart" : "Play"}
                  </button>
                </div>
                <p class="text-sm">{rom.description}</p>
                <p class="text-xs opacity-70">{rom.howTo}</p>
                <div class="flex gap-2 text-xs">
                  <a
                    class="badge badge-outline hover:badge-primary"
                    href={`/roms/licenses/${rom.id}.txt`}
                    target="_blank"
                  >
                    {rom.license}
                  </a>
                  <a
                    class="link"
                    href={rom.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source code
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <label class="form-control w-full">
          <span class="label-text text-sm mb-1">
            Or load your own <code>.nes</code> file (stays in your browser)
          </span>
          <input
            type="file"
            accept=".nes"
            class="file-input file-input-bordered file-input-sm w-full"
            disabled={status === "loading"}
            onChange={playUpload}
          />
        </label>
      </aside>

      <div class="lg:col-span-2 grid gap-4 md:grid-cols-2 text-sm">
        <div>
          <h3 class="font-bold mb-2">Controls</h3>
          <table class="table table-xs">
            <tbody>
              <tr>
                <td>D-pad</td>
                <td>
                  <kbd class="kbd kbd-xs">W</kbd>{" "}
                  <kbd class="kbd kbd-xs">A</kbd>{" "}
                  <kbd class="kbd kbd-xs">S</kbd>{" "}
                  <kbd class="kbd kbd-xs">D</kbd> (or arrow keys)
                </td>
              </tr>
              <tr>
                <td>B / A</td>
                <td>
                  <kbd class="kbd kbd-xs">J</kbd> /{" "}
                  <kbd class="kbd kbd-xs">K</kbd>
                </td>
              </tr>
              <tr>
                <td>Select / Start</td>
                <td>
                  <kbd class="kbd kbd-xs">N</kbd> /{" "}
                  <kbd class="kbd kbd-xs">M</kbd>
                </td>
              </tr>
              <tr>
                <td>Touch</td>
                <td>
                  On phones and tablets: Game Boy style pad under the screen
                </td>
              </tr>
              <tr>
                <td>Gamepad</td>
                <td>Plug in and press a button; a 2nd pad is player 2</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 class="font-bold mb-2">What this build supports</h3>
          <ul class="list-disc list-inside space-y-1 opacity-90">
            <li>
              6502 CPU, PPU (backgrounds, sprites, scrolling, sprite 0 hit) and
              OAM DMA
            </li>
            <li>
              NROM and MMC1 cartridges (mappers 0 and 1), NTSC timing
            </li>
            <li>No audio: the APU was never part of the project</li>
            <li>Commercial games need other mappers and are not provided</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
