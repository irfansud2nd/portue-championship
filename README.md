# PORTUE Silat Bandung Championship 2023 - Registration Website

## Introduction

PORTUE Bandung Championship is an annual event orginized by [Komite Olahraga Nasional Indonesia (KONI) Kota Bandung](https://portue.koni-kotabandung.or.id/) and supported by many organization. This event consists of 32 sports branches, and for the Pencak Silat, KONI Kota is supported an event organizer owned by my close friend. Therefore, I have the opportunity to facilitate registrations through the website that I have developed.

495 Users\
12 Admins

Accommodating 2312 data consisting of:

- 157 Contingents
- 1772 Athletes
- 433 Officials

This website is also my first paid and commercial project. I know this website is far from perfect. It was created in just one week, but I still maintain this website until the event is over. Nevertheless, I cannot make many improvements because I also maintain [another website](https://github.com/irfansud2nd/kejurnas-asbd-2023) that has similar functions to this one.

## Features

### Client

- Register, update and delete kontingen data
- Register, update and delete kontingen's crew data
- Upload, update and delete kontingen's crew photo
- Register, update and delete kontingen's athlete data
- Upload, update and delete photo and personal file of kontingen's athlete
- Upload kontingen's payment
- Automatically deleting the old file if the user updates it
- Automatically calculating the registration fee amount
- Live updates on the ongoing match number.
- Recapitulation of medal winnings

### Admin

- Dashboard
- Manual payment verifivation by admins
- Store data for offline document verification
- Table of athletes data with customizable filters
- Export data to Excel format for admins
- Update kontingen's medal winnings
- Update the ongoing match number.

## Discalaimer

- Admin pages are usually accessible only to admins, but for the sake of my personal portfolio, I have changed the access to anyone with their Google account
- Current database is different from the database used for PORTUE Silat Bandung Championship. this is done to avoid mixed data and free acces to admin page

## How to use

- Live Web [here](https://portue-silat-championship.vercel.app)
- Access admin page [here](https://portue-silat-championship.vercel.app/admin)
- Access scoring page [here](https://portue-silat-championship.vercel.app/scoring)

## Tech Stack

- Next JS
- Typescript
- Tailwind CSS
- Firebase (Firestore, Storage, Authentication)

## Other Resource or Liraries

- [react-export-table-to-excel](https://github.com/EdisonJpp/react-export-table-to-excel)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-toastify](https://fkhadra.github.io/react-toastify/introduction)
- [rodal](https://chenjiahan.github.io/rodal/)
