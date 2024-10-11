import 'react-native-gesture-handler';
import { useContext } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider,
    adaptNavigationTheme
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DeviceMockup from '@components/device-mockup';
import App from '@navigations/';
import { GlobalState } from '@utils/global-state';


const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...LightTheme.colors,
    },
};

const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        ...DarkTheme.colors,
    },
};


export default function Main() {
    const { isThemeDark } = useContext(GlobalState);

    const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

    return (
        <View style={styles.container}>
            <DeviceMockup theme={theme}>
                <PaperProvider theme={theme}>
                    <SafeAreaProvider>
                        <NavigationContainer theme={theme}>
                            <App />
                        </NavigationContainer>
                    </SafeAreaProvider>
                </PaperProvider>
            </DeviceMockup>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
});