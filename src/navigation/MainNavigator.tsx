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
import { createStackNavigator } from '@react-navigation/stack';
import i18n from 'i18n-js';
import SettingsScreen from '../screens/Other/Settings/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import DebugScreen from '../screens/About/DebugScreen';
import TabNavigator from './TabNavigator';
import GameMainScreen from '../screens/Game/screens/GameMainScreen';
import VoteScreen from '../screens/Amicale/VoteScreen';
import LoginScreen from '../screens/Amicale/LoginScreen';
import SelfMenuScreen from '../screens/Services/SelfMenuScreen';
import ProximoMainScreen from '../screens/Services/Proximo/ProximoMainScreen';
import ProximoListScreen from '../screens/Services/Proximo/ProximoListScreen';
import ProximoAboutScreen from '../screens/Services/Proximo/ProximoAboutScreen';
import ProfileScreen from '../screens/Amicale/ProfileScreen';
import ClubListScreen from '../screens/Amicale/Clubs/ClubListScreen';
import ClubAboutScreen from '../screens/Amicale/Clubs/ClubAboutScreen';
import ClubDisplayScreen from '../screens/Amicale/Clubs/ClubDisplayScreen';
import BugReportScreen from '../screens/Other/FeedbackScreen';
import WebsiteScreen from '../screens/Services/WebsiteScreen';
import EquipmentScreen, {
  DeviceType,
} from '../screens/Amicale/Equipment/EquipmentListScreen';
import EquipmentLendScreen from '../screens/Amicale/Equipment/EquipmentRentScreen';
import EquipmentConfirmScreen from '../screens/Amicale/Equipment/EquipmentConfirmScreen';
import DashboardEditScreen from '../screens/Other/Settings/DashboardEditScreen';
import GameStartScreen from '../screens/Game/screens/GameStartScreen';
import ImageGalleryScreen from '../screens/Media/ImageGalleryScreen';

export enum MainRoutes {
  Main = 'main',
  Gallery = 'gallery',
  Settings = 'settings',
  DashboardEdit = 'dashboard-edit',
  About = 'about',
  Dependencies = 'dependencies',
  Debug = 'debug',
  GameStart = 'game-start',
  GameMain = 'game-main',
  Login = 'login',
  SelfMenu = 'self-menu',
  Proximo = 'proximo',
  ProximoList = 'proximo-list',
  ProximoAbout = 'proximo-about',
  Profile = 'profile',
  ClubList = 'club-list',
  ClubInformation = 'club-information',
  ClubAbout = 'club-about',
  EquipmentList = 'equipment-list',
  EquipmentRent = 'equipment-rent',
  EquipmentConfirm = 'equipment-confirm',
  Vote = 'vote',
  Feedback = 'feedback',
}

type DefaultParams = { [key in MainRoutes]: object | undefined };

export type FullParamsList = DefaultParams & {
  'login': { nextScreen: string };
  'equipment-confirm': {
    item?: DeviceType;
    dates: [string, string];
  };
  'equipment-rent': { item?: DeviceType };
  'gallery': { images: Array<{ url: string }> };
  [MainRoutes.ProximoList]: {
    shouldFocusSearchBar: boolean;
    category: number;
  };
};

// Don't know why but TS is complaining without this
// See: https://stackoverflow.com/questions/63652687/interface-does-not-satisfy-the-constraint-recordstring-object-undefined
export type MainStackParamsList = FullParamsList &
  Record<string, object | undefined>;

const MainStack = createStackNavigator<MainStackParamsList>();

function MainStackComponent(props: {
  createTabNavigator: () => React.ReactElement;
}) {
  const { createTabNavigator } = props;
  return (
    <MainStack.Navigator
      initialRouteName={MainRoutes.Main}
      headerMode={'screen'}
    >
      <MainStack.Screen
        name={MainRoutes.Main}
        component={createTabNavigator}
        options={{
          headerShown: false,
          title: i18n.t('screens.home.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Gallery}
        component={ImageGalleryScreen}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Settings}
        component={SettingsScreen}
        options={{
          title: i18n.t('screens.settings.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.DashboardEdit}
        component={DashboardEditScreen}
        options={{
          title: i18n.t('screens.settings.dashboardEdit.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.About}
        component={AboutScreen}
        options={{
          title: i18n.t('screens.about.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Dependencies}
        component={AboutDependenciesScreen}
        options={{
          title: i18n.t('screens.about.libs'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Debug}
        component={DebugScreen}
        options={{
          title: i18n.t('screens.about.debug'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.GameStart}
        component={GameStartScreen}
        options={{
          title: i18n.t('screens.game.title'),
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <MainStack.Screen
        name={MainRoutes.GameMain}
        component={GameMainScreen}
        options={{
          title: i18n.t('screens.game.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Login}
        component={LoginScreen}
        options={{
          title: i18n.t('screens.login.title'),
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <MainStack.Screen
        name={'website'}
        component={WebsiteScreen}
        options={{
          title: '',
        }}
      />
      <MainStack.Screen
        name={MainRoutes.SelfMenu}
        component={SelfMenuScreen}
        options={{
          title: i18n.t('screens.menu.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Proximo}
        component={ProximoMainScreen}
        options={{
          title: i18n.t('screens.proximo.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ProximoList}
        component={ProximoListScreen}
        options={{
          title: i18n.t('screens.proximo.articleList'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ProximoAbout}
        component={ProximoAboutScreen}
        options={{
          title: i18n.t('screens.proximo.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Profile}
        component={ProfileScreen}
        options={{
          title: i18n.t('screens.profile.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ClubList}
        component={ClubListScreen}
        options={{
          title: i18n.t('screens.clubs.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ClubInformation}
        component={ClubDisplayScreen}
        options={{
          title: i18n.t('screens.clubs.details'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ClubAbout}
        component={ClubAboutScreen}
        options={{
          title: i18n.t('screens.clubs.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.EquipmentList}
        component={EquipmentScreen}
        options={{
          title: i18n.t('screens.equipment.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.EquipmentRent}
        component={EquipmentLendScreen}
        options={{
          title: i18n.t('screens.equipment.book'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.EquipmentConfirm}
        component={EquipmentConfirmScreen}
        options={{
          title: i18n.t('screens.equipment.confirm'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Vote}
        component={VoteScreen}
        options={{
          title: i18n.t('screens.vote.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Feedback}
        component={BugReportScreen}
        options={{
          title: i18n.t('screens.feedback.title'),
        }}
      />
    </MainStack.Navigator>
  );
}

type PropsType = {
  defaultHomeRoute: string | null;
  defaultHomeData: { [key: string]: string };
};

export default function MainNavigator(props: PropsType) {
  return (
    <MainStackComponent
      createTabNavigator={() => <TabNavigator {...props} />}
    />
  );
}
