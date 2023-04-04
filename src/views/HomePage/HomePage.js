// REACT
import React, { Component }  from 'react';
import {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {Link} from "react-router-dom";

import axios from 'axios';

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";
import Sidebar from "../../components/sidebar/Sidebar.js";

// STYLES
import "./HomePage.scss"


function HomePage() {

    return (
      <>
      <main id="main-homepage">
        <Sidebar />
        <div className="wrap">
          <h1>Welcome to ZogCRM</h1>
          <ul>
            <li><Link to="/clients"><i className="fal fa-users"></i>Clients</Link></li>
            <li><Link to="/quotations"><i className="fal fa-file-alt"></i>Quotes</Link></li>
            <li><Link to="/invoices"><i className="far fa-receipt"></i>Invoices</Link></li>
         </ul>
        </div>
      </main>
      </>
    );
}

export default HomePage;
