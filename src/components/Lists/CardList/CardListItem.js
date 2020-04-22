// @flow

import * as React from 'react';
import {Text, TouchableRipple} from 'react-native-paper';
import {Image, View} from 'react-native';
import type {cardItem} from "./CardList";

type Props = {
    item: cardItem,
}

export default class CardListItem extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const props = this.props;
        const item = props.item;
        const source = typeof item.image === "number"
            ? item.image
            : {uri: item.image};
        return (
            <TouchableRipple
                style={{
                    width: 100,
                    height: 150,
                    margin: 5,
                }}
                onPress={item.onPress}
            >
                <View>
                    <Image
                        style={{
                            width: 100,
                            height: 100,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        source={source}
                    />
                    <Text style={{
                        marginTop: 5,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>{item.title}</Text>
                </View>
            </TouchableRipple>
        );
    }
}