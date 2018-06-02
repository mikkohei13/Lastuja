
## Toimintalogiikka

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

## FETCH

Run fetcher from the `fetch` directory, with settings in nodemon.json:

    nodemon index.js

This should be run by a cronjob, e.g. every 10 minutes. (Does Gmail set limits on the frequency?)

## SEND

Run sender from the `send` directory:

    DEBUG=send:* npm start

or:

    DEBUG=search:* nodemon ./bin/www

Access using personToken
- Get the token using Havistin authenticator: https://www.biomi.org/havistin/
- Go to http://localhost:3000/upload/?person_token=TOKEN


## Questions

- How to use middleware in all defined routes, but nowhere else? Router-level middleware will be used with nonexistent endpoints (e.g. /uploads/foobar)
- How to organize an app, which has two parts: one called by cronjob, other being an express app serving web pages (or an API). Both use the same database, and potentially same database abstraction module.
- How to organize code into middleware vs. reusable modules? 
- How generic should modules be, in a) short term, when making a simple system (which will probably grow more complicated over time) vs. long term? E.g. handling errors.

## Expectations

- How many file attachments allowed per email? Works at least with one. TEST
- Only one track per file. TEST
- Attachment filename + pluscode uniquely identifies the file, i.e. if file with the same filename and pluscode is sent again, it should not be processed.
- If there is a problem creating a valid laji-document (e.g. because validator at api.laji.fi is down), user has to send the file again. Reprocessing is not tried automatically. TEST
- Only one new attachment is parsed at a time. If there are more attachments, rest of them will have to wait for next time fetch is run.

## Todo

- Fetch
    - Save datetime into db
- Send
    - Show files
    - Show info about files
    - Have a route to send the data
    - Display results, save id to the database
    - Show link to vihko with the files

- Make this one system, with shared node_modules. Keep fetch and send in their own subfolders, and create new folder for shared code, e.g. db models
- Separate code into reusable modules, use them through middleware. This means making lajifi_login as module, and using that from middleware, which is being used from route. Document this for future code discussions.

### FETCH
- Email validation results
- Viestin body documentin notesiin
- Käsitellyn (=validoidun) viestin poisto Gmailin inboxista
- Debugging w/ debug module
- Better error handling
- gpx-document -parserista voisi tehdä npm-moduulin

- Test
   - Viesti lähetetty useisiin osoitteisiin
   - Liitteenä jokin muu kuin gpx
   - Liitteenä malformed gpx

#### SEND
- Vihkoon tallennus -käli
- Use error template for errors, or disable error template
- UI w/ express
- Login w/ havistin-PHP
- List your unsent files
- Lajinimet eivät tunnistaudu Vihkossa - käyttäjän pitää klikata jokaista havaintoa saadakseen nimen tunnistetuksi. Toistaiseksi ok, pakottaa tarkistamaan havainnot.
- Ei paikannimeä - käyttäjän pitää lisätä paikannimet itse Vihkossa

## Notes

With default settings Nodemon runs the script twice, because it creates new .json files, which trigger nodemon to re-run. To prevent this, run:

    nodemon --ignore 'files*' index.js

...or put apprpriate settings to nodemon.json config file.

Receiving email: http://docs.cloudmailin.com/receiving_email/localhost_debugger/

