import React from "react";
import "./SingleDesignation.scss";

function SingleDesignation({ id, title, quantity, price, discount, total }) {
  return (
    <li className="singleDesignation">
      <div className="inputContainer">
        <label htmlFor={`designation-${id}`}>Designation</label>
        <input
          name={`designation-${id}`}
          type="text"
          value={title}
          readOnly
        />
      </div>
      <div className="inputContainer">
        <label htmlFor={`quantity-${id}`}>Quantity</label>
        <input
          name={`quantity-${id}`}
          type="number"
          value={quantity}
        />
      </div>
      <div className="inputContainer">
        <label htmlFor={`price-${id}`}>Price</label>
        <input
          name={`price-${id}`}
          type="number"
          value={price}
        />
      </div>
      <div className="inputContainer">
        <label htmlFor={`discount-${id}`}>Discount</label>
        <input
          name={`discount-${id}`}
          type="number"
          value={discount}
        />
      </div>
      <div className="inputContainer">
        <label htmlFor={`total-${id}`}>Total</label>
        <input
          name={`total-${id}`}
          type="number"
          value={total}
          readOnly
        />
      </div>
    </li>
  );
}

export default SingleDesignation;