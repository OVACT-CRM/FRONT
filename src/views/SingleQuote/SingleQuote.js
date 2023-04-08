// REACT
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

// Libs
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import axios from 'axios';

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";
import Sidebar from "../../components/sidebar/Sidebar.js";
import Designation from "../../components/Designation/Designation.js";

// STYLES
import "./SingleQuote.scss";

function SingleQuote() {
  const navigate = useNavigate();
  //PDF
  const contentArea = useRef(null);
  const handleExportWithFunction = (event) => {
    savePDF(contentArea.current, {
      fileName: "ZQ" + new Date(Date.now()).getTime() + ".pdf"
    });
  };

  const location = useLocation();
  const quoteID = location.pathname.split('/')[2];

  const [quote, setQuote] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [client, setClient] = useState(null);

  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().substr(0, 10));
  const [quoteSubject, setQuoteSubject] = useState('');


  const handleDateChange = (e) => {
    setQuoteDate(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setQuoteSubject(e.target.value);
  };

  const getHandleInputChange = (designationId) => {
    return (e, fieldName) => {
      const updatedDesignations = designations.map((designation) => {
        if (designation.id === designationId) {
          return {
            ...designation,
            [fieldName]: fieldName === "quantity" || fieldName === "price" || fieldName === "discount" ? parseFloat(e.target.value) : e.target.value,
          };
        }
        return designation;
      });
      setDesignations(updatedDesignations);
      calculateSubtotal(updatedDesignations); // Add this line
    };
  };

  const handleDelete = (designationId) => {
    setDesignations(designations.filter((designation) => designation.id !== designationId));
  };

  const handleAddDesignation = () => {
    const newId = designations.length + 1;
    setDesignations([
      ...designations,
      {
        id: newId,
        name: "", // Add this line
        quantity: "",
        price: "",
        discount: "",
        total: "",
      },
    ]);
  };


  const [quotationStatus, setQuotationStatus] = useState('draft');
  const isSigned = quotationStatus == "signed";

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setQuotationStatus(selectedStatus);
    
    axios
        .patch(`http://localhost:3001/quotations/${quoteID}`, {
          status: selectedStatus,
        })
        .then((response) => {
        if (response.status === 200) {
            alert("Quotation status updated successfully.");
        } else {
            alert("Failed to update the quotation status. Please try again.");
        }
        })
        .catch((error) => {
        console.error(error);
        alert("Failed to update the quotation status. Please try again.");
        });
  };

  const handleUpdateQuotation = () => {
    axios
        .patch(`http://localhost:3001/quotations/${quoteID}`, {
          subject: quoteSubject,
          date: quoteDate,
          designations: designations,
          status: quotationStatus,
        })
        .then((response) => {
        if (response.status === 200) {
            alert("Quotation updated successfully.");
        } else {
            alert("Failed to update the quotation. Please try again.");
        }
        })
        .catch((error) => {
        console.error(error);
        alert("Failed to update the quotation. Please try again.");
        });
  };


    useEffect(() => {
      console.log("Fetching quote with ID", quoteID);
      fetch(`http://localhost:3001/quotations/${quoteID}`)
        .then(response => response.json())
        .then(data => {
          console.log("Received data", data);
          setQuote(data);
    
          // Add a new ID field to the existing designations based on the index
          const updatedDesignations = data.designations.map((designation, index) => ({
            ...designation,
            id: index + 1,
          }));
    
          setDesignations(updatedDesignations);
    
          // Update quoteSubject with the fetched data
          setQuoteDate(new Date(data.createdAt).toISOString().slice(0, 10));
          if (data.subject) {
            setQuoteSubject(data.subject);
          }
          if (data.status) {
            setQuotationStatus(data.status);
          }
        })
        .catch(error => console.error(error));
    }, [quoteID]);

  const clientID = quote && quote.client._id;

  const getClientInfos = (id) => {
    fetch(`http://localhost:3001/clients/${id}`)
      .then(response => response.json())
      .then(data => setClient(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    if (clientID) {
      getClientInfos(clientID);
    }
  }, [clientID]);


  const calculateSubtotal = (updatedDesignations) => {
    const newDesignations = updatedDesignations.map((designation) => {
      return {
        ...designation,
        total: designation.price * designation.quantity * (1 - designation.discount / 100),
      };
    });
    setDesignations(newDesignations);
  };
  

  const[invoiceNumber, setInvoiceNumber] = useState(1);

  const handleCreateInvoices = () => {
    const numberOfInvoices = parseInt(invoiceNumber);
  
    if (numberOfInvoices <= 0) {
      alert("Please enter a valid number of invoice installments.");
      return;
    }
  
    const totalHT = designations.reduce((acc, curr) => acc + (curr.price * curr.quantity * (1 - (curr.discount / 100))), 0);

    const installmentAmount = totalHT / numberOfInvoices;
    console.log('installmentAmount', installmentAmount);
  
    for (let i = 0; i < numberOfInvoices; i++) {
      axios
        .post("http://localhost:3001/invoices", {
          client: { _id: clientID },
          quotations: { _id: quoteID },
          total: installmentAmount,
          status: "pending",
          step: Number(i + 1),
          nbinvoices: Number(numberOfInvoices)
        })
        .then((response) => {
          if (response.status === 201) {
            if (i === numberOfInvoices - 1) {
              alert("Invoices created successfully.");
            }
          } else {
            alert("Failed to create invoices. Please try again.");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to create invoices. Please try again.");
        });
    }
  };


  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

  const toggleModalDelete = () => {
    setModalDeleteOpen(!modalDeleteOpen);
  }
  const handleDeleteQuotation = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this quotation?");
    if (!confirmDelete) {
      return;
    }
  
    axios
      .delete(`http://localhost:3001/quotations/${quoteID}`)
      .then((response) => {
        if (response.status === 200) {
          alert("Quotation deleted successfully.");
          // Redirect to the quotations page
          navigate("/quotations");
        } else {
          alert("Failed to delete the quotation. Please try again.");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to delete the quotation. Please try again.");
      });
  };

  if (!quote) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {
        modalDeleteOpen &&
        <div className="modalWrap confirmModal">
          <div className="overlay" onClick={toggleModalDelete}></div>
          <div className="modal tac">
            <p className="mb20">Are you sure to delete this quotation ?</p>
            <CustomButton onClick={() => handleDeleteQuotation(quoteID)} size="medium" color="red"><span className="mr10">Delete Quotation</span><i className="fas fa-trash-alt"></i></CustomButton>
          </div>
        </div>
      }
      <main id="main-NewQuote">
        <Sidebar />
        <div className="wrap">
    
          <div className="quoteWrap">
            
            <div className="quoteActions">
              <header className="flex alignCenter gap30 mb50">
                <h1>Update Quote</h1>
                <div className="selectWrap">
                  <label className="mr10" htmlFor="quotation-status">Status</label>
                  <select
                    id="quotation-status"
                    value={quotationStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="signed">Signed</option>
                  </select>
                </div>
              </header>
    
              <div className="flex alignStart gap30">
                <div className="dib vam mr20 inputWrap mb20">
                  <label className="db mb10">Client Name</label>
                  <div className="inputContainer">
                    <input type="text" value={client ? client.name : "Missing Client"} readOnly/>
                  </div>
                </div>
    
                <div className="dib vam inputWrap">
                  <label className="db mb10">Date</label>
                  <input type="date" value={quoteDate} placeholder={quoteDate} onChange={handleDateChange} disabled={isSigned}/>
                </div>
              </div>
              
              <div className="inputWrap db mb30">
                <label htmlFor="quoteSubject" className="db mb10">Subject</label>
                <input disabled={isSigned} name="quoteSubject" className="largeInput" placeholder="Quotation Subject..." type="text" value={quoteSubject} onChange={handleSubjectChange}/>
              </div>
              {
                designations &&
                <ul className="mb30">
                    {designations.map((designation) => (
                    <Designation
                        key={designation.id}
                        handleInputChange={getHandleInputChange(designation.id)}
                        handleDelete={handleDelete}
                        {...designation}
                        name={designation.name}
                        quantity={designation.quantity}
                        price={designation.price}
                        discount={designation.discount}
                        isSigned={isSigned}
                    />
                    ))}
                </ul>
              }
              {
                designations.length < 9 && !isSigned &&
                <CustomButton onClick={handleAddDesignation} size="large">Add Designation</CustomButton>
              }
              {
                isSigned &&
                <>
                  <div className="inputContainer mr10">
                    <label htmlFor="inputInvoice" className="db mb10">Number of invoice installments</label>
                    <input
                      type="number"
                      name="inputInvoice"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <CustomButton onClick={handleCreateInvoices} size="medium">Create Invoices</CustomButton>
                </>
              }
              
            </div>
    
            <div className="quoteContainer">
              <div className="quoteA4" ref={contentArea}>
              <PDFExport>
                <img id="zog-z" src="http://localhost:3000/zog-z.jpg" alt="" />
                <div className="quoteContent">
                  <header>
                    <img className="zogmatext" src="http://localhost:3000/zogma-text.png" alt="" />
                    <div className="tar flex gap30">
                      <div>
                        <p className="labelSize"><strong>Quotation</strong></p>
                        <p>n*{"ZQ"+new Date(Date.now()).getTime()}</p>
                      </div>
                      <div>
                        <p className="labelSize"><strong>Date</strong></p>
                        <p>{new Date(quoteDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </header>
    
                  <div className="firstSection">
                    <div className="left">
                      <h4>Subject</h4>
                      <p>{quoteSubject ? quoteSubject : "No Subject Defined"}</p>
                    </div>
                    <div className="right">
                        <h4>Client</h4>
                        <p>{client ? client.name : 'No Client Selected'}</p>
                        {client && <p>SIRET : {client.siret}</p>}
                        {client && <p>{client.address}</p>}
                        {client && <p>INT VAT : {client.vat}</p>}
                    </div>
                </div>
                <table className="table table-quotes mb30">
                  <thead>
                  <tr>
                    <th>Designation</th>
                    <th className="tar">Qty</th>
                    <th className="tar">Price</th>
                    <th className="tar">Reduce</th>
                    <th className="tar">Total HT</th>
                  </tr>
                  </thead>
                  <tbody>
                    {designations.map((designation) => (
                      <tr key={designation.id}>
                        <td>{designation.name}</td>
                        <td className="tar">{designation.quantity}</td>
                        <td className="tar">{designation.price}</td>
                        <td className="tar">{designation.discount === 100 ? "FREE" : designation.discount === 0 ? "" : designation.discount + "%"}</td>
                        <td className="tar">{designation.price * designation.quantity * (1 - designation.discount / 100)}</td>
                      </tr>
                    ))}
                  </tbody>
              </table>
    
            <div className="lastSection">
                <div className="left">
                    <h4>Condition of payment</h4>
                    <p>50% ON RECEIPT OF INVOICE : {(designations.reduce((acc, curr) => acc + (curr.price * curr.quantity * (1 - (curr.discount / 100))), 0) / 2)} EUR</p>
                    <p>50% ON DELIVERY : {(designations.reduce((acc, curr) => acc + (curr.price * curr.quantity * (1 - (curr.discount / 100))), 0) / 2)} EUR</p>
                </div>
                <div className="right">
                    <h4>Payment</h4>
                    <p>Total HT : {designations.reduce((acc, curr) => acc + (curr.price * curr.quantity * (1 - (curr.discount / 100))), 0)} EUR</p>
                    <p>VAT Rate : 23%</p>
                    <p><strong>Total TTC : {Math.round(designations.reduce((acc, curr) => acc + (curr.price * curr.quantity * (1 - (curr.discount / 100))), 0) * 1.23)} EUR</strong></p>
                </div>
            </div>

              <div className="quoteFooter">
                <div className="left">
                  <h4>ZOGMA <span className="labelSize">- Creative Studio</span></h4>
                  <p>www.zog.ma</p>
                </div>
                <div className="right  flex alignStart">
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
    
      </div>
    
        <footer>
            <p>Quotation n*{"ZQ"+new Date(Date.now()).getTime()}</p>
            <div>
              <CustomButton onClick={handleUpdateQuotation} disabled={isSigned} size="small" color="borderwhite"><span className="mr10">Update Quote</span><i className="fas fa-save"></i></CustomButton>
              <CustomButton onClick={handleExportWithFunction} size="small" color="borderwhite"><span className="mr10">Download PDF</span><i className="fas fa-file-download"></i></CustomButton>
              <CustomButton onClick={toggleModalDelete} size="small" color="borderwhite"><span className="mr10">Delete Quotation</span><i className="fas fa-trash-alt"></i></CustomButton>
           </div>
        </footer>
    
        </div>
        </main>
        </>
      );
    }
    
    export default SingleQuote;