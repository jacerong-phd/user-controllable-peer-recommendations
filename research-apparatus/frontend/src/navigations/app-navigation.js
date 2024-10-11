import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TopAppBar from '@components/top-appbar';
import NavigationBottomTabs from '@navigations/navigation-bottom-tabs';
import NavigationTopAppbar from '@navigations/navigation-top-appbar';

import UserScreen from '@screens/user';
import ConnectScreen from '@screens/connect';
import HomeScreen from '@screens/home';
import NotificationsScreen from '@screens/notifications';

import { HEADER_SCROLL_Y, HEADER_TRANSLATE_Y } from '@utils';


const Tab = createBottomTabNavigator();


export default function AppNavigation() {
    return (
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: (props) => <NavigationTopAppbar {...props} translateY={HEADER_TRANSLATE_Y} />,
          }}
          backBehavior="history"
          tabBar={
            /* https://github.com/react-navigation/react-navigation/issues/5230#issuecomment-595846400 */
            props => <NavigationBottomTabs {...props} state={{...props.state, routes: props.state.routes.slice(0,3)}} />
          }
        >
            <Tab.Screen
              name="Home"
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => {
                    return <Icon name="home" size={size} color={color} />;
                },
              }}
            >
                {(props) => <HomeScreen {...props} scrollY={HEADER_SCROLL_Y} />}
            </Tab.Screen>
            <Tab.Screen
              name="Connect"
              options={{
                tabBarLabel: 'Connect',
                tabBarIcon: ({ color, size }) => {
                    return <Icon name="account-group" size={size} color={color} />;
                },
              }}
            >
                {(props) => <ConnectScreen {...props} scrollY={HEADER_SCROLL_Y} />}
            </Tab.Screen>
            <Tab.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                tabBarLabel: 'Notifications',
                tabBarIcon: ({ color, size }) => {
                    return <Icon name="bell" size={size} color={color} />;
                },
              }}
            />
            <Tab.Screen
              name="User"
              component={UserScreen}
              options={{
                header: (props) => <TopAppBar {...props} />,
                tabBarButton: (props) => null,
                tabBarIcon: ({ color, size }) => null,
              }}
            />
        </Tab.Navigator>
    );
}
