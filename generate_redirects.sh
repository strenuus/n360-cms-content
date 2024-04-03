# Netlify's _redirects file syntax does not support ENV variable interpolation,
# so we generate the file at build time using envsubst:
envsubst < config/_redirects > public/_redirects
