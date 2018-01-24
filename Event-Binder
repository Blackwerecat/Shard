(function () {
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
    };
    window.EVENTS = EVENTS;
})();
