import React from 'react'

function Review() {
    const reviews = [
    {
      id: 1,
      name: "Sarah Munachi",
      role: "Regular Customer",
      service: "Dine in Experience",
      rating: 5,
      review: "The ambiance is amazing and the food is absolutely delicious! The staff is very attentive and friendly. Best dining experience in town!",
      date: "March 2026",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Abraham Sunday",
      role: "Food Critic",
      service: "Takeaway Service",
      rating: 5,
      review: "Impressed with the packaging and food quality. Even after 30 minutes delivery, the food was still hot and fresh. Highly recommended!",
      date: "February 2026",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 3,
      name: "Kelly Chima",
      role: "Birthday Party Host",
      service: "Home Delivery",
      rating: 5,
      review: "They catered my birthday party and everyone loved the food! Professional service and great variety of dishes. Will definitely book again.",
      date: "January 2026",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 4,
      name: "David Ola",
      role: "Food Enthusiast",
      service: "Online Ordering",
      rating: 4,
      review: "Easy ordering process through their website. Food arrived on time and was exactly as described. Great value for money!",
      date: "March 2026",
      image: "https://randomuser.me/api/portraits/men/4.jpg"
    }
  ];

  return (
    <section>
        <div className="customersreviews w-full h-full  my-4 rounded-lg shadow-md ">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">
            What Our <span className="text-blue-600">Customers Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Come Experirnce the Best Food in Town with Us! We are committed to your stomach!
          </p>
            <div className="reviewscontainer w-[95%] h-full  mx-auto rounded-lg shadow-md mt-4 flex items-center justify-between gap-4 p-4">
                {reviews.map(items => (
                    <div key={items.id} className="reviewitems border-l-4 border-blue-500 pl-6 py-4 bg-white rounded-lg shadow-md p-4">
                        <div className="customerinfo flex items-center gap-4 mb-2">
                            {[...Array(5)].map((_,i) => (
                                <span key={i} className={`tex-xl ${i < items.rating ? "text-yellow-400" : "text-gray-300"}`}>
                                    ★
                                </span>
                            ))}
                            </div>
                        <p className="text-gray-700 mb-4 italic">{items.review}</p>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-gray-800">{items.name}</h4>
                                <p className="text-sm text-gray-500">{items.service}</p>
                            </div>
                             <span className="text-sm text-gray-400">{items.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Review