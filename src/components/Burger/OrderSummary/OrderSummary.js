import React from 'react';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
  const ingredientSummary = Object.keys(props.ingredients)
    .map(ingName => {
    return (
      <li key={ingName}>
        <span style={{textTransform: 'capitalize'}}> {ingName}</span>: {props.ingredients[ingName]}
      </li> );
    });

  return (
    <Auxiliary>
      <h3>Your Order</h3>
      <p>A delicious burger with the following ingredients: </p>
      <ul>
        {ingredientSummary}
      </ul>
      <p><strong>Order Total: {props.price.toFixed(2)}</strong></p>
      <p>Ready to Checkout?</p>
      <Button clicked={props.purchaseCancelled} btnType="Danger">CANCEL</Button>
      <Button clicked={props.purchaseContinued} btnType="Success">CONTINUE</Button>
    </Auxiliary>
  )
};

export default orderSummary;