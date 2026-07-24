# Admin portal

## at quick booking or patient booking :

- [x] make default date as today and bring any easy date picker

## at slots tab :

- [x] on slot cancel it cancels the whole day or the rest of day for the doctor.
- [x] make session default time is 15 minutes

# Doctor portal

## in overview

- [x] make practice hours can be changed by the admin and it is shown for the doctor

## in patient visits tab

- [x] add print to the consultation record for the doctor as well as in the patient view
- [x] on entering consultation make dosage and frequency have default select done menu and for custom it can be written manually
- [x] show patient details in the patient visits

## On consultation Hours

- [x] on canceling the doctor cancel the whole day or the rest of the day

# Patient portal

## in book appointment

- [x] show doctor default schedule like (Fri 9:00 PM to 12:00 AM)
- [x] don't show past slots

# [x] leave 30 min for emergency on creating slots

- [x] in the seed add all patient info like phone number and emergency and date of birth

- [x] in create slots (repeat weekly to specific date)

# General

- [x] landing page
- [ ] error handling
- [ ] client error friendly message
- [ ] check for refactor
- [ ] OWASP check
- [ ] protected routes
- [ ] potential UI enhancements
- [ ] potential UX enhancements
- [ ] change browser default confirmation modal

# Bugs

## In doctor portal

### Consultation Hours tab

- date picker is hidden in overflow
- rest of the day option os for today only

## In patient tab

### Book an appointment tab

- today and tomorrow doesn't' filter slots (if there isn't slots for today or tomorrow it will also show upcoming which isn't right for the filter)
