import React from 'react';
import { Appbar, Searchbar } from 'react-native-paper';

import { sessionStorage } from '@utils/storage';


export default function NavigationTopAppbar({ navigation, route, options, back, translateY }) {
    return (
        <Appbar.Header
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%',
            //for animation
            height: 64,
            transform: [{translateY: translateY}],
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            elevation: 4,
            zIndex: 1,
          }}
          elevated={false}
        >
            <Appbar.Action
              isLeading
              icon="account-circle"
              onPress={() => {
                navigation.push('AppNavigation', {
                  screen: 'User',
                  params: {
                    userId: sessionStorage.getNumber('userId'),
                    name: sessionStorage.getString('username'),
                  }
                });
              }}
            />
            <Searchbar
              placeholder="Search"
              onChangeText={() => {}}
            />
            <Appbar.Action
              icon="chat"
              onPress={() => {
                navigation.push('Inbox');
              }}
            />
        </Appbar.Header>
    );
}