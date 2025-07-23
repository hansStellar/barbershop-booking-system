import {useState} from "react"

// Functions
import {Booking_Function} from "@/utils/Booking_Function.js";



export default function Booking () {

    const [form_data, set_form_data] = useState({
        name: "",
        email: "",
        service: "",
        date: "",
        time: ""
    })

    const handle_form_change = (value) => {
        set_form_data({ ...form_data, [value.target.name]: value.target.value });
    }

    const handle_submit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await Booking_Function(form_data);
        } catch (error) {
            console.error(err);

        }

        // TODO: Save to backend + send confirmation email

    }

    return (
        <div className="relative bg-white">
        <div className="lg:absolute lg:inset-0 lg:left-1/2">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=2560&h=3413&&q=80"
            className="h-64 w-full bg-gray-50 object-cover sm:h-80 lg:absolute lg:h-full"
          />
        </div>
        <div className="pb-24 pt-16 sm:pb-32 sm:pt-24 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:pt-32">
          <div className="px-6 lg:px-8">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Book Your Appointment
              </h2>
              <p className="mt-2 text-lg/8 text-gray-600">
                Please fill out the form below to schedule your appointment.
              </p>
              <form onSubmit={handle_submit} className="mt-16">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {/* Booking Form: Full Name */}
                  <div className="sm:col-span-2">
                    {/* Input for user's full name */}
                    <label htmlFor="name" className="block text-sm/6 font-semibold text-gray-900">
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
                  {/* Booking Form: Email */}
                  <div className="sm:col-span-2">
                    {/* Input for user's email address */}
                    <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
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
                  {/* Booking Form: Service Selection */}
                  <div className="sm:col-span-2">
                    {/* Dropdown to select the desired service */}
                    <label htmlFor="service" className="block text-sm/6 font-semibold text-gray-900">
                      Service
                    </label>
                    <div className="mt-2.5">
                      <select
                        id="service"
                        name="service"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        value={form_data.service}
                        onChange={handle_form_change}
                        required
                      >
                        <option value="">Select Service</option>
                        <option value="Haircut">Haircut</option>
                        <option value="Shave">Shave</option>
                        <option value="Haircut & Shave">Haircut & Shave</option>
                      </select>
                    </div>
                  </div>
                  {/* Booking Form: Date Selection */}
                  <div>
                    {/* Input for selecting appointment date */}
                    <label htmlFor="date" className="block text-sm/6 font-semibold text-gray-900">
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
                  {/* Booking Form: Time Selection */}
                  <div>
                    {/* Input for selecting appointment time */}
                    <label htmlFor="time" className="block text-sm/6 font-semibold text-gray-900">
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
          </div>
        </div>
      </div>
    )
}