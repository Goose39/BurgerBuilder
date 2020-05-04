import React from 'react'
import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
  let ingredientsArr = Object.keys(props.ingredients)
    .map(ingName => {
      return [...Array(props.ingredients[ingName])].map((_, i) => {
        return <BurgerIngredient key={ingName + i} type={ingName} />
      })
    })
    .reduce((arr, el) => {
      return arr.concat(el)
    }, []);

    if (ingredientsArr.length === 0 ) {
      ingredientsArr = <p>Please start adding ingredients!</p>
    }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {ingredientsArr}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default burger;