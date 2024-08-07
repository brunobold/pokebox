"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import supabase from "src/lib/supabase-browser";

async function Navbar(props) {
  useEffect(() => {
    async function getData() {
      const { data } = await supabase.auth.getSession();
      console.log(data);
    }
    getData();
  });
  return (
    <div className="navbar bg-zinc-900">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case text-green-400">
          PokeBox
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Browse</a>
          </li>
          <li>
            <details>
              <summary>Profile</summary>
              <ul className="bg-zinc-800 p-2">
                <li>
                  <a href="/">User</a>
                </li>
                <li>
                  <Link href="/profile/settings">Settings</Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
