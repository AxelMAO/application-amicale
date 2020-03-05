// @flow

import * as React from 'react';
import {H3, Spinner, View} from "native-base";
import ThemeManager from '../utils/ThemeManager';
import WebDataManager from "../utils/WebDataManager";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import i18n from "i18n-js";
import {RefreshControl, SectionList} from "react-native";

type Props = {
    navigation: Object,
    fetchUrl: string,
    refreshTime: number,
    renderItem: React.Node,
    renderSectionHeader: React.Node,
    stickyHeader: boolean,
    createDataset: Function,
    updateErrorText: string,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    fetchedData: Object,
};

/**
 * Custom component defining a material icon using native base
 *
 * @prop active {boolean} Whether to set the icon color to active
 * @prop icon {string} The icon string to use from MaterialCommunityIcons
 * @prop color {string} The icon color. Use default theme color if unspecified
 * @prop fontSize {number} The icon size. Use 26 if unspecified
 * @prop width {number} The icon width. Use 30 if unspecified
 */
export default class WebSectionList extends React.Component<Props, State> {

    static defaultProps = {
        renderSectionHeader: undefined,
        stickyHeader: false,
    };

    webDataManager: WebDataManager;

    refreshInterval: IntervalID;
    lastRefresh: Date;

    state = {
        refreshing: false,
        firstLoading: true,
        fetchedData: {},
    };

    onRefresh: Function;
    onFetchSuccess: Function;
    onFetchError: Function;
    getEmptyRenderItem: Function;
    getEmptySectionHeader: Function;

    constructor() {
        super();
        // creating references to functions used in render()
        this.onRefresh = this.onRefresh.bind(this);
        this.onFetchSuccess = this.onFetchSuccess.bind(this);
        this.onFetchError = this.onFetchError.bind(this);
        this.getEmptyRenderItem = this.getEmptyRenderItem.bind(this);
        this.getEmptySectionHeader = this.getEmptySectionHeader.bind(this);
    }

    /**
     * Register react navigation events on first screen load.
     * Allows to detect when the screen is focused
     */
    componentDidMount() {
        this.webDataManager = new WebDataManager(this.props.fetchUrl);
        const onScreenFocus = this.onScreenFocus.bind(this);
        const onScreenBlur = this.onScreenBlur.bind(this);
        this.props.navigation.addListener('focus', onScreenFocus);
        this.props.navigation.addListener('blur', onScreenBlur);
    }

    /**
     * Refresh data when focusing the screen and setup a refresh interval if asked to
     */
    onScreenFocus() {
        this.onRefresh();
        if (this.props.refreshTime > 0)
            this.refreshInterval = setInterval(this.onRefresh, this.props.refreshTime)
    }

    /**
     * Remove any interval on un-focus
     */
    onScreenBlur() {
        clearInterval(this.refreshInterval);
    }


    onFetchSuccess(fetchedData: Object) {
        this.setState({
            fetchedData: fetchedData,
            refreshing: false,
            firstLoading: false
        });
        this.lastRefresh = new Date();
    }

    onFetchError() {
        this.setState({
            fetchedData: {},
            refreshing: false,
            firstLoading: false
        });
        this.webDataManager.showUpdateToast(this.props.updateErrorText);
    }

    /**
     * Refresh data and show a toast if any error occurred
     * @private
     */
    onRefresh() {
        let canRefresh;
        if (this.lastRefresh !== undefined)
            canRefresh = (new Date().getTime() - this.lastRefresh.getTime()) > this.props.refreshTime;
        else
            canRefresh = true;
        if (canRefresh) {
            this.setState({refreshing: true});
            this.webDataManager.readData()
                .then(this.onFetchSuccess)
                .catch(this.onFetchError);
        }
    }

    getEmptySectionHeader({section}: Object) {
        return <View/>;
    }

    getEmptyRenderItem({item}: Object) {
        return (
            <View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 100,
                    marginBottom: 20
                }}>
                    {this.state.refreshing ?
                        <Spinner/>
                        :
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={100}
                            color={ThemeManager.getCurrentThemeVariables().fetchedDataSectionListErrorText}/>}
                </View>

                <H3 style={{
                    textAlign: 'center',
                    marginRight: 20,
                    marginLeft: 20,
                    color: ThemeManager.getCurrentThemeVariables().fetchedDataSectionListErrorText
                }}>
                    {item.text}
                </H3>
            </View>);
    }

    createEmptyDataset() {
        return [
            {
                title: '',
                data: [
                    {
                        text: this.state.refreshing ?
                            i18n.t('general.loading') :
                            i18n.t('general.networkError'),
                        isSpinner: this.state.refreshing,
                        icon: this.state.refreshing ?
                            'refresh' :
                            'access-point-network-off'
                    }
                ],
                keyExtractor: this.datasetKeyExtractor,
            }
        ];
    }

    datasetKeyExtractor(item: Object) {
        return item.text
    }

    render() {
        let dataset = this.props.createDataset(this.state.fetchedData);
        const isEmpty = dataset[0].data.length === 0;
        const shouldRenderHeader = isEmpty || (this.props.renderSectionHeader !== undefined);
        if (isEmpty)
            dataset = this.createEmptyDataset();
        return (
            <SectionList
                sections={dataset}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
                renderSectionHeader={shouldRenderHeader ? this.getEmptySectionHeader : this.props.renderSectionHeader}
                renderItem={isEmpty ? this.getEmptyRenderItem : this.props.renderItem}
                style={{minHeight: 300, width: '100%'}}
                stickySectionHeadersEnabled={this.props.stickyHeader}
                contentContainerStyle={
                    isEmpty ?
                        {flexGrow: 1, justifyContent: 'center', alignItems: 'center'} : {}
                }
            />
        );
    }
}
