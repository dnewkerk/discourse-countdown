import { decorateWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

export default {
  name: 'discourse-countdown',
  initialize() {
    if (!Discourse.SiteSettings.discourse_countdown_date) {
      return;
    }
    const now = moment();
    const countdownDate = moment(Discourse.SiteSettings.discourse_countdown_date);

    if (now < countdownDate) {
      // https://stackoverflow.com/a/9130040
      const daysRemaining = countdownDate.startOf('day').diff(now.startOf('day'), 'days');
      const classArray = Discourse.SiteSettings.discourse_countdown_classes.split(' ');
      const classes = `.${classArray.join('.')}`;
      const text = Discourse.SiteSettings.discourse_countdown_text;
      const secondaryText = Discourse.SiteSettings.discourse_countdown_secondary_text;
      const countdownContent = [
        h('div.days', daysRemaining.toString()),
        h('div.text-wrap', [
          h('div.text', text),
          h('div.secondary-text', secondaryText)
        ])
      ]

      decorateWidget('header-buttons:before', helper => {
        if (Discourse.SiteSettings.discourse_countdown_url) {
          return h('div.countdown' + classes, [
            h('a.wrap',
              {
                'href': Discourse.SiteSettings.discourse_countdown_url,
                'attributes': {
                  'target': ((Discourse.SiteSettings.discourse_countdown_new_window) ? '_blank' : '_self')
                }
              },
              countdownContent
            ),
          ]);
        } else {
          return h('div.countdown' + classes, h('div.wrap', countdownContent));
        }
      });
    }
  }
};
