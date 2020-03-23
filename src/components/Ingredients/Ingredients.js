import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients =() => {

    const [userIngredients, setUserIngredients] =  useState([]);

    //Ingredient to wprowadzone przez inputy składniki w ingredientForm, a fukcja set tworzy tablice z pierwotnego
    //stanu składników i obiektu zawierającego unikalny id i listę skopiowanych składników wprowadzonych w formularzu
    const addIngredientHandler = ingredient => {
        setUserIngredients(prevIngredients => [
            ...prevIngredients,
            {id: Math.random().toString(), ...ingredient}
        ]);
    };

    const removeIngredientHandler = ingredientId => {
        setUserIngredients(prevIngr => prevIngr.filter(ingredients => ingredients.id !== ingredientId));
    }

  return (
    <div className="App">
        {/*Tutaj idzie funkcja powyżej i zostaje wywołana w momencie wysłania formularza w IngredientForm*/}
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        {/*tu idą pierwotne ingrediencje*/}
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
