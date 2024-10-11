import React, { useContext } from 'react';
import {
    ScrollView,
    View
} from 'react-native';
import {
    Avatar,
    List,
    Text,
    useTheme,
} from 'react-native-paper';
import {
    Tabs,
    TabScreen,
    TabsProvider,
} from 'react-native-paper-tabs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { GlobalState } from '@utils/global-state';


dayjs.extend(relativeTime);


export default function InvitationsScreen({ route, navigation }) {
    const theme = useTheme();

    const { connectRequests } = useContext(GlobalState);

    const now = dayjs();

    return (
        <ScrollView
          style={{
            backgroundColor: theme.colors.background,
            flex: 1
          }}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        >
            <TabsProvider defaultIndex={0}>
                <Tabs
                  uppercase={false}
                  showTextLabel={true}
                  mode="fixed"
                  showLeadingSpace={false}
                >
                    <TabScreen label="Received">
                        <View
                          style={{
                            flex: 1,
                            marginHorizontal: 16,
                            paddingHorizontal: 16,
                            justifyContent: 'center',
                          }}
                        >
                            <Text variant="headlineLarge" style={{textAlign: 'center', marginBottom: 8}}>
                                No invitations received
                            </Text>
                            <Text
                              variant="bodyLarge"
                              style={{textAlign: 'center', opacity: .6}}
                            >
                                Here, you can find all connection requests sent to you by other community members.
                            </Text>
                        </View>
                    </TabScreen>
                    <TabScreen label="Sent">
                        <View style={{flex: 1, paddingTop: (connectRequests.length > 0) ? 16 : 0}}>
                            {connectRequests.reverse().map((request, i) => {
                                const user = request.user;

                                let relativeTime = now.from(request.date, true);
                                relativeTime = relativeTime.charAt(0).toUpperCase() + relativeTime.substring(1).toLowerCase();

                                return (
                                    <List.Item
                                      key={i}
                                      title={user.username}
                                      description={
                                        <>
                                            <View style={{display: 'flex'}}>
                                                <Text style={{opacity: .6}}>
                                                    {relativeTime} ago
                                                </Text>
                                            </View>
                                        </>
                                      }
                                      left={(props) =>
                                        <Avatar.Text
                                          size={40}
                                          label={user.username.charAt(0).toUpperCase()}
                                          labelStyle={{color: theme.colors.onPrimary}}
                                          {...props}
                                        />
                                      }
                                      onPress={() => {
                                        return navigation.push('AppNavigation', {
                                            screen: 'User',
                                            params: {
                                                userId: user.id,
                                                name: user.username
                                            }
                                        });
                                      }}
                                    />
                                );
                            })}
                            {(connectRequests.length === 0) ? (
                                <View
                                  style={{
                                    flex: 1,
                                    marginHorizontal: 16,
                                    paddingHorizontal: 16,
                                    justifyContent: 'center',
                                  }}
                                >
                                    <Text variant="headlineLarge" style={{textAlign: 'center', marginBottom: 8}}>
                                        No invitations sent
                                    </Text>
                                    <Text
                                      variant="bodyLarge"
                                      style={{textAlign: 'center', opacity: .6}}
                                    >
                                        View all connection requests you've sent that are awaiting approval.
                                    </Text>
                                </View>
                            ) : (
                                null
                            )}
                        </View>
                    </TabScreen>
                </Tabs>
            </TabsProvider>
        </ScrollView>
    );
}