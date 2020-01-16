import React from 'react';
import {Link} from 'react-router-dom';
import {getUsername, activityLogger, getCartProducts} from '../repository';
import CartItem from './CartItem';
// Managing a cart using local storage
export default class Cart extends React.Component {
    _isMounted = false; // Class field that keeps track of whether this component is mounted or not
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            total: 0,
            cartIsEmpty: true
        }
    }

    componentWillMount() {
        this._isMounted = true;
        let cart = localStorage.getItem(`cart-${getUsername()}`);
        if (!cart) return;
        getCartProducts(cart).then((products) => {
            // Preventing a state update when the component is unmounted (when redirecting to /login for example)
            if (products && this._isMounted) {
                // Calculating the total price of the cart
                let total = 0;
                for (let i = 0; i < products.length; i++) {
                    total += products[i].price * products[i].qty;
                }
                this.setState({products, total});
                this.setState({cartIsEmpty: false})
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Removing an item from the cart and updating the total price accordingly
    removeFromCart = (product) => {
        let products = this.state.products.filter((item) => item.id !== product.id);
        let cart = JSON.parse(localStorage.getItem(`cart-${getUsername()}`));
        delete cart[product.id.toString()];
        localStorage.setItem(`cart-${getUsername()}`, JSON.stringify(cart));
        let total = this.state.total - (product.qty * product.price);
        this.setState({products, total});
        if (total == 0){
            this.setState({cartIsEmpty: true})
        }
        activityLogger('Removed item ' + product.id.toString() + ' from cart');
    };
    // Removing the cart from local storage
    clearCart = () => {
        localStorage.removeItem(`cart-${getUsername()}`);
        this.setState({products: []});
        activityLogger('Cleared the entire cart');
        this.setState({cartIsEmpty: true})
    };

    render() {
        const {products, total} = this.state;
        return (
            <div className="container">
                <h3 className="card-title">Cart</h3>
                {
                    products.map((product, index) => <CartItem product={product} remove={this.removeFromCart}
                                                               key={index}/>)
                }
                <hr/>
                {products.length ? <div>
                    <h4>
                        <small>Total Amount:</small>
                        <span className="float-right text-primary">${total}</span></h4>
                </div> : ''}

                {!products.length ? <h3 className="text-warning">No items in the cart</h3> : ''}
                <hr/>
                {(!this.state.cartIsEmpty) ?
                    <React.Fragment>
                        <Link to="/checkout">
                            <button className="btn btn-success float-right">Checkout</button>
                        </Link>
                        <button className="btn btn-danger float-right" onClick={this.clearCart}
                                style={{marginRight: "10px"}}>Clear Cart
                        </button>
                        <br/><br/><br/></React.Fragment>
                : ''}
            </div>
        );
    }
}
