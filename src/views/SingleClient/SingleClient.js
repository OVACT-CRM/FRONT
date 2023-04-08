//REACT
import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom"

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";
import Sidebar from "../../components/sidebar/Sidebar.js";

// STYLES
import "./SingleClient.scss";


function SingleClient() {

    const location = useLocation();
    const clientID = location.pathname.split('/')[2];
    const [client, setClient] = useState(null);
    const[activeTable, setActiveTable] = useState("quotations");

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [vat, setVat] = useState('');
    const [siret, setSiret] = useState('');



    useEffect(() => {
      fetch(`http://localhost:3001/clients/${clientID}`)
        .then(response => response.json())
        .then(data => {
            setClient(data);
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone);
            setAddress(data.address);
            if(data.vat) {
                setVat(data.vat);
            }
            if(data.siret) {
                setSiret(data.siret);
            }
        })
        .catch(error => console.error(error));
    }, [clientID]);


    const [quotations, setQuotations] = useState([]);

    const fetchQuotations = async (clientID) => {
        try {
          const response = await fetch(`http://localhost:3001/quotations/client/${clientID}`);
          const data = await response.json();
          setQuotations(data);
        } catch (err) {
          console.error(err);
        }
    };

    const [invoices, setInvoices] = useState([]);
    const fetchInvoices = async (clientID) => {
        try {
          const response = await fetch(`http://localhost:3001/invoices/client/${clientID}`);
          const data = await response.json();
          console.log('invoices: ',data);
          setInvoices(data);
        } catch (err) {
          console.error(err);
        }
    };

    useEffect(() => {
        fetchInvoices(clientID);
        fetchQuotations(clientID);
      }, [clientID]);

    

    const updateClient = async () => {
        try {
            const response = await fetch(`http://localhost:3001/clients/${clientID}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone, address, vat, siret }),
            });
            if (!response.ok) {
                throw new Error(`Update failed: ${response.statusText}`);
            }
            const updatedClient = await response.json();
            setClient(updatedClient);
            alert('Client updated successfully');
        } catch (error) {
            console.error(error);
            alert(`Failed to update client: ${error.message}`);
        }
    };


    if (!client) {
      return <div>Loading...</div>;
    }

    return (
        <>
            <main id="main-singleClient">
                <Sidebar />
                <div className="wrap">
                    <header className="flex gap20 alignCenter spaceBetween mb30">
                        <h1>{client.name}</h1>
                        <div className="flex gap30">
                            <CustomButton onClick={updateClient}>Update</CustomButton>
                            <CustomButton link={`/new-quote/${client._id}`}>Create New Quote</CustomButton>
                        </div>
                    </header>

                    <ul className="clientInfos">
                        <li>
                            <label>Email</label>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </li>
                        <li>
                            <label>Phone</label>
                            <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </li>
                        <li>
                            <label>Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </li>
                        {vat && (
                            <li>
                            <label>VAT</label>
                            <input type="text" value={vat} onChange={(e) => setVat(e.target.value)} />
                            </li>
                        )}
                        {siret && (
                            <li>
                            <label>SIRET</label>
                            <input type="text" value={siret} onChange={(e) => setSiret(e.target.value)} />
                            </li>
                        )}
                    </ul>


                    <div className="tableNav">
                        <ul>
                            <li className={activeTable === "quotations" ? "active" : ""} onClick={() => setActiveTable("quotations")}>Quotations</li>
                            <li className={activeTable === "invoices" ? "active" : ""} onClick={() => setActiveTable("invoices")}>Invoices</li>
                        </ul>
                    </div>

                    { activeTable === "quotations" &&
                    <table>
                        <thead>
                            <tr>
                            <th>Quote ID</th>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.map(quote => (
                            <tr key={quote._id}>
                                <td><a href={`http://localhost:3000/quotations/${quote._id}`}>{quote._id}</a></td>
                                <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                                <td>{quote.subject}</td>
                                <td>{quote.total}</td>
                                <td className="td-status">{quote.status}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    }

                    
                    { activeTable === "invoices" &&
                    <table>
                        <thead>
                            <tr>
                            <th>Invoice ID</th>
                            <th>Date</th>
                            <th>Step</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => (
                            <tr key={invoice._id}>
                                <td><a href={`http://localhost:3000/invoices/${invoice._id}`}>{invoice._id}</a></td>
                                <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                <td>{invoice.step}/{invoice.nbinvoices}</td>
                                <td>{invoice.total}</td>
                                <td className="td-status">{invoice.status}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    }
                </div>
            </main>
        </>
    );
}

export default SingleClient;
