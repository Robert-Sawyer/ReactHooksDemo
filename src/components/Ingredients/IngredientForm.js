import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  // w React Hooks używa się useState zamiast klasycznego stata - różnica polega na tym, że w Hooks state nie musi
  //być obiektem - w klasycznym reakcie musiał być.
  //useState w React Hooks ZAWSZE zwraca tablicę z dokładnie dwoma elementami - pierwszym jest aktualny state:
  //to znaczy, że jeśli będę aktualizował state, to ten element będzie zawierał uaktualniona wersję - AKTUALNĄ
  //drugim elementem jest FUNKCJA, KTÓRA POZWOLIŁA NA UPDATE PIERWOTNEGO STANU
  //ŻEBY BYŁO ŁATWIEJ ZROZUMIEĆ, zamiast const inputState tworzę składnię, jak  - inputTitle to aktualny state, a
  //setInputTitle to funkcja która ustawia nowy state
  const [inputTitle, setInputTitle] = useState('');
  const [inputAmount, setInputAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    //tu zostaje wywołana funkcja z Ingredients i odbiera wprowadzone przez formularz składniki
    props.onAddIngredient({title: inputTitle, amount: inputAmount})
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            {/*pobieram wartość z PIERWSZEGO ELEMENTU INITIAL STATE (PIERWOTNEGO STANU) z title*/}
            {/*POTEM UPDATUJĘ STATE W ONCHANGE I WYWOŁUJĘ FUNKCJĘ Z DRUGIEGO ELEMTU USESTATE, KTÓRA ZROBI UPDATE:
            event.target.value to wartość, którą wprowadzi użutkownik w inpucie na stronie i to ona
            będzie nową wartością tego elementu a więc state zostanie zaktualizowany*/}
            <input
                type="text"
                id="title"
                value={inputTitle}
                onChange={event => {
                  setInputTitle(event.target.value)
                }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
                type="number"
                id="amount"
                value={inputAmount}
                onChange={event => {
                  setInputAmount(event.target.value)
                }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
