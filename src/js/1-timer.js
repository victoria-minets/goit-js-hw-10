import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');

startBtn.disabled = true;

let selectedDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (selected <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#ef4040',
        titleColor: '#fff',
        messageColor: '#fff',
      });
      startBtn.disabled = true;
    } else {
      selectedDate = selected;
      startBtn.disabled = false;
    }
  },
};

flatpickr(dateInput, options);

startBtn.addEventListener('click', () => {
  if (!selectedDate) return;

  startBtn.disabled = true;
  dateInput.disabled = true;

  startCountdown(selectedDate);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerUI({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function startCountdown(targetDate) {
  if (intervalId !== null) return;
  intervalId = setInterval(() => {
    const now = new Date();
    const ms = targetDate - now;

    if (ms <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      startBtn.disabled = true;
      dateInput.disabled = false;
      return;
    }

    const time = convertMs(ms);
    updateTimerUI(time);
  }, 1000);
}
