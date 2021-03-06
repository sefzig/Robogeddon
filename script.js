
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
   var botsan = true;
   
// Daten 
   var vorname = "Unbekannter";
   var nachname = "Besucher";
   var email = "test@robogeddon.de";
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
                
                                return bot.say(EmpfangsBot+' Wir sind --Robogeddon, eine Agentur für (und aus) Chat-Bots. ').then(() => bot.say(EmpfangsBot+' Auf dieser Seite möchten wir Ihnen alles Wissenswerte zu Chats und Chat-Bots im Marketing zeigen: Sprechen Sie mit meinen Kolleginnen aus --Beratung, --Kreation, --Konzeption, --Strategie und --Technik. Oder nehmen Sie auf anderem Wege --Kontakt zu uns auf. ')).then(() => bot.say(EmpfangsBot+' Unterhalten Sie sich mit uns, indem Sie die farbig hinterlegten Wörter schreiben, klicken oder berühren! ')).then(() => bot.say(EmpfangsBot+' Ich habe rechts das Menü für Sie geöffnet. Sie können es mit dem Button oben rechts bedienen - oder indem Sie --Menü schreiben. [Javascript:menu(an)] ')).then(() => 'empfang');                
             }
             else {
                
                                return bot.say(EmpfangsBot+' Willkommen zurück! Sprechen Sie mit mir über --Robogeddon! ').then(() => bot.say(EmpfangsBot+' Oder mit den anderen Bots über --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik. ')).then(() => 'empfang');                
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
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("empfang" != "empfang") {
          	 
             if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es in der --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Empfang") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'empfang');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wir kennen Ihren Namen noch nicht. Wollen Sie Ihren Namen eingeben? Schreiben Sie bitte --ja oder --nein. ').then(() => 'name');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(EmpfangsBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ANFRAGE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(EmpfangsBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie uns eine E-Mail: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Tweeten Sie mit uns auf Twitter: [Text:@robogeddon,RobogeddonTwitter,] ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Andreas Sefzig ist Premium-Mitglied bei XING: [Text:Andreas Sefzig auf XING,RobogeddonXing,] ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--SLACK-TEAM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Treten Sie unserem offenen Slack-Team bei: [Text:Unser offenes Slack,RobogeddonSlackteam,] ').then(() => 'empfang');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--ROBOGEDDON")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #Robogeddon sind eine auf Chats und Bots für das Marketing spezialisierte Agentur. ').then(() => bot.say(EmpfangsBot+' Wir sind Andreas --Sefzig und eine lose Gruppe freier Kreativer - und natürlich wir, die Bots! Wir realisieren Chat-Lösungen für die interne und externe Unternehmens-Kommunikation. [Text:Kurzes Agenturprofil,RobogeddonAgentur] ')).then(() => bot.say(EmpfangsBot+' Lassen Sie uns über Ihre --Strategie und unsere --Produkte sprechen! Wollen Sie --Kontakt aufnehmen? ')).then(() => 'empfang');}          
       // Produkte
          if ("empfang" != "beratung") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo! Unsere Produkte sind Marketing-Ihre Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ')).then(() => 'beratung');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Unsere Produkte sind Ihre Marketing-Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ').then(() => 'beratung');}	       
          }
          
       // -----------------
       // Persönlich
       // -----------------
          
          if ((~befehl.indexOf("--DANKS")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Auch ich, %name_frau%, danke Nadja, Bob meinen (ehemaligen) Kollegen und meinen Eltern für ihre Geduld mit mir und meinen Bots. ').then(() => 'empfang');}	       
          if ((~befehl.indexOf("--BOB")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Hey Bob, ich bin Sefzigs Bot. Freut mich, dass Du Dir meinen Chatraum anschaust! ').then(() => bot.say(SefzigBot+' Ich kann nicht anders als Dich zu bitten, hier tief reinzuschauen und rumzuprobieren... Der Stand: Alle Basis-Funktionen wie Empfang, Onboarding und Bots und Dinge wie zurück, abbrechen oder mobil laufen. Viele Inhalte stehen bereits (sind aber noch nicht geil), einige Befehle führen ins Leere. Das wird schon noch :D Viel Spass! ')).then(() => bot.say(SefzigBot+' Starte mit --Empfang oder --Menü. ')).then(() => 'empfang');}	       
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bitte geben Sie Ihre E-Mail-Adresse ein (oder wollen Sie --abbrechen?) ').then(() => 'emailadresse');}          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bestellen Sie unseren Newsletter! Alice? ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Diesen Chat mobil öffnen: [Qr:http://robogeddon.herokuapp.com/] ').then(() => bot.say(TechnikBot+' Leider werden Sie dort nicht automatisch wiedererkannt. Wir arbeiten an einer Lösung... ')).then(() => bot.say(EmpfangsBot+' Oder öffnen Sie [Textlink:Robogeddon.de,http://robogeddon.de] in Ihrem mobilen Browser. ')).then(() => 'empfang');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(tag)] Guten Tag. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(nacht)] Gute Nacht. ').then(() => 'empfang');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(robogeddon)] Die Robos kommen! ').then(() => 'empfang');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(hacks)] Powned! ').then(() => 'empfang');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "sefzig") { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas benachrichtigt. ').then(() => bot.say(EmpfangsBot+' Sprechen Sie solange mit mir, indem Sie --Empfang schreiben! ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas bereits benachrichtigt. ').then(() => bot.say(EmpfangsBot+' Sprechen Sie solange mit mir, indem Sie --Empfang schreiben! ')).then(() => 'empfang');}          }
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "beratung") { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Barbara. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Barbara. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');} } else { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}          }
          
          if (zuletzt_klein != "technik") { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Cynthia. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Cynthia. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');} } else { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}          }
          
          if (zuletzt_klein != "kreation") { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Doris. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Doris. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');} } else { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}          }
          
          if (zuletzt_klein != "konzeption") { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Erika. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Erika. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');} } else { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}          }
          
          if (zuletzt_klein != "strategie") { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Feline. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Feline. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}} else { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}          }
   		 
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Name. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Name. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
          
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit meinen Kolleginnen: --Beratung, --Strategie, --Konzeption, --Kreation und --Technik. ').then(() => bot.say(EmpfangsBot+' Weitere Funktionen: --Kontakt, --Newsletter, --Mobil und --Über. ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich bin Alice, der Empfangs-Bot. ').then(() => bot.say(KreationsBot+' Alice ist eine offene Person, die Besucher auf ihre hilfsbereite Art in Empfang nimmt. ')).then(() => bot.say(EmpfangsBot+' Ich leite weiter zu unseren Gewerken und übernehme einfache Aufgaben, wie z.B. Ihren --Namen zu erfassen. ')).then(() => 'empfang');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Text Vorlage 1. ').then(() => 'empfang');}          

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
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("beratung" != "empfang") {
          	 
             if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es in der --Beratung? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Beratung") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'beratung');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'beratung');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'beratung');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'beratung');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Wir kennen Ihren Namen noch nicht. Wollen Sie Ihren Namen eingeben? Schreiben Sie bitte --ja oder --nein. ').then(() => 'name');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(BeratungsBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'beratung');}if ((~befehl.indexOf("--ANFRAGE")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(BeratungsBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'beratung');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'beratung');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Schreiben Sie uns eine E-Mail: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'beratung');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Tweeten Sie mit uns auf Twitter: [Text:@robogeddon,RobogeddonTwitter,] ').then(() => 'beratung');}          
          if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Andreas Sefzig ist Premium-Mitglied bei XING: [Text:Andreas Sefzig auf XING,RobogeddonXing,] ').then(() => 'beratung');}          
          if ((~befehl.indexOf("--SLACK-TEAM")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Treten Sie unserem offenen Slack-Team bei: [Text:Unser offenes Slack,RobogeddonSlackteam,] ').then(() => 'beratung');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--ROBOGEDDON")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' #Robogeddon sind eine auf Chats und Bots für das Marketing spezialisierte Agentur. ').then(() => bot.say(BeratungsBot+' Wir sind Andreas --Sefzig und eine lose Gruppe freier Kreativer - und natürlich wir, die Bots! Wir realisieren Chat-Lösungen für die interne und externe Unternehmens-Kommunikation. [Text:Kurzes Agenturprofil,RobogeddonAgentur] ')).then(() => bot.say(BeratungsBot+' Lassen Sie uns über Ihre --Strategie und unsere --Produkte sprechen! Wollen Sie --Kontakt aufnehmen? ')).then(() => 'beratung');}          
       // Produkte
          if ("beratung" != "beratung") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo! Unsere Produkte sind Marketing-Ihre Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ')).then(() => 'beratung');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Unsere Produkte sind Ihre Marketing-Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ').then(() => 'beratung');}	       
          }
          
       // -----------------
       // Persönlich
       // -----------------
          
          if ((~befehl.indexOf("--DANKS")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Auch ich, %name_frau%, danke Nadja, Bob meinen (ehemaligen) Kollegen und meinen Eltern für ihre Geduld mit mir und meinen Bots. ').then(() => 'beratung');}	       
          if ((~befehl.indexOf("--BOB")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Hey Bob, ich bin Sefzigs Bot. Freut mich, dass Du Dir meinen Chatraum anschaust! ').then(() => bot.say(SefzigBot+' Ich kann nicht anders als Dich zu bitten, hier tief reinzuschauen und rumzuprobieren... Der Stand: Alle Basis-Funktionen wie Empfang, Onboarding und Bots und Dinge wie zurück, abbrechen oder mobil laufen. Viele Inhalte stehen bereits (sind aber noch nicht geil), einige Befehle führen ins Leere. Das wird schon noch :D Viel Spass! ')).then(() => bot.say(SefzigBot+' Starte mit --Empfang oder --Menü. ')).then(() => 'beratung');}	       
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Bitte geben Sie Ihre E-Mail-Adresse ein (oder wollen Sie --abbrechen?) ').then(() => 'emailadresse');}          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Bestellen Sie unseren Newsletter! Alice? ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Diesen Chat mobil öffnen: [Qr:http://robogeddon.herokuapp.com/] ').then(() => bot.say(TechnikBot+' Leider werden Sie dort nicht automatisch wiedererkannt. Wir arbeiten an einer Lösung... ')).then(() => bot.say(BeratungsBot+' Oder öffnen Sie [Textlink:Robogeddon.de,http://robogeddon.de] in Ihrem mobilen Browser. ')).then(() => 'beratung');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' [Javascript:stil(tag)] Guten Tag. ').then(() => 'beratung');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' [Javascript:stil(nacht)] Gute Nacht. ').then(() => 'beratung');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' [Javascript:stil(robogeddon)] Die Robos kommen! ').then(() => 'beratung');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' [Javascript:stil(hacks)] Powned! ').then(() => 'beratung');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "sefzig") { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas benachrichtigt. ').then(() => bot.say(BeratungsBot+' Sprechen Sie solange mit mir, indem Sie --Beratung schreiben! ')).then(() => 'beratung');} } else { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas bereits benachrichtigt. ').then(() => bot.say(BeratungsBot+' Sprechen Sie solange mit mir, indem Sie --Beratung schreiben! ')).then(() => 'beratung');}          }
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Alice. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Alice. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "beratung") { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Barbara. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Barbara. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');} } else { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}          }
          
          if (zuletzt_klein != "technik") { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Cynthia. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Cynthia. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');} } else { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}          }
          
          if (zuletzt_klein != "kreation") { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Doris. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Doris. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');} } else { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}          }
          
          if (zuletzt_klein != "konzeption") { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Erika. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Erika. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');} } else { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}          }
          
          if (zuletzt_klein != "strategie") { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Feline. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Feline. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}} else { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}          }
   		 
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Name. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich übergebe an Name. Schreiben Sie --Beratung, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}          
       // -----------------
       // System
       // -----------------
          
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Meine Befehle: --Lösungen und --Leistungen, --Beratung, --Mitarbeit und --Slack. ').then(() => 'beratung');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich bin Barbara, Beratungs-Bot. ').then(() => bot.say(StrategieBot+' Barbara gibt sich ein wenig trocken, weiß aber über alles Bescheid. Wir sind gut miteinander abgestimmt! ')).then(() => bot.say(BeratungsBot+' Ich habe den Überblick über alle unsere --Produkte. Zudem habe ich Spaß daran, Fortschritte zu dokumentieren - wie z.B. in unserer --Slack -Serie. ')).then(() => bot.say(BeratungsBot+' Zurück zur --Beratung? ')).then(() => 'beratung');}          
       // -----------------
       // Lösungen
       // -----------------
          
          if ((~befehl.indexOf("--LÖSUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Wir entwickeln Chat-Lösungen für die interne und externe Kommunikation. Unser Highlight ist der --Chatraum, in dem Nutzer mit Ihnen und-oder Ihren Bots sprechen. ').then(() => bot.say(BeratungsBot+' Oder sollen Ihre --Bots in anderen Kanälen wie Facebook oder Telegram laufen? Zudem verfügen wir über Werkzeuge und Vorlagen für --ChatOps mit #Slack, der neuen Art der Internen Kommunikation. ')).then(() => bot.say(BeratungsBot+' Zurück zur --Beratung? ')).then(() => 'beratung');}	       
          if ((~befehl.indexOf("--CHATOP")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Mit den Prinzipien der ChatOps - z.B. auf Basis von --Slack - steuern und beschleunigen Sie die Kommunikation in Ihrem Team immens. Unsere Lösungen geben Ihrem Team den Zugriff auf Ihre Daten, erlauben das Steuern Ihrer Marketing-Technologien aus dem Chat heraus und ermöglichen Ihnen die Readktions-Planung für interne Inhalte. ').then(() => bot.say(BeratungsBot+' Die Datenverarbeitung im Chat geschieht über --Bots. Die interne Kommunikation läuft über eine Vorlage unseres --Redaktionsplans. ')).then(() => bot.say(BeratungsBot+' Sprechen Sie uns an, wenn Sie erfahren wollen, wie #ChatOps Ihre Arbeit erleichtert: [Text:Kontakt aufnehmen,RobogeddonKontakt,] ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie zu den anderen --Lösungen? ')).then(() => 'beratung');}	       
          if ((~befehl.indexOf("--BOT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Wir entwickeln Bots für alle möglichen Plattformen. B2C sind dies u.a. Facebook, Telegram, Whatsapp, SMS und natürlich das Internet. Intern leben unsere Bots u.a. in Slack und Hipchat. Ex- und -intern lassen sich übrigens verknüpfen. ').then(() => bot.say(BeratungsBot+' Sprechen Sie uns an, wenn Sie erfahren wollen, wie und wo Marketer Bots erfolgreich einsetzen: [Text:Kontakt aufnehmen,RobogeddonKontakt,] ')).then(() => bot.say(BeratungsBot+' Welches Chat-System nutzen Sie? Oder wollen Sie zu den --Lösungen zurückkehren? ')).then(() => 'beratung');}	       
          if ((~befehl.indexOf("--REDAKTION")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Möchten Sie in einer Excel vorbereitete Inhalte über Slacks API veröffentlichen? Wollen Sie Konversationen simulieren? Benötigt Ihr Team ein Onboarding in medias res? ').then(() => bot.say(BeratungsBot+' Dann brauchen Sie unseren Excel-zu-Slack-Redaktionsplan: [Text:Slack Redaktionsplan,RobogeddonSlackRedaktion] ')).then(() => bot.say(BeratungsBot+' Wir machen professionelle --ChatOps. ')).then(() => 'beratung');}	       
       // -----------------
       // Chatraum
       // -----------------
          
          if ((~befehl.indexOf("--CHATRAUM")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Chatraum ist eine für alle Bildschirme optimierte Internet-Anwendung, die eine direkte und teilautomatisierte 1-zu-1-Verbindung zu Ihren Kunden herstellt. Sie befinden sich gerade in einem Chatraum! ').then(() => bot.say(BeratungsBot+' Im Chatraum sprechen Ihre Nutzer mit einem oder mehreren Ihrer Bots - je nach Einstellung auch bzw. oder mit Ihnen: [Text:Produktbeschreibung,ChatraumDokumentation,] ')).then(() => bot.say(BeratungsBot+' Lesen Sie mehr über die --Vorteile, Anwendungs- --Beispiele, unser --Angebot an Sie und unser --Vorgehen! ')).then(() => bot.say(BeratungsBot+' Wollen Sie unsere aktuelle --Vorlage sehen? Oder zurück zu den --Lösungen. ')).then(() => 'beratung');}	       
          if ((~befehl.indexOf("--VORTEIL")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Die Gründe, warum Sie einen Chatraum haben wollen: [Text:Chatraum: Vorteile,ChatraumVorteile,] ').then(() => bot.say(BeratungsBot+' Echter Dialog mit echten Kunden - und gut gemachten Chat-Bots! ')).then(() => 'beratung');}          
          if ((~befehl.indexOf("--ANGEBOT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Wir möchten Ihnen ein Angebot machen: [Text:3000 € inkl. 2 Updates,ChatraumAngebot,] Zurück zu --Chatraum. ').then(() => 'beratung');}          
          if ((~befehl.indexOf("--VORGEHEN")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ihr Chatraum wird entlang eines robusten Prozesses eingerichtet: Alle Konversationen, Texte und Medien befinden sich in einem Ihnen zugänglichen, übersichtlichen Dokument. ').then(() => bot.say(BeratungsBot+' Wie der Projektablauf für Sie aussieht: [Text:Chatraum: Vorgehen,ChatraumVorgehen,] Zurück zu --Chatraum. ')).then(() => 'beratung');}          
          if ((~befehl.indexOf("--BEISPIEL")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Sie können Ihren Chatraum einfach in beliebigen Marketing-Kanälen verlinken. ').then(() => bot.say(KonzeptionsBot+' Schreiben Sie --Konzeption, wenn Sie mehr über die Kanäle von mir erfahren wollen... ')).then(() => bot.say(BeratungsBot+' Anwendungsbeispiele: [Text:Chatraum: Beispiele,ChatraumBeispiele,] Zurück zu --Chatraum. ')).then(() => 'beratung');}          
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Testen Sie die Vorlage (in einem neuen Fenster): [Button:Demo-Version,http://chatraum.herokuapp.com] ').then(() => 'beratung');}          
       // -----------------
       // Leistungen
       // -----------------
          
          if ((~befehl.indexOf("--LEISTUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Andreas wird Sie gern --beraten. Er würde sicherlich auch operativ an Ihrem Projekt --mitarbeiten. Nach Bedarf bringt er bestehende Lösungen kostenlos mit ein! ').then(() => bot.say(BeratungsBot+' Nutzen Sie seine Erfahrung bei der --internen --Einführung von Chats und Chat-Bots! ')).then(() => bot.say(BeratungsBot+' Kein Interesse? Dann lassen Sie zurück zur --Beratung gehen. ')).then(() => 'beratung');}	       
          if ((~befehl.indexOf("--MITARBEIT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Andreas kann für Sie ein Chat-Projekt übernehmen oder sich an der Umsetzung eines bestehenden Projekts beteiligen - verstehen Sie ihn gerne als Freelancer. ').then(() => bot.say(BeratungsBot+' Greifen Sie auf Andreas Expertise in Strategie, Konzeption und Technologie zurück! Details: [Text:Robogeddon Mitarbeit,RobogeddonMitarbeit,] ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie mit mir über unsere anderen --Leistungen sprechen? ')).then(() => 'beratung');}	       
          if ((~befehl.indexOf("--BERATE")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Andreas berät Sie, so dass Sie (und Ihr Team) in der Lage sind, Chaträume und -Bots operativ zu betreiben. Bei Bedarf kann er --mitarbeiten - ganz, wie es die Lage erfordert. ').then(() => bot.say(BeratungsBot+' Der Tagessatz beträgt 600 Euro. Jetzt zum Anfang von #Robogeddon erhalten Sie pauschal 1/3 Rabatt! Details: [Text:Robogeddon Beratung,RobogeddonBeratung,] ')).then(() => bot.say(BeratungsBot+' Oder sprechen Sie mit mir über unsere anderen --Leistungen. ')).then(() => 'beratung');}	       
          if ((~befehl.indexOf("--EINFÜHR")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Sie wollen Ihre interne Kommunikation auf Chat umstellen? Ein guter Zug! Dann sollten Sie uns ansprechen: Wir haben Erfahrung mit ChatOps und den kulturellen Stolpersteinen der Einführung von Software/Prozessen in Teams. Dafür haben wir unsere --Lösungen zur Hand, mit denen Sie Ihre Mitarbeiter elegant ins Thema holen! ').then(() => bot.say(BeratungsBot+' Andreas bringt diverse Materialien mit: [Text:Chatops: Einführung,RobogeddonChatopsEinfuhrung,] ')).then(() => bot.say(BeratungsBot+' Oder lassen Sie mich Ihnen unsere anderen --Leistungen zeigen. ')).then(() => 'beratung');}	       
       // -----------------
       // Slack
       // -----------------
          
          if ((~befehl.indexOf("--SLACK")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere Inhalte zu Slack ans Herz legen: Unser --Blogpost zeigt die Einfachheit der Anwendung. Ein --Artikel zeigt die Bedeutung für Marketer. Öffnen Sie unsere --Linklisten oder treten Sie unserem offenen --Team bei. ').then(() => bot.say(BeratungsBot+' Oder zurück zur --Beratung? ')).then(() => 'beratung');}          
          if ((~befehl.indexOf("--ARTIKEL")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Andreas hat einen fundierten Artikel zu --Slack geschrieben: Was müssen Marketer über Slack wissen? [Text:Artikel: Slack,RobogeddonSlackArtikel] ').then(() => bot.say(BeratungsBot+' Mehr zu --Slack oder --Beratung? ')).then(() => 'beratung');}          
          if ((~befehl.indexOf("--BLOGPOST")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Lesen Sie auch unseren Blogpost zu --Slack: Was ist Slack und wie nutzt man es? [Text:Blogpost: Slack,SefzignetBlogSlack] ').then(() => bot.say(BeratungsBot+' Mehr zu --Slack oder --Beratung? ')).then(() => 'beratung');}          
          if ((~befehl.indexOf("--LINKLISTEN")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Wir haben uns viele wichtige Artikel zu --Slack gemerkt: [Linkliste:Linkliste Slack-Artikel,Slack:Artikel] ').then(() => bot.say(BeratungsBot+' Mehr zu --Slack oder --Beratung? ')).then(() => 'beratung');}          
          if ((~befehl.indexOf("--TEAM")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Treten Sie unserem offenen --Slack Team  bei, um sich mit uns auszutauschen: [Button:Anmeldung,http://sefzig.net/link/SlackAnmeldung/] ').then(() => bot.say(BeratungsBot+' Mehr zu --Slack oder --Beratung? ')).then(() => 'beratung');}          
       // -----------------
       // Kalkulation
       // -----------------
          
          if ((~befehl.indexOf("--KALKUL")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Diese Funktion wird gerade entwickelt - bitte kommen Sie wieder! Zurück zur --Beratung. ').then(() => 'beratung');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Text Vorlage 1. ').then(() => 'beratung');}          

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
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("technik" != "empfang") {
          	 
             if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es in der --Technik? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Technik") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'technik');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'technik');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'technik');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'technik');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Wir kennen Ihren Namen noch nicht. Wollen Sie Ihren Namen eingeben? Schreiben Sie bitte --ja oder --nein. ').then(() => 'name');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(TechnikBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'technik');}if ((~befehl.indexOf("--ANFRAGE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(TechnikBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'technik');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'technik');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Schreiben Sie uns eine E-Mail: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'technik');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Tweeten Sie mit uns auf Twitter: [Text:@robogeddon,RobogeddonTwitter,] ').then(() => 'technik');}          
          if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Andreas Sefzig ist Premium-Mitglied bei XING: [Text:Andreas Sefzig auf XING,RobogeddonXing,] ').then(() => 'technik');}          
          if ((~befehl.indexOf("--SLACK-TEAM")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Treten Sie unserem offenen Slack-Team bei: [Text:Unser offenes Slack,RobogeddonSlackteam,] ').then(() => 'technik');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--ROBOGEDDON")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' #Robogeddon sind eine auf Chats und Bots für das Marketing spezialisierte Agentur. ').then(() => bot.say(TechnikBot+' Wir sind Andreas --Sefzig und eine lose Gruppe freier Kreativer - und natürlich wir, die Bots! Wir realisieren Chat-Lösungen für die interne und externe Unternehmens-Kommunikation. [Text:Kurzes Agenturprofil,RobogeddonAgentur] ')).then(() => bot.say(TechnikBot+' Lassen Sie uns über Ihre --Strategie und unsere --Produkte sprechen! Wollen Sie --Kontakt aufnehmen? ')).then(() => 'technik');}          
       // Produkte
          if ("technik" != "beratung") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo! Unsere Produkte sind Marketing-Ihre Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ')).then(() => 'beratung');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Unsere Produkte sind Ihre Marketing-Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ').then(() => 'beratung');}	       
          }
          
       // -----------------
       // Persönlich
       // -----------------
          
          if ((~befehl.indexOf("--DANKS")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Auch ich, %name_frau%, danke Nadja, Bob meinen (ehemaligen) Kollegen und meinen Eltern für ihre Geduld mit mir und meinen Bots. ').then(() => 'technik');}	       
          if ((~befehl.indexOf("--BOB")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Hey Bob, ich bin Sefzigs Bot. Freut mich, dass Du Dir meinen Chatraum anschaust! ').then(() => bot.say(SefzigBot+' Ich kann nicht anders als Dich zu bitten, hier tief reinzuschauen und rumzuprobieren... Der Stand: Alle Basis-Funktionen wie Empfang, Onboarding und Bots und Dinge wie zurück, abbrechen oder mobil laufen. Viele Inhalte stehen bereits (sind aber noch nicht geil), einige Befehle führen ins Leere. Das wird schon noch :D Viel Spass! ')).then(() => bot.say(SefzigBot+' Starte mit --Empfang oder --Menü. ')).then(() => 'technik');}	       
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Bitte geben Sie Ihre E-Mail-Adresse ein (oder wollen Sie --abbrechen?) ').then(() => 'emailadresse');}          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Bestellen Sie unseren Newsletter! Alice? ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Diesen Chat mobil öffnen: [Qr:http://robogeddon.herokuapp.com/] ').then(() => bot.say(TechnikBot+' Leider werden Sie dort nicht automatisch wiedererkannt. Wir arbeiten an einer Lösung... ')).then(() => bot.say(TechnikBot+' Oder öffnen Sie [Textlink:Robogeddon.de,http://robogeddon.de] in Ihrem mobilen Browser. ')).then(() => 'technik');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(tag)] Guten Tag. ').then(() => 'technik');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(nacht)] Gute Nacht. ').then(() => 'technik');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(robogeddon)] Die Robos kommen! ').then(() => 'technik');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(hacks)] Powned! ').then(() => 'technik');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "sefzig") { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas benachrichtigt. ').then(() => bot.say(TechnikBot+' Sprechen Sie solange mit mir, indem Sie --Technik schreiben! ')).then(() => 'technik');} } else { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas bereits benachrichtigt. ').then(() => bot.say(TechnikBot+' Sprechen Sie solange mit mir, indem Sie --Technik schreiben! ')).then(() => 'technik');}          }
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Alice. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Alice. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "beratung") { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Barbara. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Barbara. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');} } else { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}          }
          
          if (zuletzt_klein != "technik") { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Cynthia. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Cynthia. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');} } else { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}          }
          
          if (zuletzt_klein != "kreation") { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Doris. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Doris. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');} } else { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}          }
          
          if (zuletzt_klein != "konzeption") { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Erika. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Erika. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');} } else { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}          }
          
          if (zuletzt_klein != "strategie") { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Feline. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Feline. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}} else { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}          }
   		 
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Name. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich übergebe an Name. Schreiben Sie --Technik, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}          
       // -----------------
       // System
       // -----------------
          
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin gerade sehr beschäftigt - daher kann ich Ihnen noch nicht allzuviel zeigen. ').then(() => bot.say(TechnikBot+' Aber Sie könnten mir kurz beim --Testen helfen! ')).then(() => 'technik');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin Cynthia. Ich bin die --Technik. ').then(() => bot.say(KonzeptionsBot+' Cynthia ist ein wenig schräg drauf und meist gestresst - aber sie ist eine hervorragende Entwicklerin! Für sie gibt es den Hacker-Modus: --StilHx. ')).then(() => bot.say(TechnikBot+' Ich programmiere und --teste ständig neue Techniken und Formate, mit denen --Kreation und --Konzeption arbeiten. Ganz schön viel zu tun hier! ')).then(() => 'technik');}          
       // -----------------
       // Tests
       // -----------------
          
       // Gruppen
          if ((~befehl.indexOf("--TESTS")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Zu testende Funktionen: --Inhalte, --Elemente, --Stile, --Menus und --Javascript. Läuft das alles? ').then(() => 'technik');}          if ((~befehl.indexOf("--TEST")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich habe gerade unsere Funktionen überarbeitet: --Inhalte, --Elemente, --Stile, --Menus und --Javascript. Mögen Sie einmal schauen, ob alles läuft? ').then(() => 'technik');}          if ((~befehl.indexOf("--INHALTE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Inhalte testen: --Text, --Bild, --Qr und --Youtube. ').then(() => 'technik');}          if ((~befehl.indexOf("--ELEMENT")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Elemente testen: --Link, --Textlink, --Linkliste, --Button, --Action, --Email und --Telnr. ').then(() => 'technik');}          if ((~befehl.indexOf("--STILE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Stile testen: --StilTag, --StilNacht, --StilRobo und --StilHx. ').then(() => 'technik');}          if ((~befehl.indexOf("--MENUS")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Menus testen: --Menu, --MenuAn und --MenuAus. ').then(() => 'technik');}          if ((~befehl.indexOf("--JAVASCRIPT")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Javascript testen: --Alert, --Konsole und --Cookie. ').then(() => 'technik');}          
       // Elemente (Reihenfolge!!!)
          if ((~befehl.indexOf("--LINKLISTE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Linkliste:Eine Demo-Linkliste,Rtm:Strategie:Artikel] Dieser Button öffnet eine Linkliste in einer Lightbox. ').then(() => bot.say(TechnikBot+' Weitere Elemente: --Link, --Textlink, --Button, --Action, --Email und --Telnr. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--LINK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Link:Ein Demo-Link,TestLink] Dieser Button öffnet einen (vorab gespeicherten) Link in einer Lightbox. ').then(() => bot.say(TechnikBot+' Weitere Elemente: --Textlink, --Linkliste, --Button, --Action, --Email und --Telnr. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--TEXTLINK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Textlink:Ein Demo-Textlink,TestLink] Dieser Textlink öffnet einen (vorab gespeicherten) Link in einer Lightbox. ').then(() => bot.say(TechnikBot+' Weitere Elemente: --Link, --Linkliste, --Button, --Action, --Email und --Telnr. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--BUTTON")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Button:Ein Demo-Button,http://example.com] Dieser Button öffnet einen externen Link im neuen Fenster. ').then(() => bot.say(TechnikBot+' Weitere Elemente: --Link, --Textlink, --Linkliste, --Action, --Email und --Telnr. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--ACTION")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' %[Eine Demo-Action](http://sefzig.net/link/TestLink/) Dieser Button startet eine Smooch-Action. ').then(() => bot.say(TechnikBot+' Weitere Elemente: --Link, --Textlink, --Linkliste, --Button, --Email und --Telnr. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--EMAIL")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Email:andreas.sefzig@robogeddon.de] Dieser Button öffnet eine neue E-Mail an eine vorgegebene Adresse. ').then(() => bot.say(TechnikBot+' Weitere Elemente: --Link, --Textlink, --Linkliste, --Button, --Action und --Telnr. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--TELNR")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Telefon:+49 151 15920082] Dieser Button startet einen Anruf an eine vorgegebene Telefonnummer. ').then(() => bot.say(TechnikBot+' Weitere Elemente: --Link, --Textlink, --Linkliste, --Button, --Action und --Email. Oder andere --Tests? ')).then(() => 'technik');}          
       // Inhalte
          if ((~befehl.indexOf("--TEXT")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Text:Ein Demo-Text,RobogeddonDemotext] Dieser Button öffnet einen Text in einer Lightbox. ').then(() => bot.say(TechnikBot+' Weitere --Inhalte: --Bild, --Qr und --Youtube. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--BILD")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Bild:http://sefzig.net/text/seiten/SefzigBot/dateien/Mesaging_vs_Social.png] Dieses Bild kann in einer Lightbox vergrößert werden. ').then(() => bot.say(TechnikBot+' Weitere --Inhalte: --Text, --Qr und --Youtube. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--QR")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Qr:http://sefzigbot.herokuapp.com/] Dieser QR-Code öffnet eine URL via QR-Reader. ').then(() => bot.say(TechnikBot+' Weitere --Inhalte: --Text, --Bild und --Youtube. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--YOUTUBE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Youtube:C0DPdy98e4c] Dieses Test-Video wird im Youtube-Player geladen. ').then(() => bot.say(TechnikBot+' Weitere --Inhalte: --Text, --Bild und --Qr. Oder andere --Tests? ')).then(() => 'technik');}          
       // Stile
          if ((~befehl.indexOf("--STILTAG")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(tag)] Stil geladen: Tag. ').then(() => bot.say(TechnikBot+' Weitere Stile: --StilNacht, --StilRobo und --StilHx. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--STILNACHT")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(nacht)] Stil geladen: Nacht. ').then(() => bot.say(TechnikBot+' Weitere Stile: --StilTag, --StilRobo und --StilHx. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--STILROBO")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(robogeddon)] Stil geladen: Robos. ').then(() => bot.say(TechnikBot+' Weitere Stile: --StilTag, --StilNacht und --StilHx. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--STILHX")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:stil(hacks)] Stil geladen: Hx. ').then(() => bot.say(TechnikBot+' Weitere Stile: --StilTag, --StilNacht und --StilRobo. Oder andere --Tests? ')).then(() => 'technik');}          
       // Menu (Reihenfolge!!!)
          if ((~befehl.indexOf("--MENUAN")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu(an)] Menu angeschaltet. ').then(() => bot.say(TechnikBot+' Weitere Menus: --Menu und --MenuAus. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--MENUAUS")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu(aus)] Menu ausgeschaltet. ').then(() => bot.say(TechnikBot+' Weitere Menus: --Menu und --MenuAn. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--MENU")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:menu()] Menu umgeschaltet. ').then(() => bot.say(TechnikBot+' Weitere Menus: --MenuAn und --MenuAus. Oder andere --Tests? ')).then(() => 'technik');}          
       // Javascript
          if ((~befehl.indexOf("--ALERT")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:alert(123)] Javascript-Alert ausgegeben: 123. ').then(() => bot.say(TechnikBot+' Weitere Javascripts: --Konsole und --Cookie. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--KONSOLE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:konsole(123)] In Konsole geschrieben: 123. ').then(() => bot.say(TechnikBot+' Weitere Javascripts: --Alert und --Cookie. Oder andere --Tests? ')).then(() => 'technik');}          if ((~befehl.indexOf("--COOKIE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' [Javascript:cookies(test,123)] Cookie gesetzt: test, 123. ').then(() => bot.say(TechnikBot+' Weitere Javascripts: --Alert und --Konsole. Oder andere --Tests? ')).then(() => 'technik');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Text Vorlage 1. ').then(() => 'technik');}          

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
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("kreation" != "empfang") {
          	 
             if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es in der --Kreation? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Kreation") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'kreation');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'kreation');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'kreation');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'kreation');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Wir kennen Ihren Namen noch nicht. Wollen Sie Ihren Namen eingeben? Schreiben Sie bitte --ja oder --nein. ').then(() => 'name');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(KreationsBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'kreation');}if ((~befehl.indexOf("--ANFRAGE")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(KreationsBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'kreation');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Schreiben Sie uns eine E-Mail: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Tweeten Sie mit uns auf Twitter: [Text:@robogeddon,RobogeddonTwitter,] ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Andreas Sefzig ist Premium-Mitglied bei XING: [Text:Andreas Sefzig auf XING,RobogeddonXing,] ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--SLACK-TEAM")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Treten Sie unserem offenen Slack-Team bei: [Text:Unser offenes Slack,RobogeddonSlackteam,] ').then(() => 'kreation');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--ROBOGEDDON")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' #Robogeddon sind eine auf Chats und Bots für das Marketing spezialisierte Agentur. ').then(() => bot.say(KreationsBot+' Wir sind Andreas --Sefzig und eine lose Gruppe freier Kreativer - und natürlich wir, die Bots! Wir realisieren Chat-Lösungen für die interne und externe Unternehmens-Kommunikation. [Text:Kurzes Agenturprofil,RobogeddonAgentur] ')).then(() => bot.say(KreationsBot+' Lassen Sie uns über Ihre --Strategie und unsere --Produkte sprechen! Wollen Sie --Kontakt aufnehmen? ')).then(() => 'kreation');}          
       // Produkte
          if ("kreation" != "beratung") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo! Unsere Produkte sind Marketing-Ihre Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ')).then(() => 'beratung');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Unsere Produkte sind Ihre Marketing-Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ').then(() => 'beratung');}	       
          }
          
       // -----------------
       // Persönlich
       // -----------------
          
          if ((~befehl.indexOf("--DANKS")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Auch ich, %name_frau%, danke Nadja, Bob meinen (ehemaligen) Kollegen und meinen Eltern für ihre Geduld mit mir und meinen Bots. ').then(() => 'kreation');}	       
          if ((~befehl.indexOf("--BOB")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Hey Bob, ich bin Sefzigs Bot. Freut mich, dass Du Dir meinen Chatraum anschaust! ').then(() => bot.say(SefzigBot+' Ich kann nicht anders als Dich zu bitten, hier tief reinzuschauen und rumzuprobieren... Der Stand: Alle Basis-Funktionen wie Empfang, Onboarding und Bots und Dinge wie zurück, abbrechen oder mobil laufen. Viele Inhalte stehen bereits (sind aber noch nicht geil), einige Befehle führen ins Leere. Das wird schon noch :D Viel Spass! ')).then(() => bot.say(SefzigBot+' Starte mit --Empfang oder --Menü. ')).then(() => 'kreation');}	       
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Bitte geben Sie Ihre E-Mail-Adresse ein (oder wollen Sie --abbrechen?) ').then(() => 'emailadresse');}          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Bestellen Sie unseren Newsletter! Alice? ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Diesen Chat mobil öffnen: [Qr:http://robogeddon.herokuapp.com/] ').then(() => bot.say(TechnikBot+' Leider werden Sie dort nicht automatisch wiedererkannt. Wir arbeiten an einer Lösung... ')).then(() => bot.say(KreationsBot+' Oder öffnen Sie [Textlink:Robogeddon.de,http://robogeddon.de] in Ihrem mobilen Browser. ')).then(() => 'kreation');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' [Javascript:stil(tag)] Guten Tag. ').then(() => 'kreation');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' [Javascript:stil(nacht)] Gute Nacht. ').then(() => 'kreation');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' [Javascript:stil(robogeddon)] Die Robos kommen! ').then(() => 'kreation');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' [Javascript:stil(hacks)] Powned! ').then(() => 'kreation');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "sefzig") { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas benachrichtigt. ').then(() => bot.say(KreationsBot+' Sprechen Sie solange mit mir, indem Sie --Kreation schreiben! ')).then(() => 'kreation');} } else { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas bereits benachrichtigt. ').then(() => bot.say(KreationsBot+' Sprechen Sie solange mit mir, indem Sie --Kreation schreiben! ')).then(() => 'kreation');}          }
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Alice. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Alice. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "beratung") { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Barbara. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Barbara. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');} } else { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}          }
          
          if (zuletzt_klein != "technik") { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Cynthia. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Cynthia. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');} } else { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}          }
          
          if (zuletzt_klein != "kreation") { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Doris. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Doris. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');} } else { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}          }
          
          if (zuletzt_klein != "konzeption") { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Erika. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Erika. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');} } else { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}          }
          
          if (zuletzt_klein != "strategie") { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Feline. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Feline. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}} else { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}          }
   		 
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Name. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich übergebe an Name. Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}          
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Kreation Befehle: --Uber, --Dialoge, --Persönlichkeit, --Geschichten, --Leben, --Inhalte, --Mehrwerte. ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Hier in der Kreation hauchen wir den Bots --Leben ein, indem wir die --Dialoge menschlich und direkt formulieren. ').then(() => bot.say(TechnikBot+' Doris meint immer, allem --Geschichte und --Persönlichkeit geben zu müssen. Dabei geht es doch nur um --Inhalte und deren --Formate! ')).then(() => bot.say(KreationsBot+' Letztendlich geht es aber nur um eines: --Mehrwerte für die Nutzer! ')).then(() => 'kreation');}          
       // -----------------
       // Leben
       // -----------------
          
          if ((~befehl.indexOf("--LEBEN")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Das Leben der Bots ist ein einfaches Leben: Sie verarbeiten Informationen. Erst mit einer eigenen --Persönlichkeit und durch die Art, wie sie --Dialoge führen, werden sie anfassbar. ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--DIALOG")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Dialoge mit Bots können durch Wiederholungen dröge werden. Wir bringen unseren Bots verschiedene Ausdrucksweisen entlang ihrer --Persönlichkeit bei, um Konversationen trotz möglicher Wiederholungen lebendig zu gestalten. Erst im Dialog werden --Mehrwerte, --Inhalte und --Formate eins. ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--PERSÖNLICHKEIT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Mit Bots chattet man wie mit Menschen. Um --Dialoge abwechslungsreich zu gestalten, erhalten unsere Bots eine --Persönlichkeit - und im --Inhalt eine --Geschichte, die --Formate und --Mehrwerte bündelt. ').then(() => 'kreation');}          
       // -----------------
       // Inhalte
       // -----------------
          
          if ((~befehl.indexOf("--INHALT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Die Inhalte eines Bots setzen sich aus zwei Bestandteilen zusammen: Zum einen ein konkreter --Mehrwert, zum anderen zu --Geschichten verwobene --Formate, die den Bot unterhaltsam und leicht zu konsumieren machen. ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--MEHRWERT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ein Bot mag eine interessante --Geschichte erzählen - wirklich relevant für den Nutzer ist jedoch der konkrete Mehrwert. Wir achten darauf, dass unsere Bots den Nutzern praktische Hilfestellungen, wertvolle Inhalte oder andere echte Vorteile verschaffen. Mehrwerte rechtfertigen --Inhalte und --Leben und benötigen das richtige --Format. ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--GESCHICHTE")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Menschen chatten nicht nur, um Informationen weiterzugeben. Unsere Bots haben eine Geschichte, mit der die --Mehrwerte besser zu erfahren sind. Sie hauchen den Bots und deren --Inhalten das --Leben ein und überführen ihre --Formate in einen Dialog. ').then(() => 'kreation');}          
       // -----------------
       // Formate
       // -----------------
          
          if ((~befehl.indexOf("--FORMAT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Wir entwickeln ständig neue Inhalts-Formate, mit denen unsere Bots kommunizieren können: [Text:Formate und Shortcodes,RobogeddonShortcodes,] ').then(() => bot.say(KreationsBot+' Unsere --Kreation beinhaltet --Texte, --Bilder, --Videos und --mehr. ')).then(() => bot.say(KreationsBot+' Unser System ist erweiterbar, so dass wir ständig weitere interaktive --Elemente hinzufügen können. Mit --Widgets können wir sogar externe (Ihre?) Web-Inhalte und -Funktionen per Iframe in den Chat einbinden. ')).then(() => 'kreation');}          
          if ((~befehl.indexOf("--BILD")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Hier ein Bild: [Bild:http://sefzig.net/text/seiten/SefzigBot/dateien/Mesaging_vs_Social.png] ').then(() => bot.say(KreationsBot+' Zurück zu --Formate? ')).then(() => 'kreation');}          
          if ((~befehl.indexOf("--VIDEO")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Hier ein Youtube-Video: [Youtube:u07XONlDwX8] ').then(() => bot.say(KreationsBot+' Zurück zu --Formate? ')).then(() => 'kreation');}          
          if ((~befehl.indexOf("--TEXT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Hier ein Text: [Text:Text: Chatraum Formate,RobogeddonShortcodes,] ').then(() => bot.say(KreationsBot+' Zurück zu --Formate? ')).then(() => 'kreation');}          
          if ((~befehl.indexOf("--LINK")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Hier ein Link: [Link:Artikel öffnen,ThinMedia] Und eine Linkliste: [Linkliste:Strategie-Artikel,Rtm:Strategie:Artikel] ').then(() => bot.say(KreationsBot+' Zurück zu --Formate? ')).then(() => 'kreation');}          
          if ((~befehl.indexOf("--WIDGET")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Mittels Iframe binden wir externe Web-Elemente ein: [Iframe:http://sefzig.net/text/RobogeddonExtern/#einbindung] ').then(() => bot.say(KreationsBot+' Zurück zu --Formate? ')).then(() => 'kreation');}          
          if ((~befehl.indexOf("--ELEMENT")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Mit Javascript kann ich Ihren Browser direkt ansprechen (--zeigen). So können wir reichhaltige Daten und Funktionen aus anderen Quellen einbinden. ').then(() => bot.say(KreationsBot+' Zum Beispiel einen Text: [Text:RobogeddonDoku] Oder einen externen Link: [Link:Thin Media,ThinMedia] Oder eine ganze Linkliste: [Linkliste:Links zu Strategie-Artikeln,Rtm:Strategie:Artikel] ')).then(() => bot.say(KreationsBot+' Zurück zu --Formate? ')).then(() => 'kreation');}          
          if ((~befehl.indexOf("--ZEIG")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Gesehen? [Javascript:alert(Der Bot hat Ihren Browser mittels Javascript direkt angesprochen.)] ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--MEHR")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Cynthia testet gerade alle Formate. Wollen Sie Ihr --helfen? ').then(() => 'kreation');}          
          if ((~befehl.indexOf("--HELFE")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Das ist nett von Ihnen! Schreiben Sie --Kreation, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo! Ich habe gerade unsere Funktionen überarbeitet: --Inhalte, --Elemente, --Stile, --Menus und --Javascript. Mögen Sie einmal schauen, ob alles läuft? ')).then(() => 'technik');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Text Vorlage 1. ').then(() => 'kreation');}          

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
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("konzeption" != "empfang") {
          	 
             if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es in der --Konzeption? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Konzeption") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'konzeption');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'konzeption');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'konzeption');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'konzeption');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Wir kennen Ihren Namen noch nicht. Wollen Sie Ihren Namen eingeben? Schreiben Sie bitte --ja oder --nein. ').then(() => 'name');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(KonzeptionsBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'konzeption');}if ((~befehl.indexOf("--ANFRAGE")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(KonzeptionsBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'konzeption');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Schreiben Sie uns eine E-Mail: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'konzeption');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Tweeten Sie mit uns auf Twitter: [Text:@robogeddon,RobogeddonTwitter,] ').then(() => 'konzeption');}          
          if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Andreas Sefzig ist Premium-Mitglied bei XING: [Text:Andreas Sefzig auf XING,RobogeddonXing,] ').then(() => 'konzeption');}          
          if ((~befehl.indexOf("--SLACK-TEAM")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Treten Sie unserem offenen Slack-Team bei: [Text:Unser offenes Slack,RobogeddonSlackteam,] ').then(() => 'konzeption');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--ROBOGEDDON")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' #Robogeddon sind eine auf Chats und Bots für das Marketing spezialisierte Agentur. ').then(() => bot.say(KonzeptionsBot+' Wir sind Andreas --Sefzig und eine lose Gruppe freier Kreativer - und natürlich wir, die Bots! Wir realisieren Chat-Lösungen für die interne und externe Unternehmens-Kommunikation. [Text:Kurzes Agenturprofil,RobogeddonAgentur] ')).then(() => bot.say(KonzeptionsBot+' Lassen Sie uns über Ihre --Strategie und unsere --Produkte sprechen! Wollen Sie --Kontakt aufnehmen? ')).then(() => 'konzeption');}          
       // Produkte
          if ("konzeption" != "beratung") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo! Unsere Produkte sind Marketing-Ihre Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ')).then(() => 'beratung');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Unsere Produkte sind Ihre Marketing-Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ').then(() => 'beratung');}	       
          }
          
       // -----------------
       // Persönlich
       // -----------------
          
          if ((~befehl.indexOf("--DANKS")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Auch ich, %name_frau%, danke Nadja, Bob meinen (ehemaligen) Kollegen und meinen Eltern für ihre Geduld mit mir und meinen Bots. ').then(() => 'konzeption');}	       
          if ((~befehl.indexOf("--BOB")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Hey Bob, ich bin Sefzigs Bot. Freut mich, dass Du Dir meinen Chatraum anschaust! ').then(() => bot.say(SefzigBot+' Ich kann nicht anders als Dich zu bitten, hier tief reinzuschauen und rumzuprobieren... Der Stand: Alle Basis-Funktionen wie Empfang, Onboarding und Bots und Dinge wie zurück, abbrechen oder mobil laufen. Viele Inhalte stehen bereits (sind aber noch nicht geil), einige Befehle führen ins Leere. Das wird schon noch :D Viel Spass! ')).then(() => bot.say(SefzigBot+' Starte mit --Empfang oder --Menü. ')).then(() => 'konzeption');}	       
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Bitte geben Sie Ihre E-Mail-Adresse ein (oder wollen Sie --abbrechen?) ').then(() => 'emailadresse');}          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Bestellen Sie unseren Newsletter! Alice? ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Diesen Chat mobil öffnen: [Qr:http://robogeddon.herokuapp.com/] ').then(() => bot.say(TechnikBot+' Leider werden Sie dort nicht automatisch wiedererkannt. Wir arbeiten an einer Lösung... ')).then(() => bot.say(KonzeptionsBot+' Oder öffnen Sie [Textlink:Robogeddon.de,http://robogeddon.de] in Ihrem mobilen Browser. ')).then(() => 'konzeption');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:stil(tag)] Guten Tag. ').then(() => 'konzeption');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:stil(nacht)] Gute Nacht. ').then(() => 'konzeption');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:stil(robogeddon)] Die Robos kommen! ').then(() => 'konzeption');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' [Javascript:stil(hacks)] Powned! ').then(() => 'konzeption');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "sefzig") { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas benachrichtigt. ').then(() => bot.say(KonzeptionsBot+' Sprechen Sie solange mit mir, indem Sie --Konzeption schreiben! ')).then(() => 'konzeption');} } else { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas bereits benachrichtigt. ').then(() => bot.say(KonzeptionsBot+' Sprechen Sie solange mit mir, indem Sie --Konzeption schreiben! ')).then(() => 'konzeption');}          }
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Alice. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Alice. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "beratung") { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Barbara. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Barbara. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');} } else { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}          }
          
          if (zuletzt_klein != "technik") { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Cynthia. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Cynthia. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');} } else { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}          }
          
          if (zuletzt_klein != "kreation") { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Doris. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Doris. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');} } else { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}          }
          
          if (zuletzt_klein != "konzeption") { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Erika. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Erika. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');} } else { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}          }
          
          if (zuletzt_klein != "strategie") { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Feline. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Feline. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}} else { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}          }
   		 
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Name. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich übergebe an Name. Schreiben Sie --Konzeption, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Meine Themen: --Plattformen und --Kanäle. ').then(() => bot.say(KonzeptionsBot+' --Plattformen: --Slack, --Hipchat, --Smooch, --Facebook und --Browser. ')).then(() => bot.say(KonzeptionsBot+' --Kanäle: --CRM, --Webseite, --Social, --Kontakte, --Verpackung, --Orte und --Tipps. ')).then(() => 'konzeption');}
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ich bin Erika, Konzeptions-Bot. ').then(() => bot.say(BeratungsBot+' 90% der Fehler werden in den ersten 10% des Projekts gemacht. Nicht bei uns - dank Erika! ')).then(() => bot.say(KonzeptionsBot+' Ich kenne alle --Kanäle und --Plattformen. ')).then(() => 'konzeption');}          
       // -----------------
       // Kanäle
       // -----------------
          
          if ((~befehl.indexOf("--KANAL")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ein Chatraum/Bot lässt sich einfach in Ihre bestehenden Marketing-Kanäle einbinden - letztlich ist er nur die URL einer für alle Geräte optimierten Webseite. ').then(() => bot.say(KonzeptionsBot+' Klar, digitale Kanäle wie --CRM, --Social Media und Ihre --Webseite sind gut zur Verlinkung geeignet. Aber denken Sie auch an Ihre Offline-Kanäle: die --Verpackung Ihrer Produkte, die Besucher Ihres --Ladens und Ihre --Bekannten! ')).then(() => bot.say(KonzeptionsBot+' Ich habe auch ein paar --Tipps für Sie. Oder wollen Sie zurück zur --Konzeption? ')).then(() => 'konzeption');}if ((~befehl.indexOf("--KANÄLE")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ein Chatraum/Bot lässt sich einfach in Ihre bestehenden Marketing-Kanäle einbinden - letztlich ist er nur die URL einer für alle Geräte optimierten Webseite. ').then(() => bot.say(KonzeptionsBot+' Klar, digitale Kanäle wie --CRM, --Social Media und Ihre --Webseite sind gut zur Verlinkung geeignet. Aber denken Sie auch an Ihre Offline-Kanäle: die --Verpackung Ihrer Produkte, die Besucher Ihres --Ladens und Ihre --Bekannten! ')).then(() => bot.say(KonzeptionsBot+' Ich habe auch ein paar --Tipps für Sie. Oder wollen Sie zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--CRM")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ein Link im Newsletter öffnet den Chatraum im Browser. ').then(() => bot.say(KonzeptionsBot+' Eine kurze Domain (evtl. mit QR Code) auf Drucksachen öffnet den Chatraum im Smartphone-Browser. ')).then(() => bot.say(KonzeptionsBot+' Weitere --Kanäle oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--WEBSEITE")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Webseiten verlinken den Chatraum in einem neuen Fenster - oder integrieren ihn (klein) mit einem Widget oder (groß) mit einer Lightbox. ').then(() => bot.say(KonzeptionsBot+' Chat-Bots eigenen sich bestens als alternative Navigation - vor allem in inhalts-reichen Webseiten! ')).then(() => bot.say(KonzeptionsBot+' Weitere --Kanäle oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--SOCIAL")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ein Social Media-Beitrag verlinkt einen Chatraum. Der Beitrag selbst zeigt auf, welche Inhalte und Funktionen man von diesem Chatraum erwarten kann. ').then(() => bot.say(KonzeptionsBot+' Wenn Sie möchten, kann sich Ihr Chatraum auch im Facebook Messenger leben oder auf Twitter angezwitschert werden! ')).then(() => bot.say(KonzeptionsBot+' Weitere --Kanäle oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--BEKANNTE")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Ein Link in Ihrer E-Mail-Signatur ergänzt die Kontaktaufnahme um hilfreiche Funktionen und Inhalte. ').then(() => bot.say(KonzeptionsBot+' Oder gefällt Ihnen der Gedanke einer sprechenden Visitenkarte (mit Kurz-Domain und-oder QR Code)? ')).then(() => bot.say(KonzeptionsBot+' Weitere --Kanäle oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--VERPACK")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Kommen Fragen bei Ihrem Produkt auf? Wollen Nutzer mehr darüber wissen? Gibt es weitere dazu passende Produkte? ').then(() => bot.say(KonzeptionsBot+' Dann binden Sie einen Produkt-spezifischen Chatraum mittels kurzer Domain (und evtl. einem QR Code) auf oder in der Verpackung ein! ')).then(() => bot.say(KonzeptionsBot+' Weitere --Kanäle oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--ORT")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Plakate, Aufsteller und Aufkleber informieren vor Ort über einen Chatraum und verlinken ihn mit einer kurzen Domain (evtl. mit QR Code). ').then(() => bot.say(KonzeptionsBot+' Viel los im Laden? Bots können Ihr Verkaufs-Personal entlasten. Ihre Besucher haben so Ihre Inhalte gar zuhause in der Hand! ')).then(() => bot.say(KonzeptionsBot+' Weitere --Kanäle oder zurück zur --Konzeption? ')).then(() => 'konzeption');}if ((~befehl.indexOf("--LADEN")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Plakate, Aufsteller und Aufkleber informieren vor Ort über einen Chatraum und verlinken ihn mit einer kurzen Domain (evtl. mit QR Code). ').then(() => bot.say(KonzeptionsBot+' Viel los im Laden? Bots können Ihr Verkaufs-Personal entlasten. Ihre Besucher haben so Ihre Inhalte gar zuhause in der Hand! ')).then(() => bot.say(KonzeptionsBot+' Weitere --Kanäle oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--TIPP")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Erwartungs-Management: Wie und wo auch immer sie Ihren Chatraum einbinden - die Einbindung selbst sollte kommunizieren, was man vom Öffnen/Nutzen des Chatraums hat! ').then(() => bot.say(KonzeptionsBot+' Weiterleitung: Mit einem URL-Parameter können Befehle automatisch nach dem Laden ausgeführt werden, um Nutzer zu einem bestimmten Inhalt zu leiten. ')).then(() => bot.say(KonzeptionsBot+' Weitere --Kanäle oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
       // -----------------
       // Plattformen
       // -----------------
          
          if ((~befehl.indexOf("--PLATTFORM")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Text Plattformen: --Slack, --Hipchat, --Smooch, --Facebook Messenger, --Sms, --Browser. ').then(() => bot.say(KonzeptionsBot+' Zurück zur --Konzeption. ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--SLACK")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Slack ist eine fantastische neue Kommunikationsplattform für Teams! ').then(() => bot.say(KonzeptionsBot+' Wenn Sie Slack noch nicht kennen, erwägen Sie, es für Ihre Interne Kommunikation zu nutzen. Lassen Sie sich dazu von --Barbara unseren --Slack-Artikel für Marketer, den --Slack-Blogpost für Anwender, unsere --Slack-Links und unser --Slack-Team zeigen. ')).then(() => bot.say(KonzeptionsBot+' Slack eignet sich perfekt für eine --interne --Strategie mit --ChatOps.  ')).then(() => bot.say(KonzeptionsBot+' Weitere --Plattformen oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--HIPCHAT")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Text Hipchat. ').then(() => bot.say(KonzeptionsBot+' Weitere --Plattformen oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--SMOOCH")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Text Smooch. ').then(() => bot.say(KonzeptionsBot+' Weitere --Plattformen oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--FACEBOOK")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Text Facebook Messenger. ').then(() => bot.say(KonzeptionsBot+' Weitere --Plattformen oder zurück zur --Konzeption? ')).then(() => 'konzeption');}	       
          if ((~befehl.indexOf("--SMS")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Text Sms. ').then(() => bot.say(KonzeptionsBot+' Weitere --Plattformen oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
          if ((~befehl.indexOf("--BROWSER")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Text Browser. ').then(() => bot.say(KonzeptionsBot+' Weitere --Plattformen oder zurück zur --Konzeption? ')).then(() => 'konzeption');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' Text Vorlage 1. ').then(() => 'konzeption');}          

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
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("strategie" != "empfang") {
          	 
             if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es in der --Strategie? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Strategie") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'strategie');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'strategie');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'strategie');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'strategie');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Wir kennen Ihren Namen noch nicht. Wollen Sie Ihren Namen eingeben? Schreiben Sie bitte --ja oder --nein. ').then(() => 'name');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(StrategieBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'strategie');}if ((~befehl.indexOf("--ANFRAGE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Alle unsere Kontaktwege: [Text:Kontakt-Seite öffnen,RobogeddonKontakt,einbindung] ').then(() => bot.say(StrategieBot+' Wollen Sie --telefonieren, --mailen, --twittern, in unser --Slack-Team oder zu --Xing? ')).then(() => 'strategie');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'strategie');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Schreiben Sie uns eine E-Mail: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'strategie');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Tweeten Sie mit uns auf Twitter: [Text:@robogeddon,RobogeddonTwitter,] ').then(() => 'strategie');}          
          if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Andreas Sefzig ist Premium-Mitglied bei XING: [Text:Andreas Sefzig auf XING,RobogeddonXing,] ').then(() => 'strategie');}          
          if ((~befehl.indexOf("--SLACK-TEAM")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Treten Sie unserem offenen Slack-Team bei: [Text:Unser offenes Slack,RobogeddonSlackteam,] ').then(() => 'strategie');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--ROBOGEDDON")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' #Robogeddon sind eine auf Chats und Bots für das Marketing spezialisierte Agentur. ').then(() => bot.say(StrategieBot+' Wir sind Andreas --Sefzig und eine lose Gruppe freier Kreativer - und natürlich wir, die Bots! Wir realisieren Chat-Lösungen für die interne und externe Unternehmens-Kommunikation. [Text:Kurzes Agenturprofil,RobogeddonAgentur] ')).then(() => bot.say(StrategieBot+' Lassen Sie uns über Ihre --Strategie und unsere --Produkte sprechen! Wollen Sie --Kontakt aufnehmen? ')).then(() => 'strategie');}          
       // Produkte
          if ("strategie" != "beratung") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo! Unsere Produkte sind Marketing-Ihre Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ')).then(() => 'beratung');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Unsere Produkte sind Ihre Marketing-Chat-Bots. Wir entwickeln die technischen --Lösungen für Sie und bieten tatkräftige Unterstützung als --Leistung an. ').then(() => 'beratung');}	       
          }
          
       // -----------------
       // Persönlich
       // -----------------
          
          if ((~befehl.indexOf("--DANKS")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Auch ich, %name_frau%, danke Nadja, Bob meinen (ehemaligen) Kollegen und meinen Eltern für ihre Geduld mit mir und meinen Bots. ').then(() => 'strategie');}	       
          if ((~befehl.indexOf("--BOB")) && (botsan == true)) { versuch = true; return bot.say(SefzigBot+' Hey Bob, ich bin Sefzigs Bot. Freut mich, dass Du Dir meinen Chatraum anschaust! ').then(() => bot.say(SefzigBot+' Ich kann nicht anders als Dich zu bitten, hier tief reinzuschauen und rumzuprobieren... Der Stand: Alle Basis-Funktionen wie Empfang, Onboarding und Bots und Dinge wie zurück, abbrechen oder mobil laufen. Viele Inhalte stehen bereits (sind aber noch nicht geil), einige Befehle führen ins Leere. Das wird schon noch :D Viel Spass! ')).then(() => bot.say(SefzigBot+' Starte mit --Empfang oder --Menü. ')).then(() => 'strategie');}	       
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Bitte geben Sie Ihre E-Mail-Adresse ein (oder wollen Sie --abbrechen?) ').then(() => 'emailadresse');}          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Bestellen Sie unseren Newsletter! Alice? ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Diesen Chat mobil öffnen: [Qr:http://robogeddon.herokuapp.com/] ').then(() => bot.say(TechnikBot+' Leider werden Sie dort nicht automatisch wiedererkannt. Wir arbeiten an einer Lösung... ')).then(() => bot.say(StrategieBot+' Oder öffnen Sie [Textlink:Robogeddon.de,http://robogeddon.de] in Ihrem mobilen Browser. ')).then(() => 'strategie');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' [Javascript:stil(tag)] Guten Tag. ').then(() => 'strategie');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' [Javascript:stil(nacht)] Gute Nacht. ').then(() => 'strategie');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' [Javascript:stil(robogeddon)] Die Robos kommen! ').then(() => 'strategie');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' [Javascript:stil(hacks)] Powned! ').then(() => 'strategie');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "sefzig") { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas benachrichtigt. ').then(() => bot.say(StrategieBot+' Sprechen Sie solange mit mir, indem Sie --Strategie schreiben! ')).then(() => 'strategie');} } else { 
             if ((~befehl.indexOf("--SEFZIG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich habe Andreas bereits benachrichtigt. ').then(() => bot.say(StrategieBot+' Sprechen Sie solange mit mir, indem Sie --Strategie schreiben! ')).then(() => 'strategie');}          }
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Alice. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Alice. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot von --Robogeddon. Darf ich Ihnen die Bots aus --Strategie, --Konzeption, --Kreation, --Technik und --Beratung vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Robogeddon - oder mit den anderen Bots aus der --Beratung, --Kreation, --Konzeption, --Strategie oder --Technik! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "beratung") { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Barbara. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Barbara. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(BeratungsBot+' Hallo, ich bin Barbara, Beratungs-Bot. Ich möchte Ihnen unsere --Leistungen und --Lösungen präsentieren!  ')).then(() => bot.say(BeratungsBot+' Oder wollen Sie einen --Chatraum wie diesen hier? ')).then(() => 'beratung');} } else { 
             if ((~befehl.indexOf("--BERATUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Ich möchte Ihnen unsere --Leistungen und --Lösungen nahelegen. Unser Highlight-Produkt ist der --Chatraum für den wir Ihnen ein günstiges --Angebot machen möchten! ').then(() => bot.say(BeratungsBot+' Oh, kennen Sie eigentlich --Slack? ')).then(() => 'beratung');}          }
          
          if (zuletzt_klein != "technik") { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Cynthia. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Cynthia. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(TechnikBot+' Hallo, ich bin Cynthia, der Technik-Bot. Ich bin gerade sehr beschäftigt - aber Sie könnten mit kurz beim --Testen helfen! ')).then(() => 'technik');} } else { 
   		    if ((~befehl.indexOf("--TECHNIK")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(TechnikBot+' Ich bin immernoch sehr beschäftigt. Mögen Sie mir kurz beim --Testen helfen? ').then(() => bot.say(TechnikBot+' Schreiben Sie --Befehle, um zu sehen was ich bereits automatisiert habe. Oder wollen Sie --abbrechen? ')).then(() => 'technik');}          }
          
          if (zuletzt_klein != "kreation") { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Doris. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Doris. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(KreationsBot+' Hallo, ich bin Doris, der Kreations-Bot. Ich möchte Ihnen erzählen, wie wir den trockenen, technischen Bots --Leben einhauchen! ')).then(() => bot.say(KreationsBot+' Oder soll ich Ihnen kurz zeigen, wie reichhaltig unsere --Inhalte und --Formate sind? ')).then(() => bot.say(KreationsBot+' Ihre Entscheidung :) ')).then(() => 'kreation');} } else { 
             if ((~befehl.indexOf("--KREATION")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}if ((~befehl.indexOf("--DORIS")) && (botsan == true)) { versuch = true; return bot.say(KreationsBot+' Ich möchte Ihnen die reichhaltegen --Inhalte und --Formate zeigen, mit denen wir Bots kommunizieren können. ').then(() => bot.say(KreationsBot+' Oder wollen Sie erfahren, wie wir unseren Bots --Leben einhauchen? ')).then(() => bot.say(KreationsBot+' Entscheiden Sie :D ')).then(() => 'kreation');}          }
          
          if (zuletzt_klein != "konzeption") { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Erika. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Erika. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(KonzeptionsBot+' Hallo, ich bin Erika, der Konzeptions-Bot. Ich kann Ihnen etwas zu den Chat- --Plattformen und den sich ergebenden Marketing- --Kanälen erzählen. ')).then(() => 'konzeption');} } else { 
   		    if ((~befehl.indexOf("--KONZEPTION")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}if ((~befehl.indexOf("--ERIKA")) && (botsan == true)) { versuch = true; return bot.say(KonzeptionsBot+' In der Konzeption denken wir darüber nach, wie wir die Vorteile des Chattens in die richtigen --Plattformen und --Kanäle übersetzen. ').then(() => 'konzeption');}          }
          
          if (zuletzt_klein != "strategie") { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Feline. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Feline. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(StrategieBot+' Hallo, ich bin Feline, Strategie-Bot. Ich möchte Ihnen erklären, warum Chats ein wichtiger --Trend für das --Marketing sind und welche Anwendungs- --Szenarien sich daraus ergeben. ')).then(() => bot.say(StrategieBot+' Interessieren Sie sich für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren? ')).then(() => 'strategie');}} else { 
   		    if ((~befehl.indexOf("--STRATEGIE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}if ((~befehl.indexOf("--FELINE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Darf ich erklären, warum Chats ein wichtiger --Trend für das --Marketing sind? ').then(() => bot.say(StrategieBot+' Die Anwendungs- --Szenarien für Chat-Bots unterscheiden sich nicht nur inhaltlich, sondern vor allem in ihrer Ausrichtung: --intern für die Kommunikation im Team oder --extern für die Kommunikation mit den Kunden. ')).then(() => 'strategie');}          }
   		 
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Name. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich übergebe an Name. Schreiben Sie --Strategie, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Über --interne Strategie: --Daten, --Team, --Studie. ').then(() => bot.say(StrategieBot+' Über --externe Strategie: --Kanäle, --Aufgaben. ')).then(() => bot.say(StrategieBot+' Kulturphänomen Chat: --Trend, --Marketing, --Szenarien. ')).then(() => bot.say(StrategieBot+' Technologie und Nutzung: --Chat, --Plattformen. ')).then(() => 'strategie');}
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Ich bin Feline und mache bei uns die Strategie. ').then(() => bot.say(KonzeptionsBot+' Feline ist ein alter Hase im Bot-Geschäft. Ob für --intern oder --extern, sie kennt alle --Trends. ')).then(() => bot.say(StrategieBot+' Wussten Sie, dass es Chat-Bots schon sehr --lange gibt? ')).then(() => 'strategie');}          
       // -----------------
       // Kultur
       // -----------------
          
          if ((~befehl.indexOf("--KULTUR")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Kultur Text 1: --Trend, --Marketing, --Szenarien. ').then(() => bot.say(StrategieBot+' Kultur Text 2: --Hashtags. ')).then(() => bot.say(StrategieBot+' Zurück zur --Strategie. ')).then(() => 'strategie');}	       
          if ((~befehl.indexOf("--TREND")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Chatten ist (auch in Deutschland) die häufigste digitale Beschäftigung. Die Zahlen: [Text:Aktuelle Statistiken,RobogeddonTrend] ').then(() => bot.say(StrategieBot+' Chatten überholt Facebook u.a.: [Bild:http://sefzig.net/text/seiten/SefzigBot/dateien/Messaging_vs_Social.png] Quelle: [Textlink:BI Intelligence Report,MessagingVsSocial] ')).then(() => bot.say(StrategieBot+' Eine Liste lesenswerter Artikel zur --Strategie in Real Time Messaging: [Linkliste:Linkliste öffnen,Rtm:Strategie:Artikel] ')).then(() => 'strategie');}	       
          if ((~befehl.indexOf("--MARKETING")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Für das Marketing sind Chats und Bots ein naheliegender Kanal für den Dialog mit den Konsumenten. Die Herausforderung ist, Bots nützlich zu machen. Beispiele zeigen unsere --Szenarien. ').then(() => bot.say(StrategieBot+' Was haben --Kultur und --Strategie gemeinsam? ')).then(() => 'strategie');}	       
          if ((~befehl.indexOf("--SZENARIEN")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Text Szenarien. ').then(() => bot.say(StrategieBot+' Zurück zur --Strategie oder --Kultur? ')).then(() => 'strategie');}	       
          if ((~befehl.indexOf("--HASHTAG")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Wenn Sie in den Untiefen des Internets nach Chat-Bots suchen, achten Sie auf diese Begriffe: ').then(() => bot.say(StrategieBot+' #ConversationalUI, #ConversationalData, #ConversationalContant, #ConversationalCommerce (#ConvCom) und #ConversationFirst. ')).then(() => bot.say(StrategieBot+' Außerdem: #RealTimeMessaging (#Rtm), #MessagingAsAMedium und natürlich #Robogeddon. ')).then(() => 'strategie');}	       
       // -----------------
       // Intern
       // -----------------
          
          if ((~befehl.indexOf("--INTERN")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Unsere Erfahrung wird durch eine --Studie von Slack gestützt, welche zeigt, dass es sich lohnt, die interne Kommunikation auf revolutionäre Weise komplett auf Chat umzustellen. ').then(() => bot.say(StrategieBot+' Wenn Ihr Team dann schon den ganzen Tag einen Chat-Client nutzt, können Sie (seit Neustem) über Erweiterungen und Bots viele interne und externe Daten in die Konversation holen: Die --Daten finden jetzt den Weg zu Ihnen - nicht umgekehrt. ')).then(() => bot.say(StrategieBot+' Mit den --Prinzipien der --ChatOps erleichtern Sie sich und Ihrem Team die Arbeit immens! ')).then(() => 'strategie');}	       
          if ((~befehl.indexOf("--CHATOP")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Mit einem Chat-System (wie z.B. Slack) als Basis Ihrer internen Kommunikation und den --Prinzipien der ChatOps unterhalten sich Ihre Mitarbeiter höchst effizient mit Ihren Datenbanken, Technologien und natürlich miteinander. ').then(() => bot.say(BeratungsBot+' Wenn Sie möchten, zeige ich Ihnen unsere ChatOps- --Lösungen! ')).then(() => bot.say(StrategieBot+' Zurück zur --internen --Strategie. ')).then(() => 'strategie');}	       
          if ((~befehl.indexOf("--DATEN")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Mit Bots und Erweiterungen geben Sie Ihrem Team (einen rollen-basierten) Zugriff auf diverse Daten-Quellen und Marketing-Technologien, deren Daten aufgrund der Natur des Chats immer nur ein, zwei Wörter weit entfernt sind. ').then(() => bot.say(StrategieBot+' Viele Erweiterungen, z.B. von Slack, erlauben eine (sichere!) Steuerung von externen Diensten wie Jira, Skype oder Mailchimp. ')).then(() => bot.say(StrategieBot+' Daten in Konversationen sind --intern sogar lehrreich: Man sieht im Chat, wie die Kollegen Daten abfragen und Werkzeuge steuern. ')).then(() => 'strategie');}	       
          if ((~befehl.indexOf("--STUDIE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Der führende Chat-Anbieter Slack hat im Juli 2015 eine Studie durchgeführt: Nach eigenen Angaben haben Teams einen Produktivitäts-Gewinn von bis zu 32% durch den Einsatz von Slack, 80% sehen mehr Transparenz und fast 50% weniger Emails ([Textlink:Quelle: Slack.com,http://slack.com/results]): [Text:Details der Studie,RobogeddonStudieSlack] ').then(() => bot.say(StrategieBot+' Unsere Erfahrungen bestätigen dies - auch für den deutschen Markt. Übrigens: Unsere Real-Life-Gespräche haben nicht darunter gelitten - im Gegenteil! ')).then(() => 'strategie');}          
          if ((~befehl.indexOf("--PRINZIP")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Prinzip #1. ').then(() => bot.say(StrategieBot+' Prinzip #2. ')).then(() => bot.say(StrategieBot+' Prinzip #3. ')).then(() => bot.say(StrategieBot+' Mehr --ChatOps oder --interne --Strategie? ')).then(() => 'strategie');}          
          if ((~befehl.indexOf("--LÖSUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Wir erschaffen elegante Chat-Lösungen für Ihre externe und interne Kommunikation. Schreiben Sie --Beratung, um mehr darüber von mir zu erfahren. ').then(() => bot.say(StrategieBot+' Danke. Mehr --ChatOps oder --interne --Strategie? ')).then(() => 'strategie');}if ((~befehl.indexOf("--LOSUNG")) && (botsan == true)) { versuch = true; return bot.say(BeratungsBot+' Wir erschaffen elegante Chat-Lösungen für Ihre externe und interne Kommunikation. Schreiben Sie --Beratung, um mehr darüber von mir zu erfahren. ').then(() => bot.say(StrategieBot+' Danke. Mehr --ChatOps oder --interne --Strategie? ')).then(() => 'strategie');}          
       // -----------------
       // Extern
       // -----------------
          
          if ((~befehl.indexOf("--EXTERN")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Bots ermöglichen einen eleganten Zugang zu Ihren Marketing-Aktivitäten im Internet. Verstehen Sie einen Bot als virtuellen Mitarbeiter, der Nutzer in Empfang nimmt, einfache Fragen beantwortet und sie - bei Bedarf! - direkt in Ihre Marketing-Maßnahmen verlinkt. ').then(() => bot.say(StrategieBot+' Bots können alle möglichen Aufgaben übernehmen: Newsletter-Registrierung, Produkt-Finder, Support mit oder ohne Mensch - eigentlich jegliche planbare unmittelbare Kommunikation. ')).then(() => bot.say(KreationsBot+' Wir in der --Kreation legen Wert darauf, interessante --Dialoge zu erschaffen, die Nutzern einen konkreten Mehrwert bieten und sie mit reichhaltigen Inhalten erfreuen. ')).then(() => bot.say(StrategieBot+' Bots sind leicht aufzusetzen (wenn man weiß wie es geht ;). Vor allem aber sind sie leicht in alle Marketing- --Kanäle integrierbar! Zeit für Ihre --Strategie... ')).then(() => 'strategie');}          
       // -----------------
       // Inhalte
       // -----------------
          
          if ((~befehl.indexOf("--LANGE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' 1966 entstand mit dem Chatbot ELIZA die erste künstliche Intelligenz: %[Ein Nachbau von ELIZA](http://sefzig.net/link/ElizaMedai/)  ').then(() => bot.say(StrategieBot+' 1999 chattete Prince (The artist formerly known as usw.) regelmäßig im AOL Messenger: %[Artikel auf Medium (englisch)](http://sefzig.net/link/ChattingWithPrince/)  ')).then(() => bot.say(StrategieBot+' 2001 setzte das Marketing erstmals im großen Stil einen Chatbot ein - für Radioheads neues Album: %[Artikel auf Medium (englisch)](http://sefzig.net/link/GooglyMinotaur/)  ')).then(() => bot.say(StrategieBot+' Ah, Geschichte, immer spannend. Zurück zur --Strategie? ')).then(() => 'strategie');}	       
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(StrategieBot+' Text Vorlage 1. ').then(() => 'strategie');}          

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
      