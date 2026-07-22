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

const BEFORE_AFTER_METRICS = [
  {
    icon: '🕒',
    label: 'Route planning time',
    without: '2–3 hours of manual work every morning',
    withApp: 'Minutes — routes build automatically',
  },
  {
    icon: '⏳',
    label: 'Customer waiting time',
    without: 'Wide time windows and frequent delays',
    withApp: 'Tight, accurate ETAs and fewer late stops',
  },
  {
    icon: '👷',
    label: 'Driver working hours',
    without: 'Overtime from inefficient sequencing',
    withApp: 'Hours saved — shifts respected automatically',
  },
  {
    icon: '⛽',
    label: 'Fuel spend',
    without: 'Extra miles from suboptimal routes',
    withApp: 'Lower fuel costs from shorter routes',
  },
  {
    icon: '📦',
    label: 'Deliveries per day',
    without: 'Fewer stops fit in the same shift',
    withApp: 'More deliveries completed in the same shift',
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
              <img src="/favicon.svg" alt="" className="w-6 h-6" />
              AI Delivery Planner
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="primary">Log in</Button>
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
          <h2 className="text-2xl font-bold text-center mb-3">See the difference</h2>
          <p className="text-ink-muted text-center max-w-2xl mx-auto mb-10">
            The same drivers, vehicles, and deliveries — planned by hand versus planned by AI.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-card border border-edge rounded-lg shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-edge flex items-center gap-2">
                <span className="text-xl leading-none">✗</span>
                <h3 className="font-semibold m-0">Without AI Delivery Planner</h3>
              </div>
              <div className="divide-y divide-edge">
                {BEFORE_AFTER_METRICS.map((metric) => (
                  <div key={metric.label} className="px-5 py-4 flex items-start gap-3">
                    <span className="text-2xl leading-none">{metric.icon}</span>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">
                        {metric.label}
                      </div>
                      <p className="text-sm m-0">{metric.without}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-primary rounded-lg shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-edge flex items-center gap-2 bg-primary-muted">
                <span className="text-xl leading-none">✓</span>
                <h3 className="font-semibold m-0">With AI Delivery Planner</h3>
              </div>
              <div className="divide-y divide-edge">
                {BEFORE_AFTER_METRICS.map((metric) => (
                  <div key={metric.label} className="px-5 py-4 flex items-start gap-3">
                    <span className="text-2xl leading-none">{metric.icon}</span>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">
                        {metric.label}
                      </div>
                      <p className="text-sm m-0">{metric.withApp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-bold text-center mb-3">Same deliveries, two different routes</h2>
          <p className="text-ink-muted text-center max-w-2xl mx-auto mb-10">
            See how our optimizer redraws a driver&rsquo;s day — same stops, far less driving.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <figure className="m-0">
              <div className="rounded-lg border border-edge shadow-card overflow-hidden">
                <img
                  src="/images/before-after/route-without-app.webp"
                  alt="A long, zig-zagging delivery route planned by hand"
                  className="w-full h-auto"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm text-ink-muted">
                ✗ Without AI Delivery Planner — a longer, criss-crossing route
              </figcaption>
            </figure>
            <figure className="m-0">
              <div className="rounded-lg border border-primary shadow-card overflow-hidden">
                <img
                  src="/images/before-after/route-with-app.webp"
                  alt="A short, optimized delivery route planned by the AI"
                  className="w-full h-auto"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm text-ink-muted">
                ✓ With AI Delivery Planner — a shorter, optimized route
              </figcaption>
            </figure>
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
