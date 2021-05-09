/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

const STUDENT_SERVER = 'https://etud.insa-toulouse.fr/';
const AMICALE_SERVER = 'https://www.amicale-insat.fr/';
const GIT_SERVER =
  'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/';

const AMICALE_ENDPOINT = AMICALE_SERVER + 'api/';

const APP_ENDPOINT = STUDENT_SERVER + '~amicale_app/v2/';
const PROXIMO_ENDPOINT = STUDENT_SERVER + '~proximo/data/stock-v2.json';
const APP_IMAGES_ENDPOINT = STUDENT_SERVER + '~amicale_app/images/';

export default {
  amicale: {
    api: APP_ENDPOINT,
    resetPassword: AMICALE_SERVER + 'password/reset',
    events: AMICALE_ENDPOINT + 'event/list',
  },
  app: {
    api: APP_ENDPOINT,
    dashboard: APP_ENDPOINT + 'dashboard/dashboard_data.json',
    menu: APP_ENDPOINT + 'menu/menu_data.json',
  },
  proximo: PROXIMO_ENDPOINT,
  images: {
    proxiwash: APP_IMAGES_ENDPOINT + 'Proxiwash.png',
    washer: APP_IMAGES_ENDPOINT + 'ProxiwashLaveLinge.png',
    dryer: APP_IMAGES_ENDPOINT + 'ProxiwashSecheLinge.png',
    proximo: APP_IMAGES_ENDPOINT + 'Proximo.png',
    clubs: APP_IMAGES_ENDPOINT + 'Clubs.png',
    profile: APP_IMAGES_ENDPOINT + 'ProfilAmicaliste.png',
    equipment: APP_IMAGES_ENDPOINT + 'Materiel.png',
    vote: APP_IMAGES_ENDPOINT + 'Vote.png',
    amicale: APP_IMAGES_ENDPOINT + 'WebsiteAmicale.png',
    wiketud: APP_IMAGES_ENDPOINT + 'Wiketud.png',
    elusEtudiants: APP_IMAGES_ENDPOINT + 'EEC.png',
    tutorInsa: APP_IMAGES_ENDPOINT + 'TutorINSA.png',
    bib: APP_IMAGES_ENDPOINT + 'Bib.png',
    menu: APP_IMAGES_ENDPOINT + 'RU.png',
    availableRooms: APP_IMAGES_ENDPOINT + 'Salles.png',
    bluemind: APP_IMAGES_ENDPOINT + 'Bluemind.png',
    ent: APP_IMAGES_ENDPOINT + 'ENT.png',
    insaAccount: APP_IMAGES_ENDPOINT + 'Account.png',
  },
  websites: {
    amicale: AMICALE_SERVER,
    availableRooms: 'http://planex.insa-toulouse.fr/salles.php',
    bib: 'https://bibbox.insa-toulouse.fr/',
    bluemind: 'https://etud-mel.insa-toulouse.fr/webmail/',
    elusEtudiants: STUDENT_SERVER + '~eeinsat/',
    ent: 'https://ent.insa-toulouse.fr/',
    insaAccount: 'https://moncompte.insa-toulouse.fr/',
    tutorInsa: STUDENT_SERVER + '~tutorinsa/',
    wiketud: 'https://wiki.etud.insa-toulouse.fr/',
  },
  about: {
    appstore: 'https://apps.apple.com/us/app/campus-amicale-insat/id1477722148',
    playstore:
      'https://play.google.com/store/apps/details?id=fr.amicaleinsat.application',
    react: 'https://facebook.github.io/react-native/',
    git: GIT_SERVER + 'src/branch/master/README.md',
    changelog: GIT_SERVER + 'src/branch/master/Changelog.md',
    license: GIT_SERVER + 'src/branch/master/LICENSE',
  },
  feedback: {
    git: GIT_SERVER,
    trello: 'https://trello.com/b/RMej49Uq/application-campus-insa',
    facebook: 'https://www.facebook.com/campus.insat',
    mail: `mailto:app@amicale-insat.fr?subject=[FEEDBACK] Application CAMPUS
&body=Coucou Arnaud j'ai du feedback\n\n\n\nBien cordialement.`,
    discord: 'https://discord.gg/W8MeTec',
  },
};