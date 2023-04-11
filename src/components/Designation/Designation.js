import "./Designation.scss";

const Designation = (props) => {
    
  const { id, name, description, quantity, price, discount, handleInputChange, handleDelete, isSigned } = props;

  const total = price * quantity * (1 - discount / 100);
  
  const handleNameChange = (e) => {
    handleInputChange.handleNameChange(e);
  };

  const handleDescriptionChange = (e) => {
    handleInputChange.handleDescriptionChange(e);
  };
  const handleQuantityChange = (e) => {
    handleInputChange.handleQuantityChange(e);
  };
  
  const handlePriceChange = (e) => {
    handleInputChange.handlePriceChange(e);
  };
  
  const handleDiscountChange = (e) => {
    handleInputChange.handleDiscountChange(e);
  };

  const handleDeleteClick = () => {
    handleDelete(id);
  };
  
  return (
    <li className="designation-element" key={id}>
        <div className="inputContainer">
            <label>Name</label>
            <input
                type="text"
                name={`name-${id}`}
                value={name ? name : ""}
                onChange={(e) => handleInputChange(e, "name")}
                placeholder="Designation title"
                disabled={isSigned}
            />
        </div>
        <div className="inputContainer">
            <label>Description</label>
            <input
                type="text"
                name={`description-${id}`}
                value={description ? description : ""}
                onChange={(e) => handleInputChange(e, "description")}
                placeholder="Description"
                disabled={isSigned}
            />
        </div>
        <div className="inputContainer">
            <label>Quantity</label>
            <input
                type="number"
                name={`quantity-${id}`}
                value={isNaN(quantity) ? "" : quantity}
                onChange={(e) => handleInputChange(e, "quantity")}
                placeholder="0"
                min="1"
                disabled={isSigned}
            />
        </div>
        <div className="inputContainer">
            <label>Price</label>
            <input
                type="number"
                name={`price-${id}`}
                value={isNaN(price) ? "" : price}
                onChange={(e) => handleInputChange(e, "price")}
                placeholder="450"
                step="50"
                min="250"
                disabled={isSigned}
            />
        </div>
        <div className="inputContainer">
            <label>Discount</label>
            <input
                type="number"
                name={`discount-${id}`}
                value={isNaN(discount) ? "" : discount}
                onChange={(e) => handleInputChange(e, "discount")}
                placeholder="30"
                min="0"
                disabled={isSigned}
            />
        </div>
        <div className="inputContainer">
            <label>Total</label>
            <input
                type="number"
                name={`total-${id}`}
                value={isNaN(total) ? "" : total}
                readOnly
            />
        </div>
        {
          !isSigned &&
          <button onClick={handleDeleteClick} className="deleteLine"><i className="fas fa-minus"></i></button>
        }
    </li>
  );
};

export default Designation;