// REACT
import React, { Component }  from 'react';
import {Link} from "react-router-dom";

// COMPONENTS
import CustomButton from "../../components/button/CustomButton.js";

// STYLES
import "./NotFound.scss"


function NotFound() {
    return (
      <>
      <main id="mainNotFound" className="globalPagePadding">
        <div className="wrap wrap-m tac">
          <h1>
            <span className="clip-text db fsize-xl">404</span>
            Not Found
          </h1>
          <p className="mb30">Nothing out there 🤔</p>
          <div><CustomButton size="medium" featured link="/">Back Home</CustomButton></div>
        </div>
      </main>
      </>
    );
}

export default NotFound;
