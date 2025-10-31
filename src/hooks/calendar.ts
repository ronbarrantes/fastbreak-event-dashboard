"use client";
import { useCallback, useEffect, useState } from "react";

import dayjs from "dayjs";
import type { FieldValues, Path } from "react-hook-form";

interface UseDateTimePickerOptions<T extends FieldValues> {
  form: {
    setValue: (name: Path<T>, value: string) => void;
  };
}

interface UseDateTimePickerReturn {
  // State for popover open/close
  startDateOpen: boolean;
  setStartDateOpen: (open: boolean) => void;
  endDateOpen: boolean;
  setEndDateOpen: (open: boolean) => void;

  // State for dates
  startDateSelected: Date | undefined;
  setStartDateSelected: (date: Date | undefined) => void;
  endDateSelected: Date | undefined;
  setEndDateSelected: (date: Date | undefined) => void;

  // State for times
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;

  // Helper functions
  getCurrentTime15Min: () => string;
  getStartDateTime: () => string;
  getEndDateTime: () => string;

  // Validation helpers for calendar props
  isStartDateDisabled: (date: Date) => boolean;
  isEndDateDisabled: (date: Date) => boolean;

  // Validation helpers for time inputs
  getMinStartTime: () => string | undefined;
  getMinEndTime: () => string | undefined;

  // Reset function
  reset: () => void;
}

export function useDateTimePicker<T extends FieldValues>({
  form,
}: UseDateTimePickerOptions<T>): UseDateTimePickerReturn {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDateSelected, setStartDateSelectedRaw] = useState<
    Date | undefined
  >(undefined);
  const [endDateSelected, setEndDateSelectedRaw] = useState<Date | undefined>(
    undefined
  );
  const [startTime, setStartTimeRaw] = useState("10:00");
  const [endTime, setEndTimeRaw] = useState("11:00");

  // Get current time rounded to nearest 15 minutes
  const getCurrentTime15Min = useCallback(() => {
    const now = dayjs();
    const minutes = now.minute();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    const time = now.minute(roundedMinutes).second(0).millisecond(0);
    return time.format("HH:mm");
  }, []);

  // Combine date and time into a datetime string
  const combineDateTime = useCallback(
    (date: Date | undefined, time: string): string => {
      if (!date || !time) return "";
      const [hours, minutes] = time.split(":");
      return dayjs(date)
        .hour(parseInt(hours, 10))
        .minute(parseInt(minutes, 10))
        .second(0)
        .millisecond(0)
        .toISOString();
    },
    []
  );

  // Get datetime string for form submission
  const getStartDateTime = useCallback((): string => {
    return combineDateTime(startDateSelected, startTime);
  }, [combineDateTime, startDateSelected, startTime]);

  const getEndDateTime = useCallback((): string => {
    return combineDateTime(endDateSelected, endTime);
  }, [combineDateTime, endDateSelected, endTime]);

  // Wrapped setters that handle validation
  const setStartDateSelected = useCallback(
    (date: Date | undefined) => {
      setStartDateSelectedRaw(date);

      // Clear end date if it's before the new start date
      if (
        date &&
        endDateSelected &&
        dayjs(endDateSelected).isBefore(dayjs(date), "day")
      ) {
        setEndDateSelectedRaw(undefined);
        setEndTimeRaw("11:00");
      }
    },
    [endDateSelected]
  );

  const setStartTime = useCallback(
    (time: string) => {
      // Adjust start time if in the past when today is selected
      if (
        startDateSelected &&
        dayjs(startDateSelected).isSame(dayjs(), "day")
      ) {
        const currentTime = getCurrentTime15Min();
        const [currentH, currentM] = currentTime.split(":");
        const [startH, startM] = time.split(":");
        const currentTotalMin = parseInt(currentH) * 60 + parseInt(currentM);
        const startTotalMin = parseInt(startH) * 60 + parseInt(startM);
        if (startTotalMin < currentTotalMin) {
          setStartTimeRaw(currentTime);
          return;
        }
      }
      setStartTimeRaw(time);
    },
    [startDateSelected, getCurrentTime15Min]
  );

  const setEndDateSelected = useCallback((date: Date | undefined) => {
    setEndDateSelectedRaw(date);
  }, []);

  const setEndTime = useCallback(
    (time: string) => {
      // Adjust end time if on same day and before start time
      if (
        startDateSelected &&
        endDateSelected &&
        dayjs(endDateSelected).isSame(dayjs(startDateSelected), "day")
      ) {
        const [startH, startM] = startTime.split(":");
        const [endH, endM] = time.split(":");
        const startTotalMin = parseInt(startH) * 60 + parseInt(startM);
        const endTotalMin = parseInt(endH) * 60 + parseInt(endM);
        if (endTotalMin <= startTotalMin) {
          const adjustedTotalMin = startTotalMin + 15;
          const clampedTotalMin = Math.min(adjustedTotalMin, 1425);
          const adjustedHours = Math.floor(clampedTotalMin / 60);
          const adjustedMins = clampedTotalMin % 60;
          const newEndTime = `${String(adjustedHours).padStart(2, "0")}:${String(adjustedMins).padStart(2, "0")}`;
          if (newEndTime !== time) {
            setEndTimeRaw(newEndTime);
            return;
          }
        }
      }
      setEndTimeRaw(time);
    },
    [startDateSelected, endDateSelected, startTime]
  );

  // Sync to form only
  useEffect(() => {
    const startDateTime = getStartDateTime();
    form.setValue("startDate" as Path<T>, startDateTime);
  }, [startDateSelected, startTime, getStartDateTime, form]);

  useEffect(() => {
    const endDateTime = getEndDateTime();
    form.setValue("endDate" as Path<T>, endDateTime);
  }, [endDateSelected, endTime, getEndDateTime, form]);

  // Validation helpers
  const isStartDateDisabled = useCallback(
    (date: Date) => dayjs(date).isBefore(dayjs(), "day"),
    []
  );

  const isEndDateDisabled = useCallback(
    (date: Date) => (startDateSelected ? date < startDateSelected : false),
    [startDateSelected]
  );

  const getMinStartTime = useCallback((): string | undefined => {
    if (startDateSelected && dayjs(startDateSelected).isSame(dayjs(), "day")) {
      return getCurrentTime15Min();
    }
    return undefined;
  }, [startDateSelected, getCurrentTime15Min]);

  const getMinEndTime = useCallback((): string | undefined => {
    if (
      startDateSelected &&
      endDateSelected &&
      dayjs(endDateSelected).isSame(dayjs(startDateSelected), "day")
    ) {
      return startTime;
    }
    return undefined;
  }, [startDateSelected, endDateSelected, startTime]);

  // Reset function
  const reset = useCallback(() => {
    setStartDateSelectedRaw(undefined);
    setEndDateSelectedRaw(undefined);
    setStartTimeRaw("10:00");
    setEndTimeRaw("11:00");
  }, []);

  return {
    // State
    startDateOpen,
    setStartDateOpen,
    endDateOpen,
    setEndDateOpen,
    startDateSelected,
    setStartDateSelected,
    endDateSelected,
    setEndDateSelected,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    // Helpers
    getCurrentTime15Min,
    getStartDateTime,
    getEndDateTime,
    // Validation
    isStartDateDisabled,
    isEndDateDisabled,
    getMinStartTime,
    getMinEndTime,
    // Reset
    reset,
  };
}
