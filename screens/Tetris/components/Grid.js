// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import Cell from "./Cell";

type Props = {
    navigation: Object,
    grid: Array<Array<Object>>,
    height: number,
    width: number,
}

class Grid extends React.Component<Props>{

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    getRow(rowNumber: number) {
        let cells = [];
        for (let i = 0; i < this.props.width; i++) {
            let cell = this.props.grid[rowNumber][i];
            cells.push(<Cell color={cell.color} isEmpty={cell.isEmpty}/>);
        }
        return(
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#fff'
            }}>
                {cells}
            </View>
        );
    }

    getGrid() {
        let rows = [];
        for (let i = 0; i < this.props.height; i++) {
            rows.push(this.getRow(i));
        }
        return rows;
    }

    render() {
        return (
            <View style={{
                flexDirection: 'column',
                height: '80%',
                aspectRatio: this.props.width/this.props.height,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}>
                {this.getGrid()}
            </View>
        );
    }
}

export default withTheme(Grid);
