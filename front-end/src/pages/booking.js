// React
import { useEffect, useState } from "react";

// Icons

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Functions
import { Post_Booking } from "@/utils/Bookings_Functions.js";
import { Create_Customer } from "@/utils/Customers_Functions";
import { Get_Services } from "@/utils/Services_Functions";
import { Get_Employers } from "@/utils/Employers_Functions";

export default function Booking() {
  // ======================
  // 🧠 State Management
  // ======================
  const [form_data, set_form_data] = useState({
    name: "",
    email: "",
    service: "",
    date: "",
    time: "",
    price: "",
    order_ref: "",
  });

  // Services
  const [services, set_services] = useState([]);
  const [service_selected, set_service_selected] = useState(false);

  // Employes
  const [employees, set_employees] = useState([]);
  const [selected_barber_id, set_selected_barber_id] = useState(null);
  const selected_barber = employees.find(
    (emp) => emp.id === selected_barber_id,
  );
  const available_days =
    selected_barber_id === null
      ? employees.reduce((acc, emp) => {
          emp.working_days.forEach((day) => {
            if (!acc.includes(day)) acc.push(day);
          });
          return acc;
        }, [])
      : selected_barber?.working_days || [];

  // Modal state for date/time slots
  const [show_modal, set_show_modal] = useState(false);
  const [selected_date, set_selected_date] = useState(null);
  const [available_slots, set_available_slots] = useState([]);

  // Steps
  // Function to generate 15-min interval slots between two times
  const get_time_slots = (start, end) => {
    const [start_h, start_m] = start.split(":").map(Number);
    const [end_h, end_m] = end.split(":").map(Number);

    const slots = [];
    let current = new Date(0, 0, 0, start_h, start_m);
    const end_time = new Date(0, 0, 0, end_h, end_m);

    while (current < end_time) {
      const next = new Date(current.getTime() + 15 * 60000);
      slots.push(
        `${current.getHours().toString().padStart(2, "0")}:${current
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      );
      current = next;
    }
    return slots;
  };

  // Handler for clicking a calendar date
  const handle_date_click = (date_obj) => {
    set_selected_date(date_obj);
    const day_name = date_obj.toLocaleDateString("en-GB", {
      weekday: "long",
    });

    let slots = [];

    if (selected_barber_id === null) {
      employees.forEach((emp) => {
        const hours = emp.working_hours?.[day_name] || [];
        hours.forEach((range) => {
          const [start, end] = range.split("-");
          slots.push(
            ...get_time_slots(start, end).map((time) => ({
              time,
              barber: emp.name,
            })),
          );
        });
      });
    } else {
      const emp = employees.find((e) => e.id === selected_barber_id);
      const hours = emp?.working_hours?.[day_name] || [];
      hours.forEach((range) => {
        const [start, end] = range.split("-");
        slots.push(
          ...get_time_slots(start, end).map((time) => ({
            time,
            barber: emp.name,
          })),
        );
      });
    }
    set_available_slots(slots);
    set_show_modal(true);
  };
  const [current_step, set_current_step] = useState(0);
  const steps = [
    {
      id: "Step 1",
      name: "Choose Service",
      href: "#",
      status: current_step > 0 ? "complete" : "current",
    },
    {
      id: "Step 2",
      name: "Customer Info",
      href: "#",
      status:
        current_step > 1
          ? "complete"
          : current_step === 1
            ? "current"
            : "upcoming",
    },
    {
      id: "Step 3",
      name: "Confirmation",
      href: "#",
      status: current_step === 2 ? "current" : "upcoming",
    },
  ];

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Calendar State
  const today = new Date();
  const [current_month, set_current_month] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const get_days_in_month = (month_date) => {
    const year = month_date.getFullYear();
    const month = month_date.getMonth();
    const start_date = new Date(year, month, 1);
    const end_date = new Date(year, month + 1, 0);

    const start_day = (start_date.getDay() + 6) % 7; // Adjust to make Monday=0, Sunday=6
    const total_days = end_date.getDate();

    const days = [];

    // Fill in previous empty cells with null
    for (let i = 0; i < start_day; i++) {
      days.push(null);
    }

    // Fill in current month's days
    for (let i = 1; i <= total_days; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }

    return days;
  };

  const days = get_days_in_month(current_month);

  const go_to_previous_month = () => {
    set_current_month(
      new Date(current_month.getFullYear(), current_month.getMonth() - 1, 1),
    );
  };

  const go_to_next_month = () => {
    set_current_month(
      new Date(current_month.getFullYear(), current_month.getMonth() + 1, 1),
    );
  };

  const formatted_month_year = current_month.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  // ======================
  // 🛠️ Event Handlers
  // ======================
  const handle_form_change = (value) => {
    const { name, value: field_value } = value.target;

    if (name === "service") {
      if (value !== "select_service") {
        set_service_selected(true);
        fetch_employees();
      }
    }

    set_form_data({ ...form_data, [name]: field_value });
  };

  const generate_order_ref = () => {
    return Math.random().toString().slice(2, 12);
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      // 1 - First create the order/booking
      const order_ref = generate_order_ref();
      const updated_form_data = { ...form_data, order_ref };
      await Post_Booking(updated_form_data);

      // 2 - Then after order is created, proceed to register the customer in the database
      await Create_Customer(updated_form_data);

      // Notification booking has been successful down here
    } catch (error) {
      console.error("Booking failed: ", error.message);
      // Notification booking has been unsuccessful down here
    }

    // TODO: Save to backend + send confirmation email
  };

  const fetch_services = async () => {
    try {
      const response = await Get_Services();
      set_services(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetch_employees = async (e) => {
    try {
      const response = await Get_Employers();
      set_employees(response);
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // 🧩 Effects
  // ======================
  useEffect(() => {
    fetch_services();
    fetch_employees();
  }, []);

  return (
    <div className="relative">
      {/* Navigation Buttons test */}
      <div className="mt-6 flex justify-between">
        <button
          disabled={current_step === 0}
          onClick={() => set_current_step((prev) => prev - 1)}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <button
          disabled={current_step === steps.length - 1}
          onClick={() => set_current_step((prev) => prev + 1)}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>

      {/* Progress Bar */}
      <nav aria-label="Progress" className="max-w-4xl mx-auto">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              {step.status === "complete" ? (
                <a
                  href={step.href}
                  className="group flex flex-col border-l-4 border-indigo-500 py-2 pl-4 hover:border-indigo-400 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                >
                  <span className="text-sm font-medium text-indigo-400 group-hover:text-indigo-300">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {step.name}
                  </span>
                </a>
              ) : step.status === "current" ? (
                <a
                  href={step.href}
                  aria-current="step"
                  className="flex flex-col border-l-4 border-indigo-500 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                >
                  <span className="text-sm font-medium text-indigo-400">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {step.name}
                  </span>
                </a>
              ) : (
                <a
                  href={step.href}
                  className="group flex flex-col border-l-4 border-white/10 py-2 pl-4 hover:border-white/20 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                >
                  <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {step.name}
                  </span>
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Select Service */}
      {current_step === 0 && (
        <div>
          <ul role="list" className="divide-y divide-white/5">
            {services.map((service, index) => (
              <li key={index} className="relative py-5 hover:bg-white/[0.025]">
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="mx-auto flex max-w-4xl justify-between gap-x-6">
                    {/* Left Side */}
                    <div className="flex min-w-0 gap-x-4">
                      <img
                        alt=""
                        src={`${backend_url}${service.image_url}`}
                        className="size-12 object-cover flex-none rounded-full bg-gray-800 outline outline-1 -outline-offset-1 outline-white/10"
                      />
                      <div className="min-w-0 flex-auto">
                        <h2 className="text-sm/6 font-semibold text-white">
                          <span className=" inset-x-0 -top-px bottom-0" />
                          {service.name}
                        </h2>
                        <p className="mt-1 w-[450px] flex text-xs/5 text-gray-400">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    {/* Right Side */}
                    <div className="flex shrink-0 items-center gap-x-4">
                      <div className="text-right text-white ">
                        <p className="">£{service.price}.00</p>
                        <p className="text-small">{service.duration}</p>
                      </div>
                      <button
                        onClick={() => {
                          set_service_selected(true);
                          set_form_data((prev) => ({
                            ...prev,
                            service: service.name,
                            price: service.price,
                          }));
                          set_current_step(1);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-1 rounded"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Select the day and staff */}
      {current_step === 1 && (
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-white/10 max-w-4xl mx-auto">
          {/* Left Side */}
          <section className="mt-12 md:mt-0 md:pr-14">
            <h2 className="text-base font-semibold text-white">
              Choose Staffer
            </h2>
            <ol className="mt-4 flex flex-col gap-y-1 text-sm/6 text-gray-400">
              <li
                className={`group flex items-center gap-x-4 rounded-xl px-4 py-2 cursor-pointer hover:bg-white/10 ${
                  selected_barber_id === null ? "bg-white/10" : ""
                }`}
                onClick={() => set_selected_barber_id(null)}
              >
                <img
                  alt="No Preference"
                  src="https://cdn-icons-png.flaticon.com/512/64/64572.png"
                  className="size-10 flex-none rounded-full outline outline-1 -outline-offset-1 outline-white/10"
                />
                <div className="flex-auto">
                  <p className="text-white font-semibold">No Preference</p>
                  <p className="text-sm text-gray-400"></p>
                </div>
              </li>
              {employees.map((employee) => (
                <li
                  key={employee.id}
                  className={`group flex items-center gap-x-4 rounded-xl px-4 py-2 cursor-pointer hover:bg-white/10 ${
                    selected_barber_id === employee.id ? "bg-white/10" : ""
                  }`}
                  onClick={() => set_selected_barber_id(employee.id)}
                >
                  <img
                    alt={employee.name}
                    src={employee.image_url}
                    className="size-10 flex-none rounded-full outline outline-1 -outline-offset-1 outline-white/10"
                  />
                  <div className="flex-auto">
                    <p className="text-white">{employee.name}</p>
                    <p className="text-sm text-gray-400">Barber/Specialist</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Right Side */}
          <section>
            <div className="flex items-center">
              <h2 className="flex-auto text-sm font-semibold text-white">
                {formatted_month_year}
              </h2>
              <button
                type="button"
                onClick={go_to_previous_month}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-white"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={go_to_next_month}
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-white"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="mt-10 grid grid-cols-7 text-center text-xs/6 text-gray-400">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
            <div className="mt-2 grid grid-cols-7 text-sm">
              {days.map((day, dayIdx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${dayIdx}`}
                      data-first-line={dayIdx <= 6 ? "" : undefined}
                      className="py-2 [&:not([data-first-line])]:border-t [&:not([data-first-line])]:border-white/10"
                    >
                      <div className="h-8" />
                    </div>
                  );
                }
                // Updated is_past_day logic
                const now = new Date();
                const today_date = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                );
                const day_date = new Date(
                  day.date.getFullYear(),
                  day.date.getMonth(),
                  day.date.getDate(),
                );

                let is_past_day = false;

                if (day_date < today_date) {
                  is_past_day = true;
                } else if (day_date.getTime() === today_date.getTime()) {
                  // Check current time vs. end of shift
                  const day_name = day_date.toLocaleDateString("en-GB", {
                    weekday: "long",
                  });
                  const barber = selected_barber || employees[0]; // fallback to first if none selected

                  const work_slots = barber?.working_hours?.[day_name];

                  if (work_slots && work_slots.length > 0) {
                    const last_slot = work_slots[work_slots.length - 1]; // e.g., "06:00-10:00"
                    const [, end_time_str] = last_slot.split("-");
                    const [end_hour, end_minute] = end_time_str
                      .split(":")
                      .map(Number);
                    const shift_end = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate(),
                      end_hour,
                      end_minute,
                    );

                    if (now > shift_end) {
                      is_past_day = true;
                    }
                  } else {
                    is_past_day = true; // no hours set for today
                  }
                }
                const is_available = available_days.includes(
                  day.date.toLocaleDateString("en-GB", {
                    weekday: "long",
                  }),
                );
                return (
                  <div
                    key={day.date.toISOString()}
                    data-first-line={dayIdx <= 6 ? "" : undefined}
                    className="py-2 [&:not([data-first-line])]:border-t [&:not([data-first-line])]:border-white/10"
                  >
                    <button
                      type="button"
                      disabled={is_past_day || !is_available}
                      data-is-today={day.isToday ? "" : undefined}
                      data-is-selected={day.isSelected ? "" : undefined}
                      className={`
                        mx-auto flex flex-col items-center justify-center rounded-full
                        data-[is-selected]:data-[is-today]:bg-indigo-500
                        data-[is-selected]:font-semibold
                        data-[is-today]:font-semibold
                        data-[is-selected]:text-white
                        [&:not([data-is-selected])]:hover:bg-white/10
                        [&:not([data-is-selected])]:data-[is-today]:text-indigo-400
                        data-[is-selected]:[&:not([data-is-today])]:bg-white
                        data-[is-selected]:[&:not([data-is-today])]:text-gray-900
                        [&:not([data-is-selected])]:[&:not([data-is-today])]:text-white
                        ${
                          !is_available || is_past_day
                            ? "opacity-30 cursor-not-allowed"
                            : ""
                        }
                      `}
                      onClick={() => handle_date_click(day.date)}
                    >
                      <div className="flex flex-col items-center">
                        <time dateTime={day.date.toISOString().split("T")[0]}>
                          {day.date.getDate()}
                        </time>
                        {is_available && (
                          <div className="mt-1 h-0.5 w-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
        Book Your Appointment
      </h2>
      <p className="mt-2 text-lg/8 text-gray-600">
        Please fill out the form below to schedule your appointment.
      </p>
      <form onSubmit={handle_submit} className="mt-16">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* Full Name */}
          <div className="sm:col-span-2">
            {/* Input for user's full name */}
            <label
              htmlFor="name"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Full Name
            </label>
            <div className="mt-2.5">
              <input
                id="name"
                name="name"
                type="text"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={form_data.name}
                onChange={handle_form_change}
                required
              />
            </div>
          </div>
          {/* Email */}
          <div className="sm:col-span-2">
            {/* Input for user's email address */}
            <label
              htmlFor="email"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={form_data.email}
                onChange={handle_form_change}
                required
              />
            </div>
          </div>
          {/* Service Selection */}
          <div className="sm:col-span-2">
            {/* Dropdown to select the desired service */}
            <label
              htmlFor="service"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Service
            </label>
            <div className="mt-2.5">
              {services.length > 0 && (
                <select
                  id="service"
                  name="service"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  value={form_data.service}
                  onChange={handle_form_change}
                  required
                >
                  <option value="select_service" disabled>
                    Select Service
                  </option>
                  {services.map((service) => {
                    return (
                      <option key={service.id}>
                        {service.name} - £{service.price}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          </div>
          {/* Barber Staff Selection */}
          {service_selected && (
            <div className="sm:col-span-2">
              {/* Dropdown to select the desired service */}
              <label
                htmlFor="service"
                className="block text-sm/6 font-semibold text-gray-900"
              >
                Barber Staff
              </label>
              <div className="mt-2.5">
                {employees.length > 0 && (
                  <select
                    id="service"
                    name="service"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    value={form_data.service}
                    onChange={handle_form_change}
                    required
                  >
                    <option value="" disabled>
                      Select Staff
                    </option>
                    {employees.map((employee) => {
                      return <option key={employee.id}>{employee.name}</option>;
                    })}
                  </select>
                )}
              </div>
            </div>
          )}
          {/* Date Selection */}
          <div>
            {/* Input for selecting appointment date */}
            <label
              htmlFor="date"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Date
            </label>
            <div className="mt-2.5">
              <input
                id="date"
                name="date"
                type="date"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={form_data.date}
                onChange={handle_form_change}
                required
              />
            </div>
          </div>
          {/* Time Selection */}
          <div>
            {/* Input for selecting appointment time */}
            <label
              htmlFor="time"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Time
            </label>
            <div className="mt-2.5">
              <input
                id="time"
                name="time"
                type="time"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={form_data.time}
                onChange={handle_form_change}
                required
              />
            </div>
          </div>
        </div>
        {/* Submit Button Section */}
        <div className="mt-10 flex justify-end border-t border-gray-900/10 pt-8">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Book Now
          </button>
        </div>
      </form>
      {/* Modal for available time slots */}
      <Dialog
        open={show_modal}
        onClose={set_show_modal}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline outline-1 -outline-offset-1 outline-white/10 transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="size-6 text-indigo-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      Available Time Slots
                    </DialogTitle>
                    <div className="mt-4">
                      <ul className="flex flex-wrap gap-2">
                        {(() => {
                          // Slot generation logic
                          if (!selected_date) return null;
                          const day_name = selected_date.toLocaleDateString(
                            "en-GB",
                            {
                              weekday: "long",
                            },
                          );
                          let slots = [];
                          // Find selected service duration in minutes
                          let duration = 30;
                          if (form_data.service) {
                            const found = services.find(
                              (s) => s.name === form_data.service,
                            );
                            if (found && found.duration) {
                              // Try to parse duration (e.g. "30 min" or "45")
                              const match = String(found.duration).match(/\d+/);
                              if (match) duration = parseInt(match[0], 10);
                            }
                          }
                          // Helper: generate slots array for a working hour range
                          const generateSlotsForRange = (
                            start,
                            end,
                            staffName,
                          ) => {
                            const slotList = [];
                            let [sh, sm] = start.split(":").map(Number);
                            let [eh, em] = end.split(":").map(Number);
                            let startTime = new Date(0, 0, 0, sh, sm);
                            let endTime = new Date(0, 0, 0, eh, em);
                            while (true) {
                              let slotStart = new Date(startTime);
                              let slotEnd = new Date(
                                startTime.getTime() + duration * 60000,
                              );
                              if (slotEnd > endTime) break;
                              slotList.push({
                                time: slotStart.toTimeString().slice(0, 5),
                                barber: staffName,
                              });
                              startTime = new Date(
                                startTime.getTime() + 15 * 60000,
                              );
                            }
                            return slotList;
                          };
                          if (selected_barber_id === null) {
                            // Merge all employees' slots and remove duplicates by time
                            employees.forEach((emp) => {
                              const hours = emp.working_hours?.[day_name] || [];
                              hours.forEach((range) => {
                                const [start, end] = range.split("-");
                                slots.push(
                                  ...generateSlotsForRange(
                                    start,
                                    end,
                                    emp.name,
                                  ),
                                );
                              });
                            });
                            // Filter to unique slots by time string
                            const uniqueSlotsMap = {};
                            slots.forEach((slot) => {
                              if (!uniqueSlotsMap[slot.time]) {
                                uniqueSlotsMap[slot.time] = slot;
                              }
                            });
                            slots = Object.values(uniqueSlotsMap);
                            // Sort slots in chronological order
                            slots.sort((a, b) => {
                              const [ah, am] = a.time.split(":").map(Number);
                              const [bh, bm] = b.time.split(":").map(Number);
                              return ah * 60 + am - (bh * 60 + bm);
                            });
                          } else {
                            const emp = employees.find(
                              (e) => e.id === selected_barber_id,
                            );
                            const hours = emp?.working_hours?.[day_name] || [];
                            hours.forEach((range) => {
                              const [start, end] = range.split("-");
                              slots.push(
                                ...generateSlotsForRange(start, end, emp.name),
                              );
                            });
                          }
                          if (slots.length === 0) {
                            return (
                              <li className="text-gray-400">
                                No available slots
                              </li>
                            );
                          }
                          return slots.map((slot, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-center border rounded px-3 py-2 text-sm text-gray-900"
                            >
                              {slot.time}
                            </li>
                          ));
                        })()}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => set_show_modal(false)}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
