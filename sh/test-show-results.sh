#!/bin/bash

echo "TEST RESULTS SUMMARY"
echo
if test -f "./test/client-unit/report"; then
  echo "Client Unit Tests"
  echo "   " `grep "TOTAL" ./test/client-unit/report`
  echo
fi
if test -f "./test/server-unit/report"; then
  echo "Server Unit Tests"
  echo "   " `grep 'passing' ./test/server-unit/report`
  echo "   " `grep 'failing' ./test/server-unit/report`
  echo
fi
if test -f "./test/integration/report"; then
  echo "Integration Tests"
  echo "   " `grep passing ./test/integration/report`
  echo "   " `egrep -e '(failing|pending)' ./test/integration/report`
  echo
fi
if test -f "./test/integration-stock/report"; then
  echo "Stock Integration Tests"
  echo "   " `grep passing ./test/integration-stock/report`
  echo "   " `egrep -e '(failing|pending)' ./test/integration-stock/report`
  echo
fi
if test -f "./test/end-to-end-playwright/report-account"; then
  echo "End-to-end account tests (Playwright)"
  echo "   " `grep passed ./test/end-to-end-playwright/report-account`
  echo "   " `egrep -e '([0-9]+ failing|[0-9]+ failed|[0-9]+ pending|[0-9]+ skipped|[0-9]+ flakey)' ./test/end-to-end-playwright/report-account`
  echo
fi
if test -f "./test/end-to-end-playwright/report-stock"; then
  echo "End-to-end stock tests (Playwright)"
  echo "   " `grep passed ./test/end-to-end-playwright/report-stock`
  echo "   " `egrep -e '([0-9]+ failing|[0-9]+ failed|[0-9]+ pending|[0-9]+ skipped|[0-9]+ flakey)' ./test/end-to-end-playwright/report-stock`
  echo
fi
if test -f "./test/end-to-end-playwright/report"; then
  echo "End-to-end tests without stock or account tests (Playwright)"
  echo "   " `grep passed ./test/end-to-end-playwright/report`
  echo "   " `egrep -e '([0-9]+ failing|[0-9]+ failed|[0-9]+ pending|[0-9]+ skipped|[0-9]+ flakey)' ./test/end-to-end-playwright/report`
  echo
fi