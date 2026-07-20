import { Link } from 'react-router-dom';

import { Button } from '../components/shared';

const STEPS = [
  {
    icon: '🏢',
    title: 'Set up your operation',
    description: 'Add your depots, drivers, and vehicles — their hours, capacity, and shifts.',
  },
  {
    icon: '📦',
    title: 'Add your deliveries',
    description: 'Enter stops one by one, or import a whole day’s route from a CSV/Excel file.',
  },
  {
    icon: '🤖',
    title: 'Let AI optimize the routes',
    description:
      'Our OR-Tools engine builds routes that respect time windows, capacity, and driver hours — then an AI explains the plan in plain language.',
  },
  {
    icon: '💬',
    title: 'Track and adapt in real time',
    description:
      'Watch routes on the map, and chat with the AI to replan instantly when something changes.',
  },
];

const VALUE_PROPS = [
  {
    icon: '⏱️',
    title: 'Hours of planning, done in minutes',
    description: 'Stop manually sequencing stops on a spreadsheet or a map.',
  },
  {
    icon: '📉',
    title: 'Shorter, cheaper routes',
    description:
      'Combinatorial optimization finds routes a human planner would miss, cutting distance and fuel spend.',
  },
  {
    icon: '✅',
    title: 'Fewer late deliveries',
    description: 'Time windows, breaks, and driver hours are respected automatically, not by hand.',
  },
  {
    icon: '🔒',
    title: 'Your data, isolated',
    description: 'Every organization’s deliveries, drivers, and routes are fully separated.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <main>
        {/* Full-viewport hero: responsive art-directed photo (different crops
            per breakpoint, not just resolution switching) with the nav and
            headline overlaid on a bottom-up gradient for legibility. */}
        <section className="relative h-screen w-full overflow-hidden">
          <picture>
            <source media="(min-width: 1280px)" srcSet="/images/hero/hero-desktop.webp" />
            <source media="(min-width: 641px)" srcSet="/images/hero/hero-tablet.webp" />
            <img
              src="/images/hero/hero-mobile.webp"
              alt="A happy courier smiling in front of their delivery vehicle"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-canvas/10" />

          <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <span>🚚</span>
              AI Delivery Planner
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-ink-muted hover:text-ink no-underline">
                Log in
              </Link>
              <Link to="/register">
                <Button variant="primary">Get started free</Button>
              </Link>
            </div>
          </header>

          <div className="relative z-10 h-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-end pb-20 text-center gap-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight m-0">
              Plan your delivery routes with AI, not spreadsheets.
            </h1>
            <p className="text-lg text-ink-muted max-w-2xl m-0">
              AI Delivery Planner combines route optimization with an AI assistant so your team can
              plan a full day of deliveries — drivers, vehicles, and stops — in minutes, then adapt
              on the fly when plans change.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link to="/register">
                <Button variant="primary">Get started free</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">Log in</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="bg-card border border-edge rounded-lg p-5 shadow-card flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl leading-none">{step.icon}</span>
                  <span className="text-xs font-mono text-ink-muted">Step {i + 1}</span>
                </div>
                <h3 className="font-semibold m-0">{step.title}</h3>
                <p className="text-sm text-ink-muted m-0">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-bold text-center mb-10">Why teams use it</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUE_PROPS.map((value) => (
              <div
                key={value.title}
                className="bg-card border border-edge rounded-lg p-5 shadow-card flex items-start gap-4"
              >
                <span className="text-3xl leading-none">{value.icon}</span>
                <div>
                  <h3 className="font-semibold m-0 mb-1">{value.title}</h3>
                  <p className="text-sm text-ink-muted m-0">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-24 text-center flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold m-0">Ready to plan smarter?</h2>
          <p className="text-ink-muted m-0">
            Create a free account and optimize your first route today.
          </p>
          <Link to="/register">
            <Button variant="primary">Get started free</Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
