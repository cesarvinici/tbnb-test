import React from "react";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination'
import { withRouter } from "react-router";

function deletePoduct(event, id) {
    if (window.confirm("Are you sure?")) {
        let url = `http://ec2-3-94-20-132.compute-1.amazonaws.com/api/product/${id}`;
        console.log(url)
        axios.delete(url)
            .then(() => {
                window.location.reload();

            })
            .catch((err) => {
                console.log(err)
            })
    }
}

function ListProducts(props) {

    let page = props.match.params.page;

    let url = "http://ec2-3-94-20-132.compute-1.amazonaws.com/api/product";
    if (page) {
        url = `${url}?page=${page}`;
    }

    console.log(url);


    const [products, setProducts] = useState({
        loading: false,
        data: null,
        response: null,
        pagination: null,
        error: false
    });

    useEffect(() => {
        setProducts({
            loading: true,
            data: null,
            response: null,
            error: false
        })
        axios.get(url)
            .then(response => {
                let items = [];
                const links = response.data.links;

                links.map((link, key) => {
                    const lastItem = links.length != key + 1;
                    if (link.url != null && lastItem && link.label !== "&laquo; Previous") {
                        items.push(

                            <Pagination.Item key={link.label} href={"/page/" + link.label} active={link.active}>
                                {link.label}
                            </Pagination.Item>
                        );
                    }
                })


                console.log(response)
                setProducts({
                    loading: false,
                    data: response.data.data,
                    response: response.data,
                    pagination: items,
                    error: false
                })
            })
            .catch(() => {
                setProducts({
                    loading: false,
                    data: null,
                    response: null,
                    error: true
                })
            })
    }, [url]);

    let content = null;

    if (products.error) {
        content = <p>
            There was an error. Please refresh or try again later.
    </p>
    }

    if (products.data) {

        content =
            products.data.map((product, key) =>
                <tr key={key}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>
                        <Link className="btn btn-success m-1" to={"/product/" + product.id} >View</Link>
                        <Link className="btn btn-primary m-1" to={"/product/edit/" + product.id} >Edit</Link>
                        <button className="btn btn-danger" onClick={(e) => {
                            deletePoduct(e, product.id);
                        }} >Delete</button>
                    </td>
                </tr>
            )
    }

    return (
        <div className="container">
            <Row>
                <Col>
                    <h1 style={{ margin: "20px 0" }}>CRUD Product</h1>
                </Col>
            </Row>
            <Row style={{ margin: "10px" }}>
                <Col>
                    <Link className="btn btn-success btn-lg" to="/product/add">Add New Product</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Pagination>
                        {products.pagination}
                    </Pagination>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(ListProducts);
