import { Provider } from 'react-redux';

import store from '@/store';
import MainView from '@/views';
import MouseParticles from 'react-mouse-particles';

function App() {
  return (
    <Provider store={store}>
      <MainView />

      <MouseParticles g={1} color="random" cull="col,image-wrapper" />
    </Provider>
  );
}

export default App;
