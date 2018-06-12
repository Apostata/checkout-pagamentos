
import IMask from 'imask';
import { Validation, ValidationUI } from 'bunnyjs/src/Validation';
import { validationConfig } from './validation/ValidationConfig';
import M from 'materialize-css';
window.M = window.Materialize = M;

import CardModal from './credit-card-modal';

export default class CheckoutPage {
    constructor(){
        this.fieldMasks={
            cpf:{
                mask: [
                    {
                        mask: '000.000.000-00',
                        lazy: true,
                    }
                ]
            },
            tel:{
                mask: [
                    {
                        mask: '(00) 0000-0000',
                        lazy: true,
                    },
                    {
                        mask: '(00) 00000-0000',
                        lazy: true,
                    }
                ]
            }
        }
    }

    initialize (){
        this.setFieldMasks();
        let cardModal = new CardModal({
            modal: '#modal1',
            card:{
                outputNumber:'.outputNumber',
                outputName:'.outputName',
                outputExpDate:'.outputExpDate',
                outputBrand:'.outputBrand',
                outputCvv:'.outputCvv'
            },
            mask:{
                number:'#masknumber',
                name: '#maskname',
                expDate:'#maskexpdate',
                cvv:'#maskcvv'
            }
        });
        cardModal.initialize();
        this.initializeValidation();        
    }

    setFieldMasks(){
        Object.keys(this.fieldMasks).map((mask)=>{
            let id = `#${mask}`;
           new IMask(document.querySelector(id), this.fieldMasks[mask]);
        });
    }

    initializeValidation(){
        let form = document.querySelector('#checkout-form');
        let personal = document.querySelector('.personal-inf');
        ValidationUI.config = validationConfig.defaultConfig;
        Validation.lang = validationConfig.language;
        validationConfig.helperFunctions.map((func, index) =>{
            Validation.validators[Object.keys(func)] = func[Object.keys(func)];
        });
        Validation.init(form, true);
    }
};

(function(){
    var checkout = new CheckoutPage();
    checkout.initialize();
})();
