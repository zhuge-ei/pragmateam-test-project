"use client";
import React, { useCallback } from "react";
import Loading from "./_components/loading";
import Input from "./_components/input";
import Select from "./_components/select";
import Button from "./_components/button";
import Calendar from "react-calendar";
import { isBusinessDay } from "~/utils/time";
import ReservationList from "./ReservationList";
import { useCalendarLogic } from "./useCalendarLogic";
import { useReservationData } from "./useReservationData";
import { availableHoursToPOptions } from "~/utils/timeSelection";
import { useReservationForm } from "./useReservationForm";
import { useCalculateOptions } from "./useCalculateOptions";

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
  const { endOptions, startOptions } = useCalculateOptions(
    canReserve,
    reservationsForSelectedDate,
    selectedDate,
    watch("start"),
  );
  const tileClassName = useCalendarLogic(partitionedData, selectedDate);
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
