import React, {useEffect, useState} from 'react';
import { ScrollView, View } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';

import CustomActivityIndicator from '@components/custom-activity-indicator';
import UserCard from '@components/user-card';
import UserTabs from '@components/user-tabs';
import { ApiClient } from '@utils/axios-api-instance';
import { sessionStorage } from '@utils/storage';


export default function UserScreen({ route, navigation }) {
    const { userId } = route.params;

    const treatmentEval = route.params?.treatmentEval;

    const loggedInUserId = sessionStorage.getNumber('userId');
    const profileEditing = userId === loggedInUserId;

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const endpoints = [
                `/people/${userId}`,
                `/people/${userId}/conditions`,
                `/people/${userId}/symptoms`,
                `/people/${userId}/treatments`,
                `/people/${userId}/connections/${loggedInUserId}`,
            ];

            try {
                const [_user, _conditions, _symptoms, _treatments, _connectedToLoggedInUser] = await Promise
                    .all(endpoints.map((endpoint) => ApiClient().get(endpoint)));

                setUser({
                    ..._user,
                    connectedToLoggedInUser: _connectedToLoggedInUser,
                    conditions: _conditions,
                    symptoms: _symptoms,
                    treatments: _treatments,
                });

                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const [visible, setVisible] = React.useState((typeof treatmentEval !== "undefined"));
    const onDismissSnackBar = () => setVisible(false);

    return (
        <ScrollView
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
                <>
                    <UserCard
                      user={user}
                      navigation={navigation}
                      profileEditing={profileEditing}
                    />
                    <UserTabs
                      user={user}
                      navigation={navigation}
                      profileEditing={profileEditing}
                    />
                    {visible ? (
                        <Portal>
                            <Snackbar
                              visible={visible}
                              action={{
                                label: 'Dismiss',
                              }}
                              duration={5000}
                              onDismiss={onDismissSnackBar}
                              style={{
                                position: 'absolute',
                                bottom: 80,
                                left: 0,
                                right: 0,
                              }}
                            >
                                Your treatment evaluation has been saved.
                            </Snackbar>
                        </Portal>
                    ) : (
                        null
                    )}
                </>
            )}
        </ScrollView>
    );
}