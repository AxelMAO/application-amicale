// @flow

import * as React from 'react';
import {Avatar, Button, Card, Paragraph, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import {Linking} from 'react-native';
import type {CustomThemeType} from '../../managers/ThemeManager';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';

type PropsType = {
  theme: CustomThemeType,
};

const links = {
  bugsMail: `mailto:app@amicale-insat.fr?subject=[BUG] Application CAMPUS
&body=Coucou Arnaud ça bug c'est nul,\n\n
Informations sur ton système si tu sais (iOS ou Android, modèle du tel, version):\n\n\n
Nature du problème :\n\n\n
Étapes pour reproduire ce pb :\n\n\n\n
Stp corrige le pb, bien cordialement.`,
  bugsGit:
    'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues/new',
  facebook: 'https://www.facebook.com/campus.insat',
  feedbackMail: `mailto:app@amicale-insat.fr?subject=[FEEDBACK] Application CAMPUS
&body=Coucou Arnaud j'ai du feedback\n\n\n\nBien cordialement.`,
  feedbackGit:
    'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues/new',
};

class FeedbackScreen extends React.Component<PropsType> {
  /**
   * Gets link buttons
   *
   * @param isBug True if buttons should redirect to bug report methods
   * @returns {*}
   */
  static getButtons(isBug: boolean): React.Node {
    return (
      <Card.Actions
        style={{
          flex: 1,
          flexWrap: 'wrap',
        }}>
        <Button
          icon="email"
          mode="contained"
          style={{
            marginLeft: 'auto',
            marginTop: 5,
          }}
          onPress={() => {
            Linking.openURL(isBug ? links.bugsMail : links.feedbackMail);
          }}>
          MAIL
        </Button>
        <Button
          icon="git"
          mode="contained"
          color="#609927"
          style={{
            marginLeft: 'auto',
            marginTop: 5,
          }}
          onPress={() => {
            Linking.openURL(isBug ? links.bugsGit : links.feedbackGit);
          }}>
          GITEA
        </Button>
        <Button
          icon="facebook"
          mode="contained"
          color="#2e88fe"
          style={{
            marginLeft: 'auto',
            marginTop: 5,
          }}
          onPress={() => {
            Linking.openURL(links.facebook);
          }}>
          Facebook
        </Button>
      </Card.Actions>
    );
  }

  render(): React.Node {
    const {theme} = this.props;
    return (
      <CollapsibleScrollView style={{padding: 5}}>
        <Card>
          <Card.Title
            title={i18n.t('screens.feedback.bugs')}
            subtitle={i18n.t('screens.feedback.bugsSubtitle')}
            left={({
              size,
              color,
            }: {
              size: number,
              color: number,
            }): React.Node => (
              <Avatar.Icon size={size} color={color} icon="bug" />
            )}
          />
          <Card.Content>
            <Paragraph>{i18n.t('screens.feedback.bugsDescription')}</Paragraph>
            <Paragraph style={{color: theme.colors.primary}}>
              {i18n.t('screens.feedback.contactMeans')}
            </Paragraph>
          </Card.Content>
          {FeedbackScreen.getButtons(true)}
        </Card>

        <Card style={{marginTop: 20, marginBottom: 10}}>
          <Card.Title
            title={i18n.t('screens.feedback.title')}
            subtitle={i18n.t('screens.feedback.feedbackSubtitle')}
            left={({
              size,
              color,
            }: {
              size: number,
              color: number,
            }): React.Node => (
              <Avatar.Icon size={size} color={color} icon="comment" />
            )}
          />
          <Card.Content>
            <Paragraph>
              {i18n.t('screens.feedback.feedbackDescription')}
            </Paragraph>
          </Card.Content>
          {FeedbackScreen.getButtons(false)}
        </Card>
      </CollapsibleScrollView>
    );
  }
}

export default withTheme(FeedbackScreen);
