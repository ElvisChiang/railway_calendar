export interface THSRDateInfo {
  holidayName: string;
  transportPeriod: string;
  bookingStartDate: string;
  originalDates?: {
    start: string;
    end: string;
    booking: string;
  };
}
