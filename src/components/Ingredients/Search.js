import React, {useState, useEffect} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    //tutaj DESTRUKTURYZUJĘ obiekt, który stanowi funkcja onLoadingredients. dzięki temu mogę niżej zapisać zamiast
    //props.onLoad... samo onLoad... i poza tym dodać tylko tą funkcję do zależności w useeffect bez angażowania do tego propsów
    const { onLoadIngredients } = props;
    const [enteredFilter, setEnteredFilter] = useState('');


    useEffect(() => {
        //tutaj będę filtrował dane, które pójdą do firebase z zapytaniem. jeśli nie została wprowadzona wartość, wtedy query będzie pustym
        // stringiem. Jeżeli nie, to posortuj po tytułach i wyświetl, jeśli składnik zgadza się z wprowadzoną w wyszukiwarce wartością
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-df071.firebaseio.com/ingredients.json' + query)
            .then(response => response.json())
            .then(responseData => {
                const loadedIngredients = [];
                for (const key in responseData) {
                    loadedIngredients.push({
                        id: key,
                        title: responseData[key].title,
                        amount: responseData[key].amount
                    })
                }
                //onloadIngredients to funkcja, którą oczekuje komponent search zawarty w Ingredients, tam ją obsłużę
                onLoadIngredients(loadedIngredients);
            })
        //chcę, żeby useEffect wykonało się ZA KAŻDYM RAZEM, gdy zmieni się wprowadzona wartość - wyszukiwany składnik, LUB onloadingredients
        // dlatego umieszczam te rzeczy jako zależność useEffect
    }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
              type="text" value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
