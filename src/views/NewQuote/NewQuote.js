// REACT
import React, { Component }  from 'react';
import {useRef, useEffect, useState, useContext, useLayoutEffect, useHistory} from 'react';
import {Link, useLocation, useParams} from "react-router-dom"

// Libs
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import axios from 'axios';

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";
import Sidebar from "../../components/sidebar/Sidebar.js";
import Designation from "../../components/Designation/Designation.js";

// STYLES
import "./NewQuote.scss"


function NewQuote() {
  
  //PDF
  const contentArea = useRef(null);
	const handleExportWithFunction = (event) => {
		savePDF(contentArea.current, {
      paperSize: ['28cm', '39.7cm'],
      multipage: true,
      fileName: "ZQ"+new Date(Date.now()).getTime()+".pdf"
    });
	};


  const location = useLocation();
  const slugify = (str) => {
      return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };
  const clientID = location.pathname.split('/')[2];
  const pathname = location.pathname;
  const lastSlashIndex = pathname.lastIndexOf('e');
  const substringAfterLastSlash = lastSlashIndex !== -1 ? pathname.substring(lastSlashIndex + 1) : '';


  const [client, setClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState();

  useEffect(() => {
      axios.get('http://localhost:3001/clients')
      .then(res => {
          //console.log(res.data);
          setClients(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  
  const getClientInfos = (id) => {
    fetch(`http://localhost:3001/clients/${id}`)
      .then(response => response.json())
      .then(data => setClient(data))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    //console.log(substringAfterLastSlash !== '');
    if (substringAfterLastSlash !== '') {
      getClientInfos(clientID)
    }
    if(selectedClient) {
      getClientInfos(selectedClient);
    }

  }, [selectedClient, clientID]);

  // if (!client) {
  //   return <div>Loading...</div>;
  // }
  const [isOpenClientsModal, setIsOpenClientsModal] = useState(false);
  const toggleModalClients = () => {
    setIsOpenClientsModal(!isOpenClientsModal);
  }

  const handleSelectClient = (id) => {
    console.log(id);
    setSelectedClient(id);
    toggleModalClients();
  }



  const[designations, setDesignations] = useState([]);

  const handleAddDesignation = () => {
    const newId = designations.length + 1;
    setDesignations([
      ...designations,
      {
        id: newId,
        name: "",
        description: "",
        quantity: "",
        price: "",
        discount: "",
        total:"",
      },
    ]);
  };


  const getHandleInputChange = (designationId) => {
    return (e, fieldName) => {
      const updatedDesignations = designations.map((designation) => {
        if (designation.id === designationId) {
          const updatedDesignation = {
            ...designation,
            [fieldName]: fieldName === "quantity" || fieldName === "price" || fieldName === "discount" ? parseFloat(e.target.value) : e.target.value,
          };
          const discount = updatedDesignation.discount !== 0 ? updatedDesignation.discount : 0;
          const total = updatedDesignation.price * updatedDesignation.quantity * (1 - discount / 100);
          return {
            ...updatedDesignation,
            total: total,
          };
        }
        return designation;
      });
      setDesignations(updatedDesignations);
    };
  };

  const handleDelete = (id) => {
    setDesignations(designations.filter((item) => item.id !== id)); 
  };

  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().slice(0, 10));
  const handleDateChange = (event) => {
    setQuoteDate(event.target.value);
  };

  
  const[quoteSubject, setQuoteSubject] = useState("Quotation");
  const handleSubjectChange = (event) => {
    setQuoteSubject(event.target.value);
    console.log(event.target.value);
  };




  
const handleNewQuotation = (e) => {
  e.preventDefault();
  const items = designations.map(({ name, description, quantity, price, discount }) => ({
    name: name,
    description: description,
    quantity: Number(quantity),
    price: Number(price),
    discount: Number(discount),
  }));
  const data = {
    client: client ? client._id : selectedClient,
    designations: items,
    subject: quoteSubject,
  };
  console.log(data); // Check the value of subject here
  fetch(`http://localhost:3001/quotations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};



  return (
    <>
    {
      isOpenClientsModal &&
      <div className="modalWrap" id="modalClients">
        <div className="overlay" onClick={toggleModalClients}></div>
        <div className="modal">
          <ul>
            {clients.map(client => (
              <li className="cup" key={client._id} onClick={() => handleSelectClient(client._id)}><span>{client.name}</span></li>
            ))}
          </ul>
        </div>
      </div>
    }
    <main id="main-NewQuote">
      <Sidebar />
      <div className="wrap">

        <div className="quoteWrap">
          
          <div className="quoteActions">
            <header className="flex alignCenter gap30 mb50">
              <h1>New Quote</h1>
            </header>

            <div className="flex alignStart gap30">
              <div className="dib vam mr20 inputWrap mb20">
                <label className="db mb10">Client Name</label>
                <div className="inputContainer">
                  <input type="text" value={client ? client.name : "Select Client"} readOnly/>
                  <button onClick={toggleModalClients} id="button-select-client"><i className="fas fa-user"></i></button>
                </div>
              </div>

              <div className="dib vam inputWrap">
                <label className="db mb10">Date</label>
                <input type="date" value={quoteDate} placeholder={quoteDate} onChange={handleDateChange}/>
              </div>
            </div>
            
            <div className="inputWrap db mb30">
              <label htmlFor="quoteSubject" className="db mb10">Subject</label>
              <input name="quoteSubject" className="largeInput" placeholder="Quotation Subject..." type="text" value={quoteSubject} onChange={handleSubjectChange}/>
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
                  />
                ))}
              </ul>
            }
            {
              designations.length < 9 &&
              <CustomButton onClick={handleAddDesignation} size="large">Add Designation</CustomButton>
            }
            
          </div>

          <div className="quoteContainer">
            <div className="quoteA4" ref={contentArea}>
            <PDFExport>
              <img id="zog-z" src="http://localhost:3000/zog-z.jpg" alt="" />
              <div className="quoteContent">
                <header>
                  <img className="zogmatext" src="zogma-text.png" alt="" />
                  <div className="tar flex gap30">
                    <div>
                      <p className="labelSize"><strong>Quotation</strong></p>
                      <p>{"ZQ"+new Date(Date.now()).getTime()}</p>
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
                          <td><strong>{designation.name}</strong><p>{designation.description}</p></td>
                          <td className="tar">{designation.quantity}</td>
                          <td className="tar">{designation.price}</td>
                          <td className="tar">{designation.discount === 100 ? "FREE" : designation.discount === 0 ? "" : designation.discount + "%"}</td>
                          <td className="tar">{designation.total}</td>
                        </tr>
                      ))}
                    </tbody>
                </table>

                <div className="lastSection">
                  <div className="left">
                      <h4>Condition of payment</h4>
                      <p>50% ON RECEIPT OF INVOICE : {Math.round(designations.reduce((acc, curr) => acc + (curr.price * curr.quantity * (1 - (curr.discount / 100))), 0)) / 2} EUR</p>
                      <p>50% ON DELIVERY : {(designations.reduce((acc, curr) => acc + (curr.price * curr.quantity * (1 - (curr.discount / 100))), 0)) / 2} EUR</p>
                  </div>
                  <div className="right">
                      <h4>Payment</h4>
                      <p>Total HT : {Math.round(designations.reduce((acc, curr) => acc + (curr.price * curr.quantity * (1 - (curr.discount / 100))), 0))} EUR</p>
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
            <CustomButton onClick={handleNewQuotation} size="small" color="borderwhite"><span className="mr10">Save Quote</span><i className="fas fa-save"></i></CustomButton>
            <CustomButton onClick={handleExportWithFunction} size="small" color="borderwhite"><span className="mr10">Download PDF</span><i className="fas fa-file-download"></i></CustomButton>
          </div>
        </footer>

        
      </div>
    </main>
    </>
  );
}

export default NewQuote;
