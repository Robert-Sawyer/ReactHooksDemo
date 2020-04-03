import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../hooks/http';

//wszystkie komentarze na dole, pod export default
const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case "DELETE":
            return currentIngredients.filter(ing => ing.id !== action.id);
        default:
            throw new Error("Wystąpił błąd");
    }
};

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
    const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier} = useHttp();

    useEffect(() => {
        if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
            dispatch({type: 'DELETE', id: reqExtra})
        } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
            dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra}})
        }
    }, [data, reqExtra, reqIdentifier, isLoading, error]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        dispatch({type: 'SET', ingredients: filteredIngredients});
    }, []);

    const addIngredientHandler = useCallback(ingredient => {
        sendRequest(
            "https://react-hooks-df071.firebaseio.com/ingredients.json",
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT',
            'application/json'
            )
    }, [sendRequest]);

    const removeIngredientHandler = useCallback(ingredientId => {
        sendRequest(
            `https://react-hooks-df071.firebaseio.com/ingredients/${ingredientId}.json`,
            'DELETE',
            null,
            ingredientId,
            'REMOVE_INGREDIENT',
            'application/json'
        );
    }, [sendRequest]);

    const clearError = useCallback(() => {
        // setError(null);
    }, []);

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
};

export default Ingredients;

//
// import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';
//
// import IngredientForm from './IngredientForm';
// import IngredientList from './IngredientList';
// import Search from './Search';
// import ErrorModal from '../UI/ErrorModal';
// import useHttp from '../hooks/http';
//
// //do tej funkcji wrzucamy aktualny stan skłądników i action, co przyda się przy aktualizacji stanu
// const ingredientReducer = (currentIngredients, action) => {
//     switch (action.type) {
//         //chcę ustawić składniki więc odnoszę sie do składników w action i zastepuję stary stan nowym (aktualizuję)
//         case 'SET':
//             return action.ingredients;
//         //w tym przypadku chce dodać nowy skłądnik i nie chcę zastępować starego, tylko skopiować stary i wstwić nowy z dodanym nowym składnikiem
//         case 'ADD':
//             return [...currentIngredients, action.ingredient];
//         //tutaj porównuję, czy id usuwanego składnika jest takie samo jak id przesłąne w akcji. zwraca tylko elementy z innym id.
//         case "DELETE":
//             return currentIngredients.filter(ing => ing.id !== action.id);
//         default:
//             throw new Error("Wystąpił błąd");
//     }
// };
//
// //MOŻNA TEGO UŻYĆ ANALOGICZNIE JAK TEGO POWYŻEJ DO USTAWIANIA STANU LOADING I ERROR, ALE JA WOLĘ SKORZYSTAĆ Z USESTATE, BO JEST BARDZIEJ
// //CZYTELNIE. ŻEBY TEN SPOSÓB MÓGŁ ZADZIAŁAĆ, TRZEBA ZAMIENIĆ WSZYSTKIE WYSTAPIENIA SETLOADING I SETERROR NA NP. DISPATCHHTTP({LOADING:TRUE})
// //ALBO HTTPSTATE.ERROR - SZCZEGÓŁY W FILMIE 444 Z KURSU REACTA
// // const httpReducer = (httpState, action) => {
// //     switch (action.type) {
// //         case 'SEND':
// //             return {loading: true, error: null};
// //         case 'RESPONSE':
// //             return {...httpState, loading: false};
// //         case 'ERROR':
// //             return {loading: false, error: action.errorData};
// //         default:
// //             throw new Error("Wystąpił błąd");
// //     }
// // };
//
// const Ingredients = () => {
//     const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
//     const {isLoading, error, data, sendRequest} = useHttp();
//     // const [userIngredients, setUserIngredients] = useState([]);
//
//     //to jest odpowiednik z burger burgera state = loading: false. Będę go uzywał do używania Spinnera przy ładowaniu
//     // const [isLoading, setIsLoading] = useState(false);
//     // const [error, setError] = useState();
//
//     useEffect(() => {
//         console.log('RENDERING INGREDIENTS', userIngredients);
//     }, [userIngredients]);
//
//
//     //ta funkcja filtruje wyszukiwane składniki
//     //używam tu useCallback ponieważ gdy go nie było, komponent się renderował (ponieważ ładowała się lista wprowadzonych wczesniej składnikow)
//     //i funkcja przekazywała do komponentu search za każdym razem dane
//     //i wtedy odświeżała się wartość funkcji przekazanej jako drugi parametr w zależnościach w useEffect. useCallback też posiada tablicę
//     //z zaleznościami, ale w tym przypadku wykona się tylko raz.
//     //ŻEBY USECALLBACK W TYM PRZYPADKU ZADZIAŁAŁ I KOMPONENT INGREDIENTLIST NIE REDNEROWAŁ SIĘ KILKA RAZY POZA USECALLBACK DODAJĘ TEŻ
//     //REACT.MEMO W INGREDIENT LIST
//     const filteredIngredientsHandler = useCallback(filteredIngredients => {
//         // setUserIngredients(filteredIngredients);
//         dispatch({type: 'SET', ingredients: filteredIngredients});
//     }, []);
//
//     //Ingredient to wprowadzone przez inputy składniki w ingredientForm, a fukcja set tworzy tablice z pierwotnego
//     //stanu składników i obiektu zawierającego unikalny id i listę skopiowanych składników wprowadzonych w formularzu
//     //zakładam callback, żeby zmniejszyć liczbę razy ile komponent niepotrzebnie się rednereuje
//     const addIngredientHandler = useCallback(ingredient => {
//         setIsLoading(true);
//         //fetch to NIE jest funkcja reactowa, tylko funkcja przeglądarki, można ją dostosować do swoich potrzeb, przekazująć
//         //konfigurację jako drugi argument funkcji - pierwszym jest url
//         fetch("https://react-hooks-df071.firebaseio.com/ingredients.json", {
//             method: 'POST',
//             body: JSON.stringify(ingredient),
//             headers: {'Content-Type': 'application/json'}
//         }).then(response => {
//             setIsLoading(false);
//             //to,co jest zawarte w then nie wykona się natychmiast ale wtedy, gdy zostanie pomyślnie zrealizowane polecenie powyżej
//             //response.json przekonwertuje zawartość odpowiedzi z jsona na kod JS
//             return response.json();
//         }).then(responseData => {
//             //drugi then powinniśmy wykonać wtedy gdy odpowiedź z pierwszego bloku then zostanie rozparsowana z jsona
//             // setUserIngredients(prevIngredients => [
//             //     ...prevIngredients,
//             //     //firebase (tylko!) w odpowiedzi na zapytanie wysyła obiekt z zawartym name, które jest unikanym id dlatego dopasowuję name do id
//             //     {id: responseData.name, ...ingredient}]
//             dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
//         })
//             .catch(error => {
//                 setError('Oops, something went wrong!')
//             });
//     }, []);
//
//     const removeIngredientHandler = useCallback(ingredientId => {
//         sendRequest(`https://react-hooks-df071.firebaseio.com/ingredients/${ingredientId}.json`, 'DELETE');
//
//         // setIsLoading(true);
//         // fetch(`https://react-hooks-df071.firebaseio.com/ingredients/${ingredientId}.json`, {
//         //     method: 'DELETE'
//         // }).then(response => {
//         //     setIsLoading(false);
//         //     // setUserIngredients(prevIngr => prevIngr.filter(ingredients => ingredients.id !== ingredientId));
//         //     dispatch({type: 'DELETE', id: ingredientId})
//         // })
//         //     .catch(error => {
//         //         setError('Oops, something went wrong!');
//         //         setIsLoading(false);
//         //     })
//     }, [sendRequest]);
//
//     const clearError = useCallback(() => {
//         setError(null);
//     }, []);
//
//     //alternatywny sposób na ograniczenie renderowania komponentu - zamiast react.memo na początku komponentu. Teraz tylko
//     //można zamieścić obiekt ingredientList na dole w section
//     // const ingredientList = useMemo(() => {
//     //     return (
//     //         <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
//     //     )
//     // }, [userIngredients, removeIngredientHandler]);
//
//     return (
//         <div className="App">
//             {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
//             {/*Tutaj idzie funkcja powyżej i zostaje wywołana w momencie wysłania formularza w IngredientForm*/}
//             <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>
//
//             <section>
//                 <Search onLoadIngredients={filteredIngredientsHandler}/>
//                 {/*tu idą pierwotne ingrediencje*/}
//                 <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
//             </section>
//         </div>
//     );
// }
//
// export default Ingredients;
