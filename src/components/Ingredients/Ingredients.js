import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients =() => {

    const [userIngredients, setUserIngredients] =  useState([]);

    //Ingredient to wprowadzone przez inputy składniki w ingredientForm, a fukcja set tworzy tablice z pierwotnego
    //stanu składników i obiektu zawierającego unikalny id i listę skopiowanych składników wprowadzonych w formularzu
    const addIngredientHandler = ingredient => {
        //fetch to NIE jest funkcja reactowa, tylko funkcja przeglądarki, można ją dostosować do swoich potrzeb, przekazująć
        //konfigurację jako drugi argument funkcji - pierwszym jest url
        fetch("https://react-hooks-df071.firebaseio.com/ingredients.json", {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            //to,co jest zawarte w then nie wykona się natychmiast ale wtedy, gdy zostanie pomyślnie zrealizowane polecenie powyżej
            //response.json przekonwertuje zawartość odpowiedzi z jsona na kod JS
            return response.json();
        }).then(responseData => {
            //drugi then powinniśmy wykonać wtedy gdy odpowiedź z pierwszego bloku then zostanie rozparsowana z jsona
            setUserIngredients(prevIngredients => [
                ...prevIngredients,
                //firebase (tylko!) w odpowiedzi na zapytanie wysyła obiekt z zawartym name, które jest unikanym id dlatego dopasowuję name do id
                {id: responseData.name, ...ingredient}
            ]);
        })
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
