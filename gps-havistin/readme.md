
## FETCH

Run fetcher from the `fetch` directory:

    nodemon --ignore 'files*' index.js

## SEND

Run sender from the `send` directory:

    DEBUG=send:* npm start

or:

    DEBUG=search:* nodemon ./bin/www



Access using personToken
http://localhost:3000/upload/?person_token=TOKEN

## Questions

How to use middleware in all defined routes, but nowhere else?
router-level middleware will be used with nonexistent endpoints (e.g. /uploads/foobar)


## Todo

FETCH
- Email validation results
- Viestin body documentin notesiin

- Viestin body documentin notesiin
- Vihkoon tallennus -käli
   - Anna person token parametrina ja talleta vihkoon
- Debugging w/ debug module

- Varaudu:
   - ei waypointeja -> ei voi tehdä validia documenttia

- Test
   - Viesti lähetetty useisiin osoitteisiin
   - Liitteenä jokin muu kuin gpx
   - Liitteenä malformed gpx

SEND
- Use error template for errors, or disable error template
- UI w/ express
- Login w/ havistin-PHP
- List your unsent files
- Send all files


## Logiikka


### Perusvaiheet:

1) hae tiedostot ja tallenna levylle
1) konvertoi ja validoi tiedostot ja tallenna levylle
1) lähetä tiedostot ja tallenna levylle

### Tarkemmin:

- Käyttäjälle luodaan MA-tunnisteeseen liitetty +tunniste meiliosoitteeseen liitettäväksi
- Käyttäjä lähettää gpx:n tiedostona ko. osoitteeseen
- Cronjob hakee gpx:n ja
    - Parsii sen documentiksi (DONE)
    - Tallentaa hakemistoon +MA-tunnisteella
    - Validoi API:ssa
    - Vastaa käyttäjälle meilillä, virheineen
- Käyttäjä kirjautuu sisään Laji-authilla PHP:n kautta
    - Saa tokenin
    - Redirect Node-sovellukseen
        - jotta kirjautumista ei voisi ohittaa documentit nähdäkseen, joko tai
            - payload kryptattuna
            - node tarkistaa API:sta onko token validi
- Systeemi näyttää parsitut documentit
    - Virheineen jos sellaisia on 
- Käyttäjä klikkaa lähetysnappia
- Systeemi lähettää tiedoston API:iin tokenin kanssa
    - Näyttää mahdolliset virheet
- Systeemi näyttää linkin, josta pääsee dokumenttiin Vihkossa
- Käyttäjä täydentää dokumentin ja tallentaa





## Puutteita
- Lajinimet eivät tunnistaudu Vihkossa - käyttäjän pitää klikata jokaista havaintoa saadakseen nimen tunnistetuksi. Toistaiseksi ok, pakottaa tarkistamaan havainnot.
- Ei paikannimeä - käyttäjän pitää lisätä paikannimet itse Vihkossa
- gpx-document -parserista voisi tehdä npm-moduulin

## Notes

With default settings Nodemon runs the script twice, because it creates new .json files, which trigger nodemon to re-run.
To prevent this, run:

    nodemon --ignore 'files*' index.js


Receiving email: http://docs.cloudmailin.com/receiving_email/localhost_debugger/

