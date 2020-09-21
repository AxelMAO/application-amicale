/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

// @flow

import * as React from 'react';
import {Button, Card, Text, TouchableRipple} from 'react-native-paper';
import {Image, View} from 'react-native';
import Autolink from 'react-native-autolink';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import type {FeedItemType} from '../../screens/Home/HomeScreen';
import NewsSourcesConstants from '../../constants/NewsSourcesConstants';
import type {NewsSourceType} from '../../constants/NewsSourcesConstants';
import ImageGalleryButton from '../Media/ImageGalleryButton';

type PropsType = {
  navigation: StackNavigationProp,
  item: FeedItemType,
  height: number,
};

/**
 * Component used to display a feed item
 */
class FeedItem extends React.Component<PropsType> {
  /**
   * Converts a dateString using Unix Timestamp to a formatted date
   *
   * @param dateString {string} The Unix Timestamp representation of a date
   * @return {string} The formatted output date
   */
  static getFormattedDate(dateString: number): string {
    const date = new Date(dateString * 1000);
    return date.toLocaleString();
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  onPress = () => {
    const {item, navigation} = this.props;
    navigation.navigate('feed-information', {
      data: item,
      date: FeedItem.getFormattedDate(item.time),
    });
  };

  render(): React.Node {
    const {item, height, navigation} = this.props;
    const image = item.image !== '' && item.image != null ? item.image : null;
    const pageSource: NewsSourceType = NewsSourcesConstants[item.page_id];
    const cardMargin = 10;
    const cardHeight = height - 2 * cardMargin;
    const imageSize = 250;
    const titleHeight = 80;
    const actionsHeight = 60;
    const textHeight =
      image != null
        ? cardHeight - titleHeight - actionsHeight - imageSize
        : cardHeight - titleHeight - actionsHeight;
    return (
      <Card
        style={{
          margin: cardMargin,
          height: cardHeight,
        }}>
        <TouchableRipple style={{flex: 1}} onPress={this.onPress}>
          <View>
            <Card.Title
              title={pageSource.name}
              subtitle={FeedItem.getFormattedDate(item.time)}
              left={(): React.Node => (
                <Image
                  size={48}
                  source={pageSource.icon}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                />
              )}
              style={{height: titleHeight}}
            />
            {image != null ? (
              <ImageGalleryButton
                navigation={navigation}
                images={[{url: image}]}
                style={{
                  width: imageSize,
                  height: imageSize,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            ) : null}
            <Card.Content>
              {item.message !== undefined ? (
                <Autolink
                  text={item.message}
                  hashtag="facebook"
                  component={Text}
                  style={{height: textHeight}}
                />
              ) : null}
            </Card.Content>
            <Card.Actions style={{height: actionsHeight}}>
              <Button
                onPress={this.onPress}
                icon="plus"
                style={{marginLeft: 'auto'}}>
                {i18n.t('screens.home.dashboard.seeMore')}
              </Button>
            </Card.Actions>
          </View>
        </TouchableRipple>
      </Card>
    );
  }
}

export default FeedItem;
