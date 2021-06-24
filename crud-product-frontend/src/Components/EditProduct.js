import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert'

class EditProduct extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            price: '',
            quantity: '',
            showAlert: false,
            alertClass: "",
            alertMessage: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }

    componentDidMount() {
        this.getProduct();
    }

    getProduct() {
        let productId = this.props.match.params.id;
        axios.get(`http://ec2-3-94-20-132.compute-1.amazonaws.com/api/product/${productId}`)
            .then(response => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    price: response.data.price,
                    quantity: response.data.quantity,
                }, () => {
                    console.log(this.state)
                })
            })
            .catch(err => alert("Something went wront when trying to get data from the api."))
    }

    editProduct(product) {

        this.setState({
            showAlert: false
        });

        axios.request({
            method: "put",
            url: `http://ec2-3-94-20-132.compute-1.amazonaws.com/api/product/${product.id}`,
            data: product
        }).then(response => {
            this.setState({
                showAlert: true,
                alertClass: "success",
                alertMessage: ["Product edited successfully"]
            })
        })
            .catch(error => {
                const errors = error.response.data.errors
                let errorMessages = []
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
            });
    }

    onSubmit(e) {
        const product = {
            id: this.state.id,
            name: this.refs.name.value,
            price: this.refs.price.value,
            quantity: this.refs.quantity.value
        }
        this.editProduct(product);
        e.preventDefault();
    }

    render() {
        return (
            <div className="container">
                <Link style={{ margin: "20px 0" }} className="btn btn-secondary" to="/">Back</Link>
                <h1 >Edit Product</h1>
                <div className="row">
                    <form className="col-8 col-sm-6" onSubmit={this.onSubmit.bind(this)}>
                        <div className="mb-3">
                            <label htmlFor="productName">Product Name</label>
                            <input type="text" ref="name" value={this.state.name} onChange={this.handleInputChange} className="form-control" name="name" id="productName" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productPrice">Product Price</label>
                            <input type="number" value={this.state.price} onChange={this.handleInputChange} ref="price" step="0.01" name="price" className="form-control" id="productPrice" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productQuantity">Product Quantity</label>
                            <input type="number" ref="quantity" value={this.state.quantity} onChange={this.handleInputChange} name="quantity" className="form-control" id="productQuantity" />
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

export default EditProduct;
