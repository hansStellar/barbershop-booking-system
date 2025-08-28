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
      {/* Hero Section */}
      <div className="h-screen relative">
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
        {/* Content */}
        <div className="h-full flex justify-center items-center flex-col relative z-10">
          <h3 className="text-h1 text-red-600 mb-4">
            More than a haircut - it's a lifestyle
          </h3>
          <div className="flex flex-wrap justify-center gap-8 ">
            <a className="btn btn-large btn-primary">Book an Appointment</a>
            <a className="btn btn-large btn-secondary">Check our Products</a>
          </div>
        </div>
      </div>
      {/* Services */}
      <div className="bg-white relative z-10 text-center py-10 md:py-28">
        <h2 className="text-h1 mb-8 md:mb-20">Services</h2>
        <div className="flex flex-wrap justify-center gap-20 container mx-auto">
          {services.map((service, index) => (
            <div key={index} className="w-96 text-left">
              {service.image_url && (
                <div className="w-full h-[450px] relative mb-2">
                  <img
                    src={`${backend_url}${service.image_url}`}
                    alt={`${service.name} image`}
                    layout="fill"
                    objectFit="cover"
                    className="h-full object-cover w-full"
                  />
                </div>
              )}
              <div className="flex justify-between items-center mt-8 mb-4">
                <h3 className="font-bold text-h2 ">{service.name}</h3>
                <p className="text-h2 font-bebas">£{service.price}</p>
              </div>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Second Landscape */}
      <div className="relative z-10 h-[600px] bg-black">
        {/* Image */}
        <img
          src="/second_landscape.jpg"
          className="h-full w-full object-cover object-top z-0 opacity-50 pointer-events-none absolute top-0"
        />
        {/* Content */}
        <div className="container h-full flex justify-center items-center flex-col relative z-10 mx-auto text-center">
          <h3 className="text-h1 text-red-600 mb-8">
            walk-ins are welcome, <br /> but booking is Best!
          </h3>
          <div className="flex flex-wrap justify-center gap-8 ">
            <a className="btn btn-large btn-primary">Book an Appointment</a>
            <a className="btn btn-large btn-secondary">Check our Products</a>
          </div>
        </div>
      </div>
    </section>
  );
}
