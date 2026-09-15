import Image from "next/image";
import type { Positioning } from "@/lib/types";
import CTALink from "../ui/CTALink";
import TechIcon from "../ui/TechIcon";
import Reveal from "../ui/Reveal";

const TECH_PILLS = [
  { iconClass: "devicon-fastapi-plain", title: "FastAPI" },
  { iconClass: "devicon-docker-plain", title: "Docker" },
  { iconClass: "devicon-nodejs-plain-wordmark", title: "Node.js" },
  { iconClass: "devicon-python-plain", title: "Python" },
];

/**
 * Hero section — headline/intro/tech-pills/CTAs from the `Positioning`
 * content fixture (STORY-2.1: repositioned Backend & AI Systems Engineer
 * headline, replacing the legacy "Full Stack. Backend Dev" copy). Server
 * Component; renders whatever headline string it is given, never
 * hardcodes copy — the approved wording lives in `content/site-copy.json`.
 *
 * @param positioning - the `Positioning` content fixture (headline, etc.)
 */
export default function Hero({ positioning }: { positioning: Positioning }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col overflow-hidden p-4 max-md:mt-[50px]"
    >
      <div className="flex h-full min-h-screen w-full items-center justify-center gap-6 p-[5%] max-lg:flex-col">
        <div className="flex flex-col justify-center">
          <Reveal>
            <h1 className="max-w-2xl text-5xl font-semibold leading-tight max-lg:text-3xl">
              {positioning.headline}
            </h1>
          </Reveal>
          <Reveal>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {TECH_PILLS.map((pill) => (
                <TechIcon key={pill.title} {...pill} />
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-4 flex items-center gap-4">
              <CTALink href="mailto:deepsenchowa1@gmail.com" label="Get in touch" icon="bi-arrow-up-right" />
              <CTALink href="https://github.com/deep663" label="GitHub" icon="bi-github" external />
            </div>
          </Reveal>
        </div>
        <div className="flex aspect-square w-full max-w-[50%] items-center justify-center overflow-hidden max-lg:max-w-full">
          <Image
            src="/images/home/profile.png"
            alt="Deep Senchowa"
            width={480}
            height={480}
            className="h-full w-full object-contain grayscale transition-[filter] duration-700 hover:grayscale-0"
            priority
          />
        </div>
      </div>
    </section>
  );
}
