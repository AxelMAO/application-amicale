// @flow

import * as React from 'react';
import {ERROR_TYPE, readData} from "../../utils/WebData";
import i18n from "i18n-js";
import {Snackbar} from 'react-native-paper';
import {Animated, RefreshControl, View} from "react-native";
import ErrorView from "./ErrorView";
import BasicLoadingScreen from "./BasicLoadingScreen";
import {withCollapsible} from "../../utils/withCollapsible";
import * as Animatable from 'react-native-animatable';
import CustomTabBar from "../Tabbar/CustomTabBar";
import {Collapsible} from "react-navigation-collapsible";

type Props = {
    navigation: { [key: string]: any },
    fetchUrl: string,
    autoRefreshTime: number,
    refreshOnFocus: boolean,
    renderItem: (data: { [key: string]: any }) => React.Node,
    createDataset: (data: { [key: string]: any }) => Array<Object>,
    onScroll: (event: SyntheticEvent<EventTarget>) => void,
    collapsibleStack: Collapsible,

    itemHeight?: number,
    updateData?: number,
    renderSectionHeader?: (data: { [key: string]: any }) => React.Node,
    stickyHeader?: boolean,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    fetchedData: { [key: string]: any } | null,
    snackbarVisible: boolean
};


const MIN_REFRESH_TIME = 5 * 1000;

/**
 * Component used to render a SectionList with data fetched from the web
 *
 * This is a pure component, meaning it will only update if a shallow comparison of state and props is different.
 * To force the component to update, change the value of updateData.
 */
class WebSectionList extends React.PureComponent<Props, State> {

    static defaultProps = {
        stickyHeader: false,
        updateData: 0,
    };

    scrollRef: { current: null | Animated.SectionList };
    refreshInterval: IntervalID;
    lastRefresh: Date | null;

    state = {
        refreshing: false,
        firstLoading: true,
        fetchedData: null,
        snackbarVisible: false
    };

    /**
     * Registers react navigation events on first screen load.
     * Allows to detect when the screen is focused
     */
    componentDidMount() {
        const onScreenFocus = this.onScreenFocus.bind(this);
        const onScreenBlur = this.onScreenBlur.bind(this);
        this.props.navigation.addListener('focus', onScreenFocus);
        this.props.navigation.addListener('blur', onScreenBlur);
        this.scrollRef = React.createRef();
        this.onRefresh();
        this.lastRefresh = null;
    }

    /**
     * Refreshes data when focusing the screen and setup a refresh interval if asked to
     */
    onScreenFocus() {
        if (this.props.refreshOnFocus && this.lastRefresh)
            this.onRefresh();
        if (this.props.autoRefreshTime > 0)
            this.refreshInterval = setInterval(this.onRefresh, this.props.autoRefreshTime)
        // if (this.scrollRef.current) // Reset scroll to top
        //     this.scrollRef.current.getNode().scrollToLocation({animated:false, itemIndex:0, sectionIndex:0});
    }

    /**
     * Removes any interval on un-focus
     */
    onScreenBlur() {
        clearInterval(this.refreshInterval);
    }


    /**
     * Callback used when fetch is successful.
     * It will update the displayed data and stop the refresh animation
     *
     * @param fetchedData The newly fetched data
     */
    onFetchSuccess = (fetchedData: { [key: string]: any }) => {
        this.setState({
            fetchedData: fetchedData,
            refreshing: false,
            firstLoading: false
        });
        this.lastRefresh = new Date();
    };

    /**
     * Callback used when fetch encountered an error.
     * It will reset the displayed data and show an error.
     */
    onFetchError = () => {
        this.setState({
            fetchedData: null,
            refreshing: false,
            firstLoading: false
        });
        this.showSnackBar();
    };

    /**
     * Refreshes data and shows an animations while doing it
     */
    onRefresh = () => {
        let canRefresh;
        if (this.lastRefresh != null) {
            const last = this.lastRefresh;
            canRefresh = (new Date().getTime() - last.getTime()) > MIN_REFRESH_TIME;
        } else
            canRefresh = true;
        if (canRefresh) {
            this.setState({refreshing: true});
            readData(this.props.fetchUrl)
                .then(this.onFetchSuccess)
                .catch(this.onFetchError);
        }
    };

    /**
     * Shows the error popup
     */
    showSnackBar = () => this.setState({snackbarVisible: true});

    /**
     * Hides the error popup
     */
    hideSnackBar = () => this.setState({snackbarVisible: false});

    itemLayout = (data: { [key: string]: any }, index: number) => {
        const height = this.props.itemHeight;
        if (height == null)
            return undefined;
        return {
            length: height,
            offset: height * index,
            index
        }
    };

    renderSectionHeader = (data: { section: { [key: string]: any } }) => {
        if (this.props.renderSectionHeader != null) {
            return (
                <Animatable.View
                    animation={"fadeInUp"}
                    duration={500}
                    useNativeDriver
                >
                    {this.props.renderSectionHeader(data)}
                </Animatable.View>
            );
        } else
            return null;
    }

    renderItem = (data: {
        item: { [key: string]: any },
        index: number,
        section: { [key: string]: any },
        separators: { [key: string]: any },
    }) => {
        return (
            <Animatable.View
                animation={"fadeInUp"}
                duration={500}
                useNativeDriver
            >
                {this.props.renderItem(data)}
            </Animatable.View>
        );
    }

    onScroll = (event: SyntheticEvent<EventTarget>) => {
        if (this.props.onScroll)
            this.props.onScroll(event);
    }

    render() {
        let dataset = [];
        if (this.state.fetchedData != null)
            dataset = this.props.createDataset(this.state.fetchedData);
        const {containerPaddingTop, scrollIndicatorInsetTop, onScrollWithListener} = this.props.collapsibleStack;
        return (
            <View>
                <Animated.SectionList
                    ref={this.scrollRef}
                    sections={dataset}
                    extraData={this.props.updateData}
                    refreshControl={
                        <RefreshControl
                            progressViewOffset={containerPaddingTop}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderItem}
                    stickySectionHeadersEnabled={this.props.stickyHeader}
                    style={{minHeight: '100%'}}
                    ListEmptyComponent={this.state.refreshing
                        ? <BasicLoadingScreen/>
                        : <ErrorView
                            {...this.props}
                            errorCode={ERROR_TYPE.CONNECTION_ERROR}
                            onRefresh={this.onRefresh}/>
                    }
                    getItemLayout={this.props.itemHeight != null ? this.itemLayout : undefined}
                    // Animations
                    onScroll={onScrollWithListener(this.onScroll)}
                    contentContainerStyle={{
                        paddingTop: containerPaddingTop,
                        paddingBottom: CustomTabBar.TAB_BAR_HEIGHT,
                        minHeight: '100%'
                    }}
                    scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
                />
                <Snackbar
                    visible={this.state.snackbarVisible}
                    onDismiss={this.hideSnackBar}
                    action={{
                        label: 'OK',
                        onPress: () => {
                        },
                    }}
                    duration={4000}
                    style={{
                        bottom: CustomTabBar.TAB_BAR_HEIGHT
                    }}
                >
                    {i18n.t("homeScreen.listUpdateFail")}
                </Snackbar>
            </View>
        );
    }
}

export default withCollapsible(WebSectionList);
