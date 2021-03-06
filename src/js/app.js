
import IMask from 'imask';
import { Validation, ValidationUI } from 'bunnyjs/src/Validation';
import { validationConfig } from './validation/ValidationConfig';
import HelperFunctions from './utils/helperFunctions';
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
            cnpj:{
                mask: [
                    {
                        mask: '00.000.000/0000-00',
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
            },
            cep:{
                mask: [
                    {
                        mask: '00000-000',
                        lazy: true,
                    },
                ]
            }
        },

        this.sections =[
            '#pessoa-fisica',
            '#geral',
            '#endereco-faturamento',
            "#payment-inf"
        ];

        this.form = '';

        this.errorFound = false;
        this.isValid = [false];
    }

    initialize (){
        HelperFunctions.getMinHeigthTabs();
        
        this.setFieldMasks();
        let cardModal = new CardModal({
            modal: '#modal-credit-card',
            card:{
                outputNumber:'.outputNumber',
                outputName:'.outputName',
                outputExpDate:'.outputExpDate',
                outputBrand:'.outputBrand',
                outputCvv:'.outputCvv'
            },
            mask:{
                number:'#creditCard',
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
            let id = `#${mask}`,
                fields = document.querySelectorAll(id);
            fields.forEach((field)=>{
                new IMask(field, this.fieldMasks[mask]);
            });
        });
    }

    initializeValidation(){
        //let _this = this;
        this.form = document.querySelector('#checkout-form');
        
        ValidationUI.config = validationConfig.defaultConfig;
        Validation.lang = validationConfig.language;
        validationConfig.validationFunctions.map((func, index) =>{
            Validation.validators[Object.keys(func)] = func[Object.keys(func)];
        });
        //Validation.init(form, true);
        document.querySelectorAll('#numero').forEach(numberField =>{
            new IMask(numberField, {mask: Number, min: 1, max: 10000});
        });
       
        this.setEvents();
    }

    setEvents(){
       this.setChangeTabEvent();
       this.setCheckboxShowArea();
       this.formSubmit();
       this.selectPaymentMethod();
       this.form.querySelectorAll('input').forEach((elem)=>{
            this.blurInput(elem);
            if(elem.id ==="cep"){
                this.cepFocus(elem);
            }
       });
    }

    setChangeTabEvent(){
        
        window.onresize = function(){
            HelperFunctions.getMinHeigthTabs();
        };

        document.querySelectorAll('.select-abas .card-header a')
        .forEach((aba, index) =>{
            aba.addEventListener('click', function(e){
                e.preventDefault();
                let panelId = this.getAttribute('href');

                this.parentNode.setAttribute('class','card-header first animation-change-cardHeader');
                document.querySelector(`${panelId}`).setAttribute('class', `aba ${panelId.substr(1)} first animation-change-card`);
                
                setTimeout(()=>{
                    this.parentNode.classList.remove('animation-change-cardHeader');
                    document.querySelector(`${panelId}`).classList.remove('animation-change-card');
                }, 501);

                let countSibbling = 0;

                for (let sibling of this.parentNode.parentNode.children) {
                    if (sibling.children[0] !== this){
                        let siblingId = sibling.children[0].getAttribute('href');

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
        let _this = this;
        document.querySelectorAll('input[type="checkbox"][target]')
        .forEach((checkbox, index) =>{
            checkbox.addEventListener('change', function(e){
                
                let target = this.getAttribute('target').split(', ');
                let show = document.querySelector(target[0]);

                if(target.length > 1){
            
                    let hide = document.querySelector(target[1]);
                    
                    if(HelperFunctions.isChecked(this)){
                        if(HelperFunctions.isInputOrSelect(show)){
                            show.removeAttribute('disabled');
                        }
                        else{
                            show.classList.remove('hide');
                            show.querySelectorAll('input').forEach(function(elem){
                                if(HelperFunctions.isRequired(elem)) elem.setAttribute('required', 'true');
                            });

                            if(this.id === 'pessoaJuridica'){
                                let compradorIgualDestinatario = document.querySelector('#compradorIgualDestinatario');
                                
                                HelperFunctions.hideCompradorIguaDestinatario(compradorIgualDestinatario);
                            }
                        }

                        if(HelperFunctions.isInputOrSelect(hide)){
                            hide.setAttribute('disalbed','true');
                        }
                        else{
                            hide.classList.add('hide');
                            hide.querySelectorAll('input').forEach(function(elem){
                                HelperFunctions.clearInput(elem);
                            });
                            //Validation.validateSection(hide).then(result => {console.log(`clear validation on ${hide.id}`)});
                        }
                        HelperFunctions.setSections.bind(_this)(`#${show.id}`, `#${hide.id}`);
                    }

                    else{
                        if(HelperFunctions.isInputOrSelect(show)){
                            show.setAttribute('disabled', 'true');
                        }
                        else{
                            show.classList.add('hide');
                            show.querySelectorAll('input').forEach(function(elem){
                               HelperFunctions.clearInput(elem);
                            });
                            if(this.id === 'pessoaJuridica'){
                                let compradorIgualDestinatario = document.querySelector('#compradorIgualDestinatario');
                                
                                if(compradorIgualDestinatario.getAttribute('disabled') !== null){
                                    compradorIgualDestinatario.removeAttribute('disabled');
                                }
                            }
                        }

                        if(HelperFunctions.isInputOrSelect(hide)){
                            hide.removetAttribute('disalbed');
                        }
                        else{
                            hide.classList.remove('hide');
                            hide.querySelectorAll('input').forEach(function(elem){
                                if(HelperFunctions.isRequired(elem)) elem.setAttribute('required', 'true');
                            });
                        }
                        HelperFunctions.setSections.bind(_this)(`#${hide.id}`, `#${show.id}`);
                    }
                }

                else{
                    if(HelperFunctions.isChecked(this)){
                        if(HelperFunctions.isInputOrSelect(show)){
                            show.setAttribute('disabled', 'true');

                            if(HelperFunctions.isRequired(show)){
                                HelperFunctions.clearInput(show, 'disabled');
                            }
                        }
                        else{
                            show.classList.add('hide');
                            
                            if(show.querySelectorAll('input').length > 0){
                                
                                show.querySelectorAll('input').forEach(function(elem){
                                    if(HelperFunctions.isRequired(elem)) elem.removeAttribute('required');
                                });
                                //Validation.validateSection(show).then(result => {console.log(`clear validation on ${show.id}`)})
                            }
                            HelperFunctions.setSections.bind(_this)(undefined, `#${show.id}`);
                        }
                    }

                    else{
                        if(HelperFunctions.isInputOrSelect(show)){
                            show.removeAttribute('disabled');
                            if(HelperFunctions.isRequired(show)){
                                HelperFunctions.clearInput(show);
                                show.setAttribute('required', true);
                            }
                        }
                        else{
                            show.classList.remove('hide');
                            if(show.querySelectorAll('input').length > 0){
                                show.querySelectorAll('input').forEach(function(elem){
                                    if(HelperFunctions.isRequired(elem)){
                                        HelperFunctions.clearInput(elem);
                                        elem.setAttribute('required', true);
                                    }
                                });
                            }
                        }
                        HelperFunctions.setSections.bind(_this)(`#${show.id}`, undefined);
                    }
                }
                
            });
        });
    }

    formSubmit(){
        document.querySelectorAll('.enviar').forEach((btn)=>{
            btn.addEventListener('click', (e)=>{
                e.preventDefault();
                this.validateSections();
            });
        });
    }

    validateSections(){
        let ValidateAll = [];
        this.sections.forEach((section)=>{
           
            this.form.querySelector(section).querySelectorAll('input').forEach((elem)=>{
                if(HelperFunctions.isRequired(elem) && !HelperFunctions.isDisabled(elem)) elem.setAttribute('required', 'true');
            });

            if(section === "#endereco-faturamento"){
                let endEntrega = document.querySelector('#enderecoEntrega'),
                    compradorIgualdestinatario = document.querySelector('#compradorIgualDestinatario'),
                    pessoaJuridica = document.querySelector('#pessoaJuridica'); 

                if(HelperFunctions.isChecked(endEntrega)){
                    HelperFunctions.copySectionFields({
                        from:{
                            section:"#endereco-faturamento",
                            class: "Faturamento"
                        },
                        to:{
                            section:"#endereco-entrega",
                            class: "Entrega"
                        }
                    })
                }
            }

           ValidateAll.push(Validation.validateSection(this.form.querySelector(section)));
        });
        Promise.all(ValidateAll)
        .then((result)=>{
            this.isValid = [];

            try {
                result.forEach((secao)=>{
                    if (secao === true) {
                        this.isValid.push(true);
                    }
                    else{
                        if(!this.errorFound){
                            throw secao;               
                        }
                        else{
                            this.errorFound = true;
                        }
                        this.isValid.push(false);
                    }
                });

                if(!this.isValid.includes(false)){
                    console.log(HelperFunctions.serializeToJson(this.form));
                }
            }
            catch(secao){
                let abaError = HelperFunctions.getParentSelector(secao[0], '.aba');
                if(abaError){
                    let selectedTab = abaError.className.split(' ').pop(),
                        aba = document.querySelector(`.select-abas .${selectedTab} a`);
                    HelperFunctions.linearSimpleAnim(300, secao[0], 'top');
                    aba.dispatchEvent(new Event('click'));
                }       
                else{
                    this.form.querySelector('.modal-trigger').dispatchEvent(new Event('click', {
                        bubbles: true,
                        view: window
                    }));
                }
            }

        }).catch((err)=>{
            console.warn(err);
        })

    }

    blurInput(input){
        input.addEventListener('blur', (e)=>{
            if(Validation.validators[e.target.id]){
                if(HelperFunctions.isRequired(e.target)){
                    input.setAttribute('required', 'true');
                    Validation.checkInput(e.target)
                    .catch((err)=>{
                        console.warn(err);
                    })
                }
            }
        });
    }

    cepFocus(elem){
        elem.addEventListener('focus', function(){
            if(this.getAttribute('filled')!==null){
                this.removeAttribute('filled');
            }
        })
    }

    selectPaymentMethod(){
        document.querySelectorAll('.pay-methods .custom-tab a').forEach((elem, idx)=>{
            elem.addEventListener('click', (event)=>{
                event.preventDefault();
              
                let selectedPayMethod = elem.getAttribute('tab');
                selectedPayMethod = selectedPayMethod.substring(1);
                document.querySelector("#selectedPayMethod").value = selectedPayMethod;//.classList.remove('required');
                for (let sibling of elem.parentNode.parentNode.children) {
                    if(sibling.children[0] !== elem){
                        if(sibling.classList.contains('active')) sibling.classList.remove('active');
                    }
                    else{

                        let id = sibling.children[0].getAttribute('tab');
                        let activeTab = document.querySelector(`.payment-desciption ${id}`);
                        activeTab.classList.add('active');
                        activeTab.parentNode.classList.add('active');

                        if(id === "#credit-card"){
                            HelperFunctions.setSections.bind(this)('#modal-credit-card', undefined);
                            this.form.querySelector('#modal-credit-card').querySelectorAll('input, select').forEach((elem)=>{
                                if(HelperFunctions.isRequired(elem) && !HelperFunctions.isDisabled(elem)) elem.setAttribute('required', 'true');
                            });
                        }
                        else{
                           
                            HelperFunctions.setSections.bind(this)(undefined, '#modal-credit-card');
                            this.form.querySelector('#modal-credit-card').querySelectorAll('input').forEach(function(elem){
                                HelperFunctions.clearInput(elem);
                            });
                        }

                        if(!sibling.classList.contains('active')) sibling.classList.add('active');
                        
                        for (let sibling of activeTab.parentNode.children) {
                            if(sibling !== activeTab){
                                if(sibling.classList.contains('active')) sibling.classList.remove('active');
                            }
                        }
                    }
                }
            });
        });
    }


};

(function(){
    var checkout = new CheckoutPage();
    checkout.initialize();
})();
