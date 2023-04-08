import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import CustomButton from "../../components/button/CustomButton";
import "./Quotations.scss";

function Quotations() {
  const [quotations, setQuotations] = useState([]);


  const handleDuplicateQuotation = async (id) => {
    try {
      const res = await axios.post(`http://localhost:3001/quotations/${id}/duplicate`);
      const newQuotation = res.data;
      // Update the subject of the new quotation with the duplicated subject
      newQuotation.subject = `Duplicated ${newQuotation.subject}`;
      // Add the new quotation to the list of quotations in state
      setQuotations([...quotations, newQuotation]);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const res = await axios.get("http://localhost:3001/quotations");
        const updatedQuotations = await Promise.all(
          res.data.map(async (quote) => {
            const clientRes = await axios.get(`http://localhost:3001/clients/${quote.client}`);
            const clientName = clientRes.data.name;
            return { ...quote, clientName };
          })
        );
        setQuotations(updatedQuotations);
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuotations();
  }, []);

  return (
    <>
      <main id="main-quotations">
        <Sidebar />
        <div className="wrap">
          <header className="flex gap30 alignCenter mb20">
            <h1>Quotations</h1>
            <CustomButton size="medium" link="/new-quote">
              <i className="fas fa-plus"></i> New Quote
            </CustomButton>
          </header>
          {quotations.length ? (
            <table>
              <thead>
                <tr>
                  <th>Quote ID</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th className="subject">Subject</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((quote) => (
                  <tr key={quote._id}>
                    <td><a href={`http://localhost:3000/quotations/${quote._id}`}>{quote._id}</a></td>
                    <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                    <td>{quote.clientName}</td>
                    <td className="subject">{quote.subject}</td>
                    <td>{quote.total}</td>
                    <td className="td-status">{quote.status}</td>
                    <td className="td-duplicate cup" onClick={() => handleDuplicateQuotation(quote._id)}><i className="far fa-clone"></i></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Quotations found in database</p>
          )}
        </div>
      </main>
    </>
  );
}

export default Quotations;