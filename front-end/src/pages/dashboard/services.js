import { useEffect, useState } from "react";
import { Input } from "@/components/catalyst/input";
import DashboardLayout from "@/components/layouts/dashboard_layout";
import { Textarea } from "@/components/catalyst/textarea";
import { Button } from "@/components/catalyst/button";
import { Dialog } from "@/components/catalyst/dialog";
import { Switch } from "@/components/catalyst/switch";

import { Get_Services, Create_Service } from "@/utils/Services_Functions.js";

// Add layout to the page
ServicesPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    duration: "",
    price: "",
  });
  const [durationValue, setDurationValue] = useState("");

  const handleChange = (e) => {
    setNewService((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Create_Service({
        ...newService,
        duration: durationValue,
      });
      console.log("Service created:", response);
      setDialogOpen(false);
      setNewService({
        name: "",
        duration: "",
        price: "",
      });
      setDurationValue("");
      const data = await Get_Services();
      setServices(data);
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  useEffect(() => {
    const fetch_services = async () => {
      try {
        const data = await Get_Services();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetch_services();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Services</h2>
        <Button onClick={() => setDialogOpen(true)}>Add Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(services) &&
          services.map((service, index) => (
            <div
              key={index}
              className="border border-gray-600 p-4 rounded-lg bg-gray-800"
            >
              <h3 className="font-semibold">{service.name}</h3>
              <p className="text-sm">{service.description}</p>
              <p className="text-sm">Duration: {service.duration}</p>
              <p className="text-sm">Price: £{service.price}</p>
            </div>
          ))}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Add New Service</h3>
          <Input
            placeholder="Service Name"
            name="name"
            value={newService.name}
            onChange={handleChange}
            required
          />
          <select
            className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-2 w-full"
            value={durationValue}
            onChange={(e) => setDurationValue(e.target.value)}
            required
          >
            <option value="">Select duration</option>
            <option value="15 min">15 min</option>
            <option value="30 min">30 min</option>
            <option value="45 min">45 min</option>
            <option value="1 hour">1 hour</option>
            <option value="1 hour 30 min">1 hour 30 min</option>
            <option value="2 hours">2 hours</option>
          </select>
          <Input
            placeholder="Price"
            name="price"
            value={newService.price}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
