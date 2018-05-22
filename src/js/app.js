window.$ = window.jQuery = jQuery;

export default class App {

   static initialize (){
        $(document).ready(()=>{
            this.setEvents();
        });
    }

    static setEvents(){
        $('.modal').modal();
    }

};

App.initialize();