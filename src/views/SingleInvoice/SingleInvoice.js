// REACT
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from "react-router-dom";

// Libs
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import axios from 'axios';

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";
import Sidebar from "../../components/sidebar/Sidebar.js";
import Designation from "../../components/Designation/Designation.js";

// STYLES
import "./SingleInvoice.scss";


function SingleInvoices() {

  //PDF
    const contentArea = useRef(null);

    const handleExportWithFunction = (event) => {
        savePDF(contentArea.current, {
            fileName: "ZI" + new Date(Date.now()).getTime() + ".pdf"
        });
    };
    
    const location = useLocation();

    const invoiceID = location.pathname.split('/')[2];

    const [quotation, setQuotation] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const [designations, setDesignations] = useState([]);
    const [client, setClient] = useState(null);



    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().substr(0, 10));

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setInvoiceDate(newDate);
      
        axios
          .patch(`http://localhost:3001/invoices/${invoiceID}/date`, {
            date: newDate,
          })
          .then((response) => {
            if (response.status === 200) {
              alert("Invoice date updated successfully.");
            } else {
              alert("Failed to update the invoice date. Please try again.");
            }
          })
          .catch((error) => {
            console.error(error);
            alert("Failed to update the invoice date. Please try again.");
          });
      };


    const [invoiceStatus, setInvoiceStatus] = useState('draft');
    const isSigned = invoiceStatus == "signed";
  
    const handleStatusChange = (event) => {
        const selectedStatus = event.target.value;
        setInvoiceStatus(selectedStatus);
      
        axios
            .patch(`http://localhost:3001/invoices/${invoiceID}/status`, {
                status: selectedStatus,
            })
            .then((response) => {
                if (response.status === 200) {
                alert("Invoice status updated successfully.");
                } else {
                alert("Failed to update the invoice status. Please try again.");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to update the invoice status. Please try again.");
            });
      };

    useEffect(() => {
      fetch(`http://localhost:3001/invoices/${invoiceID}`)
        .then(response => response.json())
        .then(data => {
            setInvoice(data)
            setClient(data.client);
            setDesignations(data.quotations[0].designations);
            setQuotation(data.quotations[0]);
            setInvoiceDate((new Date(data.createdAt)).toISOString().slice(0,10));
            setInvoiceStatus(data.status);
            console.log(data);
        })
        .catch(error => console.error(error));
    }, [invoiceID]);



    if (!invoice) {
      return <div>Loading...</div>;
    }

    return (
        <>
            <main id="main-singleInvoice">
                <Sidebar />
                <div className="wrap">
                    <div className="invoiceContainer">
                        <div className="invoiceA4" ref={contentArea}>
                        <PDFExport>
                            <img id="zog-z" src="http://localhost:3000/zog-z.jpg" alt="" />
                            <div className="invoiceContent">
                            <header>
                                <img className="zogmatext" src="http://localhost:3000/zogma-text.png" alt="" />
                                <div className="tar flex gap30">
                                <div>
                                    <p className="labelSize"><strong>Invoice</strong></p>
                                    <p>{invoice._id}</p>
                                </div>
                                <div>
                                    <p className="labelSize"><strong>Date</strong></p>
                                    <p>{new Date(invoiceDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="labelSize"><strong>Delivery</strong></p>
                                    <p>{new Date(invoiceDate).toLocaleDateString()}</p>
                                </div>
                                </div>
                            </header>
                
                            <div className="firstSection">
                                <div className="left">
                                <h4 className="flex alignCenter spaceBetween">Subject <span className="labelSize">Step : {invoice.step}/{invoice.nbinvoices}</span></h4>
                                <p>{quotation.subject ? quotation.subject : "No Subject Defined"}</p>
                                </div>
                                <div className="right">
                                    <h4>Client</h4>
                                    <p>{client ? client.name : 'No Client Selected'}</p>
                                    {client && <p>SIRET : {client.siret}</p>}
                                    {client && <p>{client.address}</p>}
                                    {client && <p>INT VAT : {client.vat}</p>}
                                </div>
                            </div>
                            <table className="table table-invoices mb30">
                            <thead>
                            <tr>
                                <th>Designation</th>
                            </tr>
                            </thead>
                            <tbody>
                                {designations.map((designation) => (
                                <tr key={designation._id}>
                                    <td>{designation.name}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                
                        <div className="lastSection">
                            <div className="left">
                                <h4>Condition of payment</h4>
                                <p>Upon receipt of invoice</p>
                            </div>
                            <div className="right">
                                <h4>Payment</h4>
                                <p>Total HT : {invoice.total} EUR</p>
                                <p>VAT Rate : N/A</p>
                                <p>VAT Amount : N/A</p>
                                <p><strong>Total Price : {invoice.total} EUR</strong></p>
                                <p className="vat-due">VAT due by the customer - Article 44 Directive 2006/112/EC</p>
                            </div>
                        </div>

                        <div className="invoiceFooter">
                            <div className="left">
                                    <p><strong>ZOGMA</strong> <span>- PL 697-186-53-78</span></p>
                                    <p>NR EWIDEN. 53053117630 REGON: 410373867</p>
                                    <p className="mb10">ul. Szczepanowskiego 11, PL 64-000 KOŚCIAN</p>
                                    <p><strong>BANK SANTANDER : </strong></p>
                                    <p className="iban">PL11 1090 2125 0000 0001 2099 5777 — SWIFT WBK PPL PP</p>
                            </div>
                            <div className="right flex alignStart">
                                <div>
                                    <h4 className="labelSize">Good for agreement</h4>
                                    <p className="mb10">Location :</p>
                                    <p>Date :</p>
                                </div>
                                <div>
                                    <h4 className="labelSize">Client Signature</h4>
                                </div>
                                </div>
                            </div>
                        </div>
                        </PDFExport>
                    </div>
                    </div>
                    <footer>
                        <p>Invoice {invoice._id}</p>
                        <div>
                            <div className="inputWrap mr10">
                                <label className="mr10 color-white">Date</label>
                                <input type="date" value={invoiceDate} placeholder={invoiceDate} onChange={handleDateChange} disabled={isSigned}/>
                            </div>
                            <div className="selectWrap mr10">
                                <label className="mr10 color-white" htmlFor="invoice-status">Status</label>
                                <select
                                    id="invoice-status"
                                    value={invoiceStatus}
                                    onChange={handleStatusChange}
                                >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="partially paid">Partially paid</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <CustomButton onClick={handleExportWithFunction} size="small" color="borderwhite"><span className="mr10">Download PDF</span><i className="fas fa-file-download"></i></CustomButton>
                        </div>
                    </footer>
                </div>
            </main>
        </>
    );
}

export default SingleInvoices;
