import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
    Button,
    Divider,
    SegmentedButtons,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';

import { sessionStorage } from '@utils/storage';


export default function EvaluateTreatmentScreen({ route, navigation }) {
    const theme = useTheme();

    const { treatment } = route.params;

    const [effectiveness, setEffectiveness ] = React.useState(treatment.purposes.map(() => ''));
    const [sideEffect, setSideEffect] = React.useState('');
    const [burden, setBurden] = React.useState('');
    const [affordability, setAffordability] = React.useState('');

    function handleEffectiveness(index, newValue) {
        setEffectiveness(effectiveness.map((value, i) => {
            if (index === i) return newValue;
            else return value;
        }));
    }
    
    return (
        <ScrollView
          style={{
            backgroundColor: theme.colors.background,
            flex: 1,
          }}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        >
            {/* Effectiveness */}
            <View style={{...styles.row, paddingTop: 16}}>
                <View style={styles.column}>
                    <Text variant="titleMedium" style={{fontWeight: 600}}>Effectiveness</Text>
                </View>
            </View>
            <View style={{...styles.row, marginBottom: 14}}>
                <View style={styles.column}>
                    <Text
                      variant="bodyMedium"
                      style={{color: theme.colors.onSurfaceVariant}}
                    >
                        For each purpose below, what is the effect, if any, of {treatment.name} on it?
                    </Text>
                </View>
            </View>
            {treatment.purposes.map((purpose, i) => {
                const marginTop = (i > 0) ? 8 : 0;
                return (
                    <View key={i}>
                        <View style={{...styles.row, marginTop: marginTop}}>
                            <View style={styles.column}>
                                <Text variant="bodyMedium">{purpose}</Text>
                            </View>
                        </View>
                        <SegmentedButtons
                          value={effectiveness[i]}
                          onValueChange={newValue => { handleEffectiveness(i, newValue); }}
                          buttons={[
                            {value: 'none', label: 'None'},
                            {value: 'minor', label: 'Minor'},
                            {value: 'moderate', label: 'Moderate', style: {alignItems: 'center'}},
                            {value: 'major', label: 'Major'},
                          ]}
                          style={{paddingHorizontal: 16}}
                        />
                    </View>
                );
            })}
            <Divider style={{margin: 16}}/>
            {/* Side effects */}
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text variant="titleMedium" style={{fontWeight: 600}}>Side effects</Text>
                </View>
            </View>
            <View style={{...styles.row, marginBottom: 14}}>
                <View style={styles.column}>
                    <Text
                      variant="bodyMedium"
                      style={{color: theme.colors.onSurfaceVariant}}
                    >
                        In general, how would you describe the side effects, if any, of {treatment.name}?
                    </Text>
                </View>
            </View>
            <SegmentedButtons
              value={sideEffect}
              onValueChange={setSideEffect}
              buttons={[
                {value: 'none', label: 'None'},
                {value: 'mild', label: 'Mild'},
                {value: 'moderate', label: 'Moderate', style: {alignItems: 'center'}},
                {value: 'severe', label: 'Severe'},
              ]}
              style={{paddingHorizontal: 16}}
            />
            <Divider style={{margin: 16}}/>
            {/* Burden */}
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text variant="titleMedium" style={{fontWeight: 600}}>Burden</Text>
                </View>
            </View>
            <View style={{...styles.row, marginBottom: 14}}>
                <View style={styles.column}>
                    <Text
                      variant="bodyMedium"
                      style={{color: theme.colors.onSurfaceVariant}}
                    >
                        Is it difficult for you to take {treatment.name} as prescribed?
                    </Text>
                </View>
            </View>
            <SegmentedButtons
              value={burden}
              onValueChange={setBurden}
              buttons={[
                {value: 'not', label: 'Not at all', style: {alignItems: 'center'}},
                {value: 'little', label: 'A little'},
                {value: 'somewhat', label: 'Somewhat', style: {alignItems: 'center'}},
                {value: 'very', label: 'Very'},
              ]}
              style={{paddingHorizontal: 16}}
            />
            <Divider style={{ margin: 16 }}/>
            {/* Affordability */}
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text variant="titleMedium" style={{fontWeight: 600}}>Affordability</Text>
                </View>
            </View>
            <View style={{...styles.row, marginBottom: 14}}>
                <View style={styles.column}>
                    <Text
                      variant="bodyMedium"
                      style={{color: theme.colors.onSurfaceVariant}}
                    >
                        Is {treatment.name} affordable for you?
                    </Text>
                </View>
            </View>
            <SegmentedButtons
              value={affordability}
              onValueChange={setAffordability}
              buttons={[
                {value: 'not', label: 'Not at all', style: {alignItems: 'center'}},
                {value: 'little', label: 'A little'},
                {value: 'somewhat', label: 'Somewhat', style: {alignItems: 'center'}},
                {value: 'very', label: 'Very'},
              ]}
              style={{paddingHorizontal: 16}}
            />
            <Divider style={{margin: 16}}/>
            {/* Advice */}
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text variant="titleMedium" style={{fontWeight: 600}}>Advice</Text>
                </View>
            </View>
            <View style={{...styles.row, marginBottom: 14}}>
                <View style={styles.column}>
                    <Text
                      variant="bodyMedium"
                      style={{color: theme.colors.onSurfaceVariant}}
                    >
                        What would you say to help someone get the desired effects of {treatment.name}?
                    </Text>
                </View>
            </View>
            <TextInput
              label="Advice"
              multiline={true}
              style={{marginHorizontal: 16}}
            />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingVertical: 16,
                paddingHorizontal: 16
              }}
            >
                <Button
                  mode="contained"
                  disabled={false}
                  onPress={() => {
                    navigation.popToTop();
                    return navigation.push('AppNavigation', {
                        screen: 'User',
                        params: {
                            userId: sessionStorage.getNumber('userId'),
                            name: sessionStorage.getString('username'),
                            treatmentEval: true,
                        }
                    });
                  }}
                  style={{width: '100%'}}
                >
                    Save
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    column: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 16
    },
});