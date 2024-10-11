import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    IconButton,
    Divider,
    Text,
    useTheme,
} from 'react-native-paper';


export default function NotificationsScreen({ route, navigation }) {
    const theme = useTheme();

    return (
        <ScrollView
          style={{
            backgroundColor: theme.colors.background,
            flex: 1
          }}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        >
            <View style={[styles.row, styles.firstRow]}>
                <View style={styles.column}>
                    <Text variant="titleMedium" style={{fontWeight: 'bold'}}>
                        Notifications
                    </Text>
                </View>
                <View style={{...styles.column, alignItems: 'flex-end'}}>
                    <IconButton
                      icon="cog"
                      size={20}
                      onPress={() => { return; }}
                    />
                </View>
            </View>
            <Divider style={{opacity: .4}} />
            <View style={{...styles.row, flexGrow: 1}}>
                <View style={{...styles.column, marginHorizontal: 16, paddingHorizontal: 16}}>
                    <Text variant="headlineLarge" style={{textAlign: 'center', marginBottom: 8}}>
                        No notifications yet
                    </Text>
                    <Text
                      variant="bodyLarge"
                      style={{textAlign: 'center', opacity: .6}}
                    >
                        We will keep you updated on any actions you may need to take.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    firstRow: {
        marginTop: 64,
        paddingTop: 16,
    },
    column: {
        flex: 1,
        paddingHorizontal: 16,
    },
});