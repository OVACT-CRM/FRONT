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
    const slugify = (str) => {
        return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    };
    const clientID = location.pathname.split('/')[2];

    const [client, setClient] = useState(null);

    useEffect(() => {
      fetch(`http://localhost:3001/clients/${clientID}`)
        .then(response => response.json())
        .then(data => setClient(data))
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

    useEffect(() => {
        console.log("Client ID: ", clientID); // check clientID value
        fetchQuotations(clientID);
      }, [clientID]);

      

    if (!client) {
      return <div>Loading...</div>;
    }

    return (
        <>
            <main id="main-singleClient">
                <Sidebar />
                <div className="wrap">
                    <header className="flex gap20 alignCenter justifyStart mb30">
                        <h1>{client.name}</h1>
                        <CustomButton link={`/new-quote/${client._id}`}>Create New Quote</CustomButton>
                    </header>

                    <ul className="clientInfos">
                        <li><label>Email</label> <p>{client.email}</p></li>
                        <li><label>Phone</label> <p>{client.phone}</p></li>
                        <li><label>Address</label> <p>{client.address}</p></li>
                        {client.vat && <li><label>VAT</label> <p>{client.vat}</p></li>}
                        {client.siret && <li><label>SIRET</label> <p>{client.siret}</p></li>}
                    </ul>

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
                </div>
            </main>
        </>
    );
}

export default SingleClient;
