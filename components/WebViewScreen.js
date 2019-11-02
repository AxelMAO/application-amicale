// @flow

import * as React from 'react';
import {Linking, Platform, View} from 'react-native';
import {Spinner} from 'native-base';
import WebView from "react-native-webview";
import Touchable from "react-native-platform-touchable";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";
import BaseContainer from "../components/BaseContainer";

type Props = {
    navigation: Object,
    url: string,
    customInjectedJS: string,
    headerTitle: string,
    hasHeaderBackButton: boolean,
    hasSideMenu: boolean,
}

/**
 * Class defining a webview screen.
 */
export default class WebViewScreen extends React.Component<Props> {

    static defaultProps = {
        customInjectedJS: '',
        hasBackButton: false,
        hasSideMenu: true,
    };

    webview: WebView;

    openWebLink() {
        Linking.openURL(this.props.url).catch((err) => console.error('Error opening link', err));
    }

    getHeaderButton(clickAction: Function, icon: string) {
        return (
            <Touchable
                style={{padding: 6}}
                onPress={() => clickAction()}>
                <CustomMaterialIcon
                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                    icon={icon}/>
            </Touchable>
        );
    }

    getRefreshButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                {this.getHeaderButton(() => this.openWebLink(), 'web')}
                {this.getHeaderButton(() => this.refreshWebview(), 'refresh')}
            </View>
        );
    };

    refreshWebview() {
        this.webview.reload();
    }

    render() {
        const nav = this.props.navigation;
        return (
            <BaseContainer
                navigation={nav}
                headerTitle={this.props.headerTitle}
                headerRightButton={this.getRefreshButton()}
                hasBackButton={this.props.hasHeaderBackButton}
                hasSideMenu={this.props.hasSideMenu}>
                <WebView
                    ref={ref => (this.webview = ref)}
                    source={{uri: this.props.url}}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    startInLoadingState={true}
                    injectedJavaScript={this.props.customInjectedJS}
                    javaScriptEnabled={true}
                    renderLoading={() =>
                        <View style={{
                            backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor,
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '100%',
                            height: '100%',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Spinner/>
                        </View>
                    }
                />
            </BaseContainer>
        );
    }
}

