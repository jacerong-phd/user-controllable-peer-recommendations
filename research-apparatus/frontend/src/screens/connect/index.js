import React, {useContext, useEffect, useState} from 'react';
import {
    Animated,
    StyleSheet,
    View,
} from 'react-native';
import {
    Button,
    Card,
    Text,
} from 'react-native-paper';

import CustomActivityIndicator from '@components/custom-activity-indicator';
import PeerRecommendations from '@components/peer-recommendations';
import TotalConnections from '@components/total-connections';
import { ApiClient } from '@utils/axios-api-instance';
import {
    connectRequestExists,
    isRecommendationDiscarded,
} from '@utils/connect';
import { MATCHING_CRITERIA } from '@utils/constants';
import { GlobalState } from '@utils/global-state';
import { sessionStorage } from '@utils/storage';


function RecommendationList({ recommendations, navigation }) {
    if (recommendations === null || recommendations === undefined) return;

    recommendations = recommendations.filter(function (x) {
        return (!connectRequestExists(x.id) && !isRecommendationDiscarded(x.id));
    });

    recommendations = recommendations.length > 20 ? recommendations.slice(0, 20) : recommendations;

    /*
     * Pagination
     */
    const itemsPerPage = 5;
    const totalPages = Math.ceil(recommendations.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const endIndex = currentPage * itemsPerPage;

    const peers = recommendations.slice(0, endIndex);

    const showMoreResults = () => {
        setCurrentPage(currentPage + 1);
    }

    return(
        <View style={{paddingVertical: 8}}>
            <PeerRecommendations
              key={new Date().getTime()}
              recommendations={peers}
              navigation={navigation}
            />
            {(currentPage < totalPages) ? (
                <View style={{...styles.row, marginVertical: 16}}>
                    <View style={styles.column}>
                        <Button
                          mode="text"
                          icon="chevron-down"
                          onPress={showMoreResults}
                          contentStyle={{
                            flexDirection: 'row-reverse'
                          }}
                          style={{flex: 1}}
                        >
                            More suggestions
                        </Button>
                    </View>
                </View>
            ) : (
                null
            )}
        </View>
    );
}


export default function ConnectScreen({ route, navigation, scrollY }) {
    const loggedInUserId = sessionStorage.getNumber('userId');

    let hasRecommPreferences = sessionStorage.contains('recommPreferences');

    const { recommEngine, userControl } = useContext(GlobalState);

    if (!hasRecommPreferences && !userControl) {
        const keys = MATCHING_CRITERIA[recommEngine].map(obj => obj.key);

        const preferences = {};
        for (const key of keys) {
            preferences[key] = 1;
        }

        sessionStorage.set('recommPreferences', JSON.stringify(preferences));
        hasRecommPreferences = true;
    }

    const recommPreferences = hasRecommPreferences
        ? JSON.parse(sessionStorage.getString('recommPreferences'))
        : null;

    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            let endpoints = [`/people/${loggedInUserId}`];

            if (hasRecommPreferences) {
                endpoints.push(`/people/${loggedInUserId}/peer-recommendations/${recommEngine}`);
            }

            try {
                const responses = await Promise
                    .all(endpoints.map((endpoint, index) => {
                        if (index === 0) return ApiClient().get(endpoint);
                        else return ApiClient().get(endpoint, {params: recommPreferences});
                    }));

                responses.forEach((resp, i) => {
                    if (i === 0) setUser(resp);
                    else setRecommendations(resp);
                })

                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <Animated.ScrollView
          scrollEventThrottle={16}
          automaticallyAdjustContentInsets
          onScroll={e => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        >
            {isLoading ? (
                <CustomActivityIndicator
                  text="Fetching data..."
                  spinnerSize="large"
                />
            ) : (
                <View style={{paddingTop: 64}}>
                    <View style={styles.totalConnections}>
                        <TotalConnections user={user} navigation={navigation} />
                    </View>
                    <View
                      style={{...styles.row, alignItems: 'center', paddingVertical: 8, marginTop: 8}}
                    >
                        <View style={styles.column}>
                            <Text variant="bodyLarge">Invitations</Text>
                        </View>
                        <View style={{...styles.column, justifyContent: 'flex-end'}}>
                            <Button
                              mode="text"
                              onPress={() => navigation.push('Invitations')}
                              labelStyle={{marginVertical: 0}}
                            >
                                See all
                            </Button>
                        </View>
                    </View>
                    {hasRecommPreferences ? (
                        <View>
                            <View style={{...styles.row, alignItems: 'center', marginTop: 8, paddingVertical: 12}}>
                                <View style={styles.column}>
                                    <Text
                                      variant="titleMedium"
                                      style={{fontWeight: 'bold'}}
                                    >
                                        People like you
                                    </Text>
                                </View>
                                <View style={{...styles.column, justifyContent: 'flex-end'}}>
                                    <Button
                                      mode="contained"
                                      disabled={!userControl}
                                      onPress={() => navigation.push('AdjustPreferences')}
                                    >
                                        Adjust preferences
                                    </Button>
                                </View>
                            </View>
                            <RecommendationList
                              recommendations={recommendations}
                              navigation={navigation}
                            />
                        </View>
                    ) : (
                        <Card style={{marginHorizontal: 16, marginTop: 16}}>
                            <Card.Cover source={require('@assets/images/similarity.jpg')} />
                            <Card.Title title="People like you" titleVariant="titleLarge" />
                            <Card.Content>
                                <Text>
                                    To help you connect with others in the community, tell us what things in common you find important.
                                </Text>
                            </Card.Content>
                            <Card.Actions style={{paddingTop: 24}}>
                                <Button
                                  mode="contained"
                                  onPress={() => navigation.push('AdjustPreferences', {name: 'Set Preferences'})}
                                  style={{flex: 1}}
                                >
                                    Set preferences
                                </Button>
                            </Card.Actions>
                        </Card>
                    )}
                </View>
            )}
        </Animated.ScrollView>
    );
}


const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
    },
    column: {
        flex: 1,
        flexDirection: 'row',
    },
    totalConnections: {
        paddingVertical: 8,
        marginVertical: 8
    },
});