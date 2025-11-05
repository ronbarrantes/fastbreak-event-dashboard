"use server";

import { Suspense } from "react";

import Link from "next/link";

import { Container } from "@/components/container";
import { UpcomingEventsSkeleton } from "@/components/skeletons/upcoming-event-skeleton";
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

async function UpcomingEvents() {
  const { error, data } = await tryCatch(getUpcomingEvents());

  if (error) {
    return (
      <p className="text-sm text-red-400">
        Failed to load upcoming events. Please try again later.
      </p>
    );
  }

  const upcomingEvents =
    data?.map((event) => ({
      id: event.event.id,
      name: event.event.eventName,
      date: event.event.startDate ?? null,
    })) ?? [];

  if (upcomingEvents.length === 0) {
    return (
      <p className="text-sm text-slate-400">No upcoming events at this time.</p>
    );
  }

  return (
    <>
      {upcomingEvents.map((event) => (
        <UpcomingEvent key={event.id} name={event.name} date={event.date} />
      ))}
    </>
  );
}

export default async function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Container className="from-background to-background/95 border-b border-slate-800/60 bg-gradient-to-b py-20 md:py-32">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Discover & Attend{" "}
                <span className="text-cyan-400">Sports Events</span>
              </h1>
              <p className="text-lg text-slate-300 md:text-xl">
                Find exciting sports events near you, purchase tickets, and
                manage your attendance all in one place. Whether you&apos;re
                looking to attend or organize events, Fastbreak Events has you
                covered.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-cyan-500 text-white hover:bg-cyan-600"
                >
                  <Link href="/search">Browse Events</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Manage Events</Link>
                </Button>
              </div>
            </div>
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-cyan-400">Upcoming Events</CardTitle>
                <CardDescription className="text-slate-400">
                  Check out what&apos;s coming soon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Suspense fallback={<UpcomingEventsSkeleton count={3} />}>
                  <UpcomingEvents />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </Container>

        <Container className="border-b border-slate-800/60 py-20">
          <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
            Everything You Need
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Powerful features designed to make discovering and managing sports
            events simple
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Search & Discover Events
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Find events by name or filter by sport type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Easily search through all available sports events. Filter by
                  sport type to find exactly what you&apos;re looking for, from
                  basketball to soccer and more.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Buy Tickets</CardTitle>
                <CardDescription className="text-slate-400">
                  Purchase tickets for your favorite events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Secure your spot at upcoming events with just a few clicks.
                  Track your purchased tickets and manage your event attendance
                  effortlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Manage Your Events</CardTitle>
                <CardDescription className="text-slate-400">
                  Create, edit, and organize sports events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Event organizers can create and manage their events with ease.
                  Set dates, add venues, include descriptions, and organize
                  everything from one dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Track Your Attendance
                </CardTitle>
                <CardDescription className="text-slate-400">
                  View all events you&apos;re attending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Keep track of all the events you have tickets for. View event
                  details, dates, and venues all in one convenient place.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Venue Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Get details about event locations and amenities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Each event includes comprehensive venue information including
                  capacity, amenities, and location details to help you plan
                  your visit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Secure & Reliable</CardTitle>
                <CardDescription className="text-slate-400">
                  Protected access with enterprise-grade authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Your data is secured with Supabase authentication. Sign in
                  with email or Google to access all features safely.
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
                Start discovering events or manage your own sports events today
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-cyan-500 text-white hover:bg-cyan-600"
              >
                <Link href="/search">Browse Events</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">Manage Events</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </main>

      <footer className="border-t border-slate-800/60 bg-slate-900/30 py-8">
        <Container className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>Fastbreak Events</p>
          <p>Created with ❤️ by RonB</p>
        </Container>
      </footer>
    </>
  );
}
