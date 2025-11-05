"use server";

import Link from "next/link";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpcomingEvent } from "@/components/upcoming-event";
import { getUpcomingEvents } from "@/lib/actions/events";
import { tryCatch } from "@/utils/try-catch";

export default async function Home() {
  const { error, data } = await tryCatch(getUpcomingEvents());

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const upcomingEvents = data?.map((event) => ({
    id: event.event.id,
    name: event.event.eventName,
    date: event.event.startDate ?? null,
  }));

  return (
    <>
      <main className="min-h-screen">
        <Container className="from-background to-background/95 border-b border-slate-800/60 bg-gradient-to-b py-20 md:py-32">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Manage Your Events with{" "}
                <span className="text-cyan-400">Ease</span>
              </h1>
              <p className="text-lg text-slate-300 md:text-xl">
                Fastbreak Events provides a powerful, intuitive platform for
                creating, managing, and tracking events. Everything you need in
                one place.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-cyan-500 text-white hover:bg-cyan-600"
                >
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-cyan-400">Upcoming Events</CardTitle>
                <CardDescription className="text-slate-400">
                  {`Check out what's coming soon`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <UpcomingEvent
                    key={event.id}
                    name={event.name}
                    date={event.date}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>

        <Container className="border-b border-slate-800/60 py-20">
          <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
            Everything You Need
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Powerful features designed to make event management simple and
            efficient
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Easy Event Creation
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Create and manage events with our intuitive interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Set up events in minutes with all the details you need. Manage
                  dates, venues, and descriptions effortlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Venue Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Organize and track your event locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Keep all your venues in one place. Add details, track
                  capacities, and manage locations with ease.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Ticket Tracking</CardTitle>
                <CardDescription className="text-slate-400">
                  Monitor ticket sales and attendance in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Stay on top of your event&apos;s performance with detailed
                  ticket tracking and analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Secure Dashboard</CardTitle>
                <CardDescription className="text-slate-400">
                  Protected access to all your event data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Your events are secured with enterprise-grade authentication.
                  Access your dashboard from anywhere.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Real-time Updates</CardTitle>
                <CardDescription className="text-slate-400">
                  Always stay in sync with live data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Changes reflect instantly across all your devices. Never miss
                  an important update.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Beautiful Interface
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Clean, modern design that&apos;s a joy to use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Experience a thoughtfully designed interface that makes event
                  management both powerful and pleasant.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>

        <Container className="py-20">
          <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white md:text-4xl">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg text-slate-300">
                Join thousands of event organizers using Fastbreak Events
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-cyan-500 text-white hover:bg-cyan-600"
              >
                <Link href="/dashboard">Start Managing Events</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </main>

      <footer className="border-t border-slate-800/60 bg-slate-900/30 py-8">
        <Container className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>Fastbreak AI</p>
          <p>Created with ❤️ by RonB</p>
        </Container>
      </footer>
    </>
  );
}
