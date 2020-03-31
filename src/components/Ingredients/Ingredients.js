import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {

    const [userIngredients, setUserIngredients] = useState([]);
    //to jest odpowiednik z burger burgera state = loading: false. Będę go uzywał do używania Spinnera przy ładowaniu
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        console.log('RENDERING INGREDIENTS', userIngredients);
    }, [userIngredients]);


    //ta funkcja filtruje wyszukiwane składniki
    //używam tu useCallback ponieważ gdy go nie było, komponent się renderował (ponieważ ładowała się lista wprowadzonych wczesniej składnikow)
    //i funkcja przekazywała do komponentu search za każdym razem dane
    //i wtedy odświeżała się wartość funkcji przekazanej jako drugi parametr w zależnościach w useEffect. useCallback też posiada tablicę
    //z zaleznościami, ale w tym przypadku wykona się tylko raz.
    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setUserIngredients(filteredIngredients);
    }, []);

    //Ingredient to wprowadzone przez inputy składniki w ingredientForm, a fukcja set tworzy tablice z pierwotnego
    //stanu składników i obiektu zawierającego unikalny id i listę skopiowanych składników wprowadzonych w formularzu
    const addIngredientHandler = ingredient => {
        setIsLoading(true);
        //fetch to NIE jest funkcja reactowa, tylko funkcja przeglądarki, można ją dostosować do swoich potrzeb, przekazująć
        //konfigurację jako drugi argument funkcji - pierwszym jest url
        fetch("https://react-hooks-df071.firebaseio.com/ingredients.json", {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            setIsLoading(false);
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
            .catch(error => {
                setError('Oops, something went wrong!')
            });
    };

    const removeIngredientHandler = ingredientId => {
        setIsLoading(true);
        fetch(`https://react-hooks-df071.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(response => {
            setIsLoading(false);
            setUserIngredients(prevIngr => prevIngr.filter(ingredients => ingredients.id !== ingredientId));
        })
            .catch(error => {
                setError('Oops, something went wrong!');
                setIsLoading(false);
            })
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            {/*Tutaj idzie funkcja powyżej i zostaje wywołana w momencie wysłania formularza w IngredientForm*/}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {/*tu idą pierwotne ingrediencje*/}
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
