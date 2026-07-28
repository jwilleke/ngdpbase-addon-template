# Wrapper image: ngdpbase + this addon, layered in as a drop-in.
#
# This is the simplest of the deployment shapes: the addon is COPY'd into the
# image's default `addons/` directory, so no addons-path configuration is
# needed — only the enable key.
#
# NOTE: ngdpbase's runtime image ships no npm (removed to close a bundled-npm
# CVE). This template's addon has no runtime dependencies, so no install stage
# is required. The moment you add one, switch to the two-stage build in
# ngdpbase's docs/platform/deployment/addon-packaged.md — installing in a
# stage that still has npm, then copying node_modules into the runtime image.
#
# For production, prefer the `packaged` (npm) model over this drop-in: it
# version-pins the addon independently of the base image.

ARG NGDPBASE_VERSION=4.1.0

FROM ghcr.io/jwilleke/ngdpbase:${NGDPBASE_VERSION}
WORKDIR /app

# Lands in the DEFAULT addons directory, so AddonsManager discovers it with no
# config change. Enabling is still explicit — discovery never implies consent.
COPY addons/hello-ngdp/ ./addons/hello-ngdp/

# Enable the addon in your instance config (app-custom-config.json):
#   { "ngdpbase.addons.hello-ngdp.enabled": true }
