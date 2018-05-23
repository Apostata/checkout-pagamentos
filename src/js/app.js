import IMask from 'imask';
import jquery from 'jquery';
import M from 'materialize-css';
window.$ = window.jQuery = jquery;
$.extend(M);

export default class App {
    constructor(){
        this.numberDots = '<i class="material-icons">lens</i><i class="material-icons">lens</i><i class="material-icons">lens</i><i class="material-icons">lens</i>';
        this.fieldMasks = {
            cardNumber:{
                mask: [
                    {
                        mask: '0000 000000 00000',
                        lazy: true,
                    },
                        {
                        mask: '0000 0000 0000 0000',
                        lazy: true,
                    },
                    {
                        mask: '0000000000000000000',
                        lazy: true,
                    }
                ]
            },
            expDate:{
                mask: [
                    {
                        mask: '00/00',
                        lazy: true,
                    }
                ]
            },

            cvv:{
                mask: [
                    {
                        mask: '000',
                        lazy: true,
                    }
                ]
            }
        };

        this.brands = {
            "elo": /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]| 6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8]))[0-9]{10,12}/,
            "discover": /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            "diners": /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            "hipercard": /^(38[0-9]{17}|60((?!11|11)\d){2}[0-9]{12})$/,
            "amex": /^3[47][0-9]{13}$/,
            "aura": /^50((?!66)\d){2}[0-9]{12,15}$/,
            "mastercard": /^5[1-5][0-9]{14}$/,
            "visa": /^4[0-9]{12}(?:[0-9]{3})?$/,
            "jcb": /^(?:2131|1800|35\d{3})\d{11}$/
        };
    }

    initialize (){

        $(document).ready(()=>{
            this.setEvents();
            M.FormSelect.init($('.select')[0]);
            $(".outputNumber").html(`${this.numberDots} ${this.numberDots} ${this.numberDots} ${this.numberDots}`);
            $(".outputName").html("Nome Sobrenome");
            $(".outputExpDate").html("00/00");
            new IMask($('#number')[0], this.fieldMasks.cardNumber);
            new IMask($('#exp-date')[0], this.fieldMasks.expDate);
            new IMask($('#cvv')[0], this.fieldMasks.cvv);
        });
    }

    setEvents(){
        let _this = this;
        M.Modal.init($('.modal')[0]);

        $('#number').on('keyup', function(){
            var number = $(this).val().replace(/(\s|\_)/g, "");

            if(number === null || number === ""){
                number = `${_this.numberDots} ${_this.numberDots} ${_this.numberDots} ${_this.numberDots}`;
                $(".outputNumber").html(number);
            }
            else{
                $(".outputNumber").html($(this).val());
            }

            Object.keys(_this.brands).map((idx)=>{
                var matched = number.match(_this.brands[idx]);
                if(matched !== null){
                    $(".outputBrand").attr('class', 'outputBrand').addClass(idx);
                }
            })
        });

        $('#name').on('keyup', function(){
            var name = $('#name').val();
            if(name.length > 0){
                $(".outputName").html(name);
            }
            else{
                $(".outputName").html("Nome Sobrenome");
            }

           
        });

        $('#exp-date').on('keyup', function(){
            var expDate = $(this).val();
            $('.outputExpDate').html(expDate);
        })

        $('#cvv').on('focus', function(){
            if(!$('.card-content').hasClass('verso')){
                $('.card-content').addClass('verso');
            }
        }).on('blur', function(){
            if($('.card-content').hasClass('verso')){
                $('.card-content').removeClass('verso');
            }
        }).on('keyup', function(){
            var cvv = $(this).val();
            $('.outputCvv').html(cvv);
        });
    }

};

var app = new App();
app.initialize();