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

import * as React from 'react';
import {Linking, Image} from 'react-native';
import {Card, Text} from 'react-native-paper';
import Autolink from 'react-native-autolink';
import {StackNavigationProp} from '@react-navigation/stack';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import CustomTabBar from '../../components/Tabbar/CustomTabBar';
import type {FeedItemType} from './HomeScreen';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import ImageGalleryButton from '../../components/Media/ImageGalleryButton';
import NewsSourcesConstants, {
  AvailablePages,
} from '../../constants/NewsSourcesConstants';
import type {NewsSourceType} from '../../constants/NewsSourcesConstants';

type PropsType = {
  navigation: StackNavigationProp<any>;
  route: {params: {data: FeedItemType; date: string}};
};

/**
 * Class defining a feed item page.
 */
class FeedItemScreen extends React.Component<PropsType> {
  displayData: FeedItemType;

  date: string;

  constructor(props: PropsType) {
    super(props);
    this.displayData = props.route.params.data;
    this.date = props.route.params.date;
  }

  componentDidMount() {
    const {props} = this;
    props.navigation.setOptions({
      headerRight: this.getHeaderButton,
    });
  }

  /**
   * Opens the feed item out link in browser or compatible app
   */
  onOutLinkPress = () => {
    Linking.openURL(this.displayData.url);
  };

  /**
   * Gets the out link header button
   *
   * @returns {*}
   */
  getHeaderButton = () => {
    return (
      <MaterialHeaderButtons>
        <Item
          title="main"
          iconName="facebook"
          color="#2e88fe"
          onPress={this.onOutLinkPress}
        />
      </MaterialHeaderButtons>
    );
  };

  render() {
    const pageSource: NewsSourceType =
      NewsSourcesConstants[this.displayData.page_id as AvailablePages];
    return (
      <CollapsibleScrollView style={{margin: 5}} hasTab>
        <Card.Title
          title={pageSource.name}
          subtitle={this.date}
          left={() => (
            <Image
              source={pageSource.icon}
              style={{
                width: 48,
                height: 48,
              }}
            />
          )}
        />
        {this.displayData.image ? (
          <ImageGalleryButton
            images={[{url: this.displayData.image}]}
            style={{
              width: 250,
              height: 250,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        ) : null}
        <Card.Content style={{paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
          {this.displayData.message !== undefined ? (
            <Autolink
              text={this.displayData.message}
              hashtag="facebook"
              // @ts-ignore
              component={Text}
            />
          ) : null}
        </Card.Content>
      </CollapsibleScrollView>
    );
  }
}

export default FeedItemScreen;