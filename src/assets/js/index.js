require('./accordion.js');

const slice = Array.prototype.slice;
const form = document.querySelector('.contact__form');
const submit = document.querySelector('.form__submit');
const fields = slice.call(document.querySelectorAll('.form__input'));
const response = document.querySelector('.form__response');
const Patterns = {}, Errors = {};

Errors['EMPTY_REQUISITE'] = 'This field is required';
Errors['INVALID_EMAIL'] = 'Please enter a valid email address';
Errors['INVALID_TEL'] = 'Please enter a valid phone number';
Patterns['EMAIL'] = "[a-zA-Z0-9_.+\-]+@[a-zA-Z0-9-.]+$";
Patterns['PHONE'] = "^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$";

fields.map(function(field) {
	field.addEventListener('blur', function(event) {
		validateField(this);
	});
});
submit.addEventListener('click', function(event) {
  event.preventDefault();
  let count = 0;
  for(let i = 0; i < fields.length; i++) {
    count += validateField(fields[i]);
  }
  if (count === 0) submission(form);
});

function submission(form) {
  jQuery.ajax({
    type: 'POST',
    url: 'submit.php',
    data: jQuery(form).serialize(),
    beforeSend: function() {
      console.log('sending soon');
      submit.disabled = true;
    },
    success: function() {
      response.className += ' is-active';
      // form.className += ' is-invisible';
    },
    error: function(response, status, error) {
      submit.disabled = false;
    }
  });
}

function validateField(input) {
  let count = 0;
  if (!requireField(input)) {
    assignError(input, 'EMPTY_REQUISITE');
    ++count;
  } else if (!matchPattern(input)) {
    let code = `INVALID_${input.getAttribute('type')}`
    assignError(input, code.toUpperCase());
    ++count;
  } else {
    removeError(input);
  }
  return count;
}
function requireField(input) {
  if (input.getAttribute('required') !== null) {
    return input.value !== "";
  } else return true;
}
function matchPattern(input) {
  if (input.getAttribute('data-pattern') && input.value !== "") {
    let attribute = input.getAttribute('data-pattern');
    let pattern = Patterns[attribute.toUpperCase()] || attribute;
    let matcher = new RegExp(pattern);
    return matcher.test(input.value);
  } else return true;
}
function assignError(input, status) {
  let parent = input.parentNode;
  parent.setAttribute('data-error', `*${Errors[status] || ''}`);
}
function removeError(input) {
  let parent = input.parentNode;
  parent.removeAttribute('data-error');
}