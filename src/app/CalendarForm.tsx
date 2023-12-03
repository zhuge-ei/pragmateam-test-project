"use client";

import React, { useCallback } from "react";
import Loading from "./_components/loading";
import Input from "./_components/input";
import Select from "./_components/select";
import Button from "./_components/button";
import Calendar, { type TileContentFunc } from "react-calendar";
import { isBusinessDay } from "~/utils/time";
import ReservationList from "./ReservationList";
import { useReservationData } from "./useReservationData";
import { availableHoursToPOptions } from "~/utils/timeSelection";
import { useReservationForm } from "./useReservationForm";
import { useCalculateOptions } from "./useCalculateOptions";
import clsx from "clsx";
import { isSameDay, isToday } from "date-fns";

const CalendarForm = ({ name }: { name?: string | null }) => {
  const {
    canReserve,
    isLoading: isQueryLoading,
    refetch,
    reservationsForSelectedDate,
    selectedDate,
    setSelectedDate,
    partitionedData,
  } = useReservationData(name);
  const promiseRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);
  const {
    errors,
    handleSubmit,
    watch,
    resetField,
    isSubmitting,
    isValid,
    onSubmit,
    register,
  } = useReservationForm(canReserve, promiseRefetch);
  const selectedStart = watch("start");
  const { endOptions, startOptions } = useCalculateOptions(
    canReserve,
    reservationsForSelectedDate,
    selectedDate,
    selectedStart,
  );
  const tileClassName = useCallback(
    ({ date }: { date: Date }) => {
      const items = partitionedData.get(date.getTime());
      const count = items?.length ?? 0;

      return clsx("relative z-0 h-20 w-20", {
        "!border-purple-300 border": isToday(date),
        "!border-blue-300 border":
          selectedDate && isSameDay(selectedDate, date),
        "!bg-black cursor-not-allowed": !isBusinessDay(date),
        "!bg-green-200": count > 0 && count <= 3,
        "!bg-green-400": count > 3 && count <= 6,
        "!bg-green-600": count > 6,
      });
    },
    [selectedDate, partitionedData],
  );
  const tileContent: TileContentFunc = ({ date, view }) => {
    const items = partitionedData.get(date.getTime());
    const count = items?.length ?? 0;
    if (view === "month") {
      return (
        <div
          className={clsx("group absolute h-full w-full top-0 right-0 flex justify-end items-start p-1", {
            "group-hover:opacity-100": count > 0,
          })}
        >
          <div
            className={clsx(
              "h-5 w-5 rounded-full bg-teal-700 opacity-0 transition-all text-center items-center justify-center flex",
              { "group-hover:opacity-100": count > 0 },
            )}
          >
            <span className="text-xs font-light">{count}</span>
          </div>
        </div>
      );
    }
  };
  const onDayClick = useCallback(
    (value: Date) => {
      if (isBusinessDay(value)) {
        resetField("start");
        setSelectedDate(value);
      }
    },
    [setSelectedDate, resetField],
  );

  if (isQueryLoading) return <Loading />;
  return (
    <>
      <Calendar
        tileClassName={tileClassName}
        onClickDay={onDayClick}
        showNeighboringMonth={false}
        showNavigation={false}
        tileContent={tileContent}
      />
      {selectedDate && (
        <ReservationList
          selectedDate={selectedDate}
          data={reservationsForSelectedDate}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center justify-center gap-8 md:w-1/3"
      >
        {!name && (
          <Input
            {...register("name")}
            placeholder="John/Jane Doe"
            label="Your name"
            errorMessage={errors.name?.message}
          />
        )}

        <Select
          label="Start"
          {...register("start")}
          errorMessage={errors.start?.message}
          options={availableHoursToPOptions(startOptions, selectedDate)}
        />
        <Select
          label="End"
          {...register("end")}
          errorMessage={errors.end?.message}
          options={availableHoursToPOptions(endOptions, selectedDate)}
        />

        <Button
          label="Submit"
          type="submit"
          disabled={!isValid || isSubmitting}
        />
        {errors.root?.message && (
          <p className="text-sm text-red-600">{errors.root?.message}</p>
        )}
      </form>
    </>
  );
};

export default CalendarForm;
