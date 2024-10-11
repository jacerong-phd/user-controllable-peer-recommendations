import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {
    Text,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';

import {
    PHONE_HEIGHT,
    PHONE_WIDTH,
    PHONE_THICKNESS,
} from '@utils/constants';


export default function DeviceMockup({ theme, children }) {
    const [date, setDate] = useState(dayjs());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(dayjs());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.phone}>
            <View style={styles.brove} />
            <View style={[styles.button, styles.volumeButton, styles.volumeButtonUp]} />
            <View style={[styles.button, styles.volumeButton, styles.volumeButtonDown]} />
            <View style={[styles.button, styles.powerButton]} />
            <View style={{...styles.screen, backgroundColor: theme.colors.background}}>
                <View style={styles.statusBar}>
                    <View style={styles.phoneTime}>
                        <Text
                          style={{
                            color: theme.colors.onBackground,
                            fontWeight: 'bold',
                          }}
                        >
                            {date.format("HH:mm")}
                        </Text>
                    </View>
                    <View style={{flex: 4}} />
                    <View style={styles.phoneIcons}>
                        <MaterialCommunityIcons
                          name="signal-cellular-3"
                          size={16}
                          style={{color: theme.colors.onBackground}}
                        />
                        <MaterialCommunityIcons
                          name="wifi"
                          size={16}
                          style={{color: theme.colors.onBackground, marginHorizontal: 4}}
                        />
                        <MaterialCommunityIcons
                          name="battery"
                          size={16}
                          style={{color: theme.colors.onBackground, transform: [{rotate: '90deg'}]}}
                        />
                    </View>
                </View>
                {children}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    phone: {
        width: PHONE_WIDTH,
        height: PHONE_HEIGHT,
        backgroundColor: '#1F2937',
        borderColor: '#1F2937',
        borderWidth: PHONE_THICKNESS,
        borderRadius: 40,
        marginVertical: 'auto',
        marginHorizontal: 'auto',
        position: 'relative',
    },
    brove: {
        width: Math.ceil(PHONE_WIDTH * .4),
        height: 20,
        backgroundColor: '#1F2937',
        position: 'absolute',
        borderBottomLeftRadius: 16,
        marginHorizontal: '30%',
        borderBottomRightRadius: 16,
        top: 0,
        zIndex: 2,
    },
    button: {
        width: 4,
        backgroundColor: '#1F2937',
        position: 'absolute',
    },
    volumeButton: {
        height: Math.ceil(PHONE_HEIGHT * .070),
        left: -(PHONE_THICKNESS + 4),
        borderStartStartRadius: 8,
        borderEndStartRadius: 8,
    },
    volumeButtonUp: {
        top: Math.ceil(PHONE_HEIGHT * .268),
    },
    volumeButtonDown: {
        top: Math.ceil(PHONE_HEIGHT * .373),
    },
    powerButton: {
        height: Math.ceil(PHONE_HEIGHT * .1056),
        top: Math.ceil(PHONE_HEIGHT * .303),
        right: -(PHONE_THICKNESS + 4),
        borderStartEndRadius: 8,
        borderEndEndRadius: 8,
    },
    screen: {
        height: '100%',
        borderRadius: 32,
        overflow: 'hidden',
    },
    statusBar: {
        display: 'flex',
        flexDirection: 'row',
        height: 34,
    },
    phoneTime: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneIcons: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
    },
});