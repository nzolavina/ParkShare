const today = new Date();
const calendarYear = today.getFullYear();
const calendarMonth = today.getMonth();

function formatDateKey(year, month, day) {
  const safeMonth = String(month + 1).padStart(2, "0");
  const safeDay = String(day).padStart(2, "0");
  return `${year}-${safeMonth}-${safeDay}`;
}

function makeMonthDates(dayNumbers) {
  return dayNumbers.map((day) => formatDateKey(calendarYear, calendarMonth, day));
}

function buildDateSlotMap(dayNumbers, weekdaySlots, weekendSlots) {
  const map = {};

  dayNumbers.forEach((day) => {
    const dateKey = formatDateKey(calendarYear, calendarMonth, day);
    const weekDayIndex = new Date(calendarYear, calendarMonth, day).getDay();
    const isWeekend = weekDayIndex === 0 || weekDayIndex === 6;
    map[dateKey] = [...(isWeekend ? weekendSlots : weekdaySlots)];
  });

  return map;
}

function buildDisabledSlotMap(dayNumbers, weekdayDisabledIndexes, weekendDisabledIndexes, weekdaySlots, weekendSlots) {
  const map = {};

  dayNumbers.forEach((day) => {
    const dateKey = formatDateKey(calendarYear, calendarMonth, day);
    const weekDayIndex = new Date(calendarYear, calendarMonth, day).getDay();
    const isWeekend = weekDayIndex === 0 || weekDayIndex === 6;
    const sourceSlots = isWeekend ? weekendSlots : weekdaySlots;
    const disabledIndexes = isWeekend ? weekendDisabledIndexes : weekdayDisabledIndexes;

    map[dateKey] = disabledIndexes.filter((index) => sourceSlots[index]).map((index) => sourceSlots[index]);
  });

  return map;
}

const standardHourlySlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

const listings = [
  {
    id: 1,
    title: "Home Covered Garage",
    location: "Toril",
    pricePerHour: 55,
    availability: {
      dateSlots: buildDateSlotMap(
        [2, 4, 7, 9, 14, 16, 21, 23, 28],
        standardHourlySlots,
        standardHourlySlots,
      ),
      disabledSlots: buildDisabledSlotMap(
        [2, 4, 7, 9, 14, 16, 21, 23, 28],
        [3, 8],
        [2, 7],
        standardHourlySlots,
        standardHourlySlots,
      ),
    },
  },
  {
    id: 2,
    title: "Avida Towers CM Recto",
    location: "Matina",
    pricePerHour: 30,
    availability: {
      dateSlots: buildDateSlotMap(
        [1, 3, 5, 8, 10, 12, 15, 17, 19, 24, 26, 29],
        standardHourlySlots,
        standardHourlySlots,
      ),
      disabledSlots: buildDisabledSlotMap(
        [1, 3, 5, 8, 10, 12, 15, 17, 19, 24, 26, 29],
        [4, 9],
        [5],
        standardHourlySlots,
        standardHourlySlots,
      ),
    },
  },
  {
    id: 3,
    title: "Home Covered Garage",
    location: "driveway",
    pricePerHour: 40,
    availability: {
      dateSlots: buildDateSlotMap(
        [6, 13, 20, 27],
        standardHourlySlots,
        standardHourlySlots,
      ),
      disabledSlots: buildDisabledSlotMap(
        [6, 13, 20, 27],
        [2, 6],
        [3],
        standardHourlySlots,
        standardHourlySlots,
      ),
    },
  },
  {
    id: 4,
    title: "Ecoland Parking Lot",
    location: "Sasa",
    pricePerHour: 40,
    availability: {
      dateSlots: buildDateSlotMap(
        [1, 2, 3, 4, 5, 9, 10, 11, 12, 16, 17, 18, 19, 23, 24, 25, 26, 30],
        standardHourlySlots,
        standardHourlySlots,
      ),
      disabledSlots: buildDisabledSlotMap(
        [1, 2, 3, 4, 5, 9, 10, 11, 12, 16, 17, 18, 19, 23, 24, 25, 26, 30],
        [1, 10],
        [8],
        standardHourlySlots,
        standardHourlySlots,
      ),
    },
  },
  {
    id: 5,
    title: "Ecoland Compact Spot",
    location: "Ecoland",
    pricePerHour: 40,
    availability: {
      dateSlots: buildDateSlotMap(
        [3, 7, 11, 15, 19, 23, 27],
        standardHourlySlots,
        standardHourlySlots,
      ),
      disabledSlots: buildDisabledSlotMap(
        [3, 7, 11, 15, 19, 23, 27],
        [4],
        [5],
        standardHourlySlots,
        standardHourlySlots,
      ),
    },
  },
  {
    id: 6,
    title: "Avida Towers Abreeza",
    location: "Bajada",
    pricePerHour: 60,
    availability: {
      dateSlots: buildDateSlotMap(
        [2, 6, 10, 14, 18, 22, 26, 30],
        standardHourlySlots,
        standardHourlySlots,
      ),
      disabledSlots: buildDisabledSlotMap(
        [2, 6, 10, 14, 18, 22, 26, 30],
        [6, 11],
        [7],
        standardHourlySlots,
        standardHourlySlots,
      ),
    },
  },
];

