// @flow

import * as React from 'react';
import {FlatList, Linking, Platform, View} from 'react-native';
import {Body, Button, Card, CardItem, Container, H1, Left, Right, Text, Thumbnail} from 'native-base';
import CustomHeader from "../../components/CustomHeader";
import i18n from "i18n-js";
import appJson from '../../app';
import packageJson from '../../package';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AsyncStorageManager from "../../utils/AsyncStorageManager";
import {Modalize} from "react-native-modalize";
import ThemeManager from "../../utils/ThemeManager";

const links = {
    appstore: 'https://apps.apple.com/us/app/campus-amicale-insat/id1477722148',
    playstore: 'https://play.google.com/store/apps/details?id=fr.amicaleinsat.application',
    git: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/README.md',
    bugsMail: 'mailto:vergnet@etud.insa-toulouse.fr?' +
        'subject=' +
        '[BUG] Application Amicale INSA Toulouse' +
        '&body=' +
        'Coucou Arnaud ça bug c\'est nul,\n\n' +
        'Informations sur ton système si tu sais (iOS ou Android, modèle du tel, version):\n\n\n' +
        'Nature du problème :\n\n\n' +
        'Étapes pour reproduire ce pb :\n\n\n\n' +
        'Stp corrige le pb, bien cordialement.',
    bugsGit: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues',
    changelog: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/Changelog.md',
    license: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/LICENSE',
    authorMail: "mailto:vergnet@etud.insa-toulouse.fr?" +
        "subject=" +
        "Application Amicale INSA Toulouse" +
        "&body=" +
        "Coucou !\n\n",
    authorLinkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
    yohanMail: "mailto:ysimard@etud.insa-toulouse.fr?" +
        "subject=" +
        "Application Amicale INSA Toulouse" +
        "&body=" +
        "Coucou !\n\n",
    yohanLinkedin: 'https://www.linkedin.com/in/yohan-simard',
    react: 'https://facebook.github.io/react-native/',
};

type Props = {
    navigation: Object,
};

type State = {
    isDebugUnlocked: boolean,
};

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
export default class AboutScreen extends React.Component<Props, State> {

    debugTapCounter = 0;
    modalRef: { current: null | Modalize };

    state = {
        isDebugUnlocked: AsyncStorageManager.getInstance().preferences.debugUnlocked.current === '1'
    };
    /**
     * Data to be displayed in the app card
     */
    appData: Array<Object> = [
        {
            onPressCallback: () => openWebLink(Platform.OS === "ios" ? links.appstore : links.playstore),
            icon: Platform.OS === "ios" ? 'apple' : 'google-play',
            text: Platform.OS === "ios" ? i18n.t('aboutScreen.appstore') : i18n.t('aboutScreen.playstore'),
            showChevron: true
        },
        {
            onPressCallback: () => this.openBugReportModal(),
            icon: 'bug',
            text: i18n.t('aboutScreen.bugs'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.git),
            icon: 'git',
            text: 'Git',
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.changelog),
            icon: 'refresh',
            text: i18n.t('aboutScreen.changelog'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.license),
            icon: 'file-document',
            text: i18n.t('aboutScreen.license'),
            showChevron: true
        },
        {
            onPressCallback: () => this.props.navigation.navigate('DebugScreen'),
            icon: 'bug-check',
            text: i18n.t('aboutScreen.debug'),
            showChevron: true,
            showOnlyDebug: true
        },
    ];
    /**
     * Data to be displayed in the author card
     */
    authorData: Array<Object> = [
        {
            onPressCallback: () => this.tryUnlockDebugMode(),
            icon: 'account-circle',
            text: 'Arnaud VERGNET',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.authorMail),
            icon: 'email',
            text: i18n.t('aboutScreen.authorMail'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.authorLinkedin),
            icon: 'linkedin',
            text: 'Linkedin',
            showChevron: true
        },
    ];
    /**
     * Data to be displayed in the additional developer card
     */
    additionalDevData: Array<Object> = [
        {
            onPressCallback: () => console.log('Meme this'),
            icon: 'account',
            text: 'Yohan SIMARD',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.yohanMail),
            icon: 'email',
            text: i18n.t('aboutScreen.authorMail'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.yohanLinkedin),
            icon: 'linkedin',
            text: 'Linkedin',
            showChevron: true
        },
    ];
    /**
     * Data to be displayed in the technologies card
     */
    technoData: Array<Object> = [
        {
            onPressCallback: () => openWebLink(links.react),
            icon: 'react',
            text: i18n.t('aboutScreen.reactNative'),
            showChevron: true
        },
        {
            onPressCallback: () => this.props.navigation.navigate('AboutDependenciesScreen', {data: packageJson.dependencies}),
            icon: 'developer-board',
            text: i18n.t('aboutScreen.libs'),
            showChevron: true
        },
    ];
    dataOrder: Array<Object> = [
        {
            id: 'app',
        },
        {
            id: 'team',
        },
        {
            id: 'techno',
        },
    ];

    getCardItem: Function;
    getMainCard: Function;

    constructor(props: any) {
        super(props);
        this.modalRef = React.createRef();
        this.getCardItem = this.getCardItem.bind(this);
        this.getMainCard = this.getMainCard.bind(this);
    }

    getAppCard() {
        return (
            <Card>
                <CardItem>
                    <Left>
                        <Thumbnail square source={require('../../assets/android.icon.png')}/>
                        <Body>
                            <H1>{appJson.expo.name}</H1>
                            <Text note>
                                v.{appJson.expo.version}
                            </Text>
                        </Body>
                    </Left>
                </CardItem>
                <FlatList
                    data={this.appData}
                    extraData={this.state}
                    keyExtractor={(item) => item.icon}
                    listKey={"app"}
                    renderItem={this.getCardItem}
                />
            </Card>
        );
    }

    getTeamCard() {
        return (
            <Card>
                <CardItem>
                    <Left>
                        <MaterialCommunityIcons
                            name='account-multiple'
                            size={40}
                            color={ThemeManager.getCurrentThemeVariables().customMaterialIconColor}/>
                        <Body>
                            <H1>{i18n.t('aboutScreen.team')}</H1>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem header>
                    <Text>{i18n.t('aboutScreen.author')}</Text>
                </CardItem>
                <FlatList
                    data={this.authorData}
                    extraData={this.state}
                    keyExtractor={(item) => item.icon}
                    listKey={"team1"}
                    renderItem={this.getCardItem}
                />
                <CardItem header>
                    <Text>{i18n.t('aboutScreen.additionalDev')}</Text>
                </CardItem>
                <FlatList
                    data={this.additionalDevData}
                    extraData={this.state}
                    keyExtractor={(item) => item.icon}
                    listKey={"team2"}
                    renderItem={this.getCardItem}
                />
            </Card>
        );
    }

    getTechnoCard() {
        return (
            <Card>
                <CardItem header>
                    <Text>{i18n.t('aboutScreen.technologies')}</Text>
                </CardItem>
                <FlatList
                    data={this.technoData}
                    extraData={this.state}
                    keyExtractor={(item) => item.icon}
                    listKey={"techno"}
                    renderItem={this.getCardItem}
                />
            </Card>
        );
    }

    /**
     * Get a clickable card item to be rendered inside a card.
     *
     * @returns {React.Node}
     */
    getCardItem({item}: Object) {
        let shouldShow = !item.showOnlyInDebug || (item.showOnlyInDebug && this.state.isDebugUnlocked);
        if (shouldShow) {
            return (
                <CardItem button
                          onPress={item.onPressCallback}>
                    <Left>
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={26}
                            color={ThemeManager.getCurrentThemeVariables().customMaterialIconColor}/>
                        <Text>{item.text}</Text>
                    </Left>
                    {item.showChevron ?
                        <Right>
                            <MaterialCommunityIcons
                                name={'chevron-right'}
                                size={26}
                                color={ThemeManager.getCurrentThemeVariables().customMaterialIconColor}/>
                        </Right>
                        :
                        <Right/>
                    }
                </CardItem>)
                ;
        } else {
            return <View/>
        }

    }

    tryUnlockDebugMode() {
        this.debugTapCounter = this.debugTapCounter + 1;
        if (this.debugTapCounter >= 4) {
            this.unlockDebugMode();
        }
    }

    unlockDebugMode() {
        this.setState({isDebugUnlocked: true});
        let key = AsyncStorageManager.getInstance().preferences.debugUnlocked.key;
        AsyncStorageManager.getInstance().savePref(key, '1');
    }

    getBugReportModal() {
        const onPressMail = openWebLink.bind(this, links.bugsMail);
        const onPressGit = openWebLink.bind(this, links.bugsGit);
        return (
            <Modalize ref={this.modalRef}
                      adjustToContentHeight
                      modalStyle={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
                <View style={{
                    flex: 1,
                    padding: 20
                }}>
                    <H1>{i18n.t('aboutScreen.bugs')}</H1>
                    <Text>
                        {i18n.t('aboutScreen.bugsDescription')}
                    </Text>
                    <Button
                        style={{
                            marginTop: 20,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        onPress={onPressMail}>
                        <MaterialCommunityIcons
                            name={'email'}
                            size={26}
                            color={'#fff'}/>
                        <Text>{i18n.t('aboutScreen.bugsMail')}</Text>
                    </Button>
                    <Button
                        style={{
                            marginTop: 20,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        onPress={onPressGit}>
                        <MaterialCommunityIcons
                            name={'git'}
                            size={26}
                            color={'#fff'}/>
                        <Text>{i18n.t('aboutScreen.bugsGit')}</Text>
                    </Button>
                </View>
            </Modalize>
        );
    }

    openBugReportModal() {
        if (this.modalRef.current) {
            this.modalRef.current.open();
        }
    }

    getMainCard({item}: Object) {
        switch (item.id) {
            case 'app':
                return this.getAppCard();
            case 'team':
                return this.getTeamCard();
            case 'techno':
                return this.getTechnoCard();
        }
        return <View/>;
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                {this.getBugReportModal()}
                <CustomHeader navigation={nav} title={i18n.t('screens.about')} hasBackButton={true}/>
                <FlatList
                    style={{padding: 5}}
                    data={this.dataOrder}
                    extraData={this.state}
                    keyExtractor={(item) => item.id}
                    renderItem={this.getMainCard}
                />
            </Container>
        );
    }
}
