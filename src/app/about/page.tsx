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

export default async function AboutPage() {
  return (
    <>
      <main className="min-h-screen">
        <Container className="from-background to-background/95 border-b border-slate-800/60 bg-gradient-to-b py-20 md:py-32">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              About{" "}
              <span className="text-cyan-400">Fastbreak Events</span>
            </h1>
            <p className="text-lg text-slate-300 md:text-xl">
              We&apos;re building the future of sports event management. Our
              platform makes it easy to create, organize, and manage events that
              bring communities together.
            </p>
          </div>
        </Container>

        <Container className="border-b border-slate-800/60 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
              Our Mission
            </h2>
            <div className="space-y-6">
              <Card className="border-slate-700 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">
                    Empowering Event Organizers
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Making event management accessible to everyone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    At Fastbreak Events, we believe that organizing sports
                    events should be simple, intuitive, and efficient. Whether
                    you&apos;re managing a local basketball tournament or a
                    large-scale championship, our platform provides all the tools
                    you need to succeed.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">
                    Built for the Community
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Connecting athletes, fans, and organizers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Sports bring people together. Our platform is designed to
                    make it easier for communities to organize and participate in
                    events. From creating event listings to tracking ticket sales,
                    we&apos;ve streamlined every step of the process.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Technology First</CardTitle>
                  <CardDescription className="text-slate-400">
                    Modern tools for modern organizers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Built with Next.js, Supabase, and cutting-edge web
                    technologies, Fastbreak Events delivers a fast, secure, and
                    reliable experience. Your data is protected with
                    enterprise-grade security, and our platform scales with your
                    needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>

        <Container className="border-b border-slate-800/60 py-20">
          <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
            Key Features
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Everything you need to manage your events successfully
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Event Creation</CardTitle>
                <CardDescription className="text-slate-400">
                  Simple, intuitive event setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Create detailed event listings with dates, venues, sport types,
                  and descriptions in minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Venue Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Organize your locations efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Manage multiple venues per event, track capacity, and keep all
                  location information in one place.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Search & Filter</CardTitle>
                <CardDescription className="text-slate-400">
                  Find events quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Powerful search and filtering capabilities help you find
                  exactly what you&apos;re looking for.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Secure Authentication</CardTitle>
                <CardDescription className="text-slate-400">
                  Enterprise-grade security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Sign in with email or Google OAuth. Your data is always
                  protected and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Real-time Updates</CardTitle>
                <CardDescription className="text-slate-400">
                  Always stay in sync
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Changes reflect instantly across all devices. Never miss an
                  important update.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Responsive Design</CardTitle>
                <CardDescription className="text-slate-400">
                  Works on any device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  Access your dashboard from desktop, tablet, or mobile. Our
                  responsive design ensures a great experience everywhere.
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
                Join us and start managing your events today
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-cyan-500 text-white hover:bg-cyan-600"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </main>
    </>
  );
}
