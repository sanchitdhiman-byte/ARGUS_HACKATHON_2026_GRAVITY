import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const GlobalHeader = ({ isLoggedIn = false, currentView, onNavigate, onLogin, onLogout, user }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-3 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-slate-900 text-xl font-black">
                account_balance_wallet
              </span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              GrantStream
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {isLoggedIn ? (
              <>
                {[
                  { name: "Explore Grants", path: "/" },
                  { name: "My Applications", path: "/my-applications" },
                  { name: "Guidelines", path: "/guidelines" },
                  { name: "Support", path: "/support" }
                ].map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => `text-sm font-bold transition-all hover:text-primary ${
                      isActive
                        ? "text-primary border-b-2 border-primary pb-1"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {link.name}
                  </NavLink>
                ))}
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin-dashboard"
                    className={({ isActive }) => `text-sm font-bold transition-all hover:text-red-500 flex items-center gap-1 ${
                      isActive
                        ? "text-red-500 border-b-2 border-red-500 pb-1"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="material-symbols-outlined !text-sm">shield_person</span>
                    Admin
                  </NavLink>
                )}
              </>
            ) : (
              <>
                {[
                  { name: "Explore Grants", path: "/" },
                  { name: "Guidelines", path: "/guidelines" },
                  { name: "Support", path: "/support" },
                  { name: "About", path: "/about" }
                ].map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => `text-sm font-bold transition-all hover:text-primary ${
                      isActive
                        ? "text-primary border-b-2 border-primary pb-1" 
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 group relative">
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">search</span>
            </button>
            
            {isLoggedIn ? (
              <>
                <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 group relative">
                  <span className="material-symbols-outlined text-xl text-primary">notifications</span>
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                </button>
                <div 
                  className="h-9 w-9 rounded-full border-2 border-primary/30 flex items-center justify-center overflow-hidden bg-slate-100 hover:ring-4 hover:ring-primary/10 transition-all cursor-pointer group"
                  onClick={() => onLogout && onLogout()}
                  title="Sign Out"
                >
                  <img 
                    alt="User" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiJSdiKv0RWNoIMZVGymxYtgYX0M20jk0g8GPVNSxWy4a1Ku7JQQkAzJsE4qkUYmWVaAOl4v757YQxeFK8L7jzM1uHSAIsqQkkjc1-jy3cQBGeV4GjAW4gqC1rH3oDPwU3oGxhrwk_oOG1PmqpaCLnWjBRX6tannAAeCCH9-_85GMFKwpY_jIl9bnRonlr8SNNAY8bWUO5frQLIkMlbX5bEYIFlTDEUgF-b78K4NeySlcBU6wKCiaae9McmDrytHX_aWrLRNorSRU"
                  />
                </div>
              </>
            ) : (
              <Link 
                to="/login"
                className="hidden sm:flex bg-primary hover:bg-primary/90 px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-primary/10 text-slate-900 active:scale-95"
              >
                Sign In
              </Link>
            )}
            
            <button className="lg:hidden p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
