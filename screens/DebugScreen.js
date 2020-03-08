// @flow

import * as React from 'react';
import ThemeManager from '../utils/ThemeManager';
import {Alert, Clipboard, ScrollView, View} from "react-native";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import NotificationsManager from "../utils/NotificationsManager";
import CustomModal from "../components/CustomModal";
import {Button, Card, List, Subheading, TextInput, Title} from 'react-native-paper';

type Props = {
    navigation: Object,
};

type State = {
    modalCurrentDisplayItem: Object,
    currentPreferences: Object,
}

/**
 * Class defining the Debug screen. This screen allows the user to get detailed information on the app/device.
 */
export default class DebugScreen extends React.Component<Props, State> {

    modalRef: Object;
    modalInputValue = '';
    state = {
        modalCurrentDisplayItem: {},
        currentPreferences: JSON.parse(JSON.stringify(AsyncStorageManager.getInstance().preferences))
    };

    onModalRef: Function;

    constructor(props: any) {
        super(props);
        this.onModalRef = this.onModalRef.bind(this);
    }

    static getGeneralItem(onPressCallback: Function, icon: ?string, title: string, subtitle: string) {
        if (icon !== undefined) {
            return (
                <List.Item
                    title={title}
                    description={subtitle}
                    left={() => <List.Icon icon={icon}/>}
                    onPress={onPressCallback}
                />
            );
        } else {
            return (
                <List.Item
                    title={title}
                    description={subtitle}
                    onPress={onPressCallback}
                />
            );
        }
    }

    alertCurrentExpoToken() {
        let token = AsyncStorageManager.getInstance().preferences.expoToken.current;
        Alert.alert(
            'Expo Token',
            token,
            [
                {text: 'Copy', onPress: () => Clipboard.setString(token)},
                {text: 'OK'}
            ]
        );
    }

    async forceExpoTokenUpdate() {
        await NotificationsManager.forceExpoTokenUpdate();
        this.alertCurrentExpoToken();
    }

    showEditModal(item: Object) {
        this.setState({
            modalCurrentDisplayItem: item
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    }

    getModalContent() {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <Title>{this.state.modalCurrentDisplayItem.key}</Title>
                <Subheading>Default: {this.state.modalCurrentDisplayItem.default}</Subheading>
                <Subheading>Current: {this.state.modalCurrentDisplayItem.current}</Subheading>
                <TextInput
                    label='New Value'
                    onChangeText={(text) => this.modalInputValue = text}
                />
                <View style={{
                    flexDirection: 'row',
                    marginTop: 10,
                }}>
                    <Button
                        mode="contained"
                        dark={true}
                        color={ThemeManager.getCurrentThemeVariables().success}
                        onPress={() => this.saveNewPrefs(this.state.modalCurrentDisplayItem.key, this.modalInputValue)}>
                        Save new value
                    </Button>
                    <Button
                        mode="contained"
                        dark={true}
                        color={ThemeManager.getCurrentThemeVariables().danger}
                        onPress={() => this.saveNewPrefs(this.state.modalCurrentDisplayItem.key, this.state.modalCurrentDisplayItem.default)}>
                        Reset to default
                    </Button>
                </View>

            </View>
        );
    }

    saveNewPrefs(key: string, value: string) {
        this.setState((prevState) => {
            let currentPreferences = {...prevState.currentPreferences};
            currentPreferences[key].current = value;
            return {currentPreferences};
        });
        AsyncStorageManager.getInstance().savePref(key, value);
    }

    onModalRef(ref: Object) {
        this.modalRef = ref;
    }

    render() {
        return (
            <View>
                <CustomModal onRef={this.onModalRef}>
                    {this.getModalContent()}
                </CustomModal>
                <ScrollView style={{padding: 5}}>
                    <Card style={{margin: 5}}>
                        <Card.Title
                            title={'Notifications'}
                        />
                        <Card.Content>
                            {DebugScreen.getGeneralItem(() => this.alertCurrentExpoToken(), 'bell', 'Get current Expo Token', '')}
                            {DebugScreen.getGeneralItem(() => this.forceExpoTokenUpdate(), 'bell-ring', 'Force Expo token update', '')}
                        </Card.Content>
                    </Card>
                    <Card style={{margin: 5}}>
                        <Card.Title
                            title={'Preferences'}
                        />
                        <Card.Content>
                            {Object.values(this.state.currentPreferences).map((object) =>
                                <View>
                                    {DebugScreen.getGeneralItem(() => this.showEditModal(object), undefined, object.key, 'Click to edit')}
                                </View>
                            )}
                        </Card.Content>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}
