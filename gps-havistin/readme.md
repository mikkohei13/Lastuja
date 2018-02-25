

Receiving email

http://docs.cloudmailin.com/receiving_email/localhost_debugger/



## Logiikka
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
