import * as React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';


export default function CustomActivityIndicator({ text=null, spinnerSize="small" }) {
    return (
        <View
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        >
            {(typeof text === 'string' && text.length > 0) ? (
                <Text>{text}</Text>
            ) : (
                null
            )}
            <ActivityIndicator
              size={spinnerSize}
              style={{ marginTop: 10 }}
            />
        </View>
    );
}