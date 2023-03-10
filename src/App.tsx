import { Provider } from 'react-redux';

import store from '@/store';
import MainView from '@/views';

function App() {
  return (
    <Provider store={store}>
      <MainView />
    </Provider>
  );
}

export default App;
