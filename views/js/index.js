
 // ------------------------
 // Initialisierung
 // ------------------------

 // Anwendung starten
    $(document).ready(function(){
       
    // Variablen
       var selektor = "";
       var befehl = "";
       var starten = "";
       var ansicht = "";
       var startklick = "";
       
    // Stil laden
       stil();
       
    // Datenfelder ausfüllen
       cookie("vorname");
       cookie("nachname");
       cookie("email");
       
    // Chat starten
       starten = config["default"]["ansicht"];
       ansicht = getParameters("v");
       if (ansicht == "chat")  { starten = "chat"; }
       if (ansicht == "daten") { starten = "daten"; }
       window.setTimeout(function() { start(starten); }, 100);
       
    // Benutzeroberfläche
       selektor = "input[data-start], img[data-start], a[data-start], td[data-start]";
       $(selektor).click(function(e) {
          
       // Elemente
          startklick = $(this).attr("data-start");
          
       // Navigation
          start(startklick);
       // console.log("> Start: "+startklick);
          
       // Klick verhindern
          e.preventDefault();
          
       });
       
    // Menü per Default anzeigen
    // menu("an");
       
    // Menü auswählen und anzeigen
       menue = getParameters("m");
       if ((!menue) || (menue == "")) { 
          menue = config["default"]["menu"];
       }
       $("#menu > div").css("display", "none");
       $("#menu > ."+menue).css("display", "block");
       
    // Befehle im Menü
       selektor = "#seite > #menu div > div button";
       $(selektor).click(function() {
          
          datastil = $(this).attr("data-stil");
          
          if ((datastil) && (datastil != "")) { 
             
             stil(datastil);
             
          }
          else {
             
             befehl = $(this).text();
             Smooch.sendMessage("--"+befehl);
             
          }
          
       });
       
    // Menü-Button default
       var menuConfig = config["default"]["button"];
       if (menuConfig == "an") { $("#start").fadeIn(); }
       
    // Befehler-Button default
       var befehlerConfig = config["default"]["befehler"];
       if (befehlerConfig == "an") { $("#befehle").fadeIn(); }
       
    // Intro-Texte einsetzen
       $("#namenEingeben").html(texte["intro"]["namenEingeben"]);
       
    });
    
 // Chat starten
    function start(methode) {
       
    // Variablen zurücksetzen
       var vorname = "";
       var nachname = "";
       var email = "";
       var sagen = "";
       
    // Zu Daten umleiten falls Namenzwang und Namenlos
       var namezwang = config["default"]["name"];
       if ((methode == "chat") && (namezwang == "an")) {
          
          bereit = "ja";
          vorname =  $("#vornameDaten").val();  if ((vorname  == daten["label"]["vorname"])  || (!vorname)  || (vorname  == "")) { bereit = "nein"; }
          nachname = $("#nachnameDaten").val(); if ((nachname == daten["label"]["nachname"]) || (!nachname) || (nachname == "")) { bereit = "nein"; }
          
       // Methode zurücksetzen
          if (bereit == "nein") { methode = "daten"; }
          
       }
       
    // Chat starten
       if (methode == "chat") {
          
       // Debuggen
       // console.log('\n\nNeues Gespräch\n');
          
          var vornameZufall = "Nutzer";
          var nachnameZufall = Math.floor(Math.random()*999999);
          
       // Daten aus Formular übernehmen
          vorname =  $("#vornameDaten").val();  if (vorname  == daten["label"]["vorname"])  { vorname =  vornameZufall; }
          nachname = $("#nachnameDaten").val(); if (nachname == daten["label"]["nachname"]) { nachname = nachnameZufall; }
          email =    $("#emailDaten").val();    if (email    == daten["label"]["email"])    { email =    ""; }
          
       // Smooch Js
       // https://github.com/smooch/smooch-js
          var skPromise = Smooch.init({ 
             appToken: config["smooch"]["appToken"],
             embedded: true,
             givenName: vorname,
             surname: nachname,
             customText: {
                headerText:                    texte["chat"]["headerText"],
                inputPlaceholder:              texte["chat"]["inputPlaceholder"],
                sendButtonText:                texte["chat"]["sendButtonText"],
                introText:                     texte["chat"]["startText"],
                settingsText:                  texte["chat"]["settingsText"],
                settingsReadOnlyText:          texte["chat"]["settingsReadOnlyText"],
                settingsInputPlaceholder:      texte["chat"]["settingsInputPlaceholder"],
                settingsSaveButtonText:        texte["chat"]["settingsSaveButtonText"],
                settingsHeaderText:            texte["chat"]["settingsHeaderText"],
                settingsNotificationText:      texte["chat"]["settingsNotificationText"],
                actionPaymentError:            texte["chat"]["actionPaymentError"],
                actionPaymentCompleted:        texte["chat"]["actionPaymentCompleted"],
                messageError:                  texte["chat"]["messageError"],
                invalidFileError:              texte["chat"]["invalidFileError"],
                messageIndicatorTitleSingular: texte["chat"]["messageIndicatorTitleSingular"],
                messageIndicatorTitlePlural:   texte["chat"]["messageIndicatorTitlePlural"]
             }
          })
          .then(function () { window.setTimeout(function() { 
             
             anpassen();
             
             sagen = getParameters("weiter");
             if ((sagen) && (sagen != "")) { 
             
                window.setTimeout(function() { 
                   
                   nachricht = texte["chat"]["weiterleiten"]; 
                   nachricht = nachricht+"  "; 
                   Smooch.sendMessage(" "+nachricht+" "); 
                   
                   window.setTimeout(function() { 
                      
                      Smooch.sendMessage(" "+sagen+" ");
                      
                   }, 1000);
                   
                }, 1000);
                
             }
             
          }, 100); }); 
          
       // Smooch.open();
          Smooch.render(document.getElementById('chatContainer'));
          Smooch.on('message:sent', function(message) {
             
          // console.log('- Nutzer hat eine Nachricht gesendet');
          // $(".sk-messages").append('<img src="img/ui/Schreiben.gif" class="typing" />');
             
             Cookies.set(daten["cookie"]["gesprochen"], "ja");
             
          });
          Smooch.on('message:received', function(message) {
             
          // $(".typing").remove();
             window.setTimeout(function() { anpassen(); }, 1);
             
          // console.log('- Nutzer hat eine Nachricht erhalten');
             
          });
          
       // Konversation rendern
          anpassen();
          
       // Ansichten anpassen
          $("#seite > #chat, #seite > #daten").fadeOut();
       
       // Inhalt anzeigen
          $("#seite > #"+methode).fadeIn();
       
       // Fokus auf Eingabe
          $("#sk-footer .message-input").focus();
       // window.setTimeout(function() { blink(); }, 2000);
          
       }
       
    // Daten anzeigen starten
       if (methode == "daten") {
          
          var gesprochen = Cookies.get(daten["cookie"]["gesprochen"]);
          var ansicht =    config["default"]["ansicht"];
          
          if (gesprochen == "ja") {
             
             start("chat");
             
          }
          else if (ansicht == "daten") {
             
          // Inhalt anzeigen
             $("#seite > #"+methode).fadeIn();
          
             $('#daten input[type=text], #menu input[type=text]').on('keydown', function(e) {
                
                if (e.which == 13) {
                   
                   start("chat");
                   e.preventDefault();
                   
                }
                
             });
          
             $('#daten input.nachname').on('keydown', function(e) {
                
                if (e.which == 9) {
                   
                   e.preventDefault();
                   
                }
                
             });
             
          }
          else if (ansicht == "chat") {
	          
             start("chat");
             
          }
          else {
	          
             alert("komisch...");
             
          }
          
       }
       
    // Menü anzeigen starten
       if (methode == "menu") {
          
          menu();
          
       }
       
    }
    
 // Befehler-Leiste laden
    function befehlerLaden() {
       
       var stand = $("body").attr("data-befehler");
       if (stand == "true") {} else {
          
       // Befehler-Template laden
          template = templates["befehl"]["leiste"];
          if ($.isArray(template)) {
             template = template.join("a-f-z");
             template = template.replace(/a-f-z/g, "");
          }
          
       // Template einsetzen
          selektor = "#sk-footer";
          $(selektor).append(template);
       // console.log("Setze Befehler-Leiste ein: "+template);
          
       // Status merken
          $("body").attr("data-befehler", "true");
          
       // Befehlleiste erzeugen
       // Folgt...
       // alert("Befehler laden: "+inhalt);
          
       // Befehler-Button anzeigen
          $("#befehle").fadeIn();
          
          selektor = "#sk-footer";
          $(selektor).mouseenter(function() {
             $("#befehle input").addClass("aktiv");
          });

          $(selektor).mouseleave(function() {
             $("#befehle input").removeClass("aktiv");
             befehlerSchalter("aus");
          });
          
       }
       
    }
    
 // ------------------------
 // Hilfs-Funktionen
 // ------------------------
    
 // Texte anpassen
    function inhalt(methode, text_string, var1, var2, var3, var4) {
       
       text_string = " "+text_string+" ";
       var inhalte = text_string;
       var inhalt = "";
       
       if (methode == "befehl") {
       
       // Konfiguration übernehmen
          var befehl_template = templates["befehl"]["link"];
       // console.log("befehl_template: "+befehl_template);
          var befehl_prefix = config["syntax"]["befehlPrefix"];
             
       // Befehle anpassen
          inhalte = inhalte.split(befehl_prefix);
          for (i = 1; i < inhalte.length; i++) {
             
          // Befehl-Template übernehmen
             befehl_button = befehl_template;
             
          // Inhalt zurücksetzen
             inhalt = "";
             
          // Befehl freistellen
             inhalt = inhalte[i].split(/,|;|:|\.|\<|!|\?| /)[0];
          // console.log("\ninhalt: "+inhalt);
             
             if ($.isArray(befehl_button)) { 
                befehl_button = befehl_button.join("a-f-z");
                befehl_button = befehl_button.replace(/a-f-z/g, "");
             // console.log("befehl_button array: "+befehl_button);
             }
             
          // Template füllen
             befehl_button = befehl_button.replace(/%inhalt%/g, inhalt);
          // console.log("befehl_button neu: "+befehl_button);
             
          // Template einsetzen
             text_string = text_string.replace(befehl_prefix+""+inhalt, befehl_button); // ..?
          // console.log("text_string: "+text_string+"");
             
          // Befehler laden
             befehlerLaden();
       
          // Befehler hinzufügen
             befehlerNeu(inhalt);
             
          }
          
       }
       
       if ((methode == "modul") && (var1) && (var1 != "")) {
          
       // Funktions-Parameter
          var modul = var1;
          
       // Modulnamen kamelisieren
       // console.log("modul: "+modul);
       // modul = modul.charAt(0).toUpperCase() + modul.slice(1);
       // console.log("-> modul: "+modul);
          
       // Klasse in Kleinbuchstaben
          var klasse = var1;
          klasse = klasse.toLowerCase();
          
       // Cta-Text von URL trennen
          if ((modul == "Button") || (modul == "Text") || (modul == "Link") || (modul == "Textlink") || (modul == "Linkliste") || (modul == "Email") || (modul == "Telefon")) { 
             
          // console.log("> Button Var: "+var1);
             var buttons = text_string.split("["+modul+":");
             if (buttons[1]) { 
                var buttons2 = buttons[1].split("]");
                if (buttons2[1]) { 
                   var buttons3 = buttons2[0].split(",");
                   if (buttons3[2]) {      var var1 = buttons3[0];   var var2 = ""+buttons3[1]; var var3 = ""+buttons3[2];
                   }
                   else if (buttons3[1]) { var var1 = buttons3[0];   var var2 = ""+buttons3[1]; var var3 = "";
                   }
                   else {                  var var1 = buttons2[0];   var var2 = ""+buttons2[0]; var var3 = ""; }
                }
                else {                     var var1 = "Link öffnen"; var var2 = ""+var1;        var var3 = ""; }
             }
             else {                        var var1 = "Link öffnen"; var var2 = ""+var1;        var var3 = ""; }
             
          // console.log("> Variable 1: "+var1);
          // console.log("> Variable 2: "+var2);
          // console.log("> Variable 3: "+var3);
             
          }
          
       // Template laden und anpassen
          var template = templates["modul"][modul];
          
          if ($.isArray(template)) {
             template = template.join("a-f-z");
             template = template.replace(/a-f-z/g, "");
          }
          template = template.replace(/%var1%/g, var1);
          template = template.replace(/%var2%/g, var2);
          template = template.replace(/%var3%/g, var3);
          
       // Modul anpassen
          inhalte = inhalte.split("["+modul+":");
          for (i = 1; i < inhalte.length; i++) {
             
          // Inhalt freistellen
             var inhalt = inhalte[i].split("]")[0];
             
          // Template anpassen
             template = template.replace(/%klasse%/g, klasse);
             template = template.replace(/%inhalt%/g, inhalt);
          // template = template.replace(/%cta%/g, cta);
             
          // Neuen Text anpassen
             text_string = text_string.replace("["+modul+":"+inhalt+"]", template);
             
          // Debuggen
          // console.log("- "+modul+" angepasst: "+inhalt);
             
          // Zurücksetzen
             var inhalt = "";
             
          }
          
       }
       
       if ((methode == "javascript") && (var1) && (var1 != "") && (var2) && (var2 != "")) {
          
       // Funktions-Parameter
          var funktionen = var1;
          var meldung = var2;
             
       // Javascript ausführen
          inhalte = inhalte.split("[Javascript:");
          for (i = 1; i < inhalte.length; i++) {
             
          // Funktions-Namen freistellen
             var skript = inhalte[i].split("]")[0];
             
             var aufruf = skript.split("(");
             if (aufruf[1]) { 
                var funktion = aufruf[0];
                var params = aufruf[1];
                params = params.replace(")", "");
                
                var ersetzen = funktion+"("+params+")";
             }
             else { 
                var funktion = skript;
                var params = "";
                
                var ersetzen = skript;
             }
             
          // Neuen Text anpassen
             text_string = text_string.replace("[Javascript:"+ersetzen+"]", meldung);
             
          // Bekannte Funktionen ausführen
             funktionen[funktion](params);
             
          // Debuggen
          // console.log("- Javascript ausgeführt: "+skript);
             
          // Zurücksetzen
             var skript = "";
             var funktion = "";
             var params = "";
             
          }
          
       }
       
       if ((methode == "bot") && (var1) && (var1 != "") && (var2) && (var2 != "") && (var3) && (var3 != "") && (var4) && (var4 != "")) {
          
       // Funktions-Parameter
          var kurzel = var1;
          var name = var2;
          var zufall = var3;
          var id = var4;
             
       // Wenn Text den Botnamen enthält
          bot_alt = inhalte; bot_neu = inhalte.replace("["+var1+"] ","");
          if (bot_neu != bot_alt) {
             
          // Konfiguration
             var pfad = config["anwendung"]["cdn"]+"Displaybild_"+kurzel+".png";
             var wrap = '<span class="roboter" onclick="befehlen(\''+id+'\');"></span>';
             
          // Bot-Inhalte anpassen
             $(".sk-from.bot"+zufall).html(name);
             $(".sk-msg-avatar.bot"+zufall).attr("src", pfad);
             
          // Neuen Text anpassen
             text_string = text_string.replace("["+kurzel+"] ","");
             
          // Debuggen
          // console.log("- Bot angepasst: "+id);
             
             $("#seite > #menu li button").removeClass("aktiv");
          // $("#seite > #menu li button:contains('"+id+"')").addClass("aktiv");
             $("#seite > #menu li button").filter(function() { return ($(this).text() === id); }).addClass("aktiv");
             
             window.setTimeout(function() { 
                
                $(".sk-from.bot"+zufall).wrap(wrap);
                $(".sk-msg-avatar.bot"+zufall).wrap(wrap);
                
             }, 1000);
             
          }
          
       }
       
       return text_string; 
       
    }
    
 // Inhalte anpassen
    function anpassen() {
       
    // Noch nicht angepasste anpassen
       var selektor = ".sk-msg > span > span > span:not([data-angepasst])";
       $(selektor).each(function() {
          
       // Inhalte lesen
          var text_alt = $(this).html();
          
       // Neuen Inhalt beginnen // String wird von allen folgenden Funktionen angepasst
          var text_neu = text_alt;
          
       // 1 Zufallszahl für jede Nachricht
          var zufall = Math.floor(Math.random()*999999);
          
       // Zugelassene Javascript-Funktionen
          var funktionen = {
             alert:        function (b) { alert(b); },
             konsole:      function (b) { konsolen(b); },
             blinken:      function ()  { blink(); },
             cookies:      function (b) { cookies(b); },
             menu:         function (b) { menu(b); },
             stil:         function (b) { stil(b); }
          };
          
       // Bot-Inhalte markieren :/
          $(this).parent().parent().parent().parent().children().filter(".sk-from").addClass("bot"+zufall);
          $(this).parent().parent().parent().parent().parent().children().filter("img").addClass("bot"+zufall);
             
       // Inhalte anpassen
          text_neu = inhalt("befehl", text_neu);
          text_neu = inhalt("modul", text_neu, "Link");
          text_neu = inhalt("modul", text_neu, "Textlink");
          text_neu = inhalt("modul", text_neu, "Text");
          text_neu = inhalt("modul", text_neu, "Bild");
          text_neu = inhalt("modul", text_neu, "Qr");
          text_neu = inhalt("modul", text_neu, "Telefon");
          text_neu = inhalt("modul", text_neu, "Email");
          text_neu = inhalt("modul", text_neu, "Button");
          text_neu = inhalt("modul", text_neu, "Iframe");
          text_neu = inhalt("modul", text_neu, "Audio");
          text_neu = inhalt("modul", text_neu, "Youtube");
          text_neu = inhalt("modul", text_neu, "Linkliste"); 
          text_neu = inhalt("javascript", text_neu, funktionen, " ");
          
       // Bots anpassen
          var text_merken = text_neu;
          text_neu = inhalt("bot", text_neu, "AndreasSefzig",  "Andreas Sefzig",         zufall, "Sefzig");
          text_neu = inhalt("bot", text_neu, "SefzigBot",      "Andreas Sefzigs Bot",    zufall, "Sefzig");
          
          text_neu = inhalt("bot", text_neu, "EmpfangsBot",    "Alice, Empfangs-Bot",    zufall, "Empfang");
          text_neu = inhalt("bot", text_neu, "VerkaufsBot",    "Barbara, Verkaufs-Bot",  zufall, "Verkauf");
          text_neu = inhalt("bot", text_neu, "MarketingBot",   "Cynthia, Marketing-Bot", zufall, "Marketing");
          
       // Bots zusammenfassen
          window.setTimeout(function() { 
             
             $(".sk-from").each(function() {
                
                var dieser =    $(this).html();
                var vorganger = $(this).parent().parent().prev().find(".sk-from").html();
             // console.log("- "+vorganger+" = "+dieser+"?");
             
             // Bei folgendem Absender
                if (vorganger == dieser) {
                   
                // Namen hier verbergen
                   $(this).css("display","none");
                   $(this).parent().parent().css("padding-top","10px");
                   
                // Avatar davor verbergen
                   $(this).parent().parent().prev().children().filter("img.sk-msg-avatar").attr("src", "img/bots/Displaybild_LeerBot.png");
                   
                // Pfeilchen davor verbergen
                   $(this).parent().parent().prev().find(".sk-msg").addClass("frei");
                // $('head').append("<style>.sk-msg.frei::after{ border: none !important }</style>");
                   
                }
                else {
                   
                // console.log("> Anderer Vorganger: "+vorganger+" != "+name+"");
                   
                }
                vorganger = "";
                dieser = "";
                
             });
             
          }, 333);
       
       // Default-Bot
          if (text_neu == text_merken) { text_neu = "[AndreasSefzig] "+text_neu; }
          text_neu = inhalt("bot", text_neu, "AndreasSefzig",  "Andreas Sefzig",         zufall, "Sefzig");
          
       // Angepasste Inhalte schreiben
          $(this).html(text_neu);
          
       // Als angepasst markieren
          $(this).attr("data-angepasst", "true");
          
       });
       
    }
    
 // ------------------------
 // Client-Funktionen
 // ------------------------
    
 // Befehler füllen
    function befehlerNeu(inhalt) {
    // alert("stand: "+stand+", inhalt: "+inhalt);
    
    // Bisherigen Befehl löschen
       $(".befehle .befehler[rel='"+inhalt+"']").remove();
       
    // Befehler-Template laden
       template = templates["befehl"]["befehler"];
       if ($.isArray(template)) {
          template = template.join("a-f-z");
          template = template.replace(/a-f-z/g, "");
       }
       
    // Template ausfüllen
       template = template.replace(/%inhalt%/g, inhalt);
    // console.log("Setze neuen Befehler ein: "+template);
       
    // Template einsetzen
       selektor = ".befehle > div";
       $(selektor).prepend(template);
          
    }
    
 // Befehler-Klicks
    function befehlerKlick(inhalt) {
       
    // Befehlleiste erzeugen
    // Folgt...
    // alert("Befehler geklickt: "+inhalt);
       window.Smooch.sendMessage(inhalt);
       
       
    }
    
 // Befehler-Klicks
    function befehlerSchalter(methode) {
       
     // console.log("befehlerSchalter('"+methode+"')");
       if ((!methode) || (methode == "")) {
          
          var stand = $("#befehle input").val();
          if (stand == "i") { methode = "an"; }
          else { methode = "aus"; }
       
       }
       
       if (methode == "an") {
          $(".befehle").fadeIn();
          $("#befehle input").val("x");
       }
       else {
          $(".befehle").fadeOut();
          $("#befehle input").val("i");
       }
       
    }
    
 // Klicks auf Befehle
    function befehlen(befehl) {
       
    // $("#sk-footer form input.message-input").val(befehl);
    // $("#sk-footer form input.message-input").change();
    // $("#sk-footer form input.message-input").focus();
    // $("#sk-footer form .send").trigger("click");
       
       window.Smooch.sendMessage(befehl);
       
    }
    
 // Helper: Cookie setzen
    function cookie(name) {
       
       if (name) {
          
          var wert = Cookies.get(daten["cookie"][name]);  
          if ((wert)  && (wert != ""))  { wert = wert; } 
          else { wert = daten["label"][name]; } 
          
          $("#"+name+"Daten, #"+name+"Menu").val(wert);
          $("#"+name+"Daten").trigger("change");
          
          $("#"+name+"Daten, #"+name+"Menu").change(function(){  
             
             var wert_neu = $(this).val();
             
             if ((wert_neu) && (wert_neu != "") && (wert_neu != daten["label"][name]) && (wert_neu != daten["default"][name])) {
                
                Cookies.set(daten["cookie"][name], wert_neu);
                $("#"+name+"Daten, #"+name+"Menu").val(wert_neu).trigger("change");
                
             }
             else {
                
                $("#"+name+"Daten, #"+name+"Menu").val(daten["label"][name]);
                $("#"+name+"Daten").trigger("change");
                
             }
             
             if      (name == "vorname")  { update = { givenName: wert_neu }; }
             else if (name == "nachname") { update = { surname:   wert_neu }; }
             else if (name == "email")    { update = { email:     wert_neu }; }
             else              { update = { properties: { name: wert_neu } }; } 
             window.Smooch.updateUser(update);
          // console.log("Cookie (change): Smooch-User '"+name+"' Info: "+wert_neu);
             
          });
          
       // console.log("cookie input wert: "+wert);
          return wert;
          
       }
       
    }
    
 // Inhalt in Fenster öffnen
    function fenster(methode, kurzel, ansicht) {
       
       if ((!ansicht) || (ansicht == "")) { var ansicht = "einbindung"; }
       
    // URL errechnen
       if (methode == "link")  { var url = "http://sefzig.net/link/"+kurzel+"/"; }
       if (methode == "links") { var url = "http://sefzig.net/link/liste/"+kurzel+"/?ansicht=ansehen"; }
       if (methode == "text")  { var url = "http://sefzig.net/text/"+kurzel+"/#"+ansicht; }
       if (methode == "bild")  { var url = kurzel; }
       
       if ((methode == "link") || (methode == "links") || (methode == "text")) {
          
       // Bild verbergen
          $("#fenster td > img").css("display", "none");
          
       // Iframe laden
          $("#fenster td > iframe").attr("src", url);
          $("#fenster td > iframe").css("display", "block");
          
       }
       else if (methode == "bild") {
          
       // Iframe verbergen
          $("#fenster td > iframe").css("display", "none");
          
       // Bild laden
          $("#fenster td > img").attr("src", url);
          $("#fenster td > img").css("display", "block");
          
       }
       
    // Ebene öffnen
       $("#fenster").fadeIn(500);
          
       return false;
       
    }
    
 // Fenster schliessen
    function fensterSchliessen() {
              
       $('#fenster td > iframe, #fenster td > img').attr('src',''); 
       $('#fenster').css('display','none');
              
    }
    
 // ------------------------
 // Chat-Funktionen
 // ------------------------
    
 // Stil (ggfls. auswählen und) anwenden
    function stil(auswahl) {
       
       zufall = 4;
       dir = "stil";
       
       if ((auswahl) && (auswahl != "")) {
          
          auswahl = auswahl.replace("--", "");
          
       }
       else {
          
          auswahl = getParameters("stil");
          
          if ((!auswahl) || (auswahl == "")) {
             
             auswahl = config["default"]["stil"];
             
          }
       
       }
       
       auswahl = auswahl.toLowerCase();
       ladenCss(auswahl, zufall, dir);
       $("body").attr("data-stil", auswahl);
       
    }
    
 // Menü an- oder ausschalten
    function menu(methode) {
       
    // console.log("\n\nmenu('"+methode+"')");
       
    // Toggle ermitteln
       if ((methode == "an") || (methode == "aus")) {
          
          methode = methode;
       // console.log("methode übernommen: '"+methode+"'");
          
       }
       else {
          
          var status = $("body").attr("data-menu");
          if (status == "an") {
             
             methode = "an";
             
          }
          else {
             
             methode = "aus";
             
          }
       // console.log("methode aus body-attr: '"+methode+"'");
          
       }
       
    // Aktuelle und gespeicherte Zeit nehmen
       zeit = new Date().getTime();
       zeitClient = $("body").attr("data-menu-zeit");
       
    // Zwei Sekunden abwarten (Konversation laden)
       if ((!zeitClient) || (zeitClient == "")) { zeitClient = 0; }
       else { zeitClient = zeitClient - (-333); }
       
       if (zeit > zeitClient) {
          
       // Animation vorbreiten
          if (methode == "an") {
                
             methode_neu = "aus";
             left_neu = "0%";
             breite_neu = "60%";
          // console.log("neue methode (an): '"+methode+"'");
                
          }
          else {
             
             methode_neu = "an";
             left_neu = "-40%";
             breite_neu = "100%";
          // console.log("neue methode (aus): '"+methode+"'");
             
          }
          
       // Animieren
          $("#seite > #menu").animate({ right: left_neu }, 300);
          $("#seite .sk-logo").animate({ width: breite_neu }, 300);
          $("body").attr("data-menu", methode_neu);
          
       // Button einblenden
          window.setTimeout(function() { $("#start").fadeIn(300); }, 300);
          
       // Zeit speichern
          $("body").attr("data-menu-zeit", zeit);
          
       }
       
    }
    
 // Konsolen-Meldung ausgeben
    function konsolen(b) {
       
       console.log('> '+b);
       
    }
    
 // Cookies
    function cookies(params) {
       
       parameter = params.split(",");
       var id =   parameter[0];
       var name = daten["cookie"][parameter[0]];
       var wert = parameter[1];
       var update = "";
       
       Cookies.set(name, wert, { expires: 365 }); // 1 Jahr
    // console.log("Cookie '"+name+"' gesetzt: "+wert);
       
       if      (id == "vorname")  { update = { givenName: wert }; }
       else if (id == "nachname") { update = { surname:   wert }; }
       else if (id == "email")    { update = { email:     wert }; }
       else              { update = { properties: { id: wert } }; }
       window.Smooch.updateUser(update);
    // console.log("Cookies: Smooch-User '"+id+"' Info: "+wert);
       
       $("."+id).val(wert);
       $("#menu #"+id).trigger("change");
       
    }
    