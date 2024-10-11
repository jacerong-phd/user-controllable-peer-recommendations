import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Button,
    IconButton,
    Divider,
    List,
    Text,
} from 'react-native-paper';
import {
    Tabs,
    TabScreen,
    TabsProvider,
} from 'react-native-paper-tabs';


function ProfileTab({ user }) {
    const userData = [
        {
            name: 'Demographics',
            items: [
                {key: 'Gender', val: user.gender},
                {key: 'Age', val: user.age + ' years old'},
            ]
        },
        {
            name: 'Lifestyle',
            items: [
                {key: 'Activity level', val: user.activity_level},
                {key: 'Smoking status', val: user.smoking_status},
                {key: 'Health interests', val: user.health_interests},
                {key: 'Personal interests', val: user.personal_interests},
            ]
        }
    ];

    return (
        <>
            {userData.map((section, i) => {
                return (
                    <List.Section key={i}>
                        <List.Subheader>{section.name}</List.Subheader>
                        {section.items.map((obj, j) => {
                            return (
                                <List.Item
                                  title={obj.key}
                                  description={obj.val}
                                  titleStyle={{fontSize: 14, opacity: .6}}
                                  descriptionStyle={{fontSize: 16}}
                                  descriptionNumberOfLines={3}
                                  key={"section_" + i + "_item_" + j}
                                />
                            );
                        })}
                        {i < (userData.length - 1) ? (
                            <Divider style={{marginHorizontal: 16, marginTop: 16}} />
                        ) : (
                            null
                        )}
                    </List.Section>
                );
            })}
        </>
    );
}


function ConditionsTab(conditions, profileEditing) {
    return (
        <>
            {profileEditing ? (
                <View style={{...styles.row, marginBottom: 8}}>
                    <View style={styles.column}>
                        <Button
                          icon="plus"
                          mode="text"
                          onPress={() => {}}
                        >
                            Add condition
                        </Button>
                    </View>
                </View>
            ) : (
                null
            )}
            {conditions.map((obj, i) => {
                let desc = (('primary' in obj && obj.primary === true) ? 'primary condition · ' : '')
                    + 'diagnosed · '
                    + obj.time_since_diagnosis;

                desc = desc.charAt(0).toUpperCase() + desc.slice(1).toLowerCase();

                return (
                    <List.Item
                      title={obj.condition}
                      description={desc}
                      key={i}
                      right={(props) =>
                        <>
                            {profileEditing ? (
                                <List.Icon {...props} icon="dots-vertical" onPress={() => {}} />
                            ) : (
                                null
                            )}
                        </>
                      }
                    />
                );
            })}
        </>
    );
}


function SymptomsTab(symptoms, profileEditing, username) {
    return (
        <>
            {profileEditing ? (
                <View style={{...styles.row, marginBottom: 8}}>
                    <View style={styles.column}>
                        <Button
                          icon="plus"
                          mode="text"
                          onPress={() => {}}
                        >
                            Add symptom
                        </Button>
                    </View>
                </View>
            ) : (
                null
            )}
            <List.AccordionGroup>
                {symptoms.map((obj, i) => {
                    return (
                        <List.Accordion title={obj.symptom} id={i} key={i}>
                            <List.Item
                              title={`Treatments ${profileEditing ? 'you take' : username + ' takes'} for ${obj.symptom.toLowerCase()}`}
                              titleStyle={{fontSize: 14, opacity: .6}}
                              titleNumberOfLines={2}
                              description={() =>
                                <>
                                    {profileEditing ? (
                                        <Button
                                          mode="text"
                                          icon="plus"
                                          onPress={() => {}}
                                          style={{alignItems: 'flex-start'}}
                                        >
                                            Add treatment
                                        </Button>
                                    ) : (
                                        null
                                    )}
                                </>                                
                              }
                              style={{paddingLeft: 16}}
                            />
                            <List.Item
                              title={`${obj.symptom} is a side effect of`}
                              titleStyle={{fontSize: 14, opacity: .6}}
                              titleNumberOfLines={2}
                              description={() =>
                                <>
                                    {profileEditing ? (
                                        <Button mode="text"
                                          icon="plus"
                                          onPress={() => {}}
                                          style={{alignItems: 'flex-start'}}
                                        >
                                            Add treatment
                                        </Button>
                                    ) : (
                                        null
                                    )}
                                </>
                              }
                              style={{paddingLeft: 16}}
                            />
                            {i < (symptoms.length - 1) ? (
                                <Divider style={{marginHorizontal: 16}} />
                            ) : (
                                null
                            )}
                        </List.Accordion>
                    );
                })}
            </List.AccordionGroup>
        </>
    );
}


