import { withPluginApi } from "discourse/lib/plugin-api";
import { decorateWidget } from "discourse/widgets/widget";

export default {
  name: "discourse-countdown",
  initialize() {
    withPluginApi("0.11.5", (api) => {
      const siteSettings = api.container.lookup("site-settings:main");
      if (!siteSettings.discourse_countdown_date) {
        return;
      }
      decorateWidget("header-buttons:before", helper => {
        return helper.attach("countdown");
      });
    });
  }
};
