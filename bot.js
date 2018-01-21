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
        },
        find: function(name) {
            if (this[name]) {
                console.log("Found "+name);
                return this[name];
            }else {
                console.log("Could not find "+name);
                return undefined;
            }
        },
        parse: function(payload) {
            if (payload.text.startsWith('-echo'))
                this.send_message(payload.text.substring(6));
        }
    };
    window.EVENTS = EVENTS; //global
    window.shard = Shard;
})();
