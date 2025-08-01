import { useEffect, useState } from "react";
import { Get_Bookings } from "@/utils/Bookings_Functions.js";
import { Websocket } from "@/utils/Websocket.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst/table";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import DashboardLayout from "@/components/layouts/dashboard_layout.js";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst/button";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

// Functions
import useVerifyAuth from "@/utils/Admin_Auth.js";

// Render the dashboard layout
Orders.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function Orders() {
  const [bookings, set_bookings] = useState([]);
  const { is_verified, is_loading } = useVerifyAuth(); // Will use this to add some spinners in the future

  // Functions
  async function fetch_bookings() {
    try {
      const value = await Get_Bookings();
      set_bookings(value.data); // this is an array of objects
    } catch (err) {
      console.error(err.message);
    }
  }
  const run_web_socket = Websocket(fetch_bookings); // This function activates the background WebSocket, so any change in the database will be updated live, ONLY WILL BE TRIGGERED IF DATABASE CHANGES

  // Events
  useEffect(() => {
    fetch_bookings();
    return () => run_web_socket(); // This ONLY runs on unmount
  }, []);

  return (
    <div>
      {" "}
      {/* Recent Orders */}
      <div>
        <Heading className="mb-4">Orders</Heading>

        {/* Control Area */}
        <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
          <Subheading>Order #1011</Subheading>
          <div className="flex gap-4">
            <Dropdown>
              <DropdownButton className="text-sm font-medium px-4 py-2 border rounded-md shadow-sm">
                Filters
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </DropdownButton>

              <DropdownMenu className="w-72 p-4 space-y-4">
                {/* Sort by */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Sort by
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>A–Z</option>
                    <option>Z–A</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Price
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min."
                      className="w-1/2 px-2 py-1 rounded-md border border-gray-300 text-sm"
                    />
                    <span className="text-sm">to</span>
                    <input
                      type="number"
                      placeholder="Max."
                      className="w-1/2 px-2 py-1 rounded-md border border-gray-300 text-sm"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Condition
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
                    <option>Any</option>
                    <option>New</option>
                    <option>Used</option>
                  </select>
                </div>

                {/* Date Listed */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Date listed
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
                    <option>Any time</option>
                    <option>Today</option>
                    <option>This week</option>
                    <option>This month</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Availability
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
                    <option>All</option>
                    <option>In stock</option>
                    <option>Out of stock</option>
                  </select>
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Order ID</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Service</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((book, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-light">
                  {book.id.slice(0, 10)}
                </TableCell>
                <TableCell className="font-light">{book.name}</TableCell>
                <TableCell className="font-light">
                  {book.date}, {book.time}
                </TableCell>
                <TableCell className="font-light">{book.service}</TableCell>
                <TableCell className="font-light">{book.service}</TableCell>
                <TableCell className="font-light">
                  <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
