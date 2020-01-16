import React from 'react';
import {getUsername, activityLogger} from "../repository";

export default class ProductItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			quantity: 1
		}
	}

	handleInputChange = (event) => {
		const amountInStock = this.props.product.available_quantity;
		if (event.target.value > amountInStock) {
			alert(`Sorry, there are only ${amountInStock} of this pop left!`)
		} else {
			this.setState({quantity: event.target.value})
		}
	};

	restoreInputValue = (event) => {
		// If a user deletes the amount, it restores to 1 when focusing out of the number input
		if (!event.target.value) {
			this.setState({quantity: 1})
		}
	};

	// Adding the item to the cart in the local storage
	addToCart = () => {
		const username = getUsername();
		let cart = localStorage.getItem(`cart-${username}`) ? JSON.parse(localStorage.getItem(`cart-${username}`)) : {};
		let id = this.props.product.id.toString();
		cart[id] = (cart[id] ? cart[id]: 0);
		let qty = cart[id] + parseInt(this.state.quantity);
		if (this.props.product.available_quantity < qty) {
			cart[id] = this.props.product.available_quantity; 
		} else {
			cart[id] = qty;
		}
		localStorage.setItem(`cart-${username}`, JSON.stringify(cart));
		if (window.confirm("Item added to cart! Do you want to view your cart?")){
			window.location = '/cart';
		}
		activityLogger('Added item ' + id + ' to cart');
	};

	render(){
		const { product } = this.props;
		return (
			<div className="col-sm-4 d-flex pb-3">
		    <div className="card card-block" style={{display: "flex", flex: "1 1 auto",  "flexDirection": "column", "justifyContent": "space-between"}}>
				<img src={process.env.PUBLIC_URL + `/images/${product.id}.jpg`} className="card-img-top" alt={`${product.name}`}/>
			  <div className="card-body">
			    <h4 className="card-title">{product.name}</h4>
			    <p className="card-text">{product.description}</p>
			  </div>
				  <div className="card-footer">
			    <h5 className="card-text"><small>price: </small>${product.price}</h5>
			    {product.available_quantity > 0 ?
			    	<div>
			    		<button className="btn btn-sm btn-warning float-right" onClick={this.addToCart}>Add to cart</button>
			    		<input type="number" value={this.state.quantity} name="quantity" onChange={this.handleInputChange} onBlur={this.restoreInputValue} className="float-left" min="1" max={product.available_quantity} style={{ width: "60px", borderRadius: "3px"}}/>
			    	</div>
					: <div>
						<div className="text-danger" style={{"fontSize": "20px"}}>Product is out of stock</div>
					</div>
			 	}
				  </div>

			</div>
			</div>
		)
	}
}
