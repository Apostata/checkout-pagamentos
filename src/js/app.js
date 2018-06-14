
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
        this.setEvents();      
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

    setEvents(){
       this.setChangeTabEvent();
       this.setCheckboxShowArea();
    }

    setChangeTabEvent(){
        document.querySelectorAll('.select-abas .card-header a')
        .forEach((aba, index) =>{
            aba.addEventListener('click', function(e){
                e.preventDefault();
                let panelId = this.getAttribute('href');

                this.parentNode.setAttribute('class','card-header first');
                document.querySelector(`${panelId}`).setAttribute('class', `aba ${panelId.substr(1)} first`);

                let countSibbling = 0;

                for (let sibling of this.parentNode.parentNode.children) {
                    if (sibling.children[0] !== this){
                        let siblingId = sibling.children[0].getAttribute('href');
                        console.log(siblingId);

                        switch (panelId){
                            case '#personal-inf':
                                if(countSibbling === 0){
                                    sibling.setAttribute('class', 'card-header second');
                                    document.querySelector(`${siblingId}`).setAttribute('class', `aba ${siblingId.substr(1)} second`);
                                }
                                else{
                                    sibling.setAttribute('class', 'card-header third');
                                    document.querySelector(`${siblingId}`).setAttribute('class', `aba ${siblingId.substr(1)} third`);
                                }
                            break;
                            case '#delivery-inf':
                                if(countSibbling === 0){
                                    sibling.setAttribute('class', 'card-header third');
                                    document.querySelector(`${siblingId}`).setAttribute('class', `aba ${siblingId.substr(1)} third`);
                                }
                                else{
                                    sibling.setAttribute('class', 'card-header second');
                                    document.querySelector(`${siblingId}`).setAttribute('class', `aba ${siblingId.substr(1)} second`);
                                }
                            break;

                            case '#payment-inf':
                                if(countSibbling === 0){
                                    sibling.setAttribute('class', 'card-header second');
                                    document.querySelector(`${siblingId}`).setAttribute('class', `aba ${siblingId.substr(1)} second`);
                                }
                                else{
                                    sibling.setAttribute('class', 'card-header third');
                                    document.querySelector(`${siblingId}`).setAttribute('class', `aba ${siblingId.substr(1)} third`);
                                }
                            break;

                        }
                        countSibbling++;
                    }
                    
                }
            });            
        });
    }

    setCheckboxShowArea(){
        document.querySelectorAll('input[type="checkbox"][target]')
        .forEach((checkbox, index) =>{
            checkbox.addEventListener('change', function(e){
                
                let target = this.getAttribute('target').split(', ');
                let show = document.querySelector(target[0]);
                if(target.length > 1){
            
                    let hide = document.querySelector(target[1]);
                    
                    if(isChecked(this)){
                        if(isInputOrSelect(show)){
                            show.removeAttribute('disabled');
                        }
                        else{
                            show.style.display = 'block';
                        }

                        if(isInputOrSelect(hide)){
                            hide.setAttribute('disalbed','true');
                        }
                        else{
                            hide.style.display = 'none';
                            show.querySelectorAll('input').forEach(function(elem){
                                elem.value = '';
                                if(elem.type === 'checkbox') elem.checked = false;
                                elem.removeAttribute('disabled');
                            });
                        }
                    }

                    else{
                        if(isInputOrSelect(show)){
                            show.setAttribute('disabled', 'true');
                        }
                        else{
                            show.style.display = 'none';
                            hide.querySelectorAll('input').forEach(function(elem){
                                elem.value = '';
                                if(elem.type === 'checkbox') elem.checked = false;
                                elem.removeAttribute('disabled');
                            });
                        }

                        if(isInputOrSelect(hide)){
                            hide.removetAttribute('disalbed');
                        }
                        else{
                            hide.style.display = 'block';
                        }
                    }
                }
                else{
                    if(isChecked(this)){
                        if(isInputOrSelect(show)){
                            show.setAttribute('disabled', 'true');
                        }
                        else{
                            show.style.display = 'none';
                        }
                    }

                    else{
                        if(isInputOrSelect(show)){
                            show.removeAttribute('disabled');
                        }
                        else{
                            show.style.display = 'block';
                        }
                    }
                }
                
            });
        });


        let isChecked = (checkbox) =>{
            if(checkbox.checked){
                return true;
            }
            else{
                return false;
            }
        };

        let isInputOrSelect = (target)=>{
            if(target.tagName === "INPUT" || target.tagName === "SELECT"){
                return true;
            }
            else{
                return false;
            }
        }
        
    }

};

(function(){
    var checkout = new CheckoutPage();
    checkout.initialize();
})();
