// Need this for the layout
import React, { useEffect, useState } from "react";
import { Get_Bookings } from "@/utils/Get_Bookings.js";
import { Websocket } from "@/utils/Websocket.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst/table";
import { Subheading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import DashboardLayout from "@/components/layouts/dashboard_layout.js";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

import useVerifyAuth from "@/utils/Admin_Auth.js";
import { useRouter } from "next/router";

// Render the dashboard layout
Dashboard.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function Dashboard() {
  // Variables
  const router = useRouter();
  const { is_verified, is_loading } = useVerifyAuth(); // Will use this to add some spinners in the future
  const stats = [
    {
      title: "Total revenue",
      value: "$2.6M",
      change: "+4.5%",
      changeType: "increase",
    },
    {
      title: "Average order value",
      value: "$455",
      change: "-0.5%",
      changeType: "decrease",
    },
    {
      title: "Tickets sold",
      value: "5,888",
      change: "+4.5%",
      changeType: "increase",
    },
    {
      title: "Pageviews",
      value: "823,067",
      change: "+21.2%",
      changeType: "increase",
    },
  ];
  const [bookings, set_bookings] = useState([]);

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

  return !is_verified ? (
    <div>No access</div>
  ) : (
    // Inside Content
    <div>
      {/* Overview */}
      <div className="mb-14">
        {/* Heading */}
        <div className="flex items-center justify-between">
          <Subheading>Overview</Subheading>
          <Dropdown>
            <DropdownButton
              outline
              className="text-sm text-white border-zinc-700"
            >
              Last quarter
              <ChevronDownIcon className="ml-1 size-4" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem>Last week</DropdownItem>
              <DropdownItem>Last two weeks</DropdownItem>
              <DropdownItem>Last month</DropdownItem>
              <DropdownItem>Last quarter</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 sm:gap-x-6 xl:gap-x-12">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className={`rounded-lg py-6 ${
                index === 0 ? "lg:pl-0" : ""
              } ${index === stats.length - 1 ? "lg:pr-0" : ""} bg-zinc-900 sm:bg-transparent`}
            >
              <Divider className="mb-10 lg:mb-8" />
              <h3 className="text-lg sm:text-sm font-light text-zinc-300">
                {stat.title}
              </h3>
              <p className="mt-2 sm:mt-4 text-4xl sm:text-3xl font-medium text-white">
                {stat.value}
              </p>
              <div className="mt-4 sm:mt-4 flex items-center space-x-2">
                <span
                  className={`text-md sm:text-sm font-medium px-2 pt-1 pb-1 rounded-sm mr-1 ${
                    stat.changeType === "increase"
                      ? "bg-[color-mix(in_oklab,var(--color-lime-400)_10%,transparent)] text-lime-500"
                      : "bg-[color-mix(in_oklab,var(--color-pink-400)_10%,transparent)] text-pink-400"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-md sm:text-sm text-zinc-500">
                  from last week
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <Subheading className="mb-4">Recent orders</Subheading>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Service</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((book, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-light">{book.name}</TableCell>
                <TableCell className="font-light">{book.date}</TableCell>
                <TableCell className="text-zinc-500">{book.time}</TableCell>
                <TableCell className="font-light">{book.service}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
