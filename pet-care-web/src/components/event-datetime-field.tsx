"use client";

import { useEffect, useMemo, useState } from "react";

const startHour = 8;
const endHour = 21;
const stepMinutes = 15;

type DateTimeParts = {
  date: string;
  time: string;
};

function parseDateTimeLocal(value?: string): DateTimeParts | null {
  if (!value || !value.includes("T")) {
    return null;
  }

  const [date, rawTime] = value.split("T");
  const time = rawTime?.slice(0, 5);

  if (!date || !time) {
    return null;
  }

  return { date, time };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function createTimeOptions(selectedDate: string, minStartsAt?: string) {
  const minParts = parseDateTimeLocal(minStartsAt);
  const minTimeForDate = minParts?.date === selectedDate ? minParts.time : null;
  const options: string[] = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      const value = `${pad(hour)}:${pad(minute)}`;

      if (!minTimeForDate || value >= minTimeForDate) {
        options.push(value);
      }
    }
  }

  return options;
}

export function EventDateTimeField({
  defaultValue,
  minStartsAt,
}: {
  defaultValue?: string;
  minStartsAt?: string;
}) {
  const minParts = parseDateTimeLocal(minStartsAt);
  const defaultParts = parseDateTimeLocal(defaultValue) ?? minParts;
  const [date, setDate] = useState(defaultParts?.date ?? "");
  const [time, setTime] = useState(defaultParts?.time ?? "08:00");
  const timeOptions = useMemo(
    () => createTimeOptions(date, minStartsAt),
    [date, minStartsAt],
  );

  useEffect(() => {
    if (timeOptions.length > 0 && !timeOptions.includes(time)) {
      setTime(timeOptions[0]);
    }
  }, [time, timeOptions]);

  const safeTime = timeOptions.includes(time) ? time : (timeOptions[0] ?? "");
  const startsAtValue = date && safeTime ? `${date}T${safeTime}` : "";

  return (
    <div className="grid gap-2 text-sm font-semibold text-neutral-800">
      <span>Дата и час</span>
      <input type="hidden" name="startsAt" value={startsAtValue} />
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-normal text-neutral-500">
            Дата
          </span>
          <input
            className="rounded-lg border border-neutral-300 px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
            min={minParts?.date}
            onChange={(event) => setDate(event.target.value)}
            required
            type="date"
            value={date}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-normal text-neutral-500">
            Час
          </span>
          <select
            className="rounded-lg border border-neutral-300 bg-white px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
            onChange={(event) => setTime(event.target.value)}
            required
            value={safeTime}
          >
            {timeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-xs font-normal leading-5 text-neutral-500">
        Може да се избира само бъдещ час през 15 минути, между 08:00 и 21:45.
      </p>
    </div>
  );
}