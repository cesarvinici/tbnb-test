import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Line} from 'react-chartjs-2';


class ProductDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            price: '',
            quantity: '',
            priceLog: [],
            lineChart: '',
            axes: []
        }
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
                    priceLog: JSON.parse(response.data.price_log)
                }, () => {
                    this.generateGraph()
                })
            })
            .catch(err => console.log(err))
    }

    generateGraph() {
        const dates = this.state.priceLog.map((value, index) => {
            return value.date
        })
        const prices = this.state.priceLog.map((value, index) => {
            return value.price
        })
        const state = {
            labels: dates,
            datasets: [
                {
                    label: "Price",
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: prices

                }
            ]
        }

        this.setState({
              lineChart: (
                <div>
                <Line
                  data={state}
                  options={{
                    title:{
                      display:true,
                      text:'Price changes over time',
                      fontSize:20
                    },
                    legend:{
                      display:true,
                      position:'right'
                    }
                  }}
                />
              </div>
            )

        })

    }

    render() {
        return (
            <div className="container">
                <Link style={{margin:"20px 0"}} className="btn btn-secondary" to="/">Back</Link>

                <h1>Product Details</h1>

                <div>
                    <p>Name: {this.state.name}</p>
                    <p>Price: {this.state.price}</p>
                    <p>Quantity: {this.state.name}</p>
                    <p>Price Log: </p>
                    {this.state.lineChart}
                </div>

            </div>
        )
    }
}

export default ProductDetails;
