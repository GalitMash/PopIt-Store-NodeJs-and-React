import React from 'react';
import { getCartProducts, getUsername, activityLogger } from '../repository';
import { Link } from 'react-router-dom';

export default class Checkout extends React.Component {
	_isMounted = false; // Class field that keeps track of whether this component is mounted or not
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			total: 0
		}
	}

	componentWillMount() {
		this._isMounted = true;
		let cart = localStorage.getItem(`cart-${getUsername()}`);
		if (!cart) return; 
		getCartProducts(cart).then((products) => {
			// Preventing a state update when the component is unmounted (when redirecting to /login for example)
			if (products && this._isMounted) {
				// Calculating the total price to pay
				let total = 0;
				for (let i = 0; i < products.length; i++) {
					total += products[i].price * products[i].qty;
				}
				this.setState({products, total});
			}
	    });
	}

	// The user "pays" and we clear the cart.
	handlePay = () => {
		localStorage.removeItem(`cart-${getUsername()}`);
		this.setState({
			products: [],
			total: 0
		});
		alert('Thank you! Your order will be shipped in 1 business day.');
		activityLogger('Provided payment for cart');
	};

	render() {
		const { products, total } =  this.state;
		return (
			<div className=" container">
				<h3 className="card-title">Checkout</h3>
				<hr/>
				{
					products.map((product, index) =>
						<div key={index}>
							<p>
								{product.name}
								<small> (quantity: {product.qty})</small>
								<span className="float-right text-primary">${product.qty * product.price}</span>
							</p><hr/>
						</div>
					)
				}
				{ !products.length ? <h3 className="text-warning">No items in the cart</h3>: ''}
				<hr/>
				{ products.length ? <div><h4><small>Total Amount:</small><span className="float-right text-primary">${total}</span></h4><hr/></div>: ''}
				{ products.length ? <Link to="/"><button className="btn btn-success float-right" onClick={this.handlePay}>Pay</button></Link>: '' }
				<Link to="/"><button className="btn btn-danger float-right" style={{ marginRight: "10px" }}>Cancel</button></Link>
				<br/><br/><br/>
			</div>
		);
	}
}

