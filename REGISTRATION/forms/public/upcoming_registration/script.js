/**
 * THAKRITHI'26 — Registration Countdown
 * -------------------------------------
 * Target: 18 August 2026, 21:00:00 Asia/Kolkata (IST, UTC+05:30)
 *
 * The target instant is resolved using the browser's Intl API against the
 * "Asia/Kolkata" IANA timezone rather than a hardcoded numeric offset or the
 * server/deployment region's local clock. This guarantees every visitor,
 * regardless of where they are (or where the Vercel edge/server serving the
 * page happens to be) counts down to the exact same real-world instant.
 */

(function () {
  "use strict";

  var TARGET_TIMEZONE = "Asia/Kolkata";
  var TARGET_YEAR = 2026;
  var TARGET_MONTH = 8;   // August (1-indexed)
  var TARGET_DAY = 18;
  var TARGET_HOUR = 21;   // 9:00 PM, 24h clock
  var TARGET_MINUTE = 0;
  var TARGET_SECOND = 0;

  /**
   * Resolves the UTC epoch millisecond timestamp that corresponds to a given
   * "wall clock" date/time as observed in a specific IANA timezone.
   *
   * This works for any timezone (including ones with DST) because it uses
   * Intl.DateTimeFormat to read back what a UTC guess actually looks like in
   * the target timezone, then corrects the guess — rather than assuming a
   * fixed numeric UTC offset.
   */
  function getUtcTimestampForZonedTime(year, month, day, hour, minute, second, timeZone) {
    var formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    // Initial guess: treat the wall-clock values as if they were UTC.
    var guess = Date.UTC(year, month - 1, day, hour, minute, second);

    // Iterate a couple of times to converge on the exact instant, since the
    // offset itself can shift the date (rare, but safe to handle).
    for (var i = 0; i < 3; i++) {
      var parts = formatter.formatToParts(new Date(guess));
      var map = {};
      for (var p = 0; p < parts.length; p++) {
        if (parts[p].type !== "literal") {
          map[parts[p].type] = parseInt(parts[p].value, 10);
        }
      }

      var observedAsUtc = Date.UTC(
        map.year, map.month - 1, map.day, map.hour, map.minute, map.second
      );
      var desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
      var diff = desiredAsUtc - observedAsUtc;

      if (diff === 0) break;
      guess += diff;
    }

    return guess;
  }

  var TARGET_TIMESTAMP_MS = getUtcTimestampForZonedTime(
    TARGET_YEAR, TARGET_MONTH, TARGET_DAY,
    TARGET_HOUR, TARGET_MINUTE, TARGET_SECOND,
    TARGET_TIMEZONE
  );

  // Debug helper: verify the resolved instant reads correctly across zones.
  // Open the browser console to inspect this.
  (function debugValidate() {
    var checkZones = ["Asia/Kolkata", "Asia/Singapore", "UTC", "America/New_York"];
    var results = {};
    checkZones.forEach(function (tz) {
      results[tz] = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        dateStyle: "medium",
        timeStyle: "long"
      }).format(new Date(TARGET_TIMESTAMP_MS));
    });
    console.log("[Thakrithi'26 countdown] Target instant resolved as:", results);
  })();

  var elDays = document.getElementById("days");
  var elHours = document.getElementById("hours");
  var elMinutes = document.getElementById("minutes");
  var elSeconds = document.getElementById("seconds");
  var elCountdown = document.getElementById("countdown");
  var elOpenMessage = document.getElementById("open-message");

  var timerId = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function render(remainingMs) {
    var totalSeconds = Math.floor(remainingMs / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  function showRegistrationsOpen() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    elCountdown.hidden = true;
    elOpenMessage.hidden = false;
  }

  function tick() {
    var now = Date.now();
    var remaining = TARGET_TIMESTAMP_MS - now;

    if (remaining <= 0) {
      render(0);
      showRegistrationsOpen();
      return;
    }

    render(remaining);
  }

  // Run immediately, then every second. Always derived from Date.now() and
  // the fixed target timestamp — never from a decrementing stored counter —
  // so there is no drift even if a tick is delayed (e.g. backgrounded tab).
  tick();
  timerId = setInterval(tick, 1000);
})();
