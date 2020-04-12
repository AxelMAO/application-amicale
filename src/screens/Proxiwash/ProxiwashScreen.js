// @flow

import * as React from 'react';
import {Alert, Platform, View} from 'react-native';
import i18n from "i18n-js";
import WebSectionList from "../../components/Lists/WebSectionList";
import * as Notifications from "../../utils/Notifications";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import * as Expo from "expo";
import {Avatar, Banner, Button, Card, Text, withTheme} from 'react-native-paper';
import ProxiwashListItem from "../../components/Lists/ProxiwashListItem";
import ProxiwashConstants from "../../constants/ProxiwashConstants";
import CustomModal from "../../components/Custom/CustomModal";
import AprilFoolsManager from "../../managers/AprilFoolsManager";
import MaterialHeaderButtons, {Item} from "../../components/Custom/HeaderButton";
import ProxiwashSectionHeader from "../../components/Lists/ProxiwashSectionHeader";

const DATA_URL = "https://etud.insa-toulouse.fr/~amicale_app/washinsa/washinsa.json";

let modalStateStrings = {};

const REFRESH_TIME = 1000 * 10; // Refresh every 10 seconds
const LIST_ITEM_HEIGHT = 64;

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {
    refreshing: boolean,
    modalCurrentDisplayItem: React.Node,
    machinesWatched: Array<string>,
    bannerVisible: boolean,
};


/**
 * Class defining the app's proxiwash screen. This screen shows information about washing machines and
 * dryers, taken from a scrapper reading proxiwash website
 */
class ProxiwashScreen extends React.Component<Props, State> {

    modalRef: Object;

    fetchedData: Object;

    state = {
        refreshing: false,
        modalCurrentDisplayItem: null,
        machinesWatched: [],
        bannerVisible: AsyncStorageManager.getInstance().preferences.proxiwashShowBanner.current === '1',
    };

    /**
     * Creates machine state parameters using current theme and translations
     */
    constructor(props) {
        super(props);
        modalStateStrings[ProxiwashConstants.machineStates.TERMINE] = i18n.t('proxiwashScreen.modal.finished');
        modalStateStrings[ProxiwashConstants.machineStates.DISPONIBLE] = i18n.t('proxiwashScreen.modal.ready');
        modalStateStrings[ProxiwashConstants.machineStates["EN COURS"]] = i18n.t('proxiwashScreen.modal.running');
        modalStateStrings[ProxiwashConstants.machineStates.HS] = i18n.t('proxiwashScreen.modal.broken');
        modalStateStrings[ProxiwashConstants.machineStates.ERREUR] = i18n.t('proxiwashScreen.modal.error');
    }

    /**
     * Callback used when closing the banner.
     * This hides the banner and saves to preferences to prevent it from reopening
     */
    onHideBanner = () => {
        this.setState({bannerVisible: false});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.proxiwashShowBanner.key,
            '0'
        );
    };

    /**
     * Setup notification channel for android and add listeners to detect notifications fired
     */
    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getAboutButton,
        });
        if (AsyncStorageManager.getInstance().preferences.expoToken.current !== '') {
            // Get latest watchlist from server
            Notifications.getMachineNotificationWatchlist((fetchedList) => {
                this.setState({machinesWatched: fetchedList})
            });
            // Get updated watchlist after received notification
            Expo.Notifications.addListener(() => {
                Notifications.getMachineNotificationWatchlist((fetchedList) => {
                    this.setState({machinesWatched: fetchedList})
                });
            });
            if (Platform.OS === 'android') {
                Expo.Notifications.createChannelAndroidAsync('reminders', {
                    name: 'Reminders',
                    priority: 'max',
                    vibrate: [0, 250, 250, 250],
                });
            }
        }
    }

    /**
     * Callback used when pressing the about button.
     * This will open the ProxiwashAboutScreen.
     */
    onAboutPress = () => this.props.navigation.navigate('proxiwash-about');

    /**
     * Gets the about header button
     *
     * @return {*}
     */
    getAboutButton = () =>
        <MaterialHeaderButtons>
            <Item title="information" iconName="information" onPress={this.onAboutPress}/>
        </MaterialHeaderButtons>;

    /**
     * Extracts the key for the given item
     *
     * @param item The item to extract the key from
     * @return {*} The extracted key
     */
    getKeyExtractor(item: Object) {
        return item !== undefined ? item.number : undefined;
    }

    /**
     * Setups notifications for the machine with the given ID.
     * One notification will be sent at the end of the program.
     * Another will be send a few minutes before the end, based on the value of reminderNotifTime
     *
     * @param machineId The machine's ID
     * @returns {Promise<void>}
     */
    setupNotifications(machineId: string) {
        if (AsyncStorageManager.getInstance().preferences.expoToken.current !== '') {
            if (!this.isMachineWatched(machineId)) {
                Notifications.setupMachineNotification(machineId, true);
                this.saveNotificationToState(machineId);
            } else
                this.disableNotification(machineId);
        } else {
            this.showNotificationsDisabledWarning();
        }
    }

    /**
     * Shows a warning telling the user notifications are disabled for the app
     */
    showNotificationsDisabledWarning() {
        Alert.alert(
            i18n.t("proxiwashScreen.modal.notificationErrorTitle"),
            i18n.t("proxiwashScreen.modal.notificationErrorDescription"),
        );
    }

    /**
     * Stops scheduled notifications for the machine of the given ID.
     * This will also remove the notification if it was already shown.
     *
     * @param machineId The machine's ID
     */
    disableNotification(machineId: string) {
        let data = this.state.machinesWatched;
        if (data.length > 0) {
            let arrayIndex = data.indexOf(machineId);
            if (arrayIndex !== -1) {
                Notifications.setupMachineNotification(machineId, false);
                this.removeNotificationFroState(arrayIndex);
            }
        }
    }

    /**
     * Adds the given notifications associated to a machine ID to the watchlist, and saves the array to the preferences
     *
     * @param machineId
     */
    saveNotificationToState(machineId: string) {
        let data = this.state.machinesWatched;
        data.push(machineId);
        this.updateNotificationState(data);
    }

    /**
     * Removes the given index from the watchlist array and saves it to preferences
     *
     * @param index
     */
    removeNotificationFroState(index: number) {
        let data = this.state.machinesWatched;
        data.splice(index, 1);
        this.updateNotificationState(data);
    }

    /**
     * Sets the given fetchedData as the watchlist
     *
     * @param data
     */
    updateNotificationState(data: Array<Object>) {
        this.setState({machinesWatched: data});
    }

    /**
     * Checks whether the machine of the given ID has scheduled notifications
     *
     * @param machineID The machine's ID
     * @returns {boolean}
     */
    isMachineWatched(machineID: string) {
        return this.state.machinesWatched.indexOf(machineID) !== -1;
    }

    /**
     * Creates the dataset to be used by the flatlist
     *
     * @param fetchedData
     * @return {*}
     */
    createDataset = (fetchedData: Object) => {
        let data = fetchedData;
        if (AprilFoolsManager.getInstance().isAprilFoolsEnabled()) {
            data = JSON.parse(JSON.stringify(fetchedData)); // Deep copy
            AprilFoolsManager.getNewProxiwashDryerOrderedList(data.dryers);
            AprilFoolsManager.getNewProxiwashWasherOrderedList(data.washers);
        }
        this.fetchedData = fetchedData;

        return [
            {
                title: i18n.t('proxiwashScreen.dryers'),
                icon: 'tumble-dryer',
                data: data.dryers === undefined ? [] : data.dryers,
                keyExtractor: this.getKeyExtractor
            },
            {
                title: i18n.t('proxiwashScreen.washers'),
                icon: 'washing-machine',
                data: data.washers === undefined ? [] : data.washers,
                keyExtractor: this.getKeyExtractor
            },
        ];
    };

    /**
     * Shows a modal for the given item
     *
     * @param title The title to use
     * @param item The item to display information for in the modal
     * @param isDryer True if the given item is a dryer
     */
    showModal = (title: string, item: Object, isDryer: boolean) => {
        this.setState({
            modalCurrentDisplayItem: this.getModalContent(title, item, isDryer)
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    };

    /**
     * Callback used when the user clicks on enable notifications for a machine
     *
     * @param machineId The machine's id to set notifications for
     */
    onSetupNotificationsPress(machineId: string) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.setupNotifications(machineId)
    }

    /**
     * Generates the modal content.
     * This shows information for the given machine.
     *
     * @param title The title to use
     * @param item The item to display information for in the modal
     * @param isDryer True if the given item is a dryer
     * @return {*}
     */
    getModalContent(title: string, item: Object, isDryer: boolean) {
        let button = {
            text: i18n.t("proxiwashScreen.modal.ok"),
            icon: '',
            onPress: undefined
        };
        let message = modalStateStrings[ProxiwashConstants.machineStates[item.state]];
        const onPress = this.onSetupNotificationsPress.bind(this, item.number);
        if (ProxiwashConstants.machineStates[item.state] === ProxiwashConstants.machineStates["EN COURS"]) {
            button =
                {
                    text: this.isMachineWatched(item.number) ?
                        i18n.t("proxiwashScreen.modal.disableNotifications") :
                        i18n.t("proxiwashScreen.modal.enableNotifications"),
                    icon: '',
                    onPress: onPress
                }
            ;
            message = i18n.t('proxiwashScreen.modal.running',
                {
                    start: item.startTime,
                    end: item.endTime,
                    remaining: item.remainingTime
                });
        } else if (ProxiwashConstants.machineStates[item.state] === ProxiwashConstants.machineStates.DISPONIBLE) {
            if (isDryer)
                message += '\n' + i18n.t('proxiwashScreen.dryersTariff');
            else
                message += '\n' + i18n.t('proxiwashScreen.washersTariff');
        }
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <Card.Title
                    title={title}
                    left={() => <Avatar.Icon
                        icon={isDryer ? 'tumble-dryer' : 'washing-machine'}
                        color={this.props.theme.colors.text}
                        style={{backgroundColor: 'transparent'}}/>}

                />
                <Card.Content>
                    <Text>{message}</Text>
                </Card.Content>

                {button.onPress !== undefined ?
                    <Card.Actions>
                        <Button
                            icon={button.icon}
                            mode="contained"
                            onPress={button.onPress}
                            style={{marginLeft: 'auto', marginRight: 'auto'}}
                        >
                            {button.text}
                        </Button>
                    </Card.Actions> : null}
            </View>
        );
    }

    /**
     * Callback used when receiving modal ref
     *
     * @param ref
     */
    onModalRef = (ref: Object) => {
        this.modalRef = ref;
    };

    /**
     * Gets the number of machines available
     *
     * @param isDryer True if we are only checking for dryer, false for washers
     * @return {number} The number of machines available
     */
    getMachineAvailableNumber(isDryer: boolean) {
        let data;
        if (isDryer)
            data = this.fetchedData.dryers;
        else
            data = this.fetchedData.washers;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if (ProxiwashConstants.machineStates[data[i].state] === ProxiwashConstants.machineStates["DISPONIBLE"])
                count += 1;
        }
        return count;
    }

    /**
     * Gets the section render item
     *
     * @param section The section to render
     * @return {*}
     */
    getRenderSectionHeader = ({section}: Object) => {
        const isDryer = section.title === i18n.t('proxiwashScreen.dryers');
        const nbAvailable = this.getMachineAvailableNumber(isDryer);
        return (
            <ProxiwashSectionHeader
                title={section.title}
                nbAvailable={nbAvailable}
                isDryer={isDryer}/>
        );
    };

    /**
     * Gets the list item to be rendered
     *
     * @param item The object containing the item's FetchedData
     * @param section The object describing the current SectionList section
     * @returns {React.Node}
     */
    getRenderItem = ({item, section}: Object) => {
        const isDryer = section.title === i18n.t('proxiwashScreen.dryers');
        return (
            <ProxiwashListItem
                item={item}
                onPress={this.showModal}
                isWatched={this.isMachineWatched(item.number)}
                isDryer={isDryer}
                height={LIST_ITEM_HEIGHT}
            />
        );
    };

    render() {
        const nav = this.props.navigation;
        return (
            <View>
                <Banner
                    visible={this.state.bannerVisible}
                    actions={[
                        {
                            label: 'OK',
                            onPress: this.onHideBanner,
                        },
                    ]}
                    icon={() => <Avatar.Icon
                        icon={'information'}
                        size={40}
                    />}
                >
                    {i18n.t('proxiwashScreen.enableNotificationsTip')}
                </Banner>
                <CustomModal onRef={this.onModalRef}>
                    {this.state.modalCurrentDisplayItem}
                </CustomModal>
                <WebSectionList
                    createDataset={this.createDataset}
                    navigation={nav}
                    fetchUrl={DATA_URL}
                    renderItem={this.getRenderItem}
                    renderSectionHeader={this.getRenderSectionHeader}
                    autoRefreshTime={REFRESH_TIME}
                    refreshOnFocus={true}
                    updateData={this.state.machinesWatched.length}/>
            </View>
        );
    }
}

export default withTheme(ProxiwashScreen);
