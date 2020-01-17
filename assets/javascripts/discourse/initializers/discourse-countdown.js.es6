import { decorateWidget } from 'discourse/widgets/widget';

export default {
  name: 'discourse-countdown',
  initialize() {
    if (!Discourse.SiteSettings.discourse_countdown_date) {
      return;
    }
    decorateWidget('header-buttons:before', helper => {
      return helper.attach('countdown');
    });
  }
};
