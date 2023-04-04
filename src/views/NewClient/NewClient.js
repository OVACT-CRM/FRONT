// REACT
import React, { Component }  from 'react';
import {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {Link} from "react-router-dom";

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";
import Sidebar from "../../components/sidebar/Sidebar.js";

// STYLES
import "./NewClient.scss"


function NewClient() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [vat, setVat] = useState('');
  const [siret, setSiret] = useState('');

  const data = {
    name, setName,
    email, setEmail,
    phone, setPhone,
    address, setAddress,
    vat, setVat,
    siret, setSiret
  };

  const handleNewClient = (e) => {
    e.preventDefault();
  
    // Create client data object from state
    const clientData = {
      name,
      email,
      phone,
      address,
      vat,
      siret
    };
  
    // Make POST request to create new client
    fetch('http://localhost:3001/clients/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create client');
      }
      // Redirect to the single client page for the new client
      return response.json();
    })
    .then(data => {
      window.location.href = `/clients/${data._id}`;
    })
    .catch(error => {
      console.error(error);
    });
  };


  return (
    <>
    <main id="main-newclient">
      <Sidebar />
      <div className="wrap">
        <h1>Add new client</h1>
        <form onSubmit={handleNewClient}>
            <input
              id="name"
              type="text"
              placeholder="Name"
              required
              value={data.name}
              onChange={(e)=>data.setName(e.target.value)}
            />
            <input
              id="email"
              type="text"
              placeholder="Email"
              required
              value={data.email}
              onChange={(e)=>data.setEmail(e.target.value)}
            />
            <input
              id="phone"
              type="text"
              placeholder="Phone"
              required
              value={data.phone}
              onChange={(e)=>data.setPhone(e.target.value)}
            />
            <input
              id="address"
              type="text"
              placeholder="Address"
              required
              value={data.address}
              onChange={(e)=>data.setAddress(e.target.value)}
            />
            <input
              id="vat"
              type="text"
              placeholder="VAT"
              value={data.vat}
              onChange={(e)=>data.setVat(e.target.value)}
            />
            <input
              id="siret"
              type="text"
              placeholder="Siret"
              value={data.siret}
              onChange={(e)=>data.setSiret(e.target.value)}
            />
          <div className="mt20">
            <CustomButton type="submit">Ajouter</CustomButton>
          </div>
        </form>
      </div>
    </main>
    </>
  );
}

export default NewClient;