let selectedDateKey = null;
let selectedStartIndex = null;
let selectedEndIndex = null;

const reserveContent = document.getElementById("reserveContent");
const queryParams = new URLSearchParams(window.location.search);
const selectedId = Number(queryParams.get("id"));
const selectedListing = listings.find((listing) => listing.id === selectedId);

const weekDaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthName(year, month) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
}

function getMonthCalendarDays(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startsAt = (firstDayOfMonth.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < startsAt; i += 1) {
    cells.push({ isEmpty: true, key: `empty-${i}` });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const dateKey = formatDateKey(year, month, day);
    cells.push({ isEmpty: false, day, dateKey, key: dateKey });
  }

  return cells;
}

function calendarMarkup(availableDates) {
  const availableDateSet = new Set(availableDates);
  const calendarDays = getMonthCalendarDays(calendarYear, calendarMonth);

  const weekdayHeader = weekDaysShort
    .map((day) => `<span class="weekday-label">${day}</span>`)
    .join("");

  const dayButtons = calendarDays
    .map((cell) => {
      if (cell.isEmpty) {
        return `<span class="day-cell day-empty" aria-hidden="true"></span>`;
      }

      const isAvailable = availableDateSet.has(cell.dateKey);
      return `
        <button
          class="day-cell ${isAvailable ? "is-available" : "is-unavailable"}"
          type="button"
          data-date="${cell.dateKey}"
          ${isAvailable ? "" : "disabled"}
        >
          <span class="day-number">${cell.day}</span>
        </button>
      `;
    })
    .join("");

  return `
    <p class="meta calendar-month">${monthName(calendarYear, calendarMonth)}</p>
    <div class="calendar-weekdays">${weekdayHeader}</div>
    <div class="calendar-grid">${dayButtons}</div>
  `;
}

function readableDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(year, month - 1, day),
  );
}

function showTimeForDate(dateKey) {
  const selectedDateLabel = document.getElementById("selectedDate");
  if (!selectedDateLabel) {
    return;
  }

  selectedDateLabel.textContent = readableDate(dateKey);
}

