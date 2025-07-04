// src/components/Header.jsx
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-yellow-800">
      <div className="flex items-center space-x-2">
        <div className="bg-black text-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-bold">
          $
        </div>
        <span className="font-bold text-xl">EXPENSE TRACKER</span>
      </div>
      <nav className="space-x-6 hidden md:flex pr-6">
        <a href="#" className="text-white hover:text-yellow-600">Home</a>
        <a href="#" className="text-white hover:text-yellow-600">Features</a>
        <a href="#" className="text-white hover:text-yellow-600">Reviews</a>
        <a href="#" className="text-white hover:text-yellow-600">Action</a>
        <a href="#" className="text-white hover:text-yellow-600">FAQ</a>
      </nav>
      
    </header>
  );
}
