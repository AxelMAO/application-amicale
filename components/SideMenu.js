import React from 'react';
import {Platform, Dimensions, StyleSheet, Image, FlatList} from 'react-native';
import {Badge, Text, Container, Content, Icon, Left, ListItem, Right} from "native-base";
import i18n from "i18n-js";

const deviceHeight = Dimensions.get("window").height;

const drawerCover = require("../assets/drawer-cover.png");

export default class SideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 'Home',
        };
        this.dataSet = [
            {
                name: i18n.t('screens.home'),
                route: "Home",
                icon: "home",
                bg: "#C5F442"
                // types: "11" // Shows the badge
            },
            {
                name: i18n.t('screens.planning'),
                route: "Planning",
                icon: "calendar-range",
                bg: "#477EEA",
                // types: "11"
            },
            {
                name: "Proxiwash",
                route: "Proxiwash",
                icon: "washing-machine",
                bg: "#477EEA",
                // types: "11"
            },
            {
                name: "Proximo",
                route: "Proximo",
                icon: "shopping",
                bg: "#477EEA",
                // types: "11"
            },
            {
                name: i18n.t('screens.settings'),
                route: "Settings",
                icon: "settings",
                bg: "#477EEA",
                // types: "11"
            },
            {
                name: i18n.t('screens.about'),
                route: "About",
                icon: "information",
                bg: "#477EEA",
                // types: "11"
            },
        ];
    }

    navigateToScreen = (route) => () => {
        this.props.navigation.navigate(route);
        this.props.navigation.closeDrawer();
        this.setState({active: route});
    };

    render() {
        return (
            <Container>
                <Content
                    bounces={false}
                    style={{ flex: 1, top: -1 }}
                >
                    <Image source={drawerCover} style={styles.drawerCover} />

                    <FlatList
                        data={this.dataSet}
                        extraData={this.state}
                        keyExtractor={(item, index) => item.route}
                        renderItem={({item}) =>
                            <ListItem
                                button
                                noBorder={item.route !== 'Proximo'} // Display a separator before settings
                                selected={this.state.active === item.route}
                                onPress={
                                    this.navigateToScreen(item.route)
                                }
                            >
                                <Left>
                                    <Icon
                                        active
                                        name={item.icon}
                                        type={'MaterialCommunityIcons'}
                                        style={{ color: "#777", fontSize: 26, width: 30 }}
                                    />
                                    <Text style={styles.text}>
                                        {item.name}
                                    </Text>
                                </Left>
                                {item.types &&
                                <Right style={{ flex: 1 }}>
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
                            </ListItem>}
                    />
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    drawerCover: {
        alignSelf: "stretch",
        height: deviceHeight / 4,
        width: null,
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