function renderTimeSlots(dateKey) {
  const slotsHost = document.getElementById("timeSlots");
  const selectedTimeLabel = document.getElementById("selectedTime");
  const confirmButton = document.getElementById("confirmReservation");
  const slotHint = document.getElementById("slotHint");
  if (!slotsHost || !selectedTimeLabel || !confirmButton) {
    return;
  }

  const slots = selectedListing.availability.dateSlots[dateKey] || [];
  const disabledSet = new Set(selectedListing.availability.disabledSlots[dateKey] || []);

  selectedDateKey = dateKey;
  selectedStartIndex = null;
  selectedEndIndex = null;

  if (slots.length === 0) {
    slotsHost.innerHTML = `<p class="time-range">No time slots available for this date.</p>`;
    selectedTimeLabel.textContent = "None";
    confirmButton.disabled = true;
    if (slotHint) {
      slotHint.textContent = "No slots available for this date.";
    }
    return;
  }

  slotsHost.innerHTML = slots
    .map((slot, index) => {
      const isDisabled = disabledSet.has(slot);
      return `
        <button
          type="button"
          class="time-slot ${isDisabled ? "is-disabled" : ""}"
          data-time="${slot}"
          data-index="${index}"
          ${isDisabled ? "disabled" : ""}
        >
          ${slot}
        </button>
      `;
    })
    .join("");

  const slotButtons = slotsHost.querySelectorAll(".time-slot");
  slotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const clickedIndex = Number(button.dataset.index);

      if (selectedStartIndex === null || selectedEndIndex !== null) {
        selectedStartIndex = clickedIndex;
        selectedEndIndex = null;
        slotButtons.forEach((item) => item.classList.remove("is-selected", "is-in-range"));
        button.classList.add("is-selected");
        selectedTimeLabel.textContent = "None";
        confirmButton.disabled = true;
        if (slotHint) {
          slotHint.textContent = "Now pick an end slot. Disabled slots cannot be crossed.";
        }
        return;
      }

      if (clickedIndex === selectedStartIndex) {
        if (slotHint) {
          slotHint.textContent = "Pick a different end slot to create a booking range.";
        }
        return;
      }

      const rangeStart = Math.min(selectedStartIndex, clickedIndex);
      const rangeEnd = Math.max(selectedStartIndex, clickedIndex);

      const hasDisabledInRange = slots
        .slice(rangeStart, rangeEnd + 1)
        .some((slot) => disabledSet.has(slot));

      if (hasDisabledInRange) {
        selectedEndIndex = null;
        slotButtons.forEach((item) => item.classList.remove("is-selected", "is-in-range"));
        const startButton = slotsHost.querySelector(`.time-slot[data-index="${selectedStartIndex}"]`);
        if (startButton) {
          startButton.classList.add("is-selected");
        }
        selectedTimeLabel.textContent = "None";
        confirmButton.disabled = true;
        if (slotHint) {
          slotHint.textContent = "That range crosses a disabled slot. Choose another end slot.";
        }
        return;
      }

      selectedStartIndex = rangeStart;
      selectedEndIndex = rangeEnd;

      slotButtons.forEach((item) => {
        const slotIndex = Number(item.dataset.index);
        item.classList.remove("is-selected", "is-in-range");
        if (slotIndex >= rangeStart && slotIndex <= rangeEnd) {
          item.classList.add("is-in-range");
        }
        if (slotIndex === rangeStart || slotIndex === rangeEnd) {
          item.classList.add("is-selected");
        }
      });

      const startLabel = slots[rangeStart];
      const endLabel = slots[rangeEnd];
      const totalSlots = rangeEnd - rangeStart + 1;
      selectedTimeLabel.textContent = `${startLabel} to ${endLabel} (${totalSlots} slot${totalSlots === 1 ? "" : "s"})`;
      confirmButton.disabled = false;
      if (slotHint) {
        slotHint.textContent = "Range selected. You can confirm or click a new start slot.";
      }
    });
  });

  selectedTimeLabel.textContent = "None";
  confirmButton.disabled = true;
  if (slotHint) {
    slotHint.textContent = "Select a start slot, then select an end slot.";
  }
}

function setupCalendarInteractions() {
  const dayButtons = reserveContent.querySelectorAll(".day-cell.is-available");
  dayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      dayButtons.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      showTimeForDate(button.dataset.date);
      renderTimeSlots(button.dataset.date);
    });
  });

  const confirmButton = document.getElementById("confirmReservation");
  if (confirmButton) {
    confirmButton.addEventListener("click", () => {
      const selectedDate = document.getElementById("selectedDate")?.textContent || "None";
      const selectedTime = document.getElementById("selectedTime")?.textContent || "None";
      if (selectedDate === "None" || selectedTime === "None" || selectedDateKey === null || selectedEndIndex === null) {
        return;
      }

      alert(`Reservation confirmed for ${selectedListing.title} on ${selectedDate} at ${selectedTime}.`);
    });
  }
}

if (!selectedListing) {
  reserveContent.innerHTML = `
    <article class="reserve-details">
      <h2>Spot not found</h2>
      <p class="meta">The selected parking spot does not exist or was removed.</p>
      <a class="btn btn-solid" href="index.html#listings">Choose another spot</a>
    </article>
  `;
} else {
  reserveContent.innerHTML = `
    <article class="reserve-details">
      <h2>${selectedListing.title}</h2>
      <p class="meta">${selectedListing.location} | PHP ${selectedListing.pricePerHour}/hr</p>

      <div class="availability-panel">
        <h3>Choose a date</h3>
        <p class="meta">Select an available date to view parking time.</p>
        ${calendarMarkup(Object.keys(selectedListing.availability.dateSlots))}
      </div>

      <div class="availability-panel">
        <h3>Available time</h3>
        <p class="time-range">Date selected: <strong id="selectedDate">None</strong></p>
        <div id="timeSlots" class="time-slots">
          <p class="time-range">Pick a date above to see available times.</p>
        </div>
        <p class="time-range slot-hint" id="slotHint">Select a start slot, then select an end slot.</p>
        <p class="time-range">Time selected: <strong id="selectedTime">None</strong></p>
      </div>

      <button class="btn btn-solid" id="confirmReservation" type="button" disabled>Confirm reservation</button>
    </article>
  `;

  setupCalendarInteractions();
}
