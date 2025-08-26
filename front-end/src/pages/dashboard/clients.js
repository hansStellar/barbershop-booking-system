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
import { useEffect, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { Get_Customers } from "@/utils/Customers_Functions";

Clients.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function Clients() {
  // Variables
  const [customers, set_customers] = useState([]);

  // Functions
  async function fetch_customers() {
    try {
      const value = await Get_Customers();
      set_customers(value.data); // this is an array of objects
      console.log(customers);
    } catch (err) {
      console.error(err.message);
    }
  }

  const run_web_socket = Websocket(fetch_customers); // This function activates the background WebSocket, so any change in the database will be updated live, ONLY WILL BE TRIGGERED IF DATABASE CHANGES

  // Events
  useEffect(() => {
    fetch_customers();
    return () => run_web_socket(); // This ONLY runs on unmount
  }, []);

  return (
    <div>
      {" "}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Contact Number</TableHeader>
            <TableHeader>Orders</TableHeader>
            <TableHeader>It's a member?</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.customer_id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {customer.number ? customer.number : "Number not provided"}
              </TableCell>
              <TableCell>{customer.orders}</TableCell>
              <TableCell>{customer.its_registered ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
