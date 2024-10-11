import React, {useContext} from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    Button,
    Divider,
    IconButton,
    ProgressBar,
    RadioButton,
    Text,
    Tooltip,
    useTheme,
} from 'react-native-paper';

import { range } from '@utils';
import { MATCHING_CRITERIA } from '@utils/constants';
import { GlobalState } from '@utils/global-state';
import { sessionStorage } from '@utils/storage';


export default function AdjustPreferencesScreen({ route, navigation }) {
    const theme = useTheme();

    const { recommEngine } = useContext(GlobalState);

    const matchingCriteria = MATCHING_CRITERIA[recommEngine];

    const likertScalePoints = 5;

    const hasRecommPreferences = sessionStorage.contains('recommPreferences');

    let recommPreferences = hasRecommPreferences
        ? JSON.parse(sessionStorage.getString('recommPreferences'))
        : route.params?.recommPreferences;

    recommPreferences = (recommPreferences === undefined) ? {} : recommPreferences;

    let criteria = [];
    let indexCriterion;

    for (let i=0; i < matchingCriteria.length; i++) {
        criteria.push(matchingCriteria[i]['key']);

        if (
            !hasRecommPreferences
            && !recommPreferences.hasOwnProperty(matchingCriteria[i]['key'])
            && typeof indexCriterion !== 'number'
        ) {
            indexCriterion = i;
        }
    }

    const [preferenceValues, setPreferenceValues] = React.useState(
        hasRecommPreferences
            ? criteria.map((x) => recommPreferences[x])
            : null
    );

    const updatePreferenceValues = (index, newValue) => {
        setPreferenceValues(preferenceValues.map((value, i) => {
            if (index === i) return newValue;
            else return value;
        }));
    };

    return (
        <ScrollView
          style={{
            backgroundColor: theme.colors.background,
            flex: 1
          }}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        >
            {hasRecommPreferences ? (
                <>
                    <View
                      style={{flex: 1, marginTop: 16, paddingHorizontal: 16}}
                    >
                        <Text style={{marginBottom: 24}}>
                            For each criterion below, how important is it that your peers are like you in that criterion?
                        </Text>
                        {matchingCriteria.map((criterion, i) => {
                            return (
                                <View key={i}>
                                    <View
                                      style={{...styles.row, alignItems: 'center', marginBottom: 8}}
                                    >
                                        <Text style={{fontWeight: 600}}>
                                            {criterion.title}
                                        </Text>
                                        <Tooltip title={criterion.description}>
                                            <IconButton
                                              icon="information"
                                              selected
                                              size={20}
                                              onPress={() => {}}
                                            />
                                        </Tooltip>
                                    </View>
                                    <View style={styles.row}>
                                        <View style={styles.column}>
                                            <Text>Not at all important</Text>
                                        </View>
                                        <View
                                          style={{...styles.column, flex: 3, justifyContent: 'space-around'}}
                                        >
                                            <RadioButton.Group
                                              onValueChange={newValue => updatePreferenceValues(i, newValue)}
                                              value={preferenceValues[i]}
                                            >
                                                <View style={{flexDirection: 'row'}}>
                                                    {range(likertScalePoints).map((element) => <RadioButton value={element} key={element} />)}
                                                </View>
                                            </RadioButton.Group>
                                        </View>
                                        <View style={styles.column}>
                                            <Text>Extremely important</Text>
                                        </View>
                                    </View>
                                    {i < (matchingCriteria.length - 1) ? (
                                        <Divider style={{marginVertical: 8}} />
                                    ) : (
                                        null
                                    )}
                                </View>
                            );
                        })}
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingBottom: 16,
                            paddingHorizontal: 16,
                          }}
                        >
                            <Button
                              mode="contained"
                              disabled={false}
                              onPress={() => {
                                for (let i=0; i < criteria.length; i++) {
                                    const criterion = criteria[i];
                                    recommPreferences[criterion] = preferenceValues[i];
                                }
                                sessionStorage.set('recommPreferences', JSON.stringify(recommPreferences));
                                return navigation.push('AppNavigation', {screen: 'Connect'});
                              }}
                              style={{width: '100%'}}
                            >
                                Save
                            </Button>
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <View style={{height: 4}}>
                        <ProgressBar progress={(indexCriterion + 1) / 3} />
                    </View>
                    <View
                      style={{flex: 1, marginTop: 16, paddingHorizontal: 16}}
                    >
                        <Text variant="titleLarge">
                            {matchingCriteria[indexCriterion]['title']}
                        </Text>
                        <Text style={{marginTop: 8}}>
                            {matchingCriteria[indexCriterion]['description']}
                        </Text>
                        <Text style={{marginVertical: 16}}>
                            How important is it that your peers are like you in {matchingCriteria[indexCriterion]['title'].toLowerCase()}?
                        </Text>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text>Not at all important</Text>
                            </View>
                            <View style={{...styles.column, flex: 3, justifyContent: 'space-around'}}>
                                <RadioButton.Group
                                  onValueChange={newValue => setPreferenceValues(newValue)}
                                  value={preferenceValues}
                                >
                                    <View style={{flexDirection: 'row'}}>
                                        {range(likertScalePoints).map((element) => <RadioButton value={element} key={element} />)}
                                    </View>
                                </RadioButton.Group>
                            </View>
                            <View style={styles.column}>
                                <Text>Extremely important</Text>
                            </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingBottom: 16,
                            paddingHorizontal: 16,
                          }}
                        >
                            <Button
                              mode="contained"
                              disabled={preferenceValues === null}
                              onPress={() => {
                                recommPreferences = {
                                    ...recommPreferences,
                                    [matchingCriteria[indexCriterion]['key']]: preferenceValues,
                                };

                                if (indexCriterion < (matchingCriteria.length - 1)) {
                                    return navigation.push('AdjustPreferences', {
                                        recommPreferences: recommPreferences,
                                        name: 'Set Preferences'
                                    });
                                }

                                sessionStorage.set('recommPreferences', JSON.stringify(recommPreferences));
                                return navigation.push('AppNavigation', {screen: 'Connect'});
                              }}
                              style={{width: '100%'}}
                            >
                                {indexCriterion < (matchingCriteria.length - 1) ? 'Next' : 'Save'}
                            </Button>
                        </View>
                    </View>
                </>
            )}
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
    },
});