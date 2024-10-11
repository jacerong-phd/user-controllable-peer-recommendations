import * as React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import {
    Avatar,
    Button,
    IconButton,
    Menu,
    Text,
    useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ConnectMenu } from '@components/connect-menu';
import TotalConnections from '@components/total-connections';


export default function UserCard({ user, navigation, profileEditing }) {
    const theme = useTheme();

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View style={{marginBottom: 32, paddingTop: 16}}>
            {profileEditing ? (
                <View style={styles.row}>
                    <View
                      style={{...styles.column, justifyContent: 'flex-end', paddingRight: 16}}>
                        <IconButton
                          icon="cog"
                          mode="outlined"
                          size={20}
                          style={{margin: 0}}
                          onPress={() => {}}
                        />
                    </View>
                </View>
            ) : (
                null
            )}
            <View style={styles.row}>
                <View style={styles.column}>
                    {profileEditing === true ? (
                        <Avatar.Icon size={98} icon="account" style={{marginTop: -36}} />
                    ) : (
                        <Avatar.Text
                          size={98}
                          label={user.username.charAt(0).toUpperCase()}
                        />
                    )}
                </View>
            </View>
            <View style={styles.row}>
                <View style={{...styles.column, paddingTop: 16}}>
                    <Text variant="headlineMedium" style={{textAlign: 'center'}}>
                        {user.username}
                    </Text>
                </View>
            </View>
            {('location' in user)
              && typeof user.location === 'string'
              && user.location.length > 0 ? (
                <View style={styles.row}>
                    <View style={{...styles.column, alignItems: 'center', paddingTop: 4}}>
                        <MaterialCommunityIcons
                          name="map-marker-outline"
                          size={16}
                          style={{color: theme.colors.onBackground, opacity: .6, marginRight: 4}}
                        />
                        <Text variant="titleMedium" style={{opacity: .6}}>
                            {user.location}
                        </Text>
                    </View>
                </View>
            ) : (
                null
            )}
            <View style={styles.totalConnections}>
                <TotalConnections user={user} navigation={navigation} />
            </View>
            <View style={styles.row}>
                <View style={{...styles.column, alignItems: 'center', paddingTop: 24}}>
                    {profileEditing ? (
                        <Button mode="outlined" onPress={() => {}}>
                            Edit profile
                        </Button>
                    ) : user.connectedToLoggedInUser ? (
                        <>
                            <Button mode="outlined" onPress={() => {}} style={{marginRight: 8}}>
                                Message
                            </Button>
                            <Menu
                              visible={visible}
                              onDismiss={closeMenu}
                              anchor={
                                <IconButton
                                  mode="outlined"
                                  icon="dots-vertical"
                                  iconColor={theme.colors.primary}
                                  size={20}
                                  onPress={openMenu}
                                />
                              }
                              anchorPosition="bottom"
                            >
                                <Menu.Item
                                  title="Remove connection"
                                  leadingIcon="account-remove"
                                  onPress={() => {}}
                                />
                            </Menu>
                        </>
                    ) : (
                        <ConnectMenu user={user} />
                    )}
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16
    },
    column: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'center',
    },
    totalConnections: {
        paddingTop: 16,
    },
});