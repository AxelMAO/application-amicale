// @flow

import * as React from 'react';
import {View} from 'react-native';
import i18n from "i18n-js";
import WebSectionList from "../components/WebSectionList";
import {Card, Text, withTheme} from 'react-native-paper';
import AprilFoolsManager from "../utils/AprilFoolsManager";

const DATA_URL = "https://etud.insa-toulouse.fr/~amicale_app/menu/menu_data.json";

type Props = {
    navigation: Object,
}

/**
 * Class defining the app's menu screen.
 * This screen fetches data from etud to render the RU menu
 */
class SelfMenuScreen extends React.Component<Props> {

    // Hard code strings as toLocaleDateString does not work on current android JS engine
    daysOfWeek = [];
    monthsOfYear = [];

    getRenderItem: Function;
    getRenderSectionHeader: Function;
    createDataset: Function;
    colors: Object;

    constructor(props) {
        super(props);
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.monday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.tuesday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.wednesday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.thursday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.friday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.saturday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.sunday"));

        this.monthsOfYear.push(i18n.t("date.monthsOfYear.january"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.february"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.march"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.april"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.may"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.june"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.july"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.august"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.september"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.october"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.november"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.december"));

        this.getRenderItem = this.getRenderItem.bind(this);
        this.getRenderSectionHeader = this.getRenderSectionHeader.bind(this);
        this.createDataset = this.createDataset.bind(this);
        this.colors = props.theme.colors;
    }

    getKeyExtractor(item: Object) {
        return item !== undefined ? item['name'] : undefined;
    }

    createDataset(fetchedData: Object) {
        let result = [];
        // Prevent crash by giving a default value when fetchedData is empty (not yet available)
        if (Object.keys(fetchedData).length === 0) {
            result = [
                {
                    title: '',
                    data: [],
                    extraData: super.state,
                    keyExtractor: this.getKeyExtractor
                }
            ];
        }
        if (AprilFoolsManager.getInstance().isAprilFoolsEnabled() && fetchedData.length > 0)
            fetchedData[0].meal[0].foodcategory = AprilFoolsManager.getFakeMenuItem(fetchedData[0].meal[0].foodcategory);
        // fetched data is an array here
        for (let i = 0; i < fetchedData.length; i++) {
            result.push(
                {
                    title: this.getFormattedDate(fetchedData[i].date),
                    data: fetchedData[i].meal[0].foodcategory,
                    extraData: super.state,
                    keyExtractor: this.getKeyExtractor,
                }
            );
        }
        return result
    }

    getFormattedDate(dateString: string) {
        let dateArray = dateString.split('-');
        let date = new Date();
        date.setFullYear(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
        return this.daysOfWeek[date.getDay() - 1] + " " + date.getDate() + " " + this.monthsOfYear[date.getMonth()] + " " + date.getFullYear();
    }

    getRenderSectionHeader({section}: Object) {
        return (
            <Card style={{
                width: '95%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
                marginBottom: 5,
                elevation: 4,
            }}>
                <Card.Title
                    title={section.title}
                    titleStyle={{
                        textAlign: 'center'
                    }}
                    subtitleStyle={{
                        textAlign: 'center'
                    }}
                    style={{
                        paddingLeft: 0,
                    }}
                />
            </Card>
        );
    }

    getRenderItem({item}: Object) {
        return (
            <Card style={{
                flex: 0,
                marginHorizontal: 10,
                marginVertical: 5,
            }}>
                <Card.Title
                    style={{marginTop: 5}}
                    title={item.name}
                />
                <View style={{
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderBottomWidth: 1,
                    borderBottomColor: this.colors.primary,
                    marginTop: 5,
                    marginBottom: 5,
                }}/>
                <Card.Content>
                    {item.dishes.map((object) =>
                        <View>
                            {object.name !== "" ?
                                <Text style={{
                                    marginTop: 5,
                                    marginBottom: 5,
                                    textAlign: 'center'
                                }}>{this.formatName(object.name)}</Text>
                                : <View/>}
                        </View>)}
                </Card.Content>
            </Card>
        );
    }

    formatName(name: String) {
        return name.charAt(0) + name.substr(1).toLowerCase();
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebSectionList
                createDataset={this.createDataset}
                navigation={nav}
                autoRefreshTime={0}
                refreshOnFocus={false}
                fetchUrl={DATA_URL}
                renderItem={this.getRenderItem}
                renderSectionHeader={this.getRenderSectionHeader}
                stickyHeader={true}/>
        );
    }
}

export default withTheme(SelfMenuScreen);
