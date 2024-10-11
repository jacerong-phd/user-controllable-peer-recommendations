import { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TopAppBar from '@components/top-appbar';
import AppNavigation from '@navigations/app-navigation';
import LoginScreen from '@screens/auth/login';
import ConnectScreen from '@screens/connect';
import AdjustPreferencesScreen from '@screens/connect/adjust-preferences';
import InboxScreen from '@screens/inbox';
import InvitationsScreen from '@screens/invitations';
import ConnectionsScreen from '@screens/user/connections';
import EvaluateTreatmentScreen from '@screens/treatment/evaluate';
import { GlobalState } from '@utils/global-state';


const RootStack = createStackNavigator();


export default function App({ navigation }) {
    const { isSignedIn } = useContext(GlobalState);

    return (
        <RootStack.Navigator>
            {isSignedIn ? (
                <RootStack.Group
                  screenOptions={{
                    header: (props) => <TopAppBar {...props} />,
                  }}
                >
                    <RootStack.Screen
                      name="AppNavigation"
                      component={AppNavigation}
                      options={{
                        headerShown: false,
                      }}
                    />
                    <RootStack.Screen
                      name="Connections"
                      component={ConnectionsScreen}
                      options={({ navigation, route }) => ({
                        title: 'Connections',
                      })}
                    />
                    <RootStack.Screen
                      name="Invitations"
                      component={InvitationsScreen}
                      options={({ navigation, route }) => ({
                        title: 'Invitations',
                      })}
                    />
                    <RootStack.Screen
                      name="EvaluateTreatment"
                      component={EvaluateTreatmentScreen}
                      options={({ navigation, route }) => ({
                        title: 'Evaluate',
                      })}
                    />
                    <RootStack.Screen
                      name="AdjustPreferences"
                      component={AdjustPreferencesScreen}
                      options={({ navigation, route }) => ({
                        title: 'Adjust Preferences',
                      })}
                    />
                    <RootStack.Screen
                      name="PeerRecommendations"
                      component={ConnectScreen}
                      options={({ navigation, route }) => ({
                        title: 'People Like You',
                      })}
                    />
                    <RootStack.Screen
                      name="Inbox"
                      component={InboxScreen}
                      options={({ navigation, route }) => ({
                        title: 'Inbox',
                      })}
                    />
                </RootStack.Group>
            ) : (
                <RootStack.Screen
                  name="SignIn"
                  options={{
                    title: 'Sign In',
                    headerShown: false,
                  }}
                >
                    {(props) => <LoginScreen {...props} />}
                </RootStack.Screen>
            )}
        </RootStack.Navigator>
    );
}
