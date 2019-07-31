// @flow

import * as React from 'react';
import {Platform, Dimensions, StyleSheet, Image, FlatList, Linking} from 'react-native';
import {Badge, Text, Container, Content, Left, ListItem, Right} from "native-base";
import i18n from "i18n-js";
import CustomMaterialIcon from '../components/CustomMaterialIcon';

const deviceHeight = Dimensions.get("window").height;

const drawerCover = require("../assets/drawer-cover.png");

const WIKETUD_LINK = "https://www.etud.insa-toulouse.fr/wiketud/index.php/Accueil";
const Amicale_LINK = "https://www.etud.insa-toulouse.fr/~amicale";

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
                name: "Amicale",
                route: "amicale",
                icon: "web",
                bg: "#477EEA",
                // types: "11"
            },

            {
                name: "Wiketud",
                route: "wiketud",
                icon: "web",
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

    /**
     * Navigate to the selected route, close the drawer, and mark the correct item as selected
     * @param route {string} The route name to navigate to
     */
    navigateToScreen(route: string) {
        this.props.navigation.navigate(route);
        this.props.navigation.closeDrawer();
        this.setState({active: route});
    };

    render() {
        return (
            <Container>
                <Content
                    bounces={false}
                    style={{flex: 1, top: -1}}
                >
                    <Image source={drawerCover} style={styles.drawerCover}/>

                    <FlatList
                        data={this.dataSet}
                        extraData={this.state}
                        keyExtractor={(item) => item.route}
                        renderItem={({item}) =>
                            <ListItem
                                button
                                noBorder={item.name !== 'Wiketud' && item.name !== 'Proximo'} // Display a separator before settings and Amicale
                                selected={this.state.active === item.route}
                                onPress={() => {
                                    if (item.name !== 'Wiketud' && item.name !== 'Amicale')
                                        this.navigateToScreen(item.route);
                                    else if (item.name === 'Wiketud')
                                        Linking.openURL(WIKETUD_LINK).catch((err) => console.error('Error opening link', err));
                                    else if (item.name === 'Amicale')
                                        Linking.openURL(Amicale_LINK).catch((err) => console.error('Error opening link', err));
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
