import React from 'react';
import ProductItem from './ProductItem';
import TextInput from './TextInput';
import {getProducts} from '../repository';
import {Link} from 'react-router-dom';

export default class ProductList extends React.Component {
    _isMounted = false; // Class field that keeps track of whether this component is mounted or not

    constructor(props) {
        super(props);
        this.state = {
            initialProducts: [], // Full products list
            products: [] // Filtered products list (after search)
        };
    }

    componentWillMount() {
        this._isMounted = true;
        getProducts().then((products) => {
            // Preventing a state update when the component is unmounted (when redirecting to /login for example)
            if (products && this._isMounted) {
                // Initializing both states as the full products list received using a GET request
                this.setState({initialProducts: products});
                this.setState({products: products});
            }
        });

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Filtering the list when using the search
    filterList = (event) => {
        let updatedList = this.state.initialProducts;
        updatedList = updatedList.filter((product) => {
            return product.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });
        this.setState({products: updatedList});
    };

    render() {
        const products = this.state.products;
        return (
            <div className="container">
                <h3>Our Products</h3>
                <form>
                    <TextInput placeholder="Search" onChange={this.filterList}/>
                </form>
                <div className="row equal">
                    {
                        products.map((product, index) => <ProductItem product={product} key={index}/>)
                    }
                </div>
                <Link to="/checkout">
                    <button className="btn btn-success float-right">Checkout</button>
                </Link>
                <Link to="/cart">
                    <button className="btn btn-primary float-right" style={{marginRight: "10px"}}>View Cart</button>
                </Link>
                <br/><br/><br/>
            </div>
        );
    }
}