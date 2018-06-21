import axios from 'axios';

export const cardBrands = {
    "jcb": /^(?:2131|1800|35\d{3})\d{11}$/,
    "elo": /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]| 6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8]))[0-9]{10,12}/,
    "discover": /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
    "diners": /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    "hipercard": /^(38[0-9]{17}|60((?!11|11)\d){2}[0-9]{12})$/,
    "amex": /^3[47][0-9]{13}$/,
    "aura": /^50((?!66)\d){2}[0-9]{12,15}$/,
    "mastercard": /^5[1-5][0-9]{14}$/,
    "visa": /^4[0-9]{12}(?:[0-9]{3})?$/,
    
};

const fillAddressFields = (input, data) =>{
    let getParent = function(elem, selector){
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) return elem;
        }
        return null;
    },
    parent = getParent(input, '.addressSection');
    parent.querySelector('[id*=cidade]').value = data.localidade;
    parent.querySelector('label[for*=cidade]').classList.add('active');

    parent.querySelector('[id*=estado]').value = data.uf;
    parent.querySelector('label[for*=estado]').classList.add('active');

    parent.querySelector('[id*=bairro]').value = data.bairro;
    parent.querySelector('label[for*=bairro]').classList.add('active');

    parent.querySelector('[id*=endereco]').value = data.logradouro;
    parent.querySelector('label[for*=endereco]').classList.add('active');

    parent.querySelector('[id*=numero]').focus();
};

const cpf = input => {        
    return new Promise((valid, invalid)=>{
       if(input.id ==='cpf' && input.getAttribute('required') !== null ){
           
            let resto,
                cpf = input.value,
                soma = 0;

            cpf = cpf.replace(/[^\d]+/g, "");
            if(cpf.length < 11){
                invalid();
            }
            else{
                if(cpf.length > 11){
                    invalid();
                }
                else{
                    for(let i=1; i<=9; i++){
                        soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
                    }
                    resto = (soma * 10) % 11;

                    if((resto == 10) || (resto == 11)){
                        resto = 0;
                    }
                    if(resto != parseInt(cpf.substring(9, 10))){
                        invalid();
                    }

                    soma = 0;
                    for(let i = 1; i <= 10; i++){
                        soma = soma + parseInt(cpf.substring(i-1, i))*(12-i);
                    }
                    resto = (soma * 10) % 11;
                    if((resto == 10) || (resto == 11)){
                        resto = 0;
                    }
                    if(resto != parseInt(cpf.substring(10, 11))){
                        invalid();
                    }
                    else{
                        valid();
                    }
                }
            }
        }else{
            valid();
        }
    });
};

const cnpj = input => {
    return new Promise((valid, invalid)=>{
        
        if(input.id ==='cnpj' && input.getAttribute('required') !== null ){
            let cnpj = input.value;

            cnpj = cnpj.replace(/[^\d]+/g,'');
 
            if(cnpj == '') invalid();
             
            if (cnpj.length != 14)
            invalid();
         
            // Elimina CNPJs invalidos conhecidos
            if (cnpj == "00000000000000" || 
                cnpj == "11111111111111" || 
                cnpj == "22222222222222" || 
                cnpj == "33333333333333" || 
                cnpj == "44444444444444" || 
                cnpj == "55555555555555" || 
                cnpj == "66666666666666" || 
                cnpj == "77777777777777" || 
                cnpj == "88888888888888" || 
                cnpj == "99999999999999")
                invalid();
                 
            // Valida DVs
            let tamanho = cnpj.length - 2,
                numeros = cnpj.substring(0,tamanho),
                digitos = cnpj.substring(tamanho),
                soma = 0,
                pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
              soma += numeros.charAt(tamanho - i) * pos--;
              if (pos < 2)
                    pos = 9;
            }

            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
            invalid();
                 
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
              soma += numeros.charAt(tamanho - i) * pos--;
              if (pos < 2)
                    pos = 9;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                  invalid();
                   
            valid();
        }
        else{
            valid();
        }
    });
};

const cep = (input, callback = fillAddressFields) =>{
    return new Promise(function(valid, invalid) {
        if(input.id ==='cep' && input.getAttribute('required') !== null && input.getAttribute('filled') === null && input.value !== '' && input.value.length > 0){
            let req = new XMLHttpRequest(),
                cep = input.value;
            cep = cep.replace(/[^\d]+/g,'');
            let url = `http://viacep.com.br/ws/${cep}/json/`;
                
                
            req.open("GET", url);
            req.onload = function() {
                if (req.status === 200) {
                    input.setAttribute('filled', true);
                    callback(input, JSON.parse(req.response));
                    valid();
                } else {
                    invalid();
                }
            };
    
            req.onerror = function() {
                invalid();
            };
    
            req.send();
        }
        else{
            valid();
        }
    });
}

const creditCard = (input, callback = ()=>{}) =>{
    return new Promise((valid, invalid)=>{
        if(input.id === 'creditCard' && input.getAttribute('required') !== null && input.value !== '' && input.value.length > 0){
            let number = input.value.replace(/[^\d]+/g,'');

            let isValid = Object.keys(cardBrands).filter((idx)=>{
                let matched = number.match(cardBrands[idx]);
                
                if(matched !== null){
                    
                    return idx;
                }
                else{
                   return false;
                }
            });
            if(isValid.length > 0){
                callback(isValid[0]);
                valid();
            }
            else{
                invalid();
            }
        }
        else{
            valid();
        }
    });
}



export const validationConfig = {
    
    language:{
        required: "O campo '{label}' é obrigatório!",
        creditCard: "Número do cartão de crédito inválido",
        cpf: "{label} digite um cpf válido",
        cnpj: "{label} digite um cnpj válido",
        cep: "{label} insira um cep válido",
        email: "'{label}' deve ser um e-mail válido!",
        tel: "'{label}' não é um número válido de telefone!",
        telefone: "'{label}' não é um número válido de telefone!",
        maxLength: "'{label}' precisa ter menos de '{maxLength}' caracteres!",
        minLength: "'{label}' precisa ter mais de '{minLength}' caracteres!",
        maxFileSize: "O tamanho do arquivo precisa ser menor de {maxFileSize}MB, tamanho do arquivo: {fileSize}MB",
        image: "'{label}' deve ser uma imagem (JPG or PNG)",
        minImageDimensions: "'{label}' As dimensões da imagem precisam ser de no mínimo {minWidth}x{minHeight}, dimensões da imagem: {width}x{height}",
        maxImageDimensions: "'{label}' As dimensões da imagem precisam ser de no máximo {maxWidth}x{maxHeight}, dimensões da imagem: {width}x{height}",
        requiredFromList: "Selecione '{label}' da lista",
        confirmation: "'{label}' não é igual a '{originalLabel}'",
        minOptions: "Por favor, selecione ao menos {minOptionsCount} opções!",
    },

    defaultConfig:{
        // div/node class name selector which contains one label, one input, one help text etc.
        classInputGroup: 'input-field',
        // class to be applied on input group node if it has invalid input
        classInputGroupError: 'has-error',
        // label to pick textContent from to insert field name into error message
        classLabel: 'form-label',
        // error message tag name
        tagNameError: 'small',
        // error message class
        classError: 'text-error',
        // query selector to search inputs within input groups to validate
        selectorInput: '[name]'
    
    },


    validationFunctions:[
        {cpf},
        {cnpj},
        {cep},
        {creditCard}
    ]
};
