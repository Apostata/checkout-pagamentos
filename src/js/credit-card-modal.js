 import {validationConfig} from './validation/ValidationConfig';
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
    }

    initialize (){
        this.setEvents();
        M.FormSelect.init(document.querySelector(this.modal).querySelector('.select'));
        document.querySelector(this.card.outputNumber).innerHTML = `${this.numberDots} ${this.numberDots} ${this.numberDots} ${this.numberDots}`;
        document.querySelector(this.card.outputName).innerHTML = "Nome Sobrenome";
        document.querySelector(this.card.outputExpDate).innerHTML = "00/00";
        this.setFieldMasks();
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

            let number = this.value.replace(/[^\d]+/g,'');
            if(number === null || number === ""){
                number = `${_this.numberDots} ${_this.numberDots} ${_this.numberDots} ${_this.numberDots}`;
                document.querySelector(_this.card.outputNumber).innerHTML = number;
            }
            else{
                document.querySelector(_this.card.outputNumber).innerHTML = this.value;
            }
            if(number.length >= 15){
                validationConfig.validationFunctions[3].creditCard(this, _this.setBrand.bind(_this)).catch((e)=>{});
            }
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
            let id = '';
            mask !== 'number' ? id = `#mask${mask}`: id = "#creditCard"; 
           new IMask(document.querySelector(id), this.fieldMasks[mask]);
        });
    }

    setBrand(brand){
        document.querySelector(this.card.outputBrand).setAttribute('class', 'outputBrand');
        document.querySelector(this.card.outputBrand).classList.add(brand);
    };

};
