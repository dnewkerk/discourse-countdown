import { createWidget } from "discourse/widgets/widget";
import { decorateWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import Site from "discourse/models/site";

createWidget("countdown", {
  tagName: "div.discourse-countdown",
  buildKey: () => "countdown",

  html(attrs) {
    let userCustomValue = '';
    let userDate = '';
    let countdownDate = moment(this.siteSettings.discourse_countdown_date);
    let text = this.siteSettings.discourse_countdown_text;
    const secondaryText = this.siteSettings.discourse_countdown_secondary_text;
    const now = moment();

    if (this.currentUser) {
      // Get the field values by name (field keys are just numeric IDs).
      // Helpful technique found in:
      // https://github.com/discourse/discourse-user-field-prompt/blob/main/javascripts/discourse/initializers/discourse-user-field-prompt.js.es6
      // @TODO: set custom field names in admin UI.
      const fieldUserCustomValue = Site.currentProp("user_fields").findBy("name", "Exam");
      const fieldUserDate = Site.currentProp("user_fields").findBy("name", "Exam Date");

      // For some reason in this context user_fields is undefined at first.
      const userFields = this.currentUser.user_fields;
      if (userFields) {
        userCustomValue = userFields[fieldUserCustomValue.id];
        userDate = userFields[fieldUserDate.id];
      }
    }

    // If there are valid user field values, configure custom countdown.
    // @TODO: set prefix and suffix text in admin UI.
    const userDateParsed = userDate ? moment(userDate) : null;
    if (
      userCustomValue &&
      userDate &&
      userDate.match(/^\d{4}-\d{2}-\d{2}$/g) &&
      userDateParsed.isValid() &&
      userDateParsed > now
    ) {
      countdownDate = userDateParsed;
      text = `days until my ${userCustomValue} exam.`;
    }

    // Proceed with output if countdown date is in the future.
    if (countdownDate > now) {
      // https://stackoverflow.com/a/9130040
      const daysRemaining = countdownDate.startOf("day").diff(now.startOf("day"), "days");
      const classArray = this.siteSettings.discourse_countdown_classes.split(" ");
      const classes = `.${classArray.join(".")}`;

      const countdownContent = [
        h("div.days", daysRemaining.toString()),
        h("div.text-wrap", [
          h("div.text", text),
          h("div.secondary-text", secondaryText)
        ])
      ]

      if (this.siteSettings.discourse_countdown_url) {
        return h("div.countdown" + classes, [
          h("a.wrap",
            {
              "href": this.siteSettings.discourse_countdown_url,
              "attributes": {
                "target": ((this.siteSettings.discourse_countdown_new_window) ? "_blank" : "_self"),
                "rel": "noopener"
              }
            },
            countdownContent
          ),
        ]);
      } else {
        return h("div.countdown" + classes, h("div.wrap", countdownContent));
      }
    }
  }
});

// Countdown is time sensitive, so rerender on page changes.
decorateWidget("countdown:after", helper => {
  helper.widget.appEvents.on("page:changed", () => {
    helper.widget.scheduleRerender();
  });
});
