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
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { FAB, IconButton, Surface, withTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';
import AutoHideHandler from '../../utils/AutoHideHandler';
import { TAB_BAR_HEIGHT } from '../Tabbar/CustomTabBar';

const AnimatedFAB = Animatable.createAnimatableComponent(FAB);

type PropsType = {
  navigation: StackNavigationProp<any>;
  theme: ReactNativePaper.Theme;
  onPress: (action: string, data?: string) => void;
  seekAttention: boolean;
};

type StateType = {
  currentMode: string;
};

const DISPLAY_MODES = {
  DAY: 'agendaDay',
  WEEK: 'agendaWeek',
  MONTH: 'month',
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '5%',
    width: '90%',
  },
  surface: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 2,
  },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    top: '-25%',
  },
  side: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 5,
  },
});

class AnimatedBottomBar extends React.Component<PropsType, StateType> {
  ref: { current: null | (Animatable.View & View) };

  hideHandler: AutoHideHandler;

  displayModeIcons: { [key: string]: string };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      currentMode: DISPLAY_MODES.WEEK,
    };
    this.ref = React.createRef();
    this.hideHandler = new AutoHideHandler(false);
    this.hideHandler.addListener(this.onHideChange);

    this.displayModeIcons = {};
    this.displayModeIcons[DISPLAY_MODES.DAY] = 'calendar-text';
    this.displayModeIcons[DISPLAY_MODES.WEEK] = 'calendar-week';
    this.displayModeIcons[DISPLAY_MODES.MONTH] = 'calendar-range';
  }

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType): boolean {
    const { props, state } = this;
    return (
      nextProps.seekAttention !== props.seekAttention ||
      nextState.currentMode !== state.currentMode
    );
  }

  onHideChange = (shouldHide: boolean) => {
    const ref = this.ref;
    if (ref && ref.current && ref.current.fadeOutDown && ref.current.fadeInUp) {
      if (shouldHide) {
        ref.current.fadeOutDown(500);
      } else {
        ref.current.fadeInUp(500);
      }
    }
  };

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.hideHandler.onScroll(event);
  };

  changeDisplayMode = () => {
    const { props, state } = this;
    let newMode;
    switch (state.currentMode) {
      case DISPLAY_MODES.DAY:
        newMode = DISPLAY_MODES.WEEK;
        break;
      case DISPLAY_MODES.WEEK:
        newMode = DISPLAY_MODES.MONTH;
        break;
      case DISPLAY_MODES.MONTH:
        newMode = DISPLAY_MODES.DAY;
        break;
      default:
        newMode = DISPLAY_MODES.WEEK;
        break;
    }
    this.setState({ currentMode: newMode });
    props.onPress('changeView', newMode);
  };

  render() {
    const { props, state } = this;
    const buttonColor = props.theme.colors.primary;
    return (
      <Animatable.View
        ref={this.ref}
        useNativeDriver
        style={{
          ...styles.container,
          bottom: 10 + TAB_BAR_HEIGHT,
        }}
      >
        <Surface style={styles.surface}>
          <View style={styles.fabContainer}>
            <AnimatedFAB
              animation={props.seekAttention ? 'bounce' : undefined}
              easing="ease-out"
              iterationDelay={500}
              iterationCount="infinite"
              useNativeDriver
              style={styles.fab}
              icon="account-clock"
              onPress={() => props.navigation.navigate('group-select')}
            />
          </View>
          <View style={styles.side}>
            <IconButton
              icon={this.displayModeIcons[state.currentMode]}
              color={buttonColor}
              onPress={this.changeDisplayMode}
            />
            <IconButton
              icon="clock-in"
              color={buttonColor}
              style={styles.icon}
              onPress={() => props.onPress('today')}
            />
          </View>
          <View style={styles.side}>
            <IconButton
              icon="chevron-left"
              color={buttonColor}
              onPress={() => props.onPress('prev')}
            />
            <IconButton
              icon="chevron-right"
              color={buttonColor}
              style={styles.icon}
              onPress={() => props.onPress('next')}
            />
          </View>
        </Surface>
      </Animatable.View>
    );
  }
}

export default withTheme(AnimatedBottomBar);
