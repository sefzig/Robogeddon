'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({
    
    processing: {
        
        prompt: (bot) => bot.say('[TechnikBot] Nicht so schnell bitte!'),
        
        receive: () => 'processing'
    },

    start: {
        
        receive: (bot) => {
            
            return bot.say('[TechnikBot] Hallo, ich bin Cynthia, Technik-Bot.')
            .then(() => bot.say('[TechnikBot] // Node.js funktioniert'))
            .then(() => 'askName');
            
        }
        
    },

    askName: {
        
        prompt: (bot) => bot.say('[TechnikBot] Wie heissen Sie?'),
        
        receive: (bot, message) => {
            
            const name = message.text;
            
            return bot.setProp('name', name)
            .then(() => bot.say('[TechnikBot] Prima, '+name+'.'))
            .then(() => bot.say('[TechnikBot] // Skript funktioniert'))
            .then(() => 'testBefehl');
            
        }
        
    },

    testBefehl: {
        
        prompt: (bot) => bot.say('[TechnikBot] Bitte sagen Sie diesen --Befehl!'),
        
        receive: (bot, message) => {
            
            var befehle = message.text;
            befehle = befehle.replace(/--/g, "");
            befehle = befehle.replace(/ /g, "");
            
            var befehl = befehle;
            befehl = befehl.toUpperCase();
            
            const befehlen = befehle;
            
            if (befehl == "BEFEHL") {
               
               return bot.setProp('befehl', befehlen)
               .then(() => bot.say('[TechnikBot] Danke.'))
               .then(() => bot.say('[TechnikBot] // Befehle funktionieren'))
               .then(() => 'testMenu');
            	
            }
            
            else {
               
               return bot.setProp('befehl', befehlen)
               .then(() => bot.say('[TechnikBot] Nicht der --Befehl, aber egal.'))
               .then(() => bot.say('[TechnikBot] // Befehle funktionieren'))
               .then(() => 'testMenu');
            	
            }
            
        }
        
    },

    testMenu: {
        
        prompt: (bot) => bot.say('[TechnikBot] Bitte sagen Sie --Menü!'),
        
        receive: (bot, message) => {
            
            const menu = message.text;
            
            return bot.setProp('menu', menu)
            .then(() => bot.say('[TechnikBot] [Javascript:menu(an)] Menü umgeschaltet.'))
            .then(() => bot.say('[TechnikBot] // Menü funktioniert'))
            .then(() => 'testStil');
            
        }
        
    },

    testStil: {
        
        prompt: (bot) => bot.say('[TechnikBot] Welchen Stil wollen Sie? --Tag oder --Nacht?'),
        
        receive: (bot, message) => {
            
            var stile = message.text;
            stile = stile.replace(/--/g, '');
            stile = stile.replace(/ /g, '');
            const stil = stile;
            
            return bot.setProp('stil', stil)
            .then(() => bot.say('[TechnikBot] [Javascript:stil('+stil+')] Stil: '+stil+'.'))
            .then(() => bot.say('[TechnikBot] // Stile funktionieren'))
            .then(() => 'testAbgeschlossen');
            
        }
        
    },

    testAbgeschlossen: {
    	
        prompt: (bot) => bot.say('[TechnikBot] Bitte sagen Sie nochmal etwas!'),
        
        receive: (bot, message) => {
            
            return bot.getProp('name')
            .then((name) => bot.say('[TechnikBot] Ich erinnere mich an Sie, '+name+'.'))
            .then(() => bot.say('[TechnikBot] // Props funktionieren'))
            .then(() => bot.say('[TechnikBot] @sefzig, alles läuft.'))
            .then(() => bot.say('[AndreasSefzig] Danke Cynthia.'))
            .then(() => bot.getProp('name'))
            .then((name) => bot.say('[AndreasSefzig] Und Ihnen viel Spaß, '+name+'!'))
            .then(() => 'finish');
            
        }
        
    },

    finish: {
    	
        receive: (bot, message) => {
            
            return bot.getProp('name')
            .then((name) => bot.say('[TechnikBot] '+name+', mehr als Testen kann ich nicht...'))
            .then(() => 'finish');
            
        }
        
    }
    
});