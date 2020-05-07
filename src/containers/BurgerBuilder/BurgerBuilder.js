import React, { Component } from "react";
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4, 
  meat: 1.3, 
  bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4, 
    purchaseable: false, 
    purchasing: false, 
    loading: false, 
    error: false
  }

  componentDidMount () {
    axios.get('https://react-burger-builder-f87e9.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({
          ingredients: response.data
        })
      })
      .catch(err => {
        this.setState({error: true})
      })
  }

  updatePurchaseState = (updatedIngredients) => {

    const sum = Object.keys(updatedIngredients)
      .map(ingName => {
        return updatedIngredients[ingName]
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

      this.setState({
        purchaseable: sum > 0
      })
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    const updatedCount = oldCount + 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const priceAdditional = INGREDIENT_PRICES[type]
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAdditional;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({
      purchasing: true
    });
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    });
  }

  purchaseContinueHandler = () => {
    this.setState({loading: true})
    const order = {
      ingredients: this.state.ingredients, 
      price: this.state.totalPrice,
      customer: {
        name: 'Shaun Gouws',
        address: {
          street: 'streetname',
          zip: '33418', 
          country: 'USA'
        },
        email: 'testemail@test.com'
      }, 
      deliveryMethod: 'fastest'
    }
    axios.post('/orders.json', order)
      .then(res => {
        console.log(res);
        this.setState({ loading: false, purchasing: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false, purchasing: false});
      });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null
    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

    if (this.state.ingredients) {
      burger = (
        <Auxiliary>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls 
            ingredientAdded={this.addIngredientHandler} 
            ingredientRemoved={this.removeIngredientHandler} 
            disabled={disabledInfo} 
            price={this.state.totalPrice} 
            purchaseable={this.state.purchaseable}
            ordered={this.purchaseHandler} />
        </Auxiliary>
      );

      orderSummary = <OrderSummary 
      ingredients={this.state.ingredients}
      purchaseCancelled={this.purchaseCancelHandler}
      purchaseContinued={this.purchaseContinueHandler}
      price={this.state.totalPrice} />
    }

    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <Auxiliary>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Auxiliary>

    )
  }
}

export default withErrorHandler(BurgerBuilder, axios)