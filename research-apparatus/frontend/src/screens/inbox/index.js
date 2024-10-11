import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    Button,
    FAB,
    Text,
    useTheme,
} from 'react-native-paper';


export default function InboxScreen({ route, navigation }) {
    const theme = useTheme();

    return (
        <SafeAreaView style={{flexGrow: 1}}>
            <ScrollView
              style={{
                backgroundColor: theme.colors.background,
                flex: 1
              }}
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <View style={styles.row}>
                        <Text variant="headlineLarge" style={{textAlign: 'center', marginBottom: 8}}>
                            Empty inbox — for now
                        </Text>
                        <Text
                          variant="bodyLarge"
                          style={{textAlign: 'center', opacity: .6, marginBottom: 32}}
                        >
                            See all your private messages with others in the community.
                        </Text>
                        <Button
                          mode="contained"
                          onPress={() => {}}
                          style={{alignSelf: 'center'}}
                        >
                            Write a message
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <FAB
              icon="plus"
              style={styles.fabStyle}
              onPress={() => {}}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        flexGrow: 1,
        flexWrap: 'wrap',
    },
    row: {
        flex: 1,
        flexGrow: 1,
        marginHorizontal: 16,
        paddingHorizontal: 16,
        alignSelf: 'center',

    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});