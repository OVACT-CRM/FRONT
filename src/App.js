import React, { Component }  from 'react';
import {useState, useContext, useEffect, useLocation} from 'react'
import {BrowserRouter, Routes, Route, Link, Navigate, useParams} from "react-router-dom"

// PAGES
import HomePage from "./views/HomePage/HomePage.js"


import Clients from "./views/Clients/Clients.js"
import SingleClient from "./views/SingleClient/SingleClient.js"
import NewClient from "./views/NewClient/NewClient.js"

import Quotations from "./views/Quotations/Quotations.js"
import SingleQuote from "./views/SingleQuote/SingleQuote.js"
import NewQuote from "./views/NewQuote/NewQuote.js"

import Invoices from "./views/Invoices/Invoices.js"
import SingleInvoice from "./views/SingleInvoice/SingleInvoice.js"

import NotFound from "./views/NotFound/NotFound.js"

// COMPONENTS
import ResetScroll from "./components/ResetScroll/ResetScroll.js"

// STYLES
import './App.css';


function App() {
  return (
    <BrowserRouter>
        <ResetScroll />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/quotations' element={<Quotations />} />
          <Route path='/invoices' element={<Invoices />} />

          <Route path='/new-client' element={<NewClient />} />
          <Route path='/new-quote/:data?' element={<NewQuote />} />
          <Route path='/clients/:data' element={<SingleClient />} />
          <Route path='/quotations/:data' element={<SingleQuote />} />
          <Route path='/invoices/:data' element={<SingleInvoice />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
