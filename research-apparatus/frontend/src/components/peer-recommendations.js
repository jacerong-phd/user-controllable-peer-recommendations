import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import {
    Avatar,
    Card,
    Divider,
    IconButton,
    List,
    Text,
    useTheme,
} from 'react-native-paper';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import rgbHex from 'rgb-hex';

import FusionCharts from "fusioncharts";
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFusioncharts from 'react-fusioncharts';

import { round } from '@utils/';
import { sessionStorage } from '@utils/storage';


// Resolves charts dependancy
Widgets(FusionCharts);


export default function PeerRecommendations({ recommendations, navigation }) {
    const theme = useTheme();

    const [expanded, setExpanded] = React.useState(recommendations.map(() => false));

    const updateExpanded = (index, newValue) => {
        setExpanded(expanded.map((value, i) => {
            if (index === i) return newValue;
            else return false;
        }));
    };

    const scoreToLevel = (score) => {
        let level;

        if (score < 4) level = 'Low';
        else if (4 <= score && score < 8) level = 'Moderate';
        else level = 'High';

        return level;
    };

    const simTerm = {noun: 'Similarity', adjective: 'similar'};

    const showPopover = !sessionStorage.contains('showPopover');

    const dropdown = useRef();
    const [popoverVisibility, setPopoverVisibility] = useState(showPopover);

    const closePopover = () => {
        sessionStorage.set('showPopover', false);
        setPopoverVisibility(false);
    }

    return (
        <>
            {recommendations.map((user, i) => {
                const [titleColor, icon] = expanded[i]
                    ? [theme.colors.primary, 'chevron-up']
                    : [theme.colors.onBackground, 'chevron-down'];

                let lastType = null;
                let commonAttributes = null;
                for (let j = 0; j < user.common_attributes.length; j++) {
                    const type = user.common_attributes[j].type;
                    const parentType = type.split('/')[0];

                    let attr = user.common_attributes[j].attribute;
                    attr = (type == "demographics/location") ? attr : attr.toLowerCase();

                    const sep = (lastType === null || lastType === parentType) ? ',' : ';';
                    lastType = parentType;

                    commonAttributes = (j === 0) ? attr : `${commonAttributes}${sep} ${attr}`;
                }

                const similarityScore = round((user.interpersonal_similarity * 10), 1);
                const similarityLevel = scoreToLevel(similarityScore);

                const chartHeight = 140;

                /*
                 * Sequential Color Palette.
                 * Source 1: <https://www.heavy.ai/blog/12-color-palettes-for-telling-better-stories-with-your-data>
                 * Source 2: <https://chartio.com/learn/charts/how-to-choose-colors-data-visualization/>
                 */

                const dataSource = {
                    chart: {
                        theme: "fusion",
                        lowerLimit: "0",
                        upperLimit: "10",
                        showValue: "0",
                        gaugeFillMix: "",
                        showGaugeBorder: "0",
                        bgColor: rgbHex(theme.colors.elevation.level1),
                        bgAlpha: "100",
                        borderThickness: "0",
                        adjustTM: "1",
                        minorTMNumber: "1",
                        majorTMNumber: "6",
                        majorTMColor: rgbHex(theme.colors.onBackground),
                        minorTMColor: rgbHex(theme.colors.onBackground),
                        minorTMAlpha: "60",
                        labelFontColor: rgbHex(theme.colors.onBackground),
                        labelFontSize: "11",
                        baseFontSize: "11",
                        baseFontColor: rgbHex(theme.colors.background),
                    },
                    colorrange: {
                        color: [
                            {
                                minvalue: "0",
                                maxvalue: "4",
                                label: "Low",
                                code: "#9f82ce",
                            },
                            {
                                minvalue: "4",
                                maxvalue: "8",
                                label: "Moderate",
                                code: "#826dba",
                            },
                            {
                                minvalue: "8",
                                maxvalue: "10",
                                label: "High",
                                code: "#63589f",
                            },
                        ]
                    },
                    pointers: {
                        pointer: [
                            {
                                value: similarityScore.toString(),
                                bgColor: "#FF7477",
                                borderColor: "#FF7477",
                                borderThickness: "2",
                            }
                        ]
                    },
                };

                return (
                    <View key={i}>
                        <List.Item
                          title={user.username}
                          description={
                            <>
                                <View style={{display: 'flex'}}>
                                    <Text style={{opacity: .6}}>
                                        {user.gender} · {user.age}
                                    </Text>
                                </View>
                                <View style={{display: 'flex'}}>
                                    <Text
                                      numberOfLines={1}
                                      ellipsizeMode="head"
                                      style={{color: theme.colors.secondary, fontWeight: 'bold'}}
                                    >
                                        {`${similarityLevel}ly ${simTerm.adjective}`}
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
                                {(i === 0) ? (
                                    <>
                                        <IconButton
                                          ref={dropdown}
                                          icon={icon}
                                          onPress={() => updateExpanded(i, !expanded[i])}
                                          {...props}
                                        />
                                        <Popover
                                          from={dropdown}
                                          isVisible={popoverVisibility}
                                          onRequestClose={closePopover}
                                          placement={PopoverPlacement.LEFT}
                                          popoverStyle={{
                                            backgroundColor: theme.colors.elevation.level3,
                                            paddingHorizontal: 4,
                                            paddingVertical: 4,
                                            width: 120,
                                          }}
                                          offset={-10}
                                        >
                                            <Text
                                              variant="bodyMedium"
                                              style={{color: theme.colors.onBackground}}
                                            >
                                                Tap to see how similar you are to others in the community.
                                            </Text>
                                        </Popover>
                                    </>
                                ) : (
                                    <IconButton
                                      icon={icon}
                                      onPress={() => updateExpanded(i, !expanded[i])}
                                      {...props}
                                    />
                                )}
                            </>
                          }
                          onPress={() => {
                            const params = { userId: user.id, name: user.username };
                            if (!popoverVisibility)
                                return navigation.push('AppNavigation', { screen: 'User', params: params });
                            return;
                          }}
                          titleStyle={{color: titleColor}}
                        />
                        {expanded[i] ? (
                            <Card style={{marginLeft: 72, marginRight: 24}}>
                                <Card.Title
                                  title={`${simTerm.noun} between you and ${user.username}`}
                                  titleVariant="titleLarge"
                                  titleNumberOfLines={2}
                                  style={{paddingTop: 16}}
                                />
                                <Card.Content>
                                    <View style={{flexDirection: 'column'}}>
                                        <View style={{flex: 1}}>
                                            <ReactFusioncharts
                                              type="hlineargauge"
                                              width="100%"
                                              height={chartHeight}
                                              dataFormat="JSON"
                                              dataSource={dataSource}
                                            />
                                            <View
                                              style={{
                                                height: (chartHeight + 2),
                                                borderWidth: 4,
                                                borderColor: theme.colors.elevation.level1,
                                                top: -(chartHeight + 1),
                                                right: '1%',
                                                width: '102%'
                                              }}
                                            />
                                            <View
                                              style={{
                                                height: 25,
                                                backgroundColor: theme.colors.elevation.level1,
                                                marginTop: -(chartHeight + 35),
                                                marginHorizontal: 1,
                                              }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: -24}}>
                                        <View style={{flex: 1}}>
                                            <List.Item
                                              title={`Score of ${simTerm.noun.toLowerCase()}`}
                                              description={`${similarityScore.toString()} out of 10`}
                                              titleStyle={{fontSize: 14, opacity: .6}}
                                              descriptionStyle={{fontSize: 14}}
                                              style={{marginLeft: -16, paddingRight: 0}}
                                            />
                                        </View>
                                        <View style={{flex: 1}}>
                                            <List.Item
                                              title={`Level of ${simTerm.noun.toLowerCase()}`}
                                              description={`${similarityLevel}`}
                                              titleStyle={{fontSize: 14, opacity: .6, textAlign: 'right'}}
                                              descriptionStyle={{fontSize: 14, textAlign: 'right'}}
                                              style={{marginLeft: -16, paddingRight: 0}}
                                            />
                                        </View>
                                    </View>
                                    <>
                                        <Divider style={{marginTop: 8, marginBottom: 16}} />
                                        <Text variant="titleMedium">Common attributes</Text>
                                        <Text variant="bodyMedium" style={{marginTop: 8}}>
                                            {(commonAttributes !== null && commonAttributes.length > 0) ? commonAttributes : '(none)'}
                                        </Text>
                                    </>
                                </Card.Content>
                            </Card>
                        ) : (
                            null
                        )}
                  </View>
                );
            })}
        </>
    );
};