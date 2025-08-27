import Image from "next/image";
import { useEffect, useState } from "react";
import { Get_Services } from "@/utils/Services_Functions";

export default function Home() {
  const [services, set_services] = useState([]);
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    async function fetch_services() {
      try {
        const data = await Get_Services();
        set_services(data);
        console.log(services);
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    }
    fetch_services();
  }, []);

  return (
    <section className="">
      {/* Video Fixed */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-50 pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/hero_landscape.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Hero Section */}
      <div className="h-screen">
        <div className="h-full flex justify-center items-center flex-col relative z-10">
          <h3 className="text-h1 text-red-600 mb-4">
            More than a haircut - it's a lifestyle
          </h3>
          <div className="flex flex-wrap justify-center gap-4 ">
            <a className="btn btn-large btn-primary">Book an Appointment</a>
            <a className="btn btn-large btn-secondary">Check our Products</a>
          </div>
        </div>
      </div>
      {/* Services */}
      <div className="bg-white relative z-10 text-center">
        <h2 className="text-h1">Services</h2>
        <div className="flex flex-wrap justify-center gap-x-20 container mx-auto">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-100 rounded shadow">
              {service.image_url && (
                <div className="w-full h-40 relative mb-2">
                  <img
                    src={`${backend_url}${service.image_url}`}
                    alt={`${service.name} image`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded h-full object-cover w-80"
                  />
                </div>
              )}
              <h3 className="font-bold text-lg">{service.name}</h3>
              <p>{service.description}</p>
              <p className="text-sm text-gray-600">£{service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
