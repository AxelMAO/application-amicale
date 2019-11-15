// @flow

import * as React from 'react';
import {Body, Container, Content, Left, ListItem, Right, Text, Thumbnail, H1, H3} from 'native-base';
import CustomHeader from "../../components/CustomHeader";
import {FlatList, Platform, View, Image} from "react-native";
import Touchable from 'react-native-platform-touchable';
import Menu, {MenuItem} from 'react-native-material-menu';
import i18n from "i18n-js";
import CustomMaterialIcon from "../../components/CustomMaterialIcon";
import ThemeManager from "../../utils/ThemeManager";
import Modalize from 'react-native-modalize';

const sortMode = {
    price: "0",
    name: '1',
};

function sortPrice(a, b) {
    return a.price - b.price;
}

function sortPriceReverse(a, b) {
    return b.price - a.price;
}

function sortName(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function sortNameReverse(a, b) {
    if (a.name < b.name)
        return 1;
    if (a.name > b.name)
        return -1;
    return 0;
}

type Props = {
    navigation: Object
}

type State = {
    navData: Array<Object>,
    currentSortMode: string,
    isSortReversed: boolean,
    sortPriceIcon: React.Node,
    sortNameIcon: React.Node,
    modalCurrentDisplayItem: Object,
    currentlyDisplayedData: Array<Object>,
};

/**
 * Class defining proximo's article list of a certain category.
 */
export default class ProximoListScreen extends React.Component<Props, State> {

    modalRef: { current: null | Modalize };
    originalData: Array<Object>;

    constructor(props: any) {
        super(props);
        this.modalRef = React.createRef();
        this.originalData = this.props.navigation.getParam('data', []);
    }

    state = {
        currentlyDisplayedData: this.props.navigation.getParam('data', []).sort(sortPrice),
        currentSortMode: sortMode.price,
        isSortReversed: false,
        sortPriceIcon: '',
        sortNameIcon: '',
        modalCurrentDisplayItem: {},
    };

    _menu: Menu;

    /**
     * Saves the reference to the sort menu for later use
     *
     * @param ref The menu reference
     */
    setMenuRef = (ref: Menu) => {
        this._menu = ref;
    };

    /**
     * Sets the sort mode based on the one selected.
     * If the selected mode is the current one, reverse it.
     *
     * @param mode The string representing the mode
     */
    sortModeSelected(mode: string) {
        let isReverse = this.state.isSortReversed;
        if (mode === this.state.currentSortMode) // reverse mode
            isReverse = !isReverse; // this.state not updating on this function cycle
        else
            isReverse = false;
        this.setSortMode(mode, isReverse);
    }

    /**
     * Set the current sort mode.
     *
     * @param mode The string representing the mode
     * @param isReverse Whether to use a reverse sort
     */
    setSortMode(mode: string, isReverse: boolean) {
        this.setState({
            currentSortMode: mode,
            isSortReversed: isReverse
        });
        let data = this.state.currentlyDisplayedData;
        switch (mode) {
            case sortMode.price:
                if (isReverse) {
                    data.sort(sortPriceReverse);
                } else {
                    data.sort(sortPrice);
                }
                break;
            case sortMode.name:
                if (isReverse) {
                    data.sort(sortNameReverse);
                } else {
                    data.sort(sortName);
                }
                break;
        }
        this.setState({
            navData: data,
        });
        this.setupSortIcons(mode, isReverse);
        this._menu.hide();
    }

    /**
     * Set the sort mode from state when components are ready
     */
    componentDidMount() {
        this.setSortMode(this.state.currentSortMode, this.state.isSortReversed);
    }

    /**
     * get color depending on quantity available
     *
     * @param availableStock
     * @return
     */
    getStockColor(availableStock: number) {
        let color: string;
        if (availableStock > 3)
            color = ThemeManager.getCurrentThemeVariables().brandSuccess;
        else if (availableStock > 0)
            color = ThemeManager.getCurrentThemeVariables().brandWarning;
        else
            color = ThemeManager.getCurrentThemeVariables().brandDanger;
        return color;
    }

    /**
     * Set the sort menu icon based on the given mode.
     *
     * @param mode The string representing the mode
     * @param isReverse Whether to use a reversed icon
     */
    setupSortIcons(mode: string, isReverse: boolean) {
        const downSortIcon =
            <CustomMaterialIcon
                icon={'sort-descending'}/>;
        const upSortIcon =
            <CustomMaterialIcon
                icon={'sort-ascending'}/>;
        switch (mode) {
            case sortMode.price:
                this.setState({sortNameIcon: ''});
                if (isReverse) {
                    this.setState({sortPriceIcon: upSortIcon});
                } else {
                    this.setState({sortPriceIcon: downSortIcon});
                }
                break;
            case sortMode.name:
                this.setState({sortPriceIcon: ''});
                if (isReverse) {
                    this.setState({sortNameIcon: upSortIcon});
                } else {
                    this.setState({sortNameIcon: downSortIcon});
                }
                break;
        }
    }


    sanitizeString(str: string) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Returns only the articles whose name contains str. Case and accents insensitive.
     * @param str
     * @returns {[]}
     */
    filterData(str: string) {
        let filteredData = [];
        const testStr = this.sanitizeString(str);
        const articles = this.originalData;
        for (const article of articles) {
            const name = this.sanitizeString(article.name);
            if (name.includes(testStr)) {
                filteredData.push(article)
            }
        }
        return filteredData;
    }

    search(str: string) {
        this.setState({
            currentlyDisplayedData: this.filterData(str)
        })
    }

    getModalContent() {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <H1>{this.state.modalCurrentDisplayItem.name}</H1>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 10,
                }}>
                    <H3 style={{
                        color: this.getStockColor(parseInt(this.state.modalCurrentDisplayItem.quantity)),
                    }}>
                        {this.state.modalCurrentDisplayItem.quantity + ' ' + i18n.t('proximoScreen.inStock')}
                    </H3>
                    <H3 style={{marginLeft: 'auto'}}>{this.state.modalCurrentDisplayItem.price}€</H3>
                </View>

                <Content>
                    <View style={{width: '100%', height: 150, marginTop: 20, marginBottom: 20}}>
                        <Image style={{flex: 1, resizeMode: "contain"}}
                               source={{uri: this.state.modalCurrentDisplayItem.image}}/>
                    </View>
                    <Text>{this.state.modalCurrentDisplayItem.description}</Text>
                </Content>
            </View>
        );
    }

    showItemDetails(item: Object) {
        this.setState({
            modalCurrentDisplayItem: item
        });
        if (this.modalRef.current) {
            this.modalRef.current.open();
        }
    }

    getSortMenu() {
        return (
            <Menu
                ref={this.setMenuRef}
                button={
                    <Touchable
                        style={{padding: 6}}
                        onPress={() =>
                            this._menu.show()
                        }>
                        <CustomMaterialIcon
                            color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                            icon={'sort'}/>
                    </Touchable>
                }
            >
                <MenuItem
                    onPress={() => this.sortModeSelected(sortMode.name)}>
                    {this.state.sortNameIcon}
                    {i18n.t('proximoScreen.sortName')}
                </MenuItem>
                <MenuItem
                    onPress={() => this.sortModeSelected(sortMode.price)}>
                    {this.state.sortPriceIcon}
                    {i18n.t('proximoScreen.sortPrice')}
                </MenuItem>
            </Menu>
        );
    }

    render() {
        const nav = this.props.navigation;
        const navType = nav.getParam('type', '{name: "Error"}');

        return (
            <Container>
                <Modalize ref={this.modalRef}
                          adjustToContentHeight
                          modalStyle={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
                    {this.getModalContent()}
                </Modalize>
                <CustomHeader
                    hasBackButton={true}
                    navigation={nav}
                    hasSearchField={true}
                    searchCallback={(text) => this.search(text)}
                    rightButton={this.getSortMenu()}/>

                <Content>
                    <FlatList
                        data={this.state.currentlyDisplayedData}
                        extraData={this.state.currentlyDisplayedData}
                        keyExtractor={(item) => item.name + item.code}
                        style={{minHeight: 300, width: '100%'}}
                        renderItem={({item}) =>
                            <ListItem
                                thumbnail
                                onPress={() => {
                                    this.showItemDetails(item);
                                }}
                            >
                                <Left>
                                    <Thumbnail square source={{uri: item.image}}/>
                                </Left>
                                <Body>
                                    <Text style={{marginLeft: 20}}>
                                        {item.name}
                                    </Text>
                                    <Text note style={{
                                        marginLeft: 20,
                                        color: this.getStockColor(parseInt(item.quantity))
                                    }}>
                                        {item.quantity + ' ' + i18n.t('proximoScreen.inStock')}
                                    </Text>
                                </Body>
                                <Right>
                                    <Text style={{fontWeight: "bold"}}>
                                        {item.price}€
                                    </Text>
                                </Right>
                            </ListItem>}
                    />
                </Content>
            </Container>
        );
    }
}
