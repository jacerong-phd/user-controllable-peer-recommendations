import React, {useEffect, useState} from 'react';
import { ScrollView, View } from 'react-native';
import {
    Avatar,
    Button,
    IconButton,
    List,
    Menu,
    useTheme,
} from 'react-native-paper';

import { ConnectMenu } from '@components/connect-menu';
import CustomActivityIndicator from '@components/custom-activity-indicator';
import { ApiClient } from '@utils/axios-api-instance';
import { sessionStorage } from '@utils/storage';


export default function ConnectionsScreen({ route, navigation }) {
    const theme = useTheme();

    const { userId } = route.params;

    const loggedInUserId = sessionStorage.getNumber('userId');
    const profileEditing = userId === loggedInUserId;

    const [isLoading, setIsLoading] = useState(true);

    const [connections, setConnections] = useState(null);
    const [loggedInUserConnections, setloggedInUserConnections] = useState(null);

    const [menuVisibility, setMenuVisibility] = React.useState(null);
    const switchMenuVisibility = (index, action) => setMenuVisibility(
        menuVisibility.map((visibility, i) => {
            if (index == i) return (action == 'open' ? true : false);
            else return visibility;
        })
    );

    useEffect(() => {
        const fetchData = async () => {
            const endpoints = [
                `/people/${userId}/connections`,
                `/people/${loggedInUserId}/connections`,
            ];
            try {
                const [_connections, _loggedInUserConnections] = await Promise
                    .all(endpoints.map((endpoint) => ApiClient().get(endpoint)));

                setConnections(_connections);
                setloggedInUserConnections(
                    _loggedInUserConnections.map((user) => user.id)
                );

                setMenuVisibility(_connections.map(() => false));

                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

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
                <List.Section>
                    {connections.map((user, i) => {
                        if (!profileEditing && user.id == loggedInUserId) return;

                        return (
                            <List.Item
                              title={user.username}
                              descriptionStyle={{opacity: .6}}
                              titleNumberOfLines={1}
                              key={i}
                              left={(props) =>
                                <Avatar.Text
                                  size={40}
                                  label={user.username.charAt(0).toUpperCase()}
                                  labelStyle={{color: theme.colors.onPrimary}}
                                  {...props}
                                />
                              }
                              right={(props) =>
                                <>
                                    {(profileEditing
                                      || loggedInUserConnections.includes(user.id)) ? (
                                        <>
                                            <Button
                                              mode="outlined"
                                              onPress={() => {}}
                                              style={{marginLeft: 12}}
                                              {...props}
                                            >
                                                Message
                                            </Button>
                                            <Menu
                                              visible={menuVisibility[i]}
                                              onDismiss={() =>
                                                switchMenuVisibility(i, 'close')
                                              }
                                              anchor={
                                                <IconButton
                                                  icon="dots-vertical"
                                                  onPress={() =>
                                                    switchMenuVisibility(i, 'open')
                                                }
                                                />
                                              }
                                              anchorPosition="bottom"
                                              {...props}
                                            >
                                                <Menu.Item
                                                  title="Remove connection"
                                                  leadingIcon="account-remove"
                                                  onPress={() => {}}
                                                />
                                            </Menu>
                                        </>
                                    ) : (
                                        <ConnectMenu user={user} bottomTabs={false} />
                                    )}
                                </>
                              }
                              onPress={() => {
                                navigation.push('AppNavigation', {
                                  screen: 'User',
                                  params: {
                                    userId: user.id,
                                    name: user.username,
                                  }
                                });
                              }}
                              style={{paddingRight: 16}}
                            />
                        );
                    })}
                </List.Section>
            )}
        </ScrollView>
    );
}