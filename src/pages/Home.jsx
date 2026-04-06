import React from 'react'
import Review from '../components/Review'
import { Link } from 'react-router-dom'


function Home() {
  return (
    <section>
        <div className="Atract w-full h-[37rem] bg-green-200">
            <img 
            src="https://img.freepik.com/free-photo/top-view-fast-food-mix-mozzarella-sticks-club-sandwich-hamburger-mushroom-pizza-caesar-shrimp-salad-french-fries-ketchup-mayo-cheese-sauces-table_141793-3998.jpg?semt=ais_hybrid&w=740&q=100"
            alt="Food Image"
            className='w-full h-full object-cover brightness-90' 
            />
             <div className="absolute inset-0 bg-black/40 h-[42rem]"></div> 
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    Welcome to <span className="text-blue-400">KENYSkitchen</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow">
                    Discover the finest flavors crafted with passion and love
                </p>
                <button className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                    <Link to="/menu">
                        Explore Menu
                    </Link>
                </button>
            </div>
        </div>

        <div className="offers w-full h-[25rem]  my-2">
            <h2 className='text-3xl font-bold  text-center py-8'>Our Top Menu's</h2>

            <div className="menulist w-[95%] h-[18rem]  mx-auto rounded-lg mb-4 flex items-center justify-between gap-4 p-4">
                <div className="menuitems w-[30%] h-full bg-white rounded-lg shadow-md p-2">
                    <img 
                    src="https://foods.africanmarketdubai.com/wp-content/uploads/2024/10/afang-soup.jpeg"
                     alt="Menu Item" 
                     className='w-full h-[12rem] object-cover rounded-lg'
                     />

                     <p className="text-lg font-semibold text-gray-800 mt-2 text-center">Delicious Afang soup</p>
                </div>

                <div className="menuitems  menuitems w-[30%] h-full bg-white rounded-lg shadow-md p-2 ">
                    <img 
                    src="https://i.ytimg.com/vi/nmZ1TVhFQJo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAnyPFIDnXi9AFbPPd5Ge9OwKo0Gg"
                     alt="Menu Item" 
                     className='w-full h-[12rem] object-cover rounded-lg'
                     />
                     <p className="text-lg font-semibold text-gray-800 mt-2 text-center">Sweet Banger Rice</p>
                </div>

                <div className="menuitems menuitems w-[30%] h-full bg-white rounded-lg shadow-md p-2">
                    <img 
                    src="https://dooneyskitchen.com/wp-content/uploads/2021/05/Fishermans-soup.jpeg"
                     alt="Menu Item" 
                     className='w-full h-[12rem] object-cover rounded-lg'
                     />
                     <p className="text-lg font-semibold text-gray-800 mt-2 text-center">Assorted Fisherman Soup</p>
                </div>

            </div>
        </div>
        <br />

        <div className="ref w-full h-[25rem]  mx-auto rounded-lg my-1  items-center  pt-4">
            <Review />
        </div>

    </section>
  )
}

export default Home