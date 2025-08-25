import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst/table";

import { Websocket } from "@/utils/Websocket";
import DashboardLayout from "@/components/layouts/dashboard_layout";
import { Get_Bookings } from "@/utils/Bookings_Functions.js";
import { useEffect, useState } from "react";
import { Get_Employers } from "@/utils/Employers_Functions";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";

Clients.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function Clients() {
  // Variables
  const [bookings, set_bookings] = useState([]);

  // Functions
  async function fetch_clients() {
    try {
      const value = await Get_Employers();
      set_bookings(value.data); // this is an array of objects
      console.log(bookings);
    } catch (err) {
      console.error(err.message);
    }
  }

  const run_web_socket = Websocket(fetch_clients); // This function activates the background WebSocket, so any change in the database will be updated live, ONLY WILL BE TRIGGERED IF DATABASE CHANGES

  // Events
  useEffect(() => {
    fetch_clients();
    return () => run_web_socket(); // This ONLY runs on unmount
  }, []);

  return (
    <div>
      {" "}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Services</TableHeader>
            <TableHeader>Availability</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.id}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.services.join(", ")}</TableCell>
              <TableCell>
                {member.available ? "Available" : "Unavailable"}
              </TableCell>
              <TableCell>
                <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
