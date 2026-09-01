import React from 'react';
import { RxCross2 } from "react-icons/rx";
import { HiOutlineCheck } from "react-icons/hi";

const pricingPlans = [
  {
    price: "$40",
    period: "/per Day",
    title: "Onetime Package",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quae voluptas",
    features: [
      { name: "Doorstep Pickup", included: false },
      { name: "Professional Staff", included: true },
      { name: "Express Service", included: false },
      { name: "Laundry Service", included: true },
      { name: "Pickup Service", included: false },
    ],
  },
  {
    price: "$60",
    period: "/per Day",
    title: "Standard Package",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quae voluptas",
    features: [
      { name: "Doorstep Delivery", included: true },
      { name: "Professional Staff", included: true },
      { name: "Laundry Service", included: true },
      { name: "Pickup Service", included: false },
    ],
  },
  {
    price: "$80",
    period: "/per Day",
    title: "Premium Package",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quae voluptas",
    features: [
      { name: "Doorstep Delivery", included: true },
      { name: "Professional Staff", included: true },
      { name: "Laundry Service", included: true },
      { name: "Pickup Service", included: true },
    ],
  },
];

function Pricing() {
  return (
    <div className='px-4 md:px-20 py-20 mt-20'>
      <div className='text-center text-3xl md:text-5xl lilita-one-regular'>
        Affordable <span className='text-blue-500'>Pricing Packages</span>
      </div>
      <div className='mt-10 md:mt-20 flex flex-col md:flex-row justify-center gap-10 flex-wrap'>
        {pricingPlans.map((plan, index) => (
          <div key={index} className='md:w-[400px] p-8 bg-stone-100 shadow shadow-stone-400 rounded-3xl flex flex-col'>
            <div className='lilita-one-regular text-4xl'>
              {plan.price} <span className='text-blue-500 poppins-medium text-lg'>{plan.period}</span>
            </div>
            <div className='text-xl poppins-medium mt-3'>{plan.title}</div>
            <div className='mt-1 poppins-regular text-stone-700 border-b border-stone-400 pb-5'>
              {plan.description}
            </div>
            <div className='mt-5'>
              <div className='poppins-medium'>What's included?</div>
              <div className='flex flex-col gap-2 mt-2'>
                {plan.features.map((feature, i) => (
                  <div key={i} className='flex gap-1 items-center'>
                    <div className={`p-1 rounded-full text-stone-50 ${feature.included ? 'bg-blue-500' : 'bg-stone-400'}`}>
                      {feature.included ? <HiOutlineCheck size={15} /> : <RxCross2 size={15} />}
                    </div>
                    <span className='poppins-regular text-stone-700 ml-2'>{feature.name}</span>
                  </div>
                ))}
              </div>
              <div className='bg-gradient-to-r from-blue-500 to-blue-900 text-center p-4 mt-9 rounded-full poppins-medium text-stone-50'>
                Get Started
              </div>
              <div className='mt-5 poppins-regular text-stone-700'>*Terms and conditions apply</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
