# Wrapper image: ngdpbase + this addon, layered in as a drop-in.
#
# This is the simplest of the deployment shapes: the addon is COPY'd into the
# image's default `addons/` directory, so no addons-path configuration is
# needed — only the enable key.
#
# NOTE: ngdpbase's runtime image ships no npm (removed to close a bundled-npm
# CVE). This template's addon declares no dependencies of its own — it takes
# express and the guarded host helpers from the instance it runs inside — so no
# install stage is required. The moment you add one, switch to the two-stage
# build in ngdpbase's docs/platform/deployment/addon-packaged.md: install in a
# stage that still has npm, then copy node_modules into the runtime image.
#
# For production, prefer the `packaged` (npm) model over this drop-in: it
# version-pins the addon independently of the base image.
#
# The version floor is not cosmetic. The addon imports ApiContext, guardedFetch
# and resolveEgressPolicy from the host's dist/, and all three arrived well
# after 4.1.0 — the pin this file carried until the guarded defaults landed. CI
# reads this ARG as the single source of the base version, so bumping it here
# moves the typecheck with it.

ARG NGDPBASE_VERSION=4.16.4

FROM ghcr.io/jwilleke/ngdpbase:${NGDPBASE_VERSION}
WORKDIR /app

# Lands in the DEFAULT addons directory, so AddonsManager discovers it with no
# config change. Enabling is still explicit — discovery never implies consent.
COPY addons/hello-ngdp/ ./addons/hello-ngdp/

# Enable the addon in your instance config (app-custom-config.json):
#   { "ngdpbase.addons.hello-ngdp.enabled": true }
