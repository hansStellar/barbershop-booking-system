import React, { useEffect, useState } from "react";
import {
  Get_Store_Settings,
  Update_Store_Hours,
  Add_Holiday,
  Remove_Holiday,
} from "@/utils/Store_Functions";

const Settings = () => {
  const [opening_time, set_opening_time] = useState("");
  const [closing_time, set_closing_time] = useState("");
  const [holidays, set_holidays] = useState([]);
  const [new_holiday, set_new_holiday] = useState("");

  useEffect(() => {
    fetch_settings();
  }, []);

  const fetch_settings = async () => {
    const data = await Get_Store_Settings();
    set_opening_time(data.opening_time || "");
    set_closing_time(data.closing_time || "");
    set_holidays(data.holidays || []);
  };

  const handle_update_hours = async () => {
    await Update_Store_Hours(opening_time, closing_time);
    alert("Opening hours updated");
  };

  const handle_add_holiday = async () => {
    if (!new_holiday) return;
    await Add_Holiday(new_holiday);
    set_new_holiday("");
    fetch_settings();
  };

  const handle_remove_holiday = async (date) => {
    await Remove_Holiday(date);
    fetch_settings();
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Store Settings</h1>

      <div className="mb-6">
        <label className="block font-semibold">Opening Time:</label>
        <input
          type="text"
          value={opening_time}
          onChange={(e) => set_opening_time(e.target.value)}
          className="border p-2 w-full rounded mt-1"
          placeholder="e.g., 09:00"
        />

        <label className="block font-semibold mt-4">Closing Time:</label>
        <input
          type="text"
          value={closing_time}
          onChange={(e) => set_closing_time(e.target.value)}
          className="border p-2 w-full rounded mt-1"
          placeholder="e.g., 17:00"
        />

        <button
          onClick={handle_update_hours}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Hours
        </button>
      </div>

      <div className="mb-6">
        <label className="block font-semibold">Add Holiday:</label>
        <input
          type="text"
          value={new_holiday}
          onChange={(e) => set_new_holiday(e.target.value)}
          className="border p-2 w-full rounded mt-1"
          placeholder="e.g., 25 Dec 2025"
        />
        <button
          onClick={handle_add_holiday}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Holiday
        </button>
      </div>

      <div>
        <h2 className="font-bold mb-2">Holidays:</h2>
        <ul className="list-disc list-inside">
          {holidays.map((date, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{date}</span>
              <button
                onClick={() => handle_remove_holiday(date)}
                className="ml-4 text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Settings;
