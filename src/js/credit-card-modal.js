

export default class CardModal {
    constructor(config){
        this.modal = config.modal,

        this.card ={
            outputNumber: config.card.outputNumber,
            outputName: config.card.outputName,
            outputExpDate: config.card.outputExpDate,
            outputBrand: config.card.outputBrand,
            outputCvv: config.card.outputCvv
        },

        this.mask={
            number: config.mask.number,
            name: config.mask.name,
            expDate: config.mask.expDate,
            cvv: config.mask.cvv

        }

        this.numberDots = '<i class="material-icons">lens</i><i class="material-icons">lens</i><i class="material-icons">lens</i><i class="material-icons">lens</i>';
        
        this.fieldMasks = {
            number:{
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
            expdate:{
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
                    },
                    {
                        mask: '0000',
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
        this.setEvents();
        M.FormSelect.init(document.querySelector(this.modal).querySelector('.select'));
        document.querySelector(this.card.outputNumber).innerHTML = `${this.numberDots} ${this.numberDots} ${this.numberDots} ${this.numberDots}`;
        document.querySelector(this.card.outputName).innerHTML = "Nome Sobrenome";
        document.querySelector(this.card.outputExpDate).innerHTML = "00/00";
        this.setFieldMasks();
        // new IMask(document.querySelector(this.mask.number), this.fieldMasks.cardNumber);
        // new IMask(document.querySelector(this.mask.expDate), this.fieldMasks.expDate);
        // new IMask(document.querySelector(this.mask.cvv), this.fieldMasks.cvv);
    }

    setEvents(){
        let _this = this;
        M.Modal.init(document.querySelector(this.modal),{
            onOpenStart:()=>{
                document.querySelector('body').classList.add('chk-modal-opened');
            },

            onCloseEnd: ()=>{
                document.querySelector('body').classList.remove('chk-modal-opened');
            }
        });
        

        document.querySelector(this.mask.number).addEventListener('keyup', function(){
            //debugger;

            var number = this.value.replace(/(\s|\_)/g, "");

            if(number === null || number === ""){
                number = `${_this.numberDots} ${_this.numberDots} ${_this.numberDots} ${_this.numberDots}`;
                //$(_this.card.outputNumber).html(number);
                document.querySelector(_this.card.outputNumber).innerHTML = number;
            }
            else{
                document.querySelector(_this.card.outputNumber).innerHTML = this.value;
            }

            Object.keys(_this.brands).map((idx)=>{
                var matched = number.match(_this.brands[idx]);
                if(matched !== null){
                    document.querySelector(_this.card.outputBrand).setAttribute('class', 'outputBrand');
                    document.querySelector(_this.card.outputBrand).classList.add(idx);
                }
            })
        });

        document.querySelector(_this.mask.name).addEventListener('keyup', function(){
            var name =  this.value;
            if(name.length > 0){
                document.querySelector(_this.card.outputName).innerHTML = name;
            }
            else{
                document.querySelector(_this.card.outputName).innerHTML = "Nome Sobrenome";
            }

           
        });

        document.querySelector(_this.mask.expDate).addEventListener('keyup', function(){
            var expDate = this.value;
            document.querySelector(_this.card.outputExpDate).innerHTML = expDate;
        });

        document.querySelector(_this.mask.cvv).addEventListener('focus', function(){
            if(document.querySelector(_this.modal).querySelector('.card-content').className.indexOf('verso') === -1 ){
                document.querySelector(_this.modal).querySelector('.card-content').classList.add('verso');
            }
        });

        document.querySelector(_this.mask.cvv).addEventListener('blur', function(){
            if(document.querySelector(_this.modal).querySelector('.card-content').className.indexOf('verso') !== -1 ){
                document.querySelector(_this.modal).querySelector('.card-content').classList.remove('verso');
            }
        });

        document.querySelector(_this.mask.cvv).addEventListener('keyup', function(){
            var cvv = this.value;
            document.querySelector(_this.card.outputCvv).innerHTML = cvv;
        });
    }

    setFieldMasks(){
        Object.keys(this.fieldMasks).map((mask)=>{
            let id = `#mask${mask}`;
           new IMask(document.querySelector(id), this.fieldMasks[mask]);
        });
    }

};
