import React, {useContext} from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth'
import {AuthContext} from './auth-context';

const App = props => {

  const authContext = useContext(AuthContext);

  //domyślnie treścią strony jest autoryzacja, ale gdy uda sie zalogować to wtedy zamieniam na formularz składników i zwracam zawartość
  //tej zmiennej
  let content = <Auth/>;

  if (authContext.isAuth) {
    content = <Ingredients/>
  }

  return content;
};

export default App;
