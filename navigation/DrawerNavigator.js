// @flow

import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import SelfMenuScreen from '../screens/SelfMenuScreen';
import AvailableRoomScreen from "../screens/Websites/AvailableRoomScreen";
import BibScreen from "../screens/Websites/BibScreen";
import TetrisScreen from "../screens/Tetris/TetrisScreen";
import DebugScreen from '../screens/About/DebugScreen';
import Sidebar from "../components/Sidebar/Sidebar";
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import HeaderButton from "../components/Custom/HeaderButton";
import i18n from "i18n-js";
import LoginScreen from "../screens/Amicale/LoginScreen";
import ProfileScreen from "../screens/Amicale/ProfileScreen";
import ClubListScreen from "../screens/Amicale/ClubListScreen";
import ClubDisplayScreen from "../screens/Amicale/ClubDisplayScreen";

const defaultScreenOptions = {
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...TransitionPresets.SlideFromRightIOS,
};

function getDrawerButton(navigation: Object) {
    return (
        <HeaderButton icon={'menu'} onPress={navigation.openDrawer}/>
    );
}

const AboutStack = createStackNavigator();

function AboutStackComponent() {
    return (
        <AboutStack.Navigator
            initialRouteName="AboutScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <AboutStack.Screen
                name="AboutScreen"
                component={AboutScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.about'),
                        headerLeft: openDrawer
                    };
                }}
            />
            <AboutStack.Screen
                name="AboutDependenciesScreen"
                component={AboutDependenciesScreen}
                options={{
                    title: i18n.t('aboutScreen.libs')
                }}
            />
            <AboutStack.Screen
                name="DebugScreen"
                component={DebugScreen}
                options={{
                    title: i18n.t('aboutScreen.debug')
                }}
            />
        </AboutStack.Navigator>
    );
}

const SettingsStack = createStackNavigator();

function SettingsStackComponent() {
    return (
        <SettingsStack.Navigator
            initialRouteName="SettingsScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <SettingsStack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.settings'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </SettingsStack.Navigator>
    );
}

const SelfMenuStack = createStackNavigator();

function SelfMenuStackComponent() {
    return (
        <SelfMenuStack.Navigator
            initialRouteName="SelfMenuScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <SelfMenuStack.Screen
                name="SelfMenuScreen"
                component={SelfMenuScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.menuSelf'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </SelfMenuStack.Navigator>
    );
}

const AvailableRoomStack = createStackNavigator();

function AvailableRoomStackComponent() {
    return (
        <AvailableRoomStack.Navigator
            initialRouteName="AvailableRoomScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <AvailableRoomStack.Screen
                name="AvailableRoomScreen"
                component={AvailableRoomScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.availableRooms'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </AvailableRoomStack.Navigator>
    );
}

const BibStack = createStackNavigator();

function BibStackComponent() {
    return (
        <BibStack.Navigator
            initialRouteName="BibScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <BibStack.Screen
                name="BibScreen"
                component={BibScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.bib'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </BibStack.Navigator>
    );
}

const TetrisStack = createStackNavigator();

function TetrisStackComponent() {
    return (
        <TetrisStack.Navigator
            initialRouteName="TetrisScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <TetrisStack.Screen
                name="TetrisScreen"
                component={TetrisScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t("game.title"),
                        headerLeft: openDrawer
                    };
                }}
            />
        </TetrisStack.Navigator>
    );
}

const LoginStack = createStackNavigator();

function LoginStackComponent() {
    return (
        <LoginStack.Navigator
            initialRouteName="LoginScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <LoginStack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.login'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </LoginStack.Navigator>
    );
}

const ProfileStack = createStackNavigator();

function ProfileStackComponent() {
    return (
        <ProfileStack.Navigator
            initialRouteName="ProfileScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <ProfileStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.profile'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </ProfileStack.Navigator>
    );
}

const ClubStack = createStackNavigator();

function ClubStackComponent() {
    return (
        <ClubStack.Navigator
            initialRouteName="ClubListScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <ClubStack.Screen
                name="ClubListScreen"
                component={ClubListScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('clubs.clubList'),
                        headerLeft: openDrawer
                    };
                }}
            />
            <ClubStack.Screen
                name="ClubDisplayScreen"
                component={ClubDisplayScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: "",
                        headerLeft: openDrawer,
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    };
                }}
            />
        </ClubStack.Navigator>
    );
}


const Drawer = createDrawerNavigator();

function getDrawerContent(props) {
    return <Sidebar {...props}/>
}

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            initialRouteName={'Main'}
            headerMode={'float'}
            backBehavior={'initialRoute'}
            drawerType={'front'}
            drawerContent={(props) => getDrawerContent(props)}
            screenOptions={defaultScreenOptions}
        >
            <Drawer.Screen
                name="Main"
                component={TabNavigator}
            >
            </Drawer.Screen>
            <Drawer.Screen
                name="SettingsScreen"
                component={SettingsStackComponent}
            />
            <Drawer.Screen
                name="AboutScreen"
                component={AboutStackComponent}
            />
            <Drawer.Screen
                name="SelfMenuScreen"
                component={SelfMenuStackComponent}
            />
            <Drawer.Screen
                name="AvailableRoomScreen"
                component={AvailableRoomStackComponent}
            />
            <Drawer.Screen
                name="BibScreen"
                component={BibStackComponent}
            />
            <Drawer.Screen
                name="TetrisScreen"
                component={TetrisStackComponent}
            />
            <Drawer.Screen
                name="LoginScreen"
                component={LoginStackComponent}
            />
            <Drawer.Screen
                name="ProfileScreen"
                component={ProfileStackComponent}
            />
            <Drawer.Screen
                name="ClubListScreen"
                component={ClubStackComponent}
            />
        </Drawer.Navigator>
    );
}
