import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import {
    Text,
    useTheme,
} from 'react-native-paper';

import { sessionStorage } from '@utils/storage';


export default function TotalConnections({ user, navigation }) {
    const theme = useTheme();
    const color = theme.colors.onBackground;

    const loggedUser = sessionStorage.getNumber('userId');

    const username = user.username;
    const name = (user.id === loggedUser)
        ? 'Connections'
        : (username + (username.endsWith('s') ? "'" : "'s") + ' connections');

    const totalConnections = user.total_connections;

    return (
        <View style={styles.container}>
            <Pressable
              role="button"
              type="button"
              onPress={() => {
                if (totalConnections > 0)
                    return navigation.push('Connections', {userId: user.id, name: name});
                return;
              }}
            >
                <View style={styles.row}>
                    <Text variant="titleLarge" style={{textAlign: 'center', color: color}}>
                        {totalConnections}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text variant="bodyMedium" style={{textAlign: 'center', color: color}}>
                        Connection{(totalConnections === 1) ? '' : 's'}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
    },
    row: {
        flex: 1,
    },
});