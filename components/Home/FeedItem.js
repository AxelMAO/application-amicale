import * as React from 'react';
import {Avatar, Button, Card, withTheme} from 'react-native-paper';
import {View} from "react-native";
import Autolink from "react-native-autolink";
import i18n from "i18n-js";
import ImageModal from 'react-native-image-modal';

const ICON_AMICALE = require('../../assets/amicale.png');

/**
 * Gets the amicale INSAT logo
 *
 * @return {*}
 */
function getAvatar() {
    return (
        <Avatar.Image size={48} source={ICON_AMICALE}
                      style={{backgroundColor: 'transparent'}}/>
    );
}

/**
 * Component used to display a feed item
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function FeedItem(props) {
    const {colors} = props.theme;
    return (
        <Card style={{margin: 10}}>
            <Card.Title
                title={props.title}
                subtitle={props.subtitle}
                left={getAvatar}
            />
            {props.full_picture !== '' && props.full_picture !== undefined ?
                <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <ImageModal
                        resizeMode="contain"
                        imageBackgroundColor={colors.background}
                        style={{
                            width: 250,
                            height: 250,
                        }}
                        source={{
                            uri: props.full_picture,
                        }}
                    /></View> : <View/>}
            <Card.Content>
                {props.message !== undefined ?
                    <Autolink
                        text={props.message}
                        hashtag="facebook"
                        style={{color: colors.text}}
                    /> : <View/>
                }
            </Card.Content>
            <Card.Actions>
                <Button
                    color={'#57aeff'}
                    onPress={props.onOutLinkPress}
                    icon={'facebook'}>
                    {i18n.t('homeScreen.dashboard.seeMore')}
                </Button>
            </Card.Actions>
        </Card>
    );
}

export default withTheme(FeedItem);
