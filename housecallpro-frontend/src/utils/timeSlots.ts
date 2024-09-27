// src/utils/timeSlots.ts

import { Job } from '../types';


export const generateTimeSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  let startTime = new Date(start);
  const endTime = new Date(end);

  console.log('xx', startTime);
  console.log('yy', endTime);

  while (startTime < endTime) {
    const slotStart = new Date(startTime);
    const slotEnd = new Date(startTime);
    slotEnd.setHours(slotEnd.getHours() + 1);

    // Only push slots that are fully within the day range
    if (slotEnd <= endTime) {
      slots.push(
        `${slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      );
    }

    startTime.setHours(startTime.getHours() + 1);
  }

  console.log(slots);
  return slots;
};

export const filterBookedSlots = (slots: string[], bookedJobs: Job[]): string[] => {
  const availableSlots = slots.filter((slot) => {
    const [slotStartStr, slotEndStr] = slot.split(' - ');
    const slotStart = new Date(`1970-01-01T${slotStartStr}:00`);
    const slotEnd = new Date(`1970-01-01T${slotEndStr}:00`);

    // Check if any job overlaps with the current slot
    const isBooked = bookedJobs.some((job) => {
      const jobStart = new Date(job.schedule.scheduled_start);
      const jobEnd = new Date(job.schedule.scheduled_end);

      // If the slot overlaps with the job time, it's booked
      return (
        (slotStart >= jobStart && slotStart < jobEnd) || (slotEnd > jobStart && slotEnd <= jobEnd)
      );
    });

    return !isBooked;
  });

  return availableSlots;
};