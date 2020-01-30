// @flow

import * as React from 'react';
import {Container} from "native-base";
import CustomHeader from "./CustomHeader";
import CustomSideMenu from "./CustomSideMenu";
import CustomMaterialIcon from "./CustomMaterialIcon";
import {Platform, View} from "react-native";
import ThemeManager from "../utils/ThemeManager";
import Touchable from "react-native-platform-touchable";
import {ScreenOrientation} from "expo";
import {NavigationActions} from "react-navigation";


type Props = {
    navigation: Object,
    headerTitle: string,
    headerRightButton: React.Node,
    children: React.Node,
    hasTabs: boolean,
    hasBackButton: boolean,
    hasSideMenu: boolean,
    enableRotation: boolean,
    hideHeaderOnLandscape: boolean,
}

type State = {
    isOpen: boolean,
    isHeaderVisible: boolean
}


export default class BaseContainer extends React.Component<Props, State> {

    willBlurSubscription: function;
    willFocusSubscription: function;

    static defaultProps = {
        headerRightButton: <View/>,
        hasTabs: false,
        hasBackButton: false,
        hasSideMenu: true,
        enableRotation: false,
        hideHeaderOnLandscape: false,
    };


    state = {
        isOpen: false,
        isHeaderVisible: true,
    };

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen: boolean) {
        this.setState({isOpen});
    }

    /**
     * Register for blur event to close side menu on screen change
     */
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                if (this.props.enableRotation) {
                    ScreenOrientation.unlockAsync();
                    ScreenOrientation.addOrientationChangeListener((OrientationChangeEvent) => {
                        if (this.props.hideHeaderOnLandscape) {
                            let isLandscape = OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE ||
                                OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                                OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
                            this.setState({isHeaderVisible: !isLandscape});
                            const setParamsAction = NavigationActions.setParams({
                                params: {showTabBar: !isLandscape},
                                key: this.props.navigation.state.key,
                            });
                            this.props.navigation.dispatch(setParamsAction);
                        }
                    });
                }
            });
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                if (this.props.enableRotation)
                    ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
                this.setState({isOpen: false});
            }
        );
    }

    /**
     * Unregister from event when un-mounting components
     */
    componentWillUnmount() {
        if (this.willBlurSubscription !== undefined)
            this.willBlurSubscription.remove();
        if (this.willFocusSubscription !== undefined)
            this.willFocusSubscription.remove();
    }

    getMainContainer() {
        return (
            <Container>
                {this.state.isHeaderVisible ?
                    <CustomHeader
                        navigation={this.props.navigation} title={this.props.headerTitle}
                        leftButton={
                            <Touchable
                                style={{padding: 6}}
                                onPress={() => this.toggle()}>
                                <CustomMaterialIcon
                                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                                    icon="menu"/>
                            </Touchable>
                        }
                        rightButton={this.props.headerRightButton}
                        hasTabs={this.props.hasTabs}
                        hasBackButton={this.props.hasBackButton}/>
                    : <View style={{paddingTop: 20}}/>}
                {this.props.children}
            </Container>
        );
    }


    render() {
        return (
            <View style={{
                backgroundColor: ThemeManager.getCurrentThemeVariables().sideMenuBgColor,
                width: '100%',
                height: '100%'
            }}>
                {this.props.hasSideMenu ?
                    <CustomSideMenu
                        navigation={this.props.navigation} isOpen={this.state.isOpen}
                        onChange={(isOpen) => this.updateMenuState(isOpen)}>
                        {this.getMainContainer()}
                    </CustomSideMenu> :
                    this.getMainContainer()}
            </View>
        );
    }
}
