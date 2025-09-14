'use client'
import React from "react";
import Link from "next/link";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
export default function Landingpage() {
  const router = useRouter()
  return (
    <>
      <header className="body-font" style={{ backgroundColor: "#FFB900", color: "#000000", boxShadow: '0px 4px 0 0 #000000' }} >
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link
            href="#"
            className="flex title-font font-medium items-center mb-4 md:mb-0"
            style={{ color: "#000000" }}
          >
            <span className="ml-3 text-4xl font-bold italic">Paypasa</span>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link className="mr-5 hover:underline font-bold" style={{ color: "#000000" }} href="#">
              Home
            </Link>
            <Link className="mr-5 hover:underline font-bold" style={{ color: "#000000" }} href="#">
              About Us
            </Link>
            <Link className="mr-5 hover:underline font-bold" style={{ color: "#000000" }} href="#">
              Contact
            </Link>
          </nav>
          <button
            className="inline-flex items-center border-0 py-2 px-4 focus:outline rounded text-base mt-4 md:mt-0 cursor-pointer font-bold hover:bg-yellow-500 hover:border-2 hover:border-black"
            style={{ backgroundColor: "#000000", color: "#FFB900", }}
            onClick={() => router.push('/auth/login')}
          >
            Sign in
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </header>


      {/* hero section.  */}

      <div
        className="h-screen bg-cover bg-center text-center flex flex-col items-center"
        style={{
          backgroundImage: `url('/landing-bg4.jpg')`,
        }}
      >
        <h1 className="text-white text-7xl p-10 mt-10 font-bold mx-10">Capture your Expense with your team in every Moment</h1>
        <h3 className="text-white text-4xl ">Don't let anyone take your money infront of your eye!</h3>

        <Button className="bg-yellow-500 text-black text-2xl p-5 py-6  mt-8 hover:bg-amber-500 hover:text-black hover:box-shadow rounded cursor-pointer" style={{ boxShadow: '4px 4px 0 0 #000000' }}
          onClick={() => router.push('/auth/login')}>

          Start Tracking Today
        </Button>
      </div>



      <div className="infinite-slider w-full h-20 bg-amber-500 border border-black border-8 flex flex-row items-center " >
        <div className="slide-content flex items-center animate-marquee">
          <h1 className="font-bold text-4xl">LAUNCH OFFER!  <span className="italic text-white">  40% OFF </span> </h1>
          <h2 className="font-bold m-10 text-2xl">Collaborative Payment Partner</h2>
          <h1 className="font-bold text-4xl">LAUNCH OFFER!  <span className="italic text-white">  40% OFF </span> </h1>

        </div>

      </div>



      {/* section below. cards.  */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">

            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3"> <span>💵</span> Fast & Easy Bill Splitting</h1>
                  <p className="leading-relaxed mb-3">No more confusion, no more arguments. Split your bills quickly and effortlessly with just a few taps, whether it&apos;s dinner, travel, or any shared expense.</p>
                </div>
              </div>
            </div>



            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3"><span>📊</span>Precise Expense Tracking</h1>
                  <p className="leading-relaxed mb-3">Keep track of every expense in real-time. View a detailed breakdown of who paid, who owes what, and get a clear picture of your financial contributions.</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3"> <span>🧮</span>Automatic Bill Splitting</h1>
                  <p className="leading-relaxed mb-3">No need to do the math. The app automatically divides bills based on the number of attendees or custom rules, ensuring everyone pays their fair share without the hassle.</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3"> <span>👥</span> Group Management Made Simple</h1>
                  <p className="leading-relaxed mb-3">Create and manage groups for different events or shared activities. Easily add or remove members, and keep everyone in the loop on their balance.</p>
                </div>
              </div>
            </div>



            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3"> <span>⏰</span> Instant Payment Reminders</h1>
                  <p className="leading-relaxed mb-3">Never forget who owes you again. Get instant payment reminders so everyone can settle up quickly, with no awkwardness.</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3"> <span>🔒</span> Secure & Private</h1>
                  <p className="leading-relaxed mb-3">Your data is yours. The app ensures your information is private and secure, never shared with third parties. Track your expenses with confidence, knowing your privacy matters.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* footer */}
      <footer className="text-gray-600 body-font bg-gray-50">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap md:text-left text-center order-first">

            {/* First Column: Categories */}
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">Categories</h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Bill Splitting</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Expense Tracking</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Group Management</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Privacy & Security</a>
                </li>
              </nav>
            </div>

            {/* Second Column: Resources */}
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">Resources</h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">FAQ</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Contact Support</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Terms & Conditions</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Privacy Policy</a>
                </li>
              </nav>
            </div>

            {/* Third Column: Subscribe */}
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">Subscribe</h2>
              <div className="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start">
                <div className="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
                  <label htmlFor="footer-email" className="leading-7 text-sm text-gray-600">Enter your email</label>
                  <input
                    type="email"
                    id="footer-email"
                    name="footer-email"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <button className="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-primary-yellow border-0 py-2 px-6 focus:outline-none hover:bg-primary-black rounded" style={{ boxShadow: '4px 4px 0 0 #000000' }}>
                  Subscribe
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-2 md:text-left text-center">
                Stay updated with the latest features and updates from our app.
              </p>
            </div>
          </div>
        </div>


        {/* i'll add faq section if i got time.  */}



        {/* Footer Bottom Section */}
        <div className="bg-primary-yellow">
          <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
            <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
              {/* <span className="ml-3 text-xl">Paypasa</span> */}
            </a>
            <p className="text-sm  sm:ml-6 sm:mt-0 mt-4">© 2025 Paypasa
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
              <a className="" href="#" target="_blank" rel="noopener noreferrer">
                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a className="ml-3 " href="#" target="_blank" rel="noopener noreferrer">
                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a className="ml-3 " href="#" target="_blank" rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </footer>





    </>
  );
}
