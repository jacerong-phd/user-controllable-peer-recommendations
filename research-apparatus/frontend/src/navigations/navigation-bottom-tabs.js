import React from 'react';

import { CommonActions } from '@react-navigation/native';
import { BottomNavigation } from 'react-native-paper';

export default function NavigationBottomTabs({ navigation, state, descriptors, insets }) {
    const iconSize = 24;

    return (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });
            
            if (event.defaultPrevented) {
                preventDefault();
            } else {
                navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: iconSize });
            }
            
            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            
            const label = options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                    ? options.title
                    : route.title;
                
            return label;
          }}
        />
    );
}