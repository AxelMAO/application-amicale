// @flow

import * as React from 'react';
import WebDataManager from "../utils/WebDataManager";
import i18n from "i18n-js";
import {Snackbar} from 'react-native-paper';
import {RefreshControl, SectionList, View} from "react-native";
import EmptyWebSectionListItem from "./EmptyWebSectionListItem";

type Props = {
    navigation: Object,
    fetchUrl: string,
    autoRefreshTime: number,
    refreshOnFocus: boolean,
    renderItem: React.Node,
    renderSectionHeader: React.Node,
    stickyHeader: boolean,
    createDataset: Function,
    updateData: number,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    fetchedData: Object,
    snackbarVisible: boolean
};


const MIN_REFRESH_TIME = 5  * 1000;
/**
 * This is a pure component, meaning it will only update if a shallow comparison of state and props is different.
 * To force the component to update, change the value of updateData.
 */
export default class WebSectionList extends React.PureComponent<Props, State> {

    static defaultProps = {
        renderSectionHeader: null,
        stickyHeader: false,
        updateData: null,
    };

    webDataManager: WebDataManager;

    refreshInterval: IntervalID;
    lastRefresh: Date;

    state = {
        refreshing: false,
        firstLoading: true,
        fetchedData: {},
        snackbarVisible: false
    };

    onRefresh: Function;
    onFetchSuccess: Function;
    onFetchError: Function;
    getEmptyRenderItem: Function;
    getEmptySectionHeader: Function;
    showSnackBar: Function;
    hideSnackBar: Function;

    constructor() {
        super();
        // creating references to functions used in render()
        this.onRefresh = this.onRefresh.bind(this);
        this.onFetchSuccess = this.onFetchSuccess.bind(this);
        this.onFetchError = this.onFetchError.bind(this);
        this.getEmptyRenderItem = this.getEmptyRenderItem.bind(this);
        this.getEmptySectionHeader = this.getEmptySectionHeader.bind(this);
        this.showSnackBar = this.showSnackBar.bind(this);
        this.hideSnackBar = this.hideSnackBar.bind(this);
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
        this.onRefresh();
    }

    /**
     * Refresh data when focusing the screen and setup a refresh interval if asked to
     */
    onScreenFocus() {
        if (this.props.refreshOnFocus && this.lastRefresh !== undefined)
            this.onRefresh();
        if (this.props.autoRefreshTime > 0)
            this.refreshInterval = setInterval(this.onRefresh, this.props.autoRefreshTime)
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
        this.showSnackBar();
        // this.webDataManager.showUpdateToast(this.props.updateErrorText);
    }

    /**
     * Refresh data and show a toast if any error occurred
     * @private
     */
    onRefresh() {
        let canRefresh;
        if (this.lastRefresh !== undefined)
            canRefresh = (new Date().getTime() - this.lastRefresh.getTime()) > MIN_REFRESH_TIME;
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
            <EmptyWebSectionListItem
                text={item.text}
                icon={item.icon}
                refreshing={this.state.refreshing}
            />
        );
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

    showSnackBar() {
        this.setState({snackbarVisible: true})
    }

    hideSnackBar() {
        this.setState({snackbarVisible: false})
    }

    render() {
        let dataset = this.props.createDataset(this.state.fetchedData);
        const isEmpty = dataset[0].data.length === 0;
        const shouldRenderHeader = !isEmpty && (this.props.renderSectionHeader !== null);
        if (isEmpty)
            dataset = this.createEmptyDataset();
        return (
            <View>
                <Snackbar
                    visible={this.state.snackbarVisible}
                    onDismiss={this.hideSnackBar}
                    action={{
                        label: 'OK',
                        onPress: this.hideSnackBar,
                    }}
                    duration={4000}
                >
                    {i18n.t("homeScreen.listUpdateFail")}
                </Snackbar>
                <SectionList
                    sections={dataset}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    renderSectionHeader={shouldRenderHeader ? this.props.renderSectionHeader : this.getEmptySectionHeader}
                    renderItem={isEmpty ? this.getEmptyRenderItem : this.props.renderItem}
                    style={{minHeight: 300, width: '100%'}}
                    stickySectionHeadersEnabled={this.props.stickyHeader}
                    contentContainerStyle={
                        isEmpty ?
                            {flexGrow: 1, justifyContent: 'center', alignItems: 'center'} : {}
                    }
                />
            </View>
        );
    }
}