function TreatmentsTab(treatments, profileEditing, navigation) {
    return (
        <>
            {profileEditing ? (
                <View style={{...styles.row, marginBottom: 8}}>
                    <View style={styles.column}>
                        <Button
                          icon="plus"
                          mode="text"
                          onPress={() => {}}
                        >
                            Add treatment
                        </Button>
                    </View>
                </View>
            ) : (
                null
            )}
            <List.AccordionGroup>
                {treatments.map((obj, i) => {
                    const treatmentName = obj.treatment.name;
                    return (
                        <List.Accordion
                          title={treatmentName}
                          description={obj.treatment.type}
                          id={i}
                          key={i}
                        >
                            <List.Item
                              title="Purpose(s)"
                              titleStyle={{fontSize: 14, opacity: .6}}
                              description={() =>
                                <>
                                    {profileEditing ? (
                                        <View
                                          style={{...styles.row, alignItems: 'center', alignContent: 'space-between'}}
                                        >
                                            {obj.purpose.map((purpose, j) => {
                                                const marginRight = 8;
                                                return (
                                                    <Button
                                                      mode="outlined"
                                                      icon="close"
                                                      onPress={() => {}}
                                                      key={i + "_" + j}
                                                      style={{marginRight: marginRight}}
                                                      contentStyle={{flexDirection: 'row-reverse'}}
                                                    >
                                                        {purpose.length > 30 ? (purpose.slice(0, 27) + '...') : purpose}
                                                    </Button>
                                                );
                                            })}
                                            {obj.purpose.length > 0 ? (
                                                <View style={{...styles.column, padding: 0, marginLeft: -8}}>
                                                    <IconButton
                                                      icon="plus"
                                                      onPress={() => {}}
                                                    />
                                                </View>
                                            ) : (
                                                <Button
                                                  mode="text"
                                                  icon="plus"
                                                  onPress={() => {}}
                                                  style={{alignItems: 'flex-start'}}
                                                >
                                                    Add purpose
                                                </Button>
                                            )}
                                        </View>
                                    ) : (
                                        <Text style={{fontSize: 16}}>{obj.purpose.join(", ")}</Text>
                                    )}
                                </>
                              }
                              style={{paddingLeft: 16}}
                            />
                            <List.Item
                              title="Side effect(s)"
                              titleStyle={{fontSize: 14, opacity: .6}}
                              description={() =>
                                <>
                                    {profileEditing ? (
                                        <Button
                                          mode="text"
                                          icon="plus"
                                          onPress={() => {}}
                                          style={{alignItems: 'flex-start'}}
                                        >
                                            Add symptom
                                        </Button>
                                    ) : (
                                        null
                                    )}
                                </>
                              }
                              style={{paddingLeft: 16}}
                            />
                            {(profileEditing && obj.purpose.length > 0) ? (
                                <>
                                    <View
                                      style={{
                                        ...styles.row,
                                        alignItems: 'center',
                                        alignContent: 'space-between',
                                        marginLeft: 32,
                                        marginBottom: 16,
                                      }}
                                    >
                                        <Button
                                          mode="contained"
                                          onPress={() => {
                                            navigation.navigate('EvaluateTreatment', {
                                                treatment: {
                                                    name: treatmentName,
                                                    purposes: obj.purpose
                                                },
                                                name: 'Evaluate ' + treatmentName
                                            })
                                          }}
                                          style={{alignItems: 'flex-start'}}
                                        >
                                            Evaluate {treatmentName}
                                        </Button>
                                    </View>
                                </>
                            ) :  (
                                null
                            )}
                            {i < (treatments.length - 1) ? (
                                <Divider style={{marginHorizontal: 16}}/>
                            ) : (
                                null
                            )}
                        </List.Accordion>
                    );
                })}
            </List.AccordionGroup>
        </>
    );
}


export default function UserTabs({ user, navigation, profileEditing }) {
    return (
        <TabsProvider defaultIndex={0}>
            <Tabs
              uppercase={false}
              showTextLabel={true}
              mode="fixed"
              showLeadingSpace={false}
            >
                <TabScreen label="Profile">
                    <View style={{flex: 1, paddingTop: 16}}>
                        {ProfileTab({user})}
                    </View>
                </TabScreen>
                <TabScreen label="Conditions">
                    <View style={{flex: 1, paddingTop: 16}}>
                        {ConditionsTab(user.conditions, profileEditing)}
                    </View>
                </TabScreen>
                <TabScreen label="Symptoms">
                    <View style={{flex: 1, paddingTop: 16}}>
                        {SymptomsTab(user.symptoms, profileEditing, user.username)}
                    </View>
                </TabScreen>
                <TabScreen label="Treatments">
                    <View style={{flex: 1, paddingTop: 16}}>
                        {TreatmentsTab(user.treatments, profileEditing, navigation)}
                    </View>
                </TabScreen>
            </Tabs>
        </TabsProvider>
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
        paddingLeft: 16,
        paddingRight: 16,
    },
});