System to save nature observations captured by GPX tracker to FinBIF/laji.fi.


## Logic (in Finnish)

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

## BOTH

Linting:

    ./node_modules/.bin/eslint ./send/FILENAME

## FETCH

Run fetcher from the `fetch` directory, with settings in nodemon.json:

    nodemon index.js --emailResponse

This should be run by a cronjob, e.g. every 10 minutes. (Does Gmail set limits on the frequency?)

## SEND

Run sender from the `send` directory:

    nodemon index.js

Access using personToken:
- Get the token using Havistin authenticator: https://www.biomi.org/havistin/
- Go to http://localhost:3000/upload/?person_token=TOKEN

App structure (6/2018):
- app.js defines the app and uses app-level middleware, mounts router /send
- send.js listens routes under /send, uses route-level and endpoint-level middleware from middleware.js, and forwards data coming from them to view template
- middleware.js uses modularized functions
    - lajifi_api.js - Methods to work with api.laji.fi
    - db_models.js - Methods to work with the database

## Questions

- How to set up eslint to run whenever nodemon restarts the app
- How user input is / should be sanitized in node? 
- How to use middleware in all defined routes, but nowhere else? Router-level middleware will be used with nonexistent endpoints (e.g. /uploads/foobar)
- How to organize an app, which has two parts: one called by cronjob, other being an express app serving web pages (or an API). Both use the same database, and potentially same database abstraction module.
- How to organize code into middleware vs. reusable modules? 
- How generic should modules be, in a) short term, when making a simple system (which will probably grow more complicated over time) vs. long term? E.g. handling errors.
- It's often recommended that functions should have names, so that error messages, memory dumps could display the function name. But how about fat arrow functions, should/can they have names?

## Principles and limitations

- Attachment filename + pluscode uniquely identifies the file, i.e. if file with the same filename and pluscode is sent again, it should not be processed.
- GPX files are stored on disk using the original attachement filenames. Prepending them with pluscodes would be difficult, since pluscode and attachment are read separately, and combined only later (in the organizeFiles function). This could create issues:
    - If two emails with same attachment name are processed at exactly the same time, they could get mixed. Nor fetch is run only as a single process handling a single file, so it's not a problem.
    - Currently new attachment with same filename will overwrite previous attachment in gpx-folder, even if coming from different user. (Laji.fi-documents are namespaced between users using pluscodes.) This would be easier to overcome by renaming files using the organizeFiles function (TODO later, if ever).
- If there is a problem in creating a valid laji-document due to the system malfunctioning (e.g. because validator at api.laji.fi is down), user has to send the file again. Reprocessing is not tried automatically.
- Only one new attachment is parsed at a time. If there are more attachments, rest of them will have to wait for next time fetch is run.
- How many file attachments allowed per email? Works at least with one. TEST
- Only one track per file. TEST

## Todo

## Soon
- Fetch
    - Sanitize file names, so that they can be used as get param
    - Test
        - Several recipients -> Parses the file ok
        - No attachment -> Skips the email
        - Attachment is not .gpx -> Skips the attachment
        - Multiple gpx-attachments in one message -> Ever only parses one of them
        - Multiple attachments in one message, one of which is gpx -> One gpx is parsed (randomly?)
        - Malformed gpx attached -> Doesn't parse the file, but DOESN'T MOVE TO NEXT FILE EITHER = Malformed gpx file will stop all new files being processed = bug
        - kml instead of gpx
- Send
    - Reload db.json at every page load
    - Understand parsing json from api: body-parser module?
    - (Try sending invalid file)
    - !!! Save sent id's into an array in the db.json, and read them from an array using loop on handlbards template (will make easier to allow multiple sends per file in the future)
- Sanitize user input?


Note about JS:
- File paths are relative to where script is started from


### Later
- Non-features
    - Make this one system, with shared node_modules. Keep fetch and send in their own subfolders, and create new folder for shared code, e.g. db models
    - Separate code into reusable modules, use them through middleware. This means making lajifi_api as module, and using that from middleware, which is being used from route. Document this for future code discussions.
    - Use person token via cookie, using session module?
        - Use production-ready session store
    - GDPR requirements
    - Promises instead of callbacks, with sane error handling (or await / async?)
- Dev support
    - Automatic linting
    - Testing
    - Debugging w/ debug module
- Features etc.
    - Styling
    - Proper logout
- Fetch
    - Käsitellyn (=validoidun) viestin poisto Gmailin inboxista
    - Viestin body documentin notesiin
    - Map taxon names to codes? How? async/await?
        - key taxonID
        - API https://api.laji.fi/v0/taxa/search?query=TAXONNAME&limit=1&matchType=exact&onlySpecies=false&onlyFinnish=false&onlyInvasive=false&access_token=APITOKEN
    - Use 3rd party email API, e.g.
        - Postmark (no free plan)
        - EmailYak
        - Mailgun
- Send
    - Use error template for errors, or disable error template
    - Manually mark file as unsent

If you need to change how laji-documents are created, remove them from db.json and re-run the fetch script. But DON'T touch those files which have status sent, otherwise they would be duplicated!


## Notes

With default settings Nodemon runs the script twice, because it creates new .json files, which trigger nodemon to re-run. To prevent this, run:

    nodemon --ignore 'files*' index.js

...or put apprpriate settings to nodemon.json config file.

Receiving email: http://docs.cloudmailin.com/receiving_email/localhost_debugger/

