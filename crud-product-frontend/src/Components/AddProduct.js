import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert'



class AddProduct extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showAlert: false,
            alertClass: "",
            alertMessage: ''
        }
    }

    addProduct(newProduct) {
        this.setState({
            showAlert: false
        });

        axios.request({
            method: "post",
            url: "http://localhost:8000/api/product",
            data: newProduct
        }).then(response => {
            this.props.history.push('/')
        })
            .catch(error => {
                const errors = error.response.data.errors
                let errorMessages = []
                console.log(errors)
                if (errors.hasOwnProperty("name")) {

                    errorMessages.push(
                        errors.name.map((value, index) => {
                            return value
                        })
                    )
                }

                if (errors.hasOwnProperty("price")) {
                    errorMessages.push(
                        errors.price.map((value, index) => {
                            return value
                        })
                    )
                }

                if (errors.hasOwnProperty("quantity")) {
                    errorMessages.push(
                        errors.quantity.map((value, index) => {
                            return value
                        })
                    )
                }

                this.setState({
                    alertClass: "danger",
                    showAlert: true,
                    alertMessage: errorMessages
                })
            })
    }

    onSubmit(e) {

        const newProduct = {
            name: this.refs.name.value,
            price: this.refs.price.value,
            quantity: this.refs.quantity.value
        }

        this.addProduct(newProduct);
        e.preventDefault();
    }

    render() {
        return (
            <div className="container">
                <Link style={{ margin: "20px 0" }} className="btn btn-secondary" to="/">Back</Link>
                <h1 >New Product</h1>
                <div className="row">
                    <form className="col-8 col-sm-6" onSubmit={this.onSubmit.bind(this)}>
                        <div className="mb-3">
                            <label htmlFor="productName">Product Name</label>
                            <input type="text" ref="name" className="form-control" id="productName" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productPrice">Product Price</label>
                            <input type="number" ref="price" step="0.01" className="form-control" id="productPrice" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productQuantity">Product Quantity</label>
                            <input type="number" ref="quantity" className="form-control" id="productQuantity" />
                        </div>
                        {this.state.showAlert ?
                            <div style={{ margin: "5px" }}>
                                <Alert variant={this.state.alertClass}>
                                    <ul>
                                        {this.state.alertMessage.map((value, index) => {
                                            return (
                                                <li>{value}</li>
                                            )
                                        })}
                                    </ul>
                                </Alert>
                            </div>

                            : null}
                        <button className="btn btn-success btn-lg">Save</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddProduct;
