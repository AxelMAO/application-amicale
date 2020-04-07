// @flow

import * as React from 'react';
import {Avatar, Card, List, ProgressBar, Subheading, withTheme} from "react-native-paper";
import {FlatList, StyleSheet} from "react-native";

type Props = {
    teams: Array<Object>,
    dateEnd: string,
}

class VoteResults extends React.Component<Props> {

    totalVotes: number;
    winnerId: number;
    colors: Object;

    constructor(props) {
        super();
        this.colors = props.theme.colors;
        props.teams.sort(this.sortByVotes);
        this.getTotalVotes(props.teams);
        this.getWinnerId(props.teams);
    }

    shouldComponentUpdate() {
        return false;
    }

    sortByVotes = (a: Object, b: Object) => b.votes - a.votes;

    getTotalVotes(teams: Array<Object>) {
        this.totalVotes = 0;
        for (let i = 0; i < teams.length; i++) {
            this.totalVotes += teams[i].votes;
        }
    }

    getWinnerId(teams: Array<Object>) {
        this.winnerId = teams[0].id;
    }

    voteKeyExtractor = (item: Object) => item.id.toString();

    resultRenderItem = ({item}: Object) => {
        const isWinner = this.winnerId === item.id;
        return (
            <Card style={{
                marginTop: 10,
                elevation: isWinner ? 5 : 3,
            }}>
                <List.Item
                    title={item.name}
                    description={item.votes + " VOTES"}
                    left={props => isWinner
                        ? <List.Icon {...props} icon="trophy" color={this.colors.primary}/>
                        : null}
                    titleStyle={{
                        color: isWinner
                            ? this.colors.primary
                            : this.colors.text
                    }}
                    style={{padding: 0}}
                />
                <ProgressBar progress={item.votes / this.totalVotes} color={this.colors.primary}/>
            </Card>
        );
    };

    render() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"RESULTS"}
                    subtitle={"AVAILABLE UNTIL " + this.props.dateEnd}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon={"podium-gold"}
                    />}
                />
                <Card.Content>
                    <Subheading>TOTAL VOTES : {this.totalVotes}</Subheading>
                    {/*$FlowFixMe*/}
                    <FlatList
                        data={this.props.teams}
                        keyExtractor={this.voteKeyExtractor}
                        renderItem={this.resultRenderItem}
                    />
                </Card.Content>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
    },
    icon: {
        backgroundColor: 'transparent'
    },
});

export default withTheme(VoteResults);
