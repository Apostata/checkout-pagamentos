let cpf = input => {        
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

let cnpj = input => {
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

export const validationConfig ={
    language:{

        required: "O campo '{label}' é obrigatório!",
        cpf: "{label} digite um cpf válido",
        cnpj: "{label} digite um cnpj válido",
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

    helperFunctions:[
        {cpf},
        {cnpj}
    ]
}

