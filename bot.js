// ==UserScript==
// @name         Hack Chat Shard Interface
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hack.chat/*
// @grant        none
// ==/UserScript==

setTimeout(function() {
    'use strict';
    if (!window.opener) {
        const shard_window = open(location.href);
        alert('Shard is loading...');
    }else {
        shard.send_message = function(payload) {
            send({cmd:'chat',text:payload.text});
        };
        shard.init();

        shard.setRank(opener.myNick,'admin'); //set my rank to admin

        var _onmessage = ws.onmessage;
        ws.onmessage = function(payload) {
            let data = JSON.parse(payload.data);
            console.log(data);
            if (data.cmd=='chat' && data.nick != 'Shard') {
                data.room = myChannel;
                EVENTS.emit('on-message',data);
            }

            _onmessage(payload);
        };


        send({cmd:'join',channel:myChannel,nick:'Shard_Bot'});
    }
},2000);
