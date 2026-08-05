#!/usr/bin/env sh
set -eu

usage() {
  echo "Usage: ./install.sh wasm-build [--uninstall] (--project|--global) [--force]" >&2
}

skill="${1:-}"
if [ "$skill" != "wasm-build" ]; then
  if [ -z "$skill" ]; then
    usage
  else
    echo "Unknown skill: $skill" >&2
  fi
  exit 2
fi
shift

scope=""
force="false"
uninstall="false"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --project|--global)
      if [ -n "$scope" ]; then
        usage
        exit 2
      fi
      scope="$1"
      ;;
    --force)
      force="true"
      ;;
    --uninstall)
      uninstall="true"
      ;;
    *)
      usage
      exit 2
      ;;
  esac
  shift
done

if [ -z "$scope" ]; then
  usage
  exit 2
fi

script_root=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
project_root=$(pwd -P)
source_dir="$script_root/skills/wasm-build"

case "$scope" in
  --project)
    dest_parent="$project_root/.agents/skills"
    ;;
  --global)
    dest_parent="${HOME:?HOME is required}/.agents/skills"
    ;;
esac

dest="$dest_parent/wasm-build"

case "$dest" in
  */.agents/skills/wasm-build) ;;
  *)
    echo "Refusing unsafe destination: $dest" >&2
    exit 1
    ;;
esac

if [ "$uninstall" = "true" ]; then
  if [ ! -e "$dest" ]; then
    echo "wasm-build is not installed at $dest"
    exit 0
  fi
  if [ ! -d "$dest" ] || [ -L "$dest" ]; then
    echo "Refusing to uninstall non-directory destination: $dest" >&2
    exit 4
  fi
  echo "Warning: v0.1 does not detect locally modified installed files; removing exact skill directory only." >&2
  rm -rf -- "$dest"
  echo "Removed wasm-build from $dest"
  exit 0
fi

if [ ! -d "$source_dir" ]; then
  echo "Missing skill source: skills/wasm-build" >&2
  exit 2
fi

if [ -e "$dest" ] && [ "$force" != "true" ]; then
  echo "Destination already exists: $dest" >&2
  exit 3
fi

if ! mkdir -p -- "$dest_parent" 2>/dev/null; then
  echo "Permission denied: $dest_parent" >&2
  exit 4
fi

if [ -e "$dest" ]; then
  rm -rf -- "$dest"
fi

if ! cp -R -- "$source_dir" "$dest" 2>/dev/null; then
  echo "Permission denied: $dest" >&2
  exit 4
fi

echo "Installed wasm-build to $dest"
echo "Next: ask your coding agent for help building or validating a WebAssembly project."
