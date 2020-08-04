// @flow

import * as React from 'react';
import {Animated} from 'react-native';
import type {CollapsibleComponentPropsType} from './CollapsibleComponent';
import CollapsibleComponent from './CollapsibleComponent';

type PropsType = {
  ...CollapsibleComponentPropsType,
};

// eslint-disable-next-line react/prefer-stateless-function
class CollapsibleSectionList extends React.Component<PropsType> {
  render(): React.Node {
    const {props} = this;
    return (
      <CollapsibleComponent // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        component={Animated.SectionList}>
        {props.children}
      </CollapsibleComponent>
    );
  }
}

export default CollapsibleSectionList;