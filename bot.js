// ==UserScript==
// @name         Shard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateUrl    https://raw.githubusercontent.com/Blackwerecat/Shard/master/bot.js
// @downloadUrl  https://raw.githubusercontent.com/Blackwerecat/Shard/master/bot.js
// @description  Shard Bot
// @author       You
// @match        https://hack.chat/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const EVENTS = {
        bindings:{},
        bind:function(event,func){
            if (this.bindings[event])
                this.bindings[event].push(func);
            else
                this.bindings[event]=[func];
            return this.bindings[event]?event+":"+this.bindings[event].length-1:null;
        },
        emit:function(event,payload){
            if(this.bindings[event]) {
                for (let i in this.bindings[event]) {
                    let func = this.bindings[event][i];
                    setTimeout(() => (func(payload)),0);
                }
            }
        },
        unbind:function(id){
            var event = id.split(':')[0];
            var index = id.split(':')[1];
            if (event && index) {
                this.bindings[event] = this.bindings[event].splice(index,index);
            }
        }
    }; //Event binder

    const Shard = { //Shard bot
        init: function() {
            console.log("Setting up Shard...");
            console.log("Checking setup...");
            let check_list = ['send_message'];
            let flag = false;
            for (let check in check_list) {
                if (!this.find(check_list[check]))
                    flag=true;
            }
            if (flag)
                console.log("Could not start Shard");
            else {
                console.log("Starting Shard...");
                EVENTS.bind('on-message',this.parse.bind(this)); //Extra .bind to keep this bound to Shard
            }
        }, //Initialization and debugging
        find: function(name) {
            if (this[name]) {
                console.log("Found "+name);
                return this[name];
            }else {
                console.log("Could not find "+name);
                return undefined;
            }
        },

        commands: {
            '-echo':{auth:'user',run:function(payload) {
                this.send_message({text:payload.args.join(' '),room:payload.origin.room});
            }},
            '-setrank':{auth:'admin',run:function(payload) {
                let name = payload.args[0];
                let rank = payload.args[1];
                if (this.setRank(name,rank))
                    this.send_message({text:"Set rank of "+name+" to "+rank,room:payload.origin.room});
                else
                    this.send_message({text:"Failed to set rank of "+name+" to "+rank,room:payload.origin.room});
            }},
            '-mute':{auth:'admin',run:function(payload) {
                let nick = payload.args[0];
                let time = payload.args[1];
                let i = this.length;
                this.muted.push(nick);
                setTimeout(() => {this.muted = this.muted.splice(i,i); this.send_message({text:nick + " has been unmuted",room:payload.origin.room});},time*1000);
                this.send_message({text:"Muted "+nick+" for "+time+" seconds",room:payload.origin.room});
            }},
            '-help':{auth:'user',run:function(payload) {
                this.send_message({text:["Type one of the commands below to use Shard",
                                         "User Commands:",
                                         "-help                  : Shows the help page",
                                         "-echo <msg>            : Echos the message",
                                         "",
                                         "Admin Commands:",
                                         "-mute <time>           : Prevents user from using Shard for <time> seconds",
                                         "-setrank <nick> <rank> : Sets the rank of a nick"].join('\n'),room:payload.origin.room});
            }}
        },

        muted: [],
        ranks: {}, //Autherization
        hierarchy: ['user','admin'], //muted is below everything >:D
        setRank: function(name,rank) {
            if (this.hierarchy.includes(rank)){
                this.ranks[name]=rank;
                return rank;
            }else
                return undefined;
        },
        isAutherized: function(rank,auth) {
            let rank_val = this.hierarchy.indexOf(rank);
            let auth_val = this.hierarchy.indexOf(auth);
            if (rank_val>-1 && auth_val>-1)
                return rank_val>=auth_val;
            else
                return undefined;
        },

        parse: function(payload) {
            let nick = payload.nick;
            let text_array = payload.text.split(' ');
            let cmd = text_array.shift();
            if (cmd.startsWith('-')) {//prefix
                let command = this.commands[cmd];
                if (command) {
                    if (!this.ranks[nick]) // if the user doesn't have a rank
                        this.ranks[nick] = 'user';
                    if (!this.muted.includes(nick) && this.isAutherized(this.ranks[nick],command.auth))
                        command.run.bind(this)({args:text_array,origin:payload});
                    else
                        this.send_message({text:"You do not have permission to use this command",room:payload.room});
                }else
                    this.send_message({text:"Could not find command: "+cmd,room:payload.room});
            }
        }
    };
    window.EVENTS = EVENTS; //global
    window.shard = Shard;
})();
