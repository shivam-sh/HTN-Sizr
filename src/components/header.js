import React from "react";
import { Route, Link } from "react-router-dom"

export default function Header() {
  return (
    <header>
      <div className='header-inner'>
        <div className='logo'>
          <Link to='/'>SIZR.</Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link to='/shoes'>Shoes</Link>
            </li>
            <li>
              <Link to='/about'>About Us</Link>
            </li>
            <li className='btn'>
              <Link to='/measure'>Measure</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
