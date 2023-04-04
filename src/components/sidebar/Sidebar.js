import { useState, useEffect } from "react";
import {Link, useLocation} from "react-router-dom"

import "./Sidebar.scss";

const Sidebar = () => {

    const location = useLocation();
    const pathname = location.pathname.split('/')[1];
    
    return (
        <nav id="main-sidebar">
            <ul>
                <li><Link to="/"><img src="/zogma-logo.png" alt="Logo Zogma" /></Link></li>
                <li className={pathname === "clients" ? "active" : ""}><Link to="/clients"><i className="fas fa-users"></i> Clients</Link></li>
                <li className={pathname === "quotations" ? "active" : ""}><Link to="/quotations"><i className="fas fa-file-alt"></i> Quotes</Link></li>
                <li className={pathname === "invoices" ? "active" : ""}><Link to="/invoices"><i className="fas fa-receipt"></i> Invoices</Link></li>
            </ul>
        </nav>
    )
};

export default Sidebar;