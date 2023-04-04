// REACT
import React, { Component }  from 'react';
import {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {Link} from "react-router-dom";

import axios from 'axios';

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";
import Sidebar from "../../components/sidebar/Sidebar.js";

// STYLES
import "./Invoices.scss"


function Invoices() {

    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/invoices')
        .then(res => {
            console.log(res.data);
            setInvoices(res.data);
        })
        .catch(err => console.log(err));
    }, []);

    return (
      <>
      <main id="main-invoices">
        <Sidebar />
        <div className="wrap">
          <header className="flex gap30 alignCenter mb20">
            <h1>Invoices</h1>
          </header>
          {invoices.length ? (
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Subject</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td><a href={`http://localhost:3000/invoices/${invoice._id}`}>{invoice._id}</a></td>
                    <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    <td>{invoice.client.name}</td>
                    <td className="subject">{invoice.quotations[0].subject}</td>
                    <td>{invoice.total}</td>
                    <td className="td-status">{invoice.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No invoices found in database</p>
          )}
        </div>
      </main>
      </>
    );
}

export default Invoices;
