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
import { Heading } from "@/components/catalyst/heading";
import { Button } from "@/components/catalyst/button.jsx";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@/components/catalyst/dialog.jsx";
import { Input } from "@/components/catalyst/input";
import { Create_Employer, Get_Employers } from "@/utils/Employers_Functions";
import { Get_Services } from "@/utils/Services_Functions";

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
    working_days: [],
    working_hours: {},

    services: [],
  });

  const timeOptions = [
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
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Updated getAvailableStartTimes and getAvailableEndTimes to exclude hours already in any existing range
  const getAvailableStartTimes = (day, workingHours) => {
    const ranges = workingHours[day] || [];
    return timeOptions.filter((start) => {
      const startMinutes = toMinutes(start);
      return !ranges.some(
        (range) =>
          startMinutes >= toMinutes(range.start) &&
          startMinutes < toMinutes(range.end),
      );
    });
  };

  const getAvailableEndTimes = (day, start, workingHours) => {
    if (!start) return [];

    const startMinutes = toMinutes(start);
    const ranges = workingHours[day] || [];

    return timeOptions.filter((end) => {
      const endMinutes = toMinutes(end);
      if (endMinutes <= startMinutes) return false;

      return !ranges.some(
        (range) =>
          startMinutes < toMinutes(range.end) &&
          endMinutes > toMinutes(range.start),
      );
    });
  };

  const handleChange = (field, value) => {
    setNewEmployer((prev) => ({ ...prev, [field]: value }));
  };

  const addWorkingHour = (day, start, end) => {
    setNewEmployer((prev) => {
      const currentHours = prev.working_hours[day] || [];
      const updated = {
        ...prev,
        working_hours: {
          ...prev.working_hours,
          [day]: [...currentHours, { start, end }],
        },
      };
      console.log("Updated employer after adding hour:", updated);
      return updated;
    });
  };

  const [hourRange, setHourRange] = useState({});

  const get_employers = async () => {
    try {
      const response = await Get_Employers();
      setStaff(response);
    } catch (error) {
      console.log(error);
    }
  };

  const get_services = async () => {
    try {
      const response = await Get_Services();
      setServices(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_employers();
    get_services();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Staff Management</h2>
        <Button onClick={() => setDialogStaffOn(true)}>Add Employer</Button>
      </div>

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
                {daysOfWeek.map((day) => {
                  const isSelected = newEmployer.working_days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const isSelected =
                          newEmployer.working_days.includes(day);
                        const hasHours =
                          newEmployer.working_hours[day]?.length > 0;

                        if (isSelected && hasHours) {
                          alert("Remove all working hours for this day first.");
                          return;
                        }

                        const updated = isSelected
                          ? newEmployer.working_days.filter((d) => d !== day)
                          : [...newEmployer.working_days, day];

                        const sortedUpdated = daysOfWeek.filter((d) =>
                          updated.includes(d),
                        );
                        handleChange("working_days", sortedUpdated);
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
              {newEmployer.working_days.map((day) => (
                <div key={day} className="mb-2">
                  <p className="text-white font-medium">{day}</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={hourRange[`${day}_start`] || ""}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        setHourRange((prev) => ({
                          ...prev,
                          [`${day}_start`]: newStart,
                          ...(newStart === "" && { [`${day}_end`]: "" }),
                        }));
                      }}
                      className="bg-white text-black px-3 py-2 rounded border border-gray-300"
                    >
                      <option value="">Start</option>
                      {getAvailableStartTimes(
                        day,
                        newEmployer.working_hours,
                      ).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span className="text-white">to</span>
                    <select
                      value={hourRange[`${day}_end`] || ""}
                      onChange={(e) =>
                        setHourRange((prev) => ({
                          ...prev,
                          [`${day}_end`]: e.target.value,
                        }))
                      }
                      className="bg-white text-black px-3 py-2 rounded border border-gray-300"
                      disabled={!hourRange[`${day}_start`]}
                    >
                      <option value="">End</option>
                      {getAvailableEndTimes(
                        day,
                        hourRange[`${day}_start`] || "",
                        newEmployer.working_hours,
                      ).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={() => {
                        addWorkingHour(
                          day,
                          hourRange[`${day}_start`],
                          hourRange[`${day}_end`],
                        );
                        setHourRange((prev) => ({
                          ...prev,
                          [`${day}_start`]: "",
                          [`${day}_end`]: "",
                        }));
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {(newEmployer.working_hours[day] || []).map((slot, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-200 text-black rounded-full px-3 py-1"
                      >
                        <span>
                          {slot.start} - {slot.end}
                        </span>
                        <button
                          onClick={() => {
                            setNewEmployer((prev) => {
                              const filtered = prev.working_hours[day].filter(
                                (_, i) => i !== idx,
                              );
                              const updatedHours = {
                                ...prev.working_hours,
                                [day]: filtered,
                              };

                              return {
                                ...prev,
                                working_hours: updatedHours,
                                working_days: [
                                  ...new Set([...prev.working_days]),
                                ], // keep working_days intact
                              };
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

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
                      const formattedEmployer = {
                        ...newEmployer,
                        working_hours: Object.fromEntries(
                          Object.entries(newEmployer.working_hours).map(
                            ([day, slots]) => [
                              day,
                              slots.map((slot) => `${slot.start}-${slot.end}`),
                            ],
                          ),
                        ),
                      };
                      await Create_Employer(formattedEmployer);
                      console.log("Employer created successfully");
                      setDialogStaffOn(false);
                      setNewEmployer({
                        name: "",
                        email: "",
                        phone: "",
                        working_days: [],
                        working_hours: {},
                        profile_picture: "",
                        services: [],
                      });
                      setHourRange({});
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
