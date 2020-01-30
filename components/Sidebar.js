// @flow

import * as React from 'react';
import {Dimensions, FlatList, Image, Linking, Platform, StyleSheet} from 'react-native';
import {Badge, Container, Content, Left, ListItem, Right, Text} from "native-base";
import i18n from "i18n-js";
import CustomMaterialIcon from '../components/CustomMaterialIcon';
import ThemeManager from "../utils/ThemeManager";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const drawerCover = require("../assets/drawer-cover.png");

type Props = {
    navigation: Object,
};

type State = {
    active: string,
};

/**
 * Class used to define a navigation drawer
 */
export default class SideBar extends React.Component<Props, State> {

    dataSet: Array<Object>;

    state = {
        active: 'Home',
    };

    /**
     * Generate the datasets
     *
     * @param props
     */
    constructor(props: Props) {
        super(props);
        // Dataset used to render the drawer
        // If the link field is defined, clicking on the item will open the link
        this.dataSet = [
            {
                name: i18n.t('sidenav.divider1'),
                route: "Divider1"
            },
            {
                name: "Amicale",
                route: "AmicaleScreen",
                icon: "web",
            },
            {
                name: "Élus Étudiants",
                route: "ElusEtudScreen",
                icon: "alpha-e-box",
            },
            {
                name: "Wiketud",
                route: "WiketudScreen",
                icon: "wikipedia",
            },
            {
                name: "Tutor'INSA",
                route: "TutorInsaScreen",
                icon: "school",
            },
            {
                name: "Mails BlueMind",
                route: "BlueMindScreen",
                icon: "email",
            },
            {
                name: i18n.t('sidenav.divider2'),
                route: "Divider2"
            },
            {
                name: i18n.t('screens.availableRooms'),
                route: "AvailableRoomScreen",
                icon: "calendar-check",
            },
            {
                name: i18n.t('screens.menuSelf'),
                route: "SelfMenuScreen",
                icon: "silverware-fork-knife",
            },
            {
                name: i18n.t('sidenav.divider3'),
                route: "Divider3"
            },
            {
                name: i18n.t('screens.settings'),
                route: "SettingsScreen",
                icon: "settings",
            },
        ];
    }

    getRenderItem(item: Object) {
        if (item.icon !== undefined) {
            return (
                <ListItem
                    button
                    noBorder
                    selected={this.state.active === item.route}
                    onPress={() => {
                        if (item.link !== undefined)
                            Linking.openURL(item.link).catch((err) => console.error('Error opening link', err));
                        else
                            this.navigateToScreen(item.route);
                    }}
                >
                    <Left>
                        <CustomMaterialIcon
                            icon={item.icon}
                            active={this.state.active === item.route}
                        />
                        <Text style={styles.text}>
                            {item.name}
                        </Text>
                    </Left>
                    {item.types &&
                    <Right style={{flex: 1}}>
                        <Badge
                            style={{
                                borderRadius: 3,
                                height: 25,
                                width: 72,
                                backgroundColor: item.bg
                            }}
                        >
                            <Text
                                style={styles.badgeText}
                            >{`${item.types} Types`}</Text>
                        </Badge>
                    </Right>}
                </ListItem>
            );
        } else {
            return (
                <ListItem itemDivider>
                    <Text>{item.name}</Text>
                </ListItem>
            );
        }

    }

    /**
     * Navigate to the selected route
     * @param route {string} The route name to navigate to
     */
    navigateToScreen(route: string) {
        this.props.navigation.navigate(route);
    };

    render() {
        return (
            <Container style={{
                backgroundColor: ThemeManager.getCurrentThemeVariables().sideMenuBgColor,
            }}>
                <Image source={drawerCover} style={styles.drawerCover}/>
                <FlatList
                    data={this.dataSet}
                    extraData={this.state}
                    keyExtractor={(item) => item.route}
                    renderItem={({item}) => this.getRenderItem(item)}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    drawerCover: {
        height: deviceWidth / 3,
        width: 2 * deviceWidth / 3,
        position: "relative",
        marginBottom: 10,
        marginTop: 20
    },
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
    },
    badgeText: {
        fontSize: Platform.OS === "ios" ? 13 : 11,
        fontWeight: "400",
        textAlign: "center",
        marginTop: Platform.OS === "android" ? -3 : undefined
    }
});
