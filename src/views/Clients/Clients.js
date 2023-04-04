// REACT
import React, { Component }  from 'react';
import {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {Link} from "react-router-dom";

import axios from 'axios';

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";
import Sidebar from "../../components/sidebar/Sidebar.js";

// STYLES
import "./Clients.scss"


function HomePage() {

    const [clients, setClients] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/clients')
        .then(res => {
            console.log(res.data);
            setClients(res.data);
        })
        .catch(err => console.log(err));
    }, []);

    return (
      <>
      <main id="main-clients">
        <Sidebar />
        <div className="wrap">
          <header className="flex gap30 alignCenter mb20">
            <h1>Clients</h1>
            <CustomButton size="medium" link="/new-client"><i className="fas fa-plus"></i> New Client</CustomButton>
          </header>
          {
           clients.length ?
            <ul>
              {clients.map(client => (
              <li key={client._id}>
                    <h4>
                    <Link to={`/clients/${client._id}`}><span><i className="fas fa-user mr10"></i>{client.name}</span><i className="fas fa-arrow-right"></i></Link>
                    </h4>
                    <p><i className="fas fa-envelope"></i> <span>{client.email}</span></p>
                    <p><i className="fas fa-phone"></i> <span>{client.phone}</span></p>
                    <p><i className="fas fa-map-marker-alt"></i> <span>{client.address}</span></p>
                    <p><i className="fas fa-globe"></i> <span>{client.vat ? client.vat : "No VAT defined"}</span></p>
                    <p><i className="fas fa-id-badge"></i> <span>{client.siret ? client.siret : "No Siret defined"}</span></p>
                    <p><CustomButton color="borderwhite" size="small" link={`/new-quote/${client._id}`}>Create New Quote</CustomButton></p>
              </li>
              ))}
            </ul>
            : 
            <p>No Clients found in database</p>
         }
        </div>
      </main>
      </>
    );
}

export default HomePage;
