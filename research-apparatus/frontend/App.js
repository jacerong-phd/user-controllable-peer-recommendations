import { registerRootComponent } from 'expo';
import { BrowserRouter } from 'react-router-dom';

import { GlobalStateProvider } from '@utils/global-state';
import Main from './src';


export default function App() {
    return (
        <BrowserRouter>
            <GlobalStateProvider>
                <Main />
            </GlobalStateProvider>
        </BrowserRouter>
    );
}


registerRootComponent(App);

// Project structure
// <https://cheesecakelabs.com/blog/efficient-way-structure-react-native-projects/>