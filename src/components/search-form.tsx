"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

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

type SearchFormProps = {
  availableSports?: string[];
};

export const SearchForm = ({ availableSports = [] }: SearchFormProps) => {
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

  const handleClear = () => {
    form.reset({
      query: "",
      sportType: "",
    });
    router.push("/search");
  };

  // Watch form values to determine if there are dirty inputs
  const queryValue = useWatch({ control: form.control, name: "query" });
  const sportTypeValue = useWatch({ control: form.control, name: "sportType" });
  const hasDirtyInputs =
    (queryValue?.trim() ?? "") !== "" || (sportTypeValue ?? "") !== "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={`grid items-end gap-3 ${hasDirtyInputs ? "grid-cols-[1fr_auto_auto_auto]" : "grid-cols-[1fr_auto_auto]"}`}
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs text-slate-400">Search</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Search events..."
                    className="h-9 border-slate-700 bg-slate-800/50 text-sm text-white placeholder:text-slate-500"
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
              <FormItem className="space-y-1">
                <FormLabel className="text-xs text-slate-400">Sport</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="h-9 w-32 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white capitalize focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All</option>
                    {availableSports.map((sport) => (
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

          <Button
            type="submit"
            size="sm"
            className="h-9 bg-cyan-500 text-white hover:bg-cyan-600"
          >
            Search
          </Button>
          {hasDirtyInputs && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="h-9 border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700/50"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
