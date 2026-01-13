"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply?: () => void;
  onClear?: () => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="space-y-2">
        <Label htmlFor="start-date">Dari Tanggal</Label>
        <Input
          id="start-date"
          type="date"
          value={startDate || ""}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full sm:w-[180px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end-date">Sampai Tanggal</Label>
        <Input
          id="end-date"
          type="date"
          value={endDate || ""}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full sm:w-[180px]"
        />
      </div>

      <div className="flex gap-2">
        {onApply && (
          <Button onClick={onApply} disabled={!startDate || !endDate}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Terapkan
          </Button>
        )}
        {onClear && (
          <Button variant="outline" onClick={onClear}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
