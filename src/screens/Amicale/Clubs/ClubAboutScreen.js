// @flow

import * as React from 'react';
import {Image, ScrollView, View} from 'react-native';
import {Card, List, Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import Autolink from "react-native-autolink";

type Props = {
};

type State = {
};

const CONTACT_LINK = 'clubs@amicale-insat.fr';

/**
 * Class defining a planning event information page.
 */
class ClubAboutScreen extends React.Component<Props, State> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    render() {
        return (
            <ScrollView style={{padding: 5}}>
                <View style={{
                    width: '100%',
                    height: 100,
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image
                        source={require('../../../../assets/amicale.png')}
                        style={{flex: 1, resizeMode: "contain"}}
                        resizeMode="contain"/>
                </View>
                <Text>{i18n.t("clubs.about.text")}</Text>
                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t("clubs.about.title")}
                        subtitle={i18n.t("clubs.about.subtitle")}
                        left={props => <List.Icon {...props} icon={'information'}/>}
                    />
                    <Card.Content>
                        <Text>{i18n.t("clubs.about.message")}</Text>
                        <Autolink
                            text={CONTACT_LINK}
                            component={Text}
                        />
                    </Card.Content>
                </Card>
            </ScrollView>
        );
    }
}

export default withTheme(ClubAboutScreen);