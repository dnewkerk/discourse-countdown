# frozen_string_literal: true

# name: discourse-countdown
# about: Countdown to the specified date.
# version: 0.4
# authors: dnewkerk
# url: https://github.com/dnewkerk/discourse-countdown

register_asset 'stylesheets/discourse-countdown.scss'

enabled_site_setting :discourse_countdown_enabled

PLUGIN_NAME ||= 'discourse-countdown'
