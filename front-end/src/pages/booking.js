// React
import { useEffect, useState } from "react";

// Icons

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

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
  const available_days = selected_barber?.working_days || [];

  // Steps
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

    // Fill in previous month's trailing days
    for (let i = 0; i < start_day; i++) {
      const date = new Date(year, month, -start_day + i + 1);
      days.push({ date, isCurrentMonth: false });
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

    // Fill in next month's leading days
    while (days.length % 7 !== 0) {
      const date = new Date(
        year,
        month + 1,
        days.length - total_days - start_day + 1,
      );
      days.push({ date, isCurrentMonth: false });
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
                          <span className="absolute inset-x-0 -top-px bottom-0" />
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
                      <a className="btn btn-small btn-accent">Book</a>
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
              {days.map((day, dayIdx) => (
                <div
                  key={day.date.toISOString()}
                  data-first-line={dayIdx <= 6 ? "" : undefined}
                  className="py-2 [&:not([data-first-line])]:border-t [&:not([data-first-line])]:border-white/10"
                >
                  <button
                    type="button"
                    data-is-today={day.isToday ? "" : undefined}
                    data-is-selected={day.isSelected ? "" : undefined}
                    data-is-current-month={day.isCurrentMonth ? "" : undefined}
                    className="mx-auto flex size-8 items-center justify-center rounded-full data-[is-selected]:data-[is-today]:bg-indigo-500 data-[is-selected]:font-semibold data-[is-today]:font-semibold data-[is-selected]:text-white [&:not([data-is-selected])]:hover:bg-white/10 [&:not([data-is-selected])]:data-[is-today]:text-indigo-400 data-[is-selected]:[&:not([data-is-today])]:bg-white data-[is-selected]:[&:not([data-is-today])]:text-gray-900 [&:not([data-is-selected])]:[&:not([data-is-today])]:data-[is-current-month]:text-white [&:not([data-is-selected])]:[&:not([data-is-today])]:[&:not([data-is-current-month])]:text-gray-500"
                  >
                    <time dateTime={day.date.toISOString().split("T")[0]}>
                      {day.date.getDate()}
                    </time>
                  </button>
                </div>
              ))}
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
    </div>
  );
}
