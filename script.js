
'use strict'; 

   const Script = require('smooch-bot').Script; 

// Bots
   const AndreasSefzig = "[AndreasSefzig] "; 
   const SefzigBot = "[SefzigBot] "; 
   const EmpfangsBot = "[EmpfangsBot] "; 
   const KreationsBot = "[KreationsBot] "; 
   const BeratungsBot = "[BeratungsBot] "; 
   const KonzeptionsBot = "[KonzeptionsBot] "; 
   const StrategieBot = "[StrategieBot] "; 
   const TechnikBot = "[TechnikBot] "; 
   const LinkBot = "[LinkBot] "; 
   const TextBot = "[TextBot] "; 
   const SlackBot = "[SlackBot] "; 

// Variablen 
   var versuche_max = 3; 
   var versuche = 0; 
   var zuletzt = ""; 
   var bekannt = false;

// Daten 
   var vorname = "Unbekannter";
   var nachname = "Besucher";
   var email = "test@chatraum.de";
   var emailkorrekt = true;
   
// Konversationen 
   module.exports = new Script({ 
   
   // ---------------
   // GESPRÄCH ANFANG
   // ---------------
     
    processing: {
        
        prompt: (bot) => bot.say(EmpfangsBot+'Nicht so schnell bitte...'),
        receive: () => 'processing'
        
    },
   
    start: {
    
    // prompt: (bot) => bot.say(EmpfangsBot+'Starte...'),
       receive: (bot, message) => {
            
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim());
          
       // Nächster Schritt default
          var dann = "empfang";
          
          if (~befehl.indexOf("Weiterleiten zu:")) {
             
          // bot.say(EmpfangsBot+'Ich leite Sie weiter.');
             
          }
          else {
             
             if (bekannt == false) {
                
                                return bot.say(EmpfangsBot+' Willkommen in der Vorlage des --Chatraums. ').then(() => bot.say(EmpfangsBot+' Wir sind 3 Bots: Ich bin Alice, Barbara ist im --Verkauf und Cynthia macht unser --Marketing. ')).then(() => bot.say(EmpfangsBot+' Unterhalten Sie sich mit uns, indem Sie die farbig hinterlegten Wörter schreiben, klicken oder berühren! ')).then(() => bot.say(EmpfangsBot+' Ich habe rechts das Menü für Sie geöffnet. Sie können es mit dem Button oben rechts bedienen - oder indem Sie --Menü schreiben. [Javascript:menu(an)] ')).then(() => 'empfang');                
             }
             else {
                
                                return bot.say(EmpfangsBot+' Willkommen zurück! Sprechen Sie mit mir über --Chatraum! ').then(() => bot.say(EmpfangsBot+' Oder sprechen Sie mit den anderen Bots über --Verkauf und --Marketing. ')).then(() => 'empfang');                
             }
             
          }
          
          return bot.setProp('empfangen', 'ja')
          .then(() => dann);
          
       }
    },
   
 // -------------------------
 // Onboarding
 // -------------------------
    
    name: {
    	
        receive: (bot, message) => {
            
            var antwort = befehlWort(message.text.trim().toUpperCase());
            var dann = "name";
            
            if ((antwort == "--JA") ||
                (antwort == "--NAME") ||
                (antwort == "--ÄNDERN")) { 
               
               bot.say(EmpfangsBot+'Wir werden sorgsam mit Ihren Daten umgehen.');
               dann = "vorname";
               
            }
            if ((antwort == "--NEIN") ||
                (antwort == "--EMPFANG") ||
                (antwort == "--ABBRECHEN")) {
               
               bot.say(EmpfangsBot+'Gehen wir zurück zum --Empfang.');
               dann = "empfang";
               
            }
            if ((antwort == "--EMAIL") ||
                (antwort == "--E-MAIL")) {
               
               bot.say(EmpfangsBot+'Wir geben Ihre Adresse nicht weiter.');
               dann = "emailadresse";
               
            }
            
            return bot.setProp('name_eingabe', 'tmp')
                .then(() => dann);
        }
    },

    vorname: {
    	
        prompt: (bot) => bot.say(EmpfangsBot+'Wie heissen Sie mit Vornamen?'),
        receive: (bot, message) => {
            
            vorname = message.text;
            vorname = vorname.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
            
            return bot.setProp('vorname', vorname)
                .then(() => bot.say(EmpfangsBot+''+vorname+', prima.'))
                .then(() => bot.say(EmpfangsBot+'Und wie heissen Sie mit Nachnamen? [Javascript:cookies(vorname,'+vorname+')] '))
                .then(() => 'nachname');
        }
    },

    nachname: {
    	
        receive: (bot, message) => {
            
            nachname = message.text; 
            nachname = nachname.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
            nachname = nachname.replace("--","");
            
            bot.setProp('nachname', nachname);
            return bot.getProp('vorname')
                .then((vorname) => bot.say(EmpfangsBot+'Sie heissen also '+vorname+' '+nachname+'. Bitte geben Sie nun Ihre E-Mail-Adresse ein (sie können auch --abbrechen). [Javascript:cookies(nachname,'+nachname+')] '))
                .then(() => 'emailadresse');
            
        }
    },

    emailadresse: {
    	
        receive: (bot, message) => {
            
            email = message.text;
            
         // emailkorrekt = email.test(emailregex);
            emailkorrekt = true;
            
            if (emailkorrekt == true) {
            	
               return bot.setProp('email', email)
                  .then(() => bot.say(EmpfangsBot+''+email+' ist eine valide E-Mail-Adresse. [Javascript:cookies(email,'+email+')] '))
                  .then(() => bot.say(EmpfangsBot+'Schreiben Sie --E-Mail, um sie zu ändern. Oder lassen Sie uns zurück zum --Empfang gehen.'))
                  .then(() => 'empfang');
               
            }
            else {
            	
                return bot.say(+' 0 ').then(() => bot.say(EmpfangsBot+' Bitte geben Sie Ihre E-Mail-Adresse nochmal ein - oder lassen Sie uns zum --Empfang zurückkehren. ')).then(() => 'emailadresse');                
            }
        }
    },
   
 // ---------------------------
 // Empfang (Alice)
 // ---------------------------
 // - name_klein: empfang
 // - name_kamel: Empfang
 // - name_gross: EMPFANG
 // - frau_klein: alice
 // - frau_kamel: Alice
 // - frau_gross: ALICE
 // - bot_name:   EmpfangsBot
 // - bot_klein:  empfangsbot
 // - bot_kamel:  Empfangsbot
 // - bot_gross:  EMPFANGSBOT
 // ---------------------------
 
    empfang: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "empfang";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Empfang";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("empfang" != "empfang") {
          	 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ABBRECHEN")) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Empfang") { 
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; }             
          } 
          else {
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; return bot.say(EmpfangsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'empfang');}             
          }
          
          if (~befehl.indexOf("--MENÜAN")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'empfang');}if (~befehl.indexOf("--MENUAN")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'empfang');}          if (~befehl.indexOf("--MENÜAUS")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'empfang');}if (~befehl.indexOf("--MENUAUS")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'empfang');}          if (~befehl.indexOf("--MENÜ")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}if (~befehl.indexOf("--MENU")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}if (~befehl.indexOf("--MENUE")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; return bot.say(EmpfangsBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if (~befehl.indexOf("--KONTAKT")) { versuch = true; return bot.say(EmpfangsBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(EmpfangsBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'empfang');}          
          if (~befehl.indexOf("--TELEFON")) { versuch = true; return bot.say(EmpfangsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'empfang');}          
          if (~befehl.indexOf("--MAIL")) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'empfang');}          
          if (~befehl.indexOf("--TWITTER")) { versuch = true; return bot.say(EmpfangsBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'empfang');}          
       // -----------------
       // Über uns
       // -----------------
          
          if (~befehl.indexOf("--CHATRAUM")) { versuch = true; return bot.say(EmpfangsBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(EmpfangsBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'empfang');}          
       // Produkte
          if ("empfang" != "verkauf") {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(EmpfangsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if (~befehl.indexOf("--NEWSLETTER")) { versuch = true; return bot.say(EmpfangsBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if (~befehl.indexOf("--MOBIL")) { versuch = true; return bot.say(EmpfangsBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(EmpfangsBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'empfang');}          
       // Stile
          if (~befehl.indexOf("--TAG")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'empfang');}          if (~befehl.indexOf("--NACHT")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'empfang');}          if (~befehl.indexOf("--ROBOS")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'empfang');}          if (~befehl.indexOf("--HX")) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'empfang');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Barbara. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Barbara. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Cynthia. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Cynthia. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if (~befehl.indexOf("--GEWERK")) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Name. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if (~befehl.indexOf("--BEFEHLE")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit meinen Kolleginnen in --Verkauf und --Marketing. ').then(() => bot.say(EmpfangsBot+' Weitere Funktionen: --Kontakt, --Newsletter, --Mobil und --Über. ')).then(() => 'empfang');}          
          if (~befehl.indexOf("--ÜBER")) { versuch = true; return bot.say(EmpfangsBot+' Ich bin Alice, der Empfangs-Bot. ').then(() => bot.say(VerkaufsBot+' Alice ist eine offene Person, die Besucher auf ihre hilfsbereite Art in Empfang nimmt. ')).then(() => bot.say(EmpfangsBot+' Ich leite weiter zu meinen Kolleginnen und übernehme einfache Aufgaben, wie z.B. Ihren --Namen zu erfassen. ')).then(() => 'empfang');}if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Ich bin Alice, der Empfangs-Bot. ').then(() => bot.say(VerkaufsBot+' Alice ist eine offene Person, die Besucher auf ihre hilfsbereite Art in Empfang nimmt. ')).then(() => bot.say(EmpfangsBot+' Ich leite weiter zu meinen Kolleginnen und übernehme einfache Aufgaben, wie z.B. Ihren --Namen zu erfassen. ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Ich bin Alice, der Empfangs-Bot. ').then(() => bot.say(VerkaufsBot+' Alice ist eine offene Person, die Besucher auf ihre hilfsbereite Art in Empfang nimmt. ')).then(() => bot.say(EmpfangsBot+' Ich leite weiter zu meinen Kolleginnen und übernehme einfache Aufgaben, wie z.B. Ihren --Namen zu erfassen. ')).then(() => 'empfang');}          
       // -----------------
       // Inhalte
       // -----------------
          
          if (~befehl.indexOf("--DATEN")) { versuch = true; return bot.say(EmpfangsBot+' Lassen Sie uns Ihre Daten durchgehen. ').then(() => 'name');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if (~befehl.indexOf("--VORLAGE")) { versuch = true; return bot.say(EmpfangsBot+' Text Vorlage 1. ').then(() => 'empfang');}          

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { versuche = 0; } else { versuche++; if (versuche == versuche_max) {
             bot.say(EmpfangsBot+'Suchen Sie meine --Befehle?'); versuche = 0; }
          }
          
       // Weiterleiten
          return bot.setProp('empfang', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
 // ---------------------------
 // Beratung (Barbara)
 // ---------------------------
 // - name_klein: beratung
 // - name_kamel: Beratung
 // - name_gross: BERATUNG
 // - frau_klein: barbara
 // - frau_kamel: Barbara
 // - frau_gross: BARBARA
 // - bot_name:   BeratungsBot
 // - bot_klein:  beratungsbot
 // - bot_kamel:  Beratungsbot
 // - bot_gross:  BERATUNGSBOT
 // ---------------------------
 
    beratung: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "beratung";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Beratung";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("beratung" != "empfang") {
          	 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(BeratungsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Beratung? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(BeratungsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Beratung? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ABBRECHEN")) { versuch = true; return bot.say(BeratungsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Beratung? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Beratung") { 
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; }             
          } 
          else {
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; return bot.say(BeratungsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'beratung');}             
          }
          
          if (~befehl.indexOf("--MENÜAN")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'beratung');}if (~befehl.indexOf("--MENUAN")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'beratung');}          if (~befehl.indexOf("--MENÜAUS")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'beratung');}if (~befehl.indexOf("--MENUAUS")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'beratung');}          if (~befehl.indexOf("--MENÜ")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'beratung');}if (~befehl.indexOf("--MENU")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'beratung');}if (~befehl.indexOf("--MENUE")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'beratung');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; return bot.say(BeratungsBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if (~befehl.indexOf("--KONTAKT")) { versuch = true; return bot.say(BeratungsBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(BeratungsBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'beratung');}          
          if (~befehl.indexOf("--TELEFON")) { versuch = true; return bot.say(BeratungsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'beratung');}          
          if (~befehl.indexOf("--MAIL")) { versuch = true; return bot.say(BeratungsBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'beratung');}          
          if (~befehl.indexOf("--TWITTER")) { versuch = true; return bot.say(BeratungsBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'beratung');}          
       // -----------------
       // Über uns
       // -----------------
          
          if (~befehl.indexOf("--CHATRAUM")) { versuch = true; return bot.say(BeratungsBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(BeratungsBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'beratung');}          
       // Produkte
          if ("beratung" != "verkauf") {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(BeratungsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if (~befehl.indexOf("--NEWSLETTER")) { versuch = true; return bot.say(BeratungsBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if (~befehl.indexOf("--MOBIL")) { versuch = true; return bot.say(BeratungsBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(BeratungsBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'beratung');}          
       // Stile
          if (~befehl.indexOf("--TAG")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'beratung');}          if (~befehl.indexOf("--NACHT")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'beratung');}          if (~befehl.indexOf("--ROBOS")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'beratung');}          if (~befehl.indexOf("--HX")) { versuch = true; return bot.say(BeratungsBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'beratung');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Alice. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Alice. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Barbara. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Barbara. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Cynthia. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Cynthia. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if (~befehl.indexOf("--GEWERK")) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Name. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if (~befehl.indexOf("--BEFEHLE")) { versuch = true; return bot.say(BeratungsBot+' Sprechen Sie mit mir über --Produkte und --Beratung. ').then(() => bot.say(BeratungsBot+' Weitere Funktionen: --Kontakt, --Newsletter, --Mobil und --Über. ')).then(() => 'beratung');}          
          if (~befehl.indexOf("--ÜBER")) { versuch = true; return bot.say(BeratungsBot+' Ich bin Barbara, der Verkaufs-Bot. ').then(() => bot.say(MarketingBot+' Barbara ist eine Person, zu der ich später mehr sagen kann (folgt). ')).then(() => bot.say(BeratungsBot+' Ich kenne mich mit unseren --Produkten aus und --berate Sie gern. ')).then(() => 'beratung');}if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(BeratungsBot+' Ich bin Barbara, der Verkaufs-Bot. ').then(() => bot.say(MarketingBot+' Barbara ist eine Person, zu der ich später mehr sagen kann (folgt). ')).then(() => bot.say(BeratungsBot+' Ich kenne mich mit unseren --Produkten aus und --berate Sie gern. ')).then(() => 'beratung');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(BeratungsBot+' Ich bin Barbara, der Verkaufs-Bot. ').then(() => bot.say(MarketingBot+' Barbara ist eine Person, zu der ich später mehr sagen kann (folgt). ')).then(() => bot.say(BeratungsBot+' Ich kenne mich mit unseren --Produkten aus und --berate Sie gern. ')).then(() => 'beratung');}          
       // -----------------
       // Inhalte
       // -----------------
          
          if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(BeratungsBot+' Text Produkt. ').then(() => 'beratung');}          
          if (~befehl.indexOf("--BERAT")) { versuch = true; return bot.say(BeratungsBot+' Text Beratung. ').then(() => 'beratung');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if (~befehl.indexOf("--VORLAGE")) { versuch = true; return bot.say(BeratungsBot+' Text Vorlage 1. ').then(() => 'beratung');}          

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { versuche = 0; } else { versuche++; if (versuche == versuche_max) {
             bot.say(BeratungsBot+'Suchen Sie meine --Befehle?'); versuche = 0; }
          }
          
       // Weiterleiten
          return bot.setProp('beratung', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
 // ---------------------------
 // Technik (Cynthia)
 // ---------------------------
 // - name_klein: technik
 // - name_kamel: Technik
 // - name_gross: TECHNIK
 // - frau_klein: cynthia
 // - frau_kamel: Cynthia
 // - frau_gross: CYNTHIA
 // - bot_name:   TechnikBot
 // - bot_klein:  technikbot
 // - bot_kamel:  Technikbot
 // - bot_gross:  TECHNIKBOT
 // ---------------------------
 
    technik: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "technik";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Technik";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("technik" != "empfang") {
          	 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(TechnikBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Technik? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(TechnikBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Technik? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ABBRECHEN")) { versuch = true; return bot.say(TechnikBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Technik? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Technik") { 
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; }             
          } 
          else {
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; return bot.say(TechnikBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'technik');}             
          }
          
          if (~befehl.indexOf("--MENÜAN")) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'technik');}if (~befehl.indexOf("--MENUAN")) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'technik');}          if (~befehl.indexOf("--MENÜAUS")) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'technik');}if (~befehl.indexOf("--MENUAUS")) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'technik');}          if (~befehl.indexOf("--MENÜ")) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'technik');}if (~befehl.indexOf("--MENU")) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'technik');}if (~befehl.indexOf("--MENUE")) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'technik');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; return bot.say(TechnikBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if (~befehl.indexOf("--KONTAKT")) { versuch = true; return bot.say(TechnikBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(TechnikBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'technik');}          
          if (~befehl.indexOf("--TELEFON")) { versuch = true; return bot.say(TechnikBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'technik');}          
          if (~befehl.indexOf("--MAIL")) { versuch = true; return bot.say(TechnikBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'technik');}          
          if (~befehl.indexOf("--TWITTER")) { versuch = true; return bot.say(TechnikBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'technik');}          
       // -----------------
       // Über uns
       // -----------------
          
          if (~befehl.indexOf("--CHATRAUM")) { versuch = true; return bot.say(TechnikBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(TechnikBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'technik');}          
       // Produkte
          if ("technik" != "verkauf") {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(TechnikBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if (~befehl.indexOf("--NEWSLETTER")) { versuch = true; return bot.say(TechnikBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if (~befehl.indexOf("--MOBIL")) { versuch = true; return bot.say(TechnikBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(TechnikBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'technik');}          
       // Stile
          if (~befehl.indexOf("--TAG")) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'technik');}          if (~befehl.indexOf("--NACHT")) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'technik');}          if (~befehl.indexOf("--ROBOS")) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'technik');}          if (~befehl.indexOf("--HX")) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'technik');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Alice. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Alice. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Barbara. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Barbara. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Cynthia. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Cynthia. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if (~befehl.indexOf("--GEWERK")) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Name. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if (~befehl.indexOf("--BEFEHLE")) { versuch = true; return bot.say(TechnikBot+' Sprechen Sie mit mir über --Facebook und --Umfrage. ').then(() => bot.say(TechnikBot+' Weitere Funktionen: --Kontakt, --Newsletter, --Mobil und --Über. ')).then(() => 'technik');}          
          if (~befehl.indexOf("--ÜBER")) { versuch = true; return bot.say(TechnikBot+' Ich bin Cynthia, der Marketing-Bot. ').then(() => bot.say(EmpfangsBot+' Cynthia ist eine Person, zu der ich später mehr sagen kann (folgt). ')).then(() => bot.say(TechnikBot+' Ich mache unser --Facebook und habe eine --Umfrage. ')).then(() => 'technik');}if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(TechnikBot+' Ich bin Cynthia, der Marketing-Bot. ').then(() => bot.say(EmpfangsBot+' Cynthia ist eine Person, zu der ich später mehr sagen kann (folgt). ')).then(() => bot.say(TechnikBot+' Ich mache unser --Facebook und habe eine --Umfrage. ')).then(() => 'technik');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(TechnikBot+' Ich bin Cynthia, der Marketing-Bot. ').then(() => bot.say(EmpfangsBot+' Cynthia ist eine Person, zu der ich später mehr sagen kann (folgt). ')).then(() => bot.say(TechnikBot+' Ich mache unser --Facebook und habe eine --Umfrage. ')).then(() => 'technik');}          
       // -----------------
       // Inhalte
       // -----------------
          
          if (~befehl.indexOf("--FACEBOOK")) { versuch = true; return bot.say(TechnikBot+' Text Facebook. ').then(() => 'technik');}          
          if (~befehl.indexOf("--UMFRAGE")) { versuch = true; return bot.say(TechnikBot+' Text Umfrage. ').then(() => 'technik');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if (~befehl.indexOf("--VORLAGE")) { versuch = true; return bot.say(TechnikBot+' Text Vorlage 1. ').then(() => 'technik');}          

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { versuche = 0; } else { versuche++; if (versuche == versuche_max) {
             bot.say(TechnikBot+'Suchen Sie meine --Befehle?'); versuche = 0; }
          }
          
       // Weiterleiten
          return bot.setProp('technik', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
 // ---------------------------
 // Kreation (Doris)
 // ---------------------------
 // - name_klein: kreation
 // - name_kamel: Kreation
 // - name_gross: KREATION
 // - frau_klein: doris
 // - frau_kamel: Doris
 // - frau_gross: DORIS
 // - bot_name:   KreationsBot
 // - bot_klein:  kreationsbot
 // - bot_kamel:  Kreationsbot
 // - bot_gross:  KREATIONSBOT
 // ---------------------------
 
    kreation: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "kreation";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Kreation";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("kreation" != "empfang") {
          	 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(KreationsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Kreation? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(KreationsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Kreation? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ABBRECHEN")) { versuch = true; return bot.say(KreationsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Kreation? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Kreation") { 
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; }             
          } 
          else {
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; return bot.say(KreationsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'kreation');}             
          }
          
          if (~befehl.indexOf("--MENÜAN")) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'kreation');}if (~befehl.indexOf("--MENUAN")) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'kreation');}          if (~befehl.indexOf("--MENÜAUS")) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'kreation');}if (~befehl.indexOf("--MENUAUS")) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'kreation');}          if (~befehl.indexOf("--MENÜ")) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'kreation');}if (~befehl.indexOf("--MENU")) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'kreation');}if (~befehl.indexOf("--MENUE")) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'kreation');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; return bot.say(KreationsBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if (~befehl.indexOf("--KONTAKT")) { versuch = true; return bot.say(KreationsBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(KreationsBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'kreation');}          
          if (~befehl.indexOf("--TELEFON")) { versuch = true; return bot.say(KreationsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'kreation');}          
          if (~befehl.indexOf("--MAIL")) { versuch = true; return bot.say(KreationsBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'kreation');}          
          if (~befehl.indexOf("--TWITTER")) { versuch = true; return bot.say(KreationsBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'kreation');}          
       // -----------------
       // Über uns
       // -----------------
          
          if (~befehl.indexOf("--CHATRAUM")) { versuch = true; return bot.say(KreationsBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(KreationsBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'kreation');}          
       // Produkte
          if ("kreation" != "verkauf") {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(KreationsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if (~befehl.indexOf("--NEWSLETTER")) { versuch = true; return bot.say(KreationsBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if (~befehl.indexOf("--MOBIL")) { versuch = true; return bot.say(KreationsBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(KreationsBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'kreation');}          
       // Stile
          if (~befehl.indexOf("--TAG")) { versuch = true; return bot.say(KreationsBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'kreation');}          if (~befehl.indexOf("--NACHT")) { versuch = true; return bot.say(KreationsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'kreation');}          if (~befehl.indexOf("--ROBOS")) { versuch = true; return bot.say(KreationsBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'kreation');}          if (~befehl.indexOf("--HX")) { versuch = true; return bot.say(KreationsBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'kreation');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Alice. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Alice. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Barbara. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Barbara. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Cynthia. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Cynthia. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if (~befehl.indexOf("--GEWERK")) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Name. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { versuche = 0; } else { versuche++; if (versuche == versuche_max) {
             bot.say(KreationsBot+'Suchen Sie meine --Befehle?'); versuche = 0; }
          }
          
       // Weiterleiten
          return bot.setProp('kreation', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
 // ---------------------------
 // Konzeption (Erika)
 // ---------------------------
 // - name_klein: konzeption
 // - name_kamel: Konzeption
 // - name_gross: KONZEPTION
 // - frau_klein: erika
 // - frau_kamel: Erika
 // - frau_gross: ERIKA
 // - bot_name:   KonzeptionsBot
 // - bot_klein:  konzeptionsbot
 // - bot_kamel:  Konzeptionsbot
 // - bot_gross:  KONZEPTIONSBOT
 // ---------------------------
 
    konzeption: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "konzeption";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Konzeption";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("konzeption" != "empfang") {
          	 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(KonzeptionsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Konzeption? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(KonzeptionsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Konzeption? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ABBRECHEN")) { versuch = true; return bot.say(KonzeptionsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Konzeption? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Konzeption") { 
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; }             
          } 
          else {
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; return bot.say(KonzeptionsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'konzeption');}             
          }
          
          if (~befehl.indexOf("--MENÜAN")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'konzeption');}if (~befehl.indexOf("--MENUAN")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'konzeption');}          if (~befehl.indexOf("--MENÜAUS")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'konzeption');}if (~befehl.indexOf("--MENUAUS")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'konzeption');}          if (~befehl.indexOf("--MENÜ")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'konzeption');}if (~befehl.indexOf("--MENU")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'konzeption');}if (~befehl.indexOf("--MENUE")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'konzeption');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; return bot.say(KonzeptionsBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if (~befehl.indexOf("--KONTAKT")) { versuch = true; return bot.say(KonzeptionsBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(KonzeptionsBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'konzeption');}          
          if (~befehl.indexOf("--TELEFON")) { versuch = true; return bot.say(KonzeptionsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'konzeption');}          
          if (~befehl.indexOf("--MAIL")) { versuch = true; return bot.say(KonzeptionsBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'konzeption');}          
          if (~befehl.indexOf("--TWITTER")) { versuch = true; return bot.say(KonzeptionsBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'konzeption');}          
       // -----------------
       // Über uns
       // -----------------
          
          if (~befehl.indexOf("--CHATRAUM")) { versuch = true; return bot.say(KonzeptionsBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(KonzeptionsBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'konzeption');}          
       // Produkte
          if ("konzeption" != "verkauf") {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(KonzeptionsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if (~befehl.indexOf("--NEWSLETTER")) { versuch = true; return bot.say(KonzeptionsBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if (~befehl.indexOf("--MOBIL")) { versuch = true; return bot.say(KonzeptionsBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(KonzeptionsBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'konzeption');}          
       // Stile
          if (~befehl.indexOf("--TAG")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'konzeption');}          if (~befehl.indexOf("--NACHT")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'konzeption');}          if (~befehl.indexOf("--ROBOS")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'konzeption');}          if (~befehl.indexOf("--HX")) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'konzeption');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Alice. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Alice. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Barbara. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Barbara. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Cynthia. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Cynthia. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if (~befehl.indexOf("--GEWERK")) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Name. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { versuche = 0; } else { versuche++; if (versuche == versuche_max) {
             bot.say(KonzeptionsBot+'Suchen Sie meine --Befehle?'); versuche = 0; }
          }
          
       // Weiterleiten
          return bot.setProp('konzeption', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
 // ---------------------------
 // Strategie (Feline)
 // ---------------------------
 // - name_klein: strategie
 // - name_kamel: Strategie
 // - name_gross: STRATEGIE
 // - frau_klein: feline
 // - frau_kamel: Feline
 // - frau_gross: FELINE
 // - bot_name:   StrategieBot
 // - bot_klein:  strategiebot
 // - bot_kamel:  Strategiebot
 // - bot_gross:  STRATEGIEBOT
 // ---------------------------
 
    strategie: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "strategie";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Strategie";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("strategie" != "empfang") {
          	 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(StrategieBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Strategie? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(StrategieBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Strategie? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if (~befehl.indexOf("--ABBRECHEN")) { versuch = true; return bot.say(StrategieBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Strategie? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Strategie") { 
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; }             
          } 
          else {
             
             if (~befehl.indexOf("--ZURÜCK")) { versuch = true; return bot.say(StrategieBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'strategie');}             
          }
          
          if (~befehl.indexOf("--MENÜAN")) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'strategie');}if (~befehl.indexOf("--MENUAN")) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'strategie');}          if (~befehl.indexOf("--MENÜAUS")) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'strategie');}if (~befehl.indexOf("--MENUAUS")) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'strategie');}          if (~befehl.indexOf("--MENÜ")) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'strategie');}if (~befehl.indexOf("--MENU")) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'strategie');}if (~befehl.indexOf("--MENUE")) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'strategie');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; }             
          }
          else {
       	    
             if (~befehl.indexOf("--NAME")) { versuch = true; return bot.say(StrategieBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if (~befehl.indexOf("--KONTAKT")) { versuch = true; return bot.say(StrategieBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(StrategieBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'strategie');}          
          if (~befehl.indexOf("--TELEFON")) { versuch = true; return bot.say(StrategieBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'strategie');}          
          if (~befehl.indexOf("--MAIL")) { versuch = true; return bot.say(StrategieBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'strategie');}          
          if (~befehl.indexOf("--TWITTER")) { versuch = true; return bot.say(StrategieBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'strategie');}          
       // -----------------
       // Über uns
       // -----------------
          
          if (~befehl.indexOf("--CHATRAUM")) { versuch = true; return bot.say(StrategieBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(StrategieBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'strategie');}          
       // Produkte
          if ("strategie" != "verkauf") {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(StrategieBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if (~befehl.indexOf("--PRODUKT")) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if (~befehl.indexOf("--NEWSLETTER")) { versuch = true; return bot.say(StrategieBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if (~befehl.indexOf("--MOBIL")) { versuch = true; return bot.say(StrategieBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(StrategieBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'strategie');}          
       // Stile
          if (~befehl.indexOf("--TAG")) { versuch = true; return bot.say(StrategieBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'strategie');}          if (~befehl.indexOf("--NACHT")) { versuch = true; return bot.say(StrategieBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'strategie');}          if (~befehl.indexOf("--ROBOS")) { versuch = true; return bot.say(StrategieBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'strategie');}          if (~befehl.indexOf("--HX")) { versuch = true; return bot.say(StrategieBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'strategie');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Alice. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Alice. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if (~befehl.indexOf("--EMPFANG")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if (~befehl.indexOf("--ALICE")) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Barbara. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Barbara. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if (~befehl.indexOf("--VERKAUF")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if (~befehl.indexOf("--BARBARA")) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Cynthia. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Cynthia. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if (~befehl.indexOf("--MARKETING")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if (~befehl.indexOf("--CYNTHIA")) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if (~befehl.indexOf("--GEWERK")) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Name. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { versuche = 0; } else { versuche++; if (versuche == versuche_max) {
             bot.say(StrategieBot+'Suchen Sie meine --Befehle?'); versuche = 0; }
          }
          
       // Weiterleiten
          return bot.setProp('strategie', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
    finish: {
       receive: (bot, message) => {
          return bot.getProp('name')
             .then(() => 'finish');
       }
    }
    
   // --------------
   // GESPRÄCH AUS 
   // -------------- 

   });
   
 // Befehle
    function befehlWort(befehl) {
       
    // Wenn die Nachricht nur ein Wort ist
       var test = befehl.split(" "); 
       if ((!test[1]) || (test[1] == "")) {
          
       // In Befehl umwandeln
          befehl = befehl.replace("--", "");
          befehl = "--"+befehl;
          
       // Satzzeichen entfernen
          befehl = befehl.replace(".", "");
          befehl = befehl.replace("!", "");
          befehl = befehl.replace("?", "");
               
       }
            
       return befehl;
       
    }
    
 // Bots vereinfachen
    function sagenhaft(befehl, dann, bot, text1, text2, text3, text4, text5) {
    // sagenhaft('Strategie', dann, bot,
    //    SefzigBot+'Chatten ist die häufigste digitale Beschäftigung in Deutschland: [Text:Aktuelle Statistiken,RobogeddonChatten] Ein weltweiter --Trend mit erheblichen absehbaren Auswirkungen auf die Benutzeroberflächen des Internets.',
    //    SefzigBot+'Chat-Bots gibt es schon --lange. Sie werden gerade jetzt für das Marketing interessant, weil die meisten Menschen mit Chatten vertraut sind und große Anwendungen wie --Facebook, --Slack u.a. ihre Plattformen für Bots öffnen.',
    //    SefzigBot+'Interessieren Sie sich eher für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren?'
    //  );  
       if  (~befehl.indexOf("--STRATEGIE")) { 
          
          versuch = true; 
          
          if ((text5) && (text5 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3) }).then(function(){
             return bot.say(text4) }).then(function(){
             return bot.say(text5); });
          }
          else if ((text4) && (text4 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3) }).then(function(){
             return bot.say(text4); });
          }
          else if ((text3) && (text3 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3); });
          }
          else if ((text2) && (text2 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2); });
          }
          else if ((text1) && (text1 != "")) {
             bot.say(text1);
          }
          
       }
       
    }
      