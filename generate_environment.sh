#!/bin/sh

usage() {
    echo "Usage: $0 [match] [output]"
    echo ""
    echo "Example:"
    echo " $0 \"PUBLIC_*\" ./env.js : Outputs all environment variables starting with \"PUBLIC_\" to ./env.js"
    echo ""
}

if [ "$1" == "" ]; then
    usage
    exit
fi

cat << EOT > $2
window.env = {
$(
  env -0 | while IFS='=' read -r -d '' n v; do
    if [[ $n == "$1" ]]
    then
      printf "  %s: '%s',\n" "$n" "$v";
    fi
  done
)
}
EOT

# Execute all other parameters
shift 2
exec "$@"
