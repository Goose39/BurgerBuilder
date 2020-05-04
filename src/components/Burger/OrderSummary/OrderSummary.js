import React from 'react';
import Auxiliary from '../../../hoc/Auxiliary';

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
      <p>Ready to Checkout?</p>
    </Auxiliary>
  )
};

export default orderSummary;