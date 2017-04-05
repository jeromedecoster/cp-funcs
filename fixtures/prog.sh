#!/usr/bin/env bash

# http://unix.stackexchange.com/questions/33049/check-if-pipe-is-empty-and-run-a-command-on-the-data-if-it-isnt
# echo "string" | (test -s /dev/stdin && echo 'pipe has data' && cat || echo 'pipe is empty')
test -s /dev/stdin && stdin=`cat` || true

# no args
if [[ $# -eq 0 ]]; then
  echo "cwd: `pwd`"
  echo 'usage: prog.sh [--exit] [--stdin] [--stderr] [--cwd] [--rand] [--lot] [--toomuch] ...' >&2
  exit 0
fi

for i do
  if [[ "$i" == '--exit' ]]; then
    echo 'stderr message: exit is coming' >&2
    exit 128
  elif [[ "$i" == '--stdin' ]]; then
    if [[ -n "$stdin" ]]; then
      echo "$stdin"
    fi
  elif [[ "$i" == '--stderr' ]]; then
    echo 'stderr message: everything goes wrong' >&2
  elif [[ "$i" == '--cwd' ]]; then
    pwd
  elif [[ "$i" == '--rand' ]]; then
    max=`echo $RANDOM % 10000 | bc`
    for (( c=1; c<=$max; c++ ))
    do
      echo "loop $c / $max"
    done
  elif [[ "$i" == '--lot' ]]; then
    max=100000
    for (( c=1; c<=$max; c++ ))
    do
      echo "loop $c / $max"
    done
  elif [[ "$i" == '--toomuch' ]]; then
    max=2000000
    for (( c=1; c<=$max; c++ ))
    do
      echo "loop $c / $max"
    done
  else
    echo "$i"
  fi
done
