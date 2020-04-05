import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import useHttp from '../../components/hooks/http';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';

//WSZYSTKIE KOMENTARZE (I PRZEDOSTATNIA WERSJA KOMPONENTU) NA DOLE, POD EXPORT DEFAULT
const Search = React.memo(props => {

        const {onLoadIngredients} = props;
        const [enteredFilter, setEnteredFilter] = useState('');
        const inputRef = useRef();
        const {isLoading, data, error, sendRequest, clear} = useHttp();

        useEffect(() => {

            const timer = setTimeout(() => {
                if (enteredFilter === inputRef.current.value) {
                    const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
                    sendRequest('https://react-hooks-df071.firebaseio.com/ingredients.json' + query, 'GET')
                }
            }, 500);
            return () => {
                clearTimeout(timer);
            };
        }, [enteredFilter, inputRef, sendRequest]);

        useEffect(() => {
            if (!isLoading && !error, data) {
                const loadedIngredients = [];
                for (const key in data) {
                    loadedIngredients.push({
                        id: key,
                        title: data[key].title,
                        amount: data[key].amount
                    });
                }
                onLoadIngredients(loadedIngredients);
            }
        }, [data, isLoading, error, onLoadIngredients]);

        return (
            <section className="search">
                {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
                <Card>
                    <div className="search-input">
                        <label>Filter by Title</label>
                        {isLoading && <span>Loading...</span>}
                        <input
                            ref={inputRef} type="text" value={enteredFilter}
                            onChange={event => setEnteredFilter(event.target.value)}/>
                    </div>
                </Card>
            </section>
        );
    })
;

export default Search;

//
// import React, {useState, useEffect, useRef} from 'react';
//
// import Card from '../UI/Card';
// import './Search.css';
//
// const Search = React.memo(props => {
//     //tutaj DESTRUKTURYZUJĘ obiekt, który stanowi funkcja onLoadingredients. dzięki temu mogę niżej zapisać zamiast
//     //props.onLoad... samo onLoad... i poza tym dodać tylko tą funkcję do zależności w useeffect bez angażowania do tego propsów
//     const { onLoadIngredients } = props;
//     const [enteredFilter, setEnteredFilter] = useState('');
//     const inputRef = useRef();
//
//     //useEffect wykona się zawsze, gdy ten komponent zostanie zrenderowany i NA KOŃCU CYKLU - PO WSZYSTKICH FUNKCJACH
//     useEffect(() => {
//         //ustawiam timer na pół sekundy, żeby nie wysyłać żądania na serwer po każdym wciśnięciu klawisza - dopiero,gdy minie pół sekundu
//         //zostanie wykonany fetch z zapytaniem o taki składnik - to zaoszczędzi na wydajności
//         setTimeout(() => {
//             if (enteredFilter === inputRef.current.value) {
//                 //tutaj będę filtrował dane, które pójdą do firebase z zapytaniem. jeśli nie została wprowadzona wartość, wtedy query będzie pustym
//                 // stringiem. Jeżeli nie, to posortuj po tytułach i wyświetl, jeśli składnik zgadza się z wprowadzoną w wyszukiwarce wartością
//                 const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
//                 fetch('https://react-hooks-df071.firebaseio.com/ingredients.json' + query)
//                     .then(response => response.json())
//                     .then(responseData => {
//                         const loadedIngredients = [];
//                         for (const key in responseData) {
//                             loadedIngredients.push({
//                                 id: key,
//                                 title: responseData[key].title,
//                                 amount: responseData[key].amount
//                             });
//                         }
//                         //onloadIngredients to funkcja, którą oczekuje komponent search zawarty w Ingredients, tam ją obsłużę
//                         onLoadIngredients(loadedIngredients);
//                     })
//             }
//         }, 500);
//         //useEffect ma drugi argument - tablicę z ZALEŻNOŚCIAMI FUNKCJI (TEJ WEWNĄTRZ USEEFFECT) I TYLKO WTEDY, GDY ZALEŻNOŚCI
//         // ULEGNA ZMIANIE, FUNKCJA ODPALI SIĘ PONOWNIE. DZIEKI TEMU MOŻNA DECYDOWAĆ JAK CZĘSTO FUNKCJA BĘDZIE SIĘ URUCHAMIAĆ.
//         //DOMYŚLNIE JEST TO PO KAŻDYM CYKLU ŁADOWANIA KOMPONENTU (RENDER)
//         //UMIESZCZENIE PUSTEJ TABLICY SPOWODUJE, ŻE USEEFFECT URUCHOMI SIĘ TYLKO RAZ - PO PIERWSZYM ZAŁADOWANIU STRONY (ZACHOWUJE SIĘ W TAKIEJ
//         //KONFIGURACJI IDENTYCZNIE, CO COMPONENTDIDMOUNT - URUCHAMIA SIE TYLKO RAZ
//         //chcę tutaj, żeby useEffect wykonało się ZA KAŻDYM RAZEM, gdy zmieni się wprowadzona wartość - wyszukiwany składnik, LUB onloadingredients
//         // dlatego umieszczam te rzeczy jako zależność useEffect
//     }, [enteredFilter, onLoadIngredients, inputRef]);
//
//     return (
//         <section className="search">
//             <Card>
//                 <div className="search-input">
//                     <label>Filter by Title</label>
//                     <input
//                         ref={inputRef} type="text" value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)}/>
//                 </div>
//             </Card>
//         </section>
//     );
// });
//
// export default Search;
