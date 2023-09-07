# Grafana Deep Panel

The Grafana Deep Panel is a plugin for Grafana that renders the snapshot data that is gathered and stored
by [DEEP](https://github.com/intergral/deep).

## Setup

Currently, this plugin is not available on the Grafana marketplace. So to use this plugin you need to manually install
it.

## Installation

To install this plugin into Grafana follow the steps below:

1. Build the plugin
    1. Either build from source or
    2. Download the latest release from [Github](https://github.com/intergral/grafana-deep-panel/releases)
2. Unzip or copy the build output to the plugins directory for Grafana (In docker this is /var/lib/grafana/plugins/)
3. Now do the same for [intergral-deep-datasource](https://github.com/intergral/grafana-deep-datasource)
4. Now start Grafana and you will be able to add Deep as a datasource.

### Unsigned

If you are using the unsigned version of the build you need to add an exception to the grafana.ini file.

1. When using the unsigned
    1. Add the line `allow_loading_unsigned_plugins = intergral-deep-panel,intergral-deep-datasource` to `grafana.ini` (
       In docker this is /etc/grafana/grafana.ini) in the `[plugins]` section.
    2. Here we hae also added the allowance for the panel plugin that this plugin requires.

## Using Docker

If you are using docker to deploy grafana then you can set the variable `GF_INSTALL_PLUGINS` to include this plugin.

```yaml
  grafana:
    image: grafana/grafana-oss
    environment:
      - GF_INSTALL_PLUGINS=https://github.com/intergral/grafana-deep-panel/releases/download/v0.0.3/intergral-deep-panel-0.0.3.zip;intergral-deep-panel,https://github.com/intergral/grafana-deep-datasource/releases/download/v0.0.7/intergral-deep-datasource-0.0.7.zip;intergral-deep-datasource
    ports:
      - "3000:3000"
```

The above example will install the plugins that are signed for `localhost:3000` if you are using a different value for
the `app_url` in the `grafana.ini` then you will either have to allow this unsigned plugins or sign this plugin for your host
value.

```ini
allow_loading_unsigned_plugins: intergral-deep-panel,intergral-deep-datasource
```
