import React from 'react';
import {Switch, Route} from 'react-router-dom';
import ListProducts from './Components/ListProducts';
import AddProduct from './Components/AddProduct';
import EditProduct from './Components/EditProduct';
import ProductDetails from './Components/ProductDetails';


const Main = () => (
    <main>
        <Switch>
            <Route exact path="/" component={ListProducts} />
            <Route exact path="/page/:page" component={ListProducts} />
            <Route exact path="/product/add" component={AddProduct} />
            <Route exact path="/product/edit/:id" component={EditProduct} />
            <Route exact path="/product/:id" component={ProductDetails} />
        </Switch>
    </main>
)


export default Main;
