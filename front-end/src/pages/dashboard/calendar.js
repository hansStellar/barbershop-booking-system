import { useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { parse, startOfWeek, format, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DashboardLayout from "@/components/layouts/dashboard_layout";
import { Get_Bookings } from "@/utils/Bookings_Functions.js";

const locales = {
  "en-GB": require("date-fns/locale/en-GB"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

Calendar.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      const response = await Get_Bookings();
      const bookings = response.data.map((book) => ({
        title: `${book.name} - ${book.service}`,
        start: new Date(`${book.date}T${book.time}`),
        end: new Date(`${book.date}T${book.time}`), // You can adjust end time if you have durations
        allDay: false,
      }));
      setEvents(bookings);
    }

    fetchBookings();
  }, []);

  return (
    <div className="h-[80vh] p-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", background: "white", padding: "1rem" }}
        views={["month", "week", "day"]}
        selectable={false}
        toolbar
        popup
      />
    </div>
  );
}
