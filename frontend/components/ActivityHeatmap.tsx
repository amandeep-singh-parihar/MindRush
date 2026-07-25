"use client";

import { useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

interface ActivityHeatmapProps {
  attemptDates?: string[];
}

export default function ActivityHeatmap({ attemptDates = [] }: ActivityHeatmapProps) {
  const { values, startDate, endDate, activeDaysCount, totalActivities } = useMemo(() => {
    const counts: Record<string, number> = {};

    attemptDates.forEach((dateStr) => {
      const formatted = new Date(dateStr).toISOString().split("T")[0];
      counts[formatted] = (counts[formatted] || 0) + 1;
    });

    const valuesList = Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 365);

    const activeDays = Object.keys(counts).length;
    const totalCount = attemptDates.length;

    return {
      values: valuesList,
      startDate: start,
      endDate: end,
      activeDaysCount: activeDays,
      totalActivities: totalCount,
    };
  }, [attemptDates]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header Stat row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-400 font-medium">Activity Log (Past Year)</p>
          <h4 className="text-2xl font-extrabold text-white mt-1">
            {activeDaysCount} Active {activeDaysCount === 1 ? "Day" : "Days"}
          </h4>
        </div>

        <div className="text-xs text-zinc-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <span className="font-bold text-white">{totalActivities}</span> Total Quiz Activities
        </div>
      </div>

      {/* Heatmap Container (Full Width & Responsive) */}
      <div className="w-full overflow-x-auto pb-1 scrollbar-none [&_svg]:w-full [&_svg]:h-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(value) => {
            if (!value || !value.count) {
              return "color-empty";
            }
            return `color-scale-${Math.min(4, value.count)}`;
          }}
          titleForValue={(value) =>
            value && value.date
              ? `${value.date}: ${value.count} quiz ${value.count === 1 ? "activity" : "activities"}`
              : "No activity"
          }
        />
      </div>

      {/* Footer Legend */}
      <div className="flex justify-between items-center text-[11px] text-zinc-400 pt-1 border-t border-white/5">
        <span>Past 365 Days</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-white/5 border border-white/10" />
          <div className="w-2.5 h-2.5 rounded-sm bg-pink-500/35" />
          <div className="w-2.5 h-2.5 rounded-sm bg-pink-500/65" />
          <div className="w-2.5 h-2.5 rounded-sm bg-purple-500/85" />
          <div className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
