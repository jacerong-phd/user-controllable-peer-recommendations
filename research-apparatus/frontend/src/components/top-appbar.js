import React from 'react';
import {
    Appbar,
    useTheme,
} from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';


export default function TopAppBar({
    navigation,
    route,
    options,
    back,
}) {
    const theme = useTheme();

    const title = route.params?.name || getHeaderTitle(options, route.name);
    const mode = title.length > 24 ? 'medium' : 'small';

    return (
        <Appbar.Header
          elevated={true}
          mode={mode}
          style={{backgroundColor: theme.colors.background}}
        >
            {navigation.canGoBack() ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
}