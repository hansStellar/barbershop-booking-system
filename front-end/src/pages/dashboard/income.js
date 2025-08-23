import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/dashboard_layout.js";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Websocket } from "@/utils/Websocket.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst/table";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Get_Bookings } from "@/utils/Bookings_Functions.js";
import useVerifyAuth from "@/utils/Admin_Auth.js";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// Render the dashboard layout
Income.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function Income() {
  const [bookings, set_bookings] = useState([]);
  const [filtered, set_filtered] = useState([]);
  const [total, set_total] = useState(0);
  const { is_verified, is_loading } = useVerifyAuth();

  const [filterType, set_filter_type] = useState("current-month");
  const [monthStart, set_month_start] = useState("");
  const [monthEnd, set_month_end] = useState("");
  const [yearStart, set_year_start] = useState("");
  const [yearEnd, set_year_end] = useState("");

  const [availableMonths, set_available_months] = useState([]);
  const [availableYears, set_available_years] = useState([]);
  const [availableDays, set_available_days] = useState([]);

  // Fetch all bookings
  async function fetch_bookings() {
    try {
      const value = await Get_Bookings();
      set_bookings(value.data);

      // Extract unique months, years, days
      const months = new Set();
      const years = new Set();
      const days = new Set();

      value.data.forEach((b) => {
        if (!b.date) return;
        const [year, month, day] = b.date.split("-");
        months.add(`${year}-${month}`);
        years.add(year);
        days.add(b.date);
      });

      set_available_months([...months]);
      set_available_years([...years]);
      set_available_days([...days]);

      // Default: current month
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      set_filter_type("current-month");
      filterByMonth(value.data, currentMonth);
    } catch (err) {
      console.error(err.message);
    }
  }

  // Calculate total income
  function calc_total(data) {
    const sum = data.reduce((acc, item) => {
      const cleanPrice = Number(String(item.price).replace(/[^0-9.-]+/g, ""));
      return acc + (cleanPrice || 0);
    }, 0);
    set_total(sum);
  }

  function filterByMonth(dataSet, month) {
    const filtered_data = dataSet.filter((b) => b.date?.startsWith(month));
    set_filtered(filtered_data);
    calc_total(filtered_data);
  }

  function filterByYear(year) {
    const filtered_data = bookings.filter((b) => b.date?.startsWith(year));
    set_filtered(filtered_data);
    calc_total(filtered_data);
  }

  function filterByDay(day) {
    const filtered_data = bookings.filter((b) => b.date === day);
    set_filtered(filtered_data);
    calc_total(filtered_data);
  }

  function filterByMonthRange(start, end) {
    const filtered_data = bookings.filter((b) => {
      if (!b.date) return false;
      const bookingMonth = b.date.slice(0, 7); // YYYY-MM
      return bookingMonth >= start && bookingMonth <= end;
    });
    set_filtered(filtered_data);
    calc_total(filtered_data);
  }

  function filterByYearRange(startYear, endYear) {
    const filtered_data = bookings.filter((b) => {
      const year = b.date?.split("-")[0];
      return year >= startYear && year <= endYear;
    });
    set_filtered(filtered_data);
    calc_total(filtered_data);
  }

  const run_web_socket = Websocket(fetch_bookings); // This function activates the background WebSocket, so any change in the database will be updated live, ONLY WILL BE TRIGGERED IF DATABASE CHANGES

  useEffect(() => {
    fetch_bookings();
    return () => run_web_socket(); // This ONLY runs on unmount
  }, []);

  // Group bookings by date and sum prices
  const grouped = filtered.reduce((acc, booking) => {
    if (!booking.date) return acc;
    const [year, month, day] = booking.date.split("-");
    const formatted = `${day}/${month}`;
    if (!acc[formatted]) acc[formatted] = 0;
    const cleanPrice = Number(String(booking.price).replace(/[^0-9.-]+/g, ""));
    acc[formatted] += cleanPrice || 0;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true, // start y-axis at 0
      },
    },
  };

  return (
    <div>
      <Heading className="mb-4">Income / Financial Reports</Heading>

      {/* Overview */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <Subheading>Total Income: ${total}</Subheading>
        <Dropdown>
          <DropdownButton className="text-sm font-medium px-4 py-2 border rounded-md shadow-sm">
            Filters
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </DropdownButton>
          <DropdownMenu className="w-72 p-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Select filter type
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                onChange={(e) => {
                  const value = e.target.value;
                  set_filter_type(value);

                  if (value === "current-month") {
                    const now = new Date();
                    const currentMonth = `${now.getFullYear()}-${String(
                      now.getMonth() + 1,
                    ).padStart(2, "0")}`;
                    filterByMonth(bookings, currentMonth);
                  }

                  if (
                    value === "specific-month" &&
                    availableMonths.length > 0
                  ) {
                    filterByMonth(bookings, availableMonths[0]);
                  }

                  if (value === "month-range" && availableMonths.length > 1) {
                    filterByMonthRange(
                      availableMonths[0],
                      availableMonths[availableMonths.length - 1],
                    );
                  }

                  if (value === "specific-year" && availableYears.length > 0) {
                    filterByYear(availableYears[0]);
                  }

                  if (value === "year-range" && availableYears.length > 1) {
                    filterByYearRange(
                      availableYears[0],
                      availableYears[availableYears.length - 1],
                    );
                  }

                  if (value === "specific-day" && availableDays.length > 0) {
                    filterByDay(availableDays[0]);
                  }
                }}
              >
                <option value="current-month">Current month</option>
                <option value="specific-month">Specific month</option>
                <option value="month-range">Month range</option>
                <option value="specific-year">Specific year</option>
                <option value="year-range">Year range</option>
                <option value="specific-day">Specific day</option>
              </select>
            </div>

            {filterType === "specific-month" && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Filter by month
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  onChange={(e) => {
                    filterByMonth(bookings, e.target.value);
                    set_month_start("");
                    set_month_end("");
                    set_year_start("");
                    set_year_end("");
                  }}
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {new Date(m + "-01").toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filterType === "month-range" && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Select month range
                </label>
                <select
                  id="monthStart"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm mb-2"
                  onChange={(e) => {
                    set_month_start(e.target.value);
                    if (monthEnd) filterByMonthRange(e.target.value, monthEnd);
                  }}
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {new Date(m + "-01").toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </option>
                  ))}
                </select>
                <select
                  id="monthEnd"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  onChange={(e) => {
                    set_month_end(e.target.value);
                    if (monthStart)
                      filterByMonthRange(monthStart, e.target.value);
                  }}
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {new Date(m + "-01").toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </option>
                  ))}
                </select>
                <button
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    const start = document.getElementById("monthStart")?.value;
                    const end = document.getElementById("monthEnd")?.value;
                    if (start && end) {
                      filterByMonthRange(start, end);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            )}

            {filterType === "specific-year" && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Filter by year
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  onChange={(e) => {
                    filterByYear(e.target.value);
                    set_month_start("");
                    set_month_end("");
                    set_year_start("");
                    set_year_end("");
                  }}
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filterType === "year-range" && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Select year range
                </label>
                <select
                  id="yearStart"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm mb-2"
                  onChange={(e) => {
                    set_year_start(e.target.value);
                    if (yearEnd) filterByYearRange(e.target.value, yearEnd);
                  }}
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  id="yearEnd"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  onChange={(e) => {
                    set_year_end(e.target.value);
                    if (yearStart) filterByYearRange(yearStart, e.target.value);
                  }}
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <button
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    const start = document.getElementById("yearStart")?.value;
                    const end = document.getElementById("yearEnd")?.value;
                    if (start && end) {
                      filterByYearRange(start, end);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            )}

            {filterType === "specific-day" && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Filter by day
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  onChange={(e) => {
                    filterByDay(e.target.value);
                    set_month_start("");
                    set_month_end("");
                    set_year_start("");
                    set_year_end("");
                  }}
                >
                  {availableDays.map((d) => (
                    <option key={d} value={d}>
                      {new Date(d).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Chart */}
      <div className="bg-zinc-900 p-4 rounded-lg mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Service</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-light">
                {item.id?.slice(0, 10)}
              </TableCell>
              <TableCell className="font-light">{item.date}</TableCell>
              <TableCell className="font-light">{item.name}</TableCell>
              <TableCell className="font-light">{item.service}</TableCell>
              <TableCell className="font-light">${item.price}</TableCell>
              <TableCell className="font-light">
                <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
