"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const searchSchema = z.object({
  query: z.string().optional(),
  sportType: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const sportOptions = ["soccer", "football", "Basketball"] as const;

export const SearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchParams.get("query") ?? "",
      sportType: searchParams.get("sportType") ?? "",
    },
  });

  // Update form when URL params change (e.g., browser back/forward)
  useEffect(() => {
    form.reset({
      query: searchParams.get("query") ?? "",
      sportType: searchParams.get("sportType") ?? "",
    });
  }, [searchParams, form]);

  const onSubmit = (data: SearchFormValues) => {
    const params = new URLSearchParams();
    
    if (data.query) {
      params.set("query", data.query);
    }
    
    if (data.sportType) {
      params.set("sportType", data.sportType);
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Search</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Search events by name..."
                    className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Sport Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="ring-offset-background flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All Sports</option>
                    {sportOptions.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="bg-cyan-500 text-white hover:bg-cyan-600"
        >
          Search
        </Button>
      </form>
    </Form>
  );
};

