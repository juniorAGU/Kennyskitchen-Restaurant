import React from 'react'
import { Link } from 'react-router-dom'

function About() {
  return (
    <section className='min-h-screen bg-gray-50'>
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-yellow-300">KENYSkitchen</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Making your stomach realise that good food brings happiness and joy to your life. 
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our <span className="text-blue-600">Story</span>
              </h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-4 leading-relaxed">KENYSkitchen was born from a simple dream to bring Good african delicious, and freshly prepared meals to our community. What started as a small family kitchen has grown into a beloved dining destination where every meal tells a story.</p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our name "KENYS" represents our commitment to excellence - 
                <span className="font-semibold text-blue-600"> K</span>indness, 
                <span className="font-semibold text-blue-600"> E</span>xcellence, 
                <span className="font-semibold text-blue-600"> N</span>utrition, 
                <span className="font-semibold text-blue-600"> Y</span>our satisfaction, and 
                <span className="font-semibold text-blue-600"> S</span>ervice.
              </p>
              <p className="text-gray-600 leading-relaxed">Today, we're proud to serve hundreds of happy customers daily,offering everything from quick takeaways to elegant dining experiences.</p>
            </div>
            <div className="relative">
              <img 
                src="https://thumbs.dreamstime.com/b/johannesburg-south-africa-march-roadside-food-stall-large-cooking-pots-roadside-food-stall-south-africa-111549536.jpg"
                alt="Our Kitchen"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-5 -right-5 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <p className="text-2xl font-bold">Since 2021</p>
              </div>
            </div>
          </div>
        </div>
      </section>

       <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 text-center hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h3>
              <p className="text-gray-600">To serve high quality delicious meals, that bring joy to every table, while providing exceptional service that makes every customer feel like family.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 text-center hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h3>
              <p className="text-gray-600">To become the most Biggedt,lovly and trusted kitchen in Nigeria, known for excellence in food quality, service, and customer satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Delicious Dishes</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Expert Chefs</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.8★</div>
              <div className="text-blue-100">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ready to Experience <span className="text-blue-600">KENYSkitchen</span>?
          </h2>
          <p className="text-gray-600 mb-8">
            Come visit us or order online. We can't wait to serve you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/menu"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              View Our Menu
            </Link>
            <Link 
              to="/contact"
              className="px-8 py-3 bg-transparent border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>



    </section>
  )
}

export default About