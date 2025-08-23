import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/dashboard_layout";
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
import { Button } from "@/components/catalyst/button.jsx";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@/components/catalyst/dialog.jsx";
import { Input } from "@/components/catalyst/input";
import { Textarea } from "@/components/catalyst/textarea";
import { Switch } from "@/components/catalyst/switch";
import { Select, SelectItem } from "@/components/catalyst/select.jsx";
import { Create_Employer, Get_Employers } from "@/utils/Employers_Functions";
import { Get_Services } from "@/utils/Services_Functions";

// Add layout to the page
StaffManagement.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [dialogStaff, setDialogStaffOn] = useState(false);
  const [newEmployer, setNewEmployer] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    working_days: [],
    working_hours: [],
    working_hours_start: "",
    working_hours_end: "",
    profile_picture: "",
    services: [],
  });

  const handleChange = (field, value) => {
    setNewEmployer((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Get Employers
    const get_employers = async () => {
      try {
        const response = await Get_Employers();
        setStaff(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    // Get Services
    const get_services = async () => {
      try {
        const response = await Get_Services();
        setServices(response);
      } catch (error) {
        console.log(error);
      }
    };

    // Trigger the functions
    console.log(services);
    get_employers();
    get_services();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Staff Management</h2>
        <Button onClick={() => setDialogStaffOn(true)}>Add Employer</Button>
      </div>

      <div className="flex justify-end mb-4">
        <Dialog open={dialogStaff} onClose={() => setDialogStaffOn(false)}>
          {dialogStaff && (
            <div className="dialog-content space-y-4">
              <Heading>Add New Employer</Heading>
              <div className="grid gap-3">
                <p className="text-sm font-medium text-white">Name</p>
                <Input
                  value={newEmployer.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <p className="text-sm font-medium text-white">Email</p>
                <Input
                  type="email"
                  value={newEmployer.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <p className="text-sm font-medium text-white">Phone</p>
                <Input
                  value={newEmployer.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />

                <p className="text-sm font-medium text-white">Working Days</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => {
                    const isSelected = newEmployer.working_days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? newEmployer.working_days.filter((d) => d !== day)
                            : [...newEmployer.working_days, day];
                          handleChange("working_days", updated);
                        }}
                        className={`px-3 py-1 rounded border ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <p className="text-sm font-medium text-white">Working Hours</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={newEmployer.working_hours_start}
                      onChange={(e) =>
                        handleChange("working_hours_start", e.target.value)
                      }
                      className="bg-white text-black px-3 py-2 rounded border border-gray-300"
                    >
                      <option value="">Start</option>
                      {[
                        "06:00",
                        "06:30",
                        "07:00",
                        "07:30",
                        "08:00",
                        "08:30",
                        "09:00",
                        "09:30",
                        "10:00",
                        "10:30",
                        "11:00",
                        "11:30",
                        "12:00",
                        "12:30",
                        "13:00",
                        "13:30",
                        "14:00",
                        "14:30",
                        "15:00",
                        "15:30",
                        "16:00",
                        "16:30",
                        "17:00",
                        "17:30",
                        "18:00",
                        "18:30",
                        "19:00",
                        "19:30",
                        "20:00",
                        "20:30",
                        "21:00",
                        "21:30",
                        "22:00",
                      ].map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="text-white">to</span>
                    <select
                      value={newEmployer.working_hours_end}
                      onChange={(e) =>
                        handleChange("working_hours_end", e.target.value)
                      }
                      className="bg-white text-black px-3 py-2 rounded border border-gray-300"
                    >
                      <option value="">End</option>
                      {[
                        "06:00",
                        "06:30",
                        "07:00",
                        "07:30",
                        "08:00",
                        "08:30",
                        "09:00",
                        "09:30",
                        "10:00",
                        "10:30",
                        "11:00",
                        "11:30",
                        "12:00",
                        "12:30",
                        "13:00",
                        "13:30",
                        "14:00",
                        "14:30",
                        "15:00",
                        "15:30",
                        "16:00",
                        "16:30",
                        "17:00",
                        "17:30",
                        "18:00",
                        "18:30",
                        "19:00",
                        "19:30",
                        "20:00",
                        "20:30",
                        "21:00",
                        "21:30",
                        "22:00",
                      ].map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={() => {
                        if (
                          newEmployer.working_hours_start &&
                          newEmployer.working_hours_end
                        ) {
                          const newRange = `${newEmployer.working_hours_start} - ${newEmployer.working_hours_end}`;
                          if (!newEmployer.working_hours.includes(newRange)) {
                            handleChange("working_hours", [
                              ...newEmployer.working_hours,
                              newRange,
                            ]);
                          }
                          handleChange("working_hours_start", "");
                          handleChange("working_hours_end", "");
                        }
                      }}
                    >
                      Add Hour
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newEmployer.working_hours.map((range, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-200 text-black rounded-full"
                      >
                        {range}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm font-medium text-white">Services</p>
                <div className="flex flex-wrap gap-2">
                  {services.map((service, index) => {
                    const isSelected = newEmployer.services.includes(
                      service.name,
                    );
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? newEmployer.services.filter(
                                (s) => s !== service.name,
                              )
                            : [...newEmployer.services, service.name];
                          handleChange("services", updated);
                        }}
                        className={`px-3 py-1 rounded border ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                      >
                        {service.name}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={async () => {
                      try {
                        await Create_Employer(newEmployer);
                        console.log("Employer created successfully");
                        setDialogStaffOn(false);
                        setNewEmployer({
                          name: "",
                          email: "",
                          phone: "",
                          role: "",
                          working_days: [],
                          working_hours: [],
                          working_hours_start: "",
                          working_hours_end: "",
                          profile_picture: "",
                          services: [],
                        });
                      } catch (error) {
                        console.error(error.message);
                      }
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Dialog>
      </div>

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
          {staff.map((member) => (
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
