// @flow

import * as React from 'react';
import ThemeManager from "../utils/ThemeManager";
import WebViewScreen from "../components/WebViewScreen";

type Props = {
    navigation: Object,
}


const URL = 'https://srv-falcon.etud.insa-toulouse.fr/~eeinsat/';

/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class ElusEtudScreen extends React.Component<Props> {

    render() {
        const nav = this.props.navigation;
        return (
            <WebViewScreen
                navigation={nav}
                data={[
                    {
                        url: URL,
                        icon: '',
                        name: '',
                        customJS: ''
                    },
                ]}
                headerTitle={'Élus Étudiants'}
                hasHeaderBackButton={true}
                hasSideMenu={false}/>
        );
    }
}

