import React, {useEffect, useState} from 'react';
import {
    Animated,
    StyleSheet,
    View,
} from 'react-native';
import {
    Avatar,
    Button,
    Divider,
    IconButton,
    List,
    Text,
    useTheme,
} from 'react-native-paper';
import {
    Tabs,
    TabScreen,
    TabsProvider,
} from 'react-native-paper-tabs';
import Icon from 'react-native-paper/src/components/Icon';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


import CustomActivityIndicator from '@components/custom-activity-indicator';
import { ApiClient } from '@utils/axios-api-instance';
import { DATE_TIME_FORMAT } from '@utils/constants';


dayjs.extend(relativeTime);


function CommunityFeed({ messages, navigation }) {
    const theme = useTheme();

    const now = dayjs();

    /*
     * Pagination
     */
    const itemsPerPage = 5;
    const totalPages = Math.ceil(messages.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const endIndex = currentPage * itemsPerPage;

    const feed = messages.slice(0, endIndex);

    const showMorePosts = () => {
        setCurrentPage(currentPage + 1);
    }

    const replyActions = [
        {icon: 'thumb-up-outline', label: 'Like', justifyContent: 'flex-start'},
        {icon: 'comment-outline', label: 'Comment', justifyContent: 'center'},
        {icon: 'repeat-variant', label: 'Repost', justifyContent: 'flex-end'},
    ];

    return (
        <View style={{paddingBottom: 20}}>
            {feed.map((message, i) => {
                const user = message.person;

                const publicationDate = dayjs(message.datetime, DATE_TIME_FORMAT);
                let relativeTime = now.from(publicationDate, true);
                relativeTime = relativeTime.charAt(0).toUpperCase() + 
                    relativeTime.substring(1).toLowerCase();

                return (
                    <View
                      key={i}
                      style={styles.message}
                    >
                        <List.Item
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
                          right={(props) =>
                            <>
                                <IconButton
                                  icon="dots-vertical"
                                  onPress={() => {}}
                                  {...props}
                                />
                            </>
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
                          style={styles.messageHeader}
                        />
                        <Text style={styles.messageContent}>
                            {message.message}
                        </Text>
                        <View style={styles.messageActions}>
                            {replyActions.map((action, j) => {
                                const color = theme.colors.onSurfaceVariant;
                                return (
                                    <View key={j} style={{...styles.column, justifyContent: action.justifyContent}}>
                                        <Icon source={action.icon} size={18.75} color={color} />
                                        <Text variant="bodySmall" style={{color: color, paddingLeft: 4}}>
                                            {action.label}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                        <Divider style={styles.messageDivider} />
                    </View>
                );
            })}
            {(currentPage < totalPages) ? (
                <Button
                  mode="text"
                  onPress={showMorePosts}
                  style={{alignSelf: 'center', paddingTop: 20}}
                >
                    Show more posts
                </Button>
            ) : (
                null
            )}
        </View>
    );
}


export default function HomeScreen({ route, navigation, scrollY }) {
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const endpoint = `community/feed`;

            try {
                const response = await ApiClient().get(endpoint);
                setMessages(response);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

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
            <View style={{height: 64}} />
            <TabsProvider defaultIndex={0}>
                <Tabs
                  uppercase={false}
                  showTextLabel={true}
                  mode="fixed"
                  showLeadingSpace={false}
                >
                    <TabScreen label="Community">
                        <View style={{flex: 1}}>
                            {isLoading ? (
                                <CustomActivityIndicator
                                  text="Fetching data..."
                                  spinnerSize="large"
                                />
                            ) : (
                                <CommunityFeed messages={messages} navigation={navigation} />
                            )}
                        </View>
                    </TabScreen>
                    <TabScreen label="Connections">
                        <View
                          style={{
                            flex: 1,
                            marginHorizontal: 16,
                            paddingHorizontal: 16,
                            justifyContent: 'center',
                          }}
                        >
                            <Text variant="headlineLarge" style={{textAlign: 'center', marginBottom: 8}}>
                                No one on your connection list
                            </Text>
                            <Text
                              variant="bodyLarge"
                              style={{textAlign: 'center', opacity: .6, marginBottom: 32}}
                            >
                                Connect with others in the community and keep up to date with their activities.
                            </Text>
                            <Button
                              mode="contained"
                              onPress={() => {
                                return navigation.push('AppNavigation', {screen: 'Connect'});
                              }}
                              style={{alignSelf: 'center'}}
                            >
                                Find people like you
                            </Button>
                        </View>
                    </TabScreen>
                </Tabs>
            </TabsProvider>
        </Animated.ScrollView>
    );
}


const styles = StyleSheet.create({
    message: {
        paddingTop: 6,
    },
    messageHeader: {
        paddingRight: 16,
        paddingVertical: 0,
    },
    messageContent: {
        fontSize: 14,
        paddingLeft: 72,
        paddingRight: 16,
        paddingTop: 2,
    },
    messageDivider: {
        marginTop: 12,
        opacity: .4,
    },
    messageActions: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: 12,
        marginLeft: 72,
        marginRight: 16,
    },
    column: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});