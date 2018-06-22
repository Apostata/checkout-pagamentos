export default class HelperFunctions{
    static isRequired(elem){
        if(elem.classList.contains('required')){
            return true;
        }
        else
        {
            return false;
        }
    }

    static isChecked(checkbox){
        if(checkbox.checked){
            return true;
        }
        else{
            return false;
        }
    }

    static isDisabled(elem){
        if(elem.getAttribute('disabled') !== null){
            return true
        }
        else{
            return false;
        }
    }

    static isInputOrSelect (target){
        if(target.tagName === "INPUT" || target.tagName === "SELECT"){
            return true;
        }
        else{
            return false;
        }
    }

    static clearInput (elem, enableDisable = 'enable'){
        elem.value = '';
        if(enableDisable !== 'disabled'){
            elem.removeAttribute('disabled');
        }
        elem.removeAttribute('required');
        if(elem.type === 'checkbox') elem.checked = false;
        elem.parentNode.classList.remove('has-error');
        if(elem.parentNode.querySelector('.text-error')){
           elem.parentNode.querySelector('.text-error').remove();
        }
    };

    static setSections (show, hide){
        if(show){
            if(!this.sections.includes(show)){
                this.sections.push(show);
            }
        }
        if(hide){
            if(this.sections.includes(hide)){
                let index = this.sections.indexOf(hide);
                this.sections.splice(index, 1);
            }
        }
    }

    static getParentSelector(element, selector){
        for ( ; element && element !== document; element = element.parentNode ) {
            if ( element.matches( selector ) ) return element;
        }
        return null;
    }

    static copySectionFields(opts){
        document.querySelectorAll(`${opts.from.section} input[type=text]`)
        .forEach(elem => {
            let selector = elem.name.replace(opts.from.class, opts.to.class);
            if(elem.value !== ""){
                document.querySelector(opts.to.section).querySelector(`[name=${selector}]`).value = elem.value;
            }
        });
    }

    static  serializeToJson(form){
        var json = {};
        [].forEach.call(form.querySelectorAll('input,select,textarea'), function(el) {
            var key = el.name,
                val = el.value,
                validElem = val != '' && val !== undefined && val !== null && el.hasAttribute('name') && !el.hasAttribute('exclude') && !el.disabled;
           
            if (validElem) {
                if (el.hasAttribute('type') && el.getAttribute('type').toLowerCase() == 'checkbox') {
                    el.checked && ( (Object.prototype.toString.call(json[key]) == '[object Array]' ) ? json[key].push(val) : json[key] = [val]);
                }
                else if (el.hasAttribute('type') && el.getAttribute('type').toLowerCase() == 'radio') {
                    el.checked && (json[key] = val);
                }
                else if (el.nodeName.toLowerCase() == 'select' && el.multiple) {
                    [].forEach.call(el.selectedOptions, function(ele) {
                        ( (Object.prototype.toString.call(json[key]) == '[object Array]' ) ? json[key].push(ele.value) : json[key] = [ele.value]);
                    })
                }
                else {
                    json[key] = val;
                }
            }
        });
        return json;
    }

    static hideCompradorIguaDestinatario(checkbox){
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change'));
        checkbox.setAttribute('disabled', true);
    }

    static getMinHeigthTabs(){
        let minHeight = 0,
            selecetdHeigth = 0,
            maxHeight = window.innerHeight;

        document.querySelectorAll('.aba').forEach((aba)=>{
            if(aba.clientHeight > minHeight){
                minHeight = aba.clientHeight;

                if(aba.clientHeight > maxHeight){
                    selecetdHeigth = maxHeight;
                }
                else{
                    selecetdHeigth = aba.clientHeight;
                }
                
            }
        });
        // document.querySelectorAll('.aba').forEach((aba)=>{
        //     aba.querySelector('.card-content').style.minHeight = `${selecetdHeigth}px`;
        // });
        document.querySelector('#checkout-form').style.minHeight = `${minHeight + 50}px`;
    }

    static getOffset(elem)  {
        var _x = 0;
        var _y = 0;
        while( elem && !isNaN( elem.offsetLeft ) && !isNaN( elem.offsetTop ) ) {
            _x += elem.offsetLeft - elem.scrollLeft;
            _y += elem.offsetTop - elem.scrollTop;
            elem = elem.offsetParent;
        }
        return { top: _y, left: _x };
    }

    static linearSimpleAnim(tempo, elem, direction){
        let valor = HelperFunctions.getOffset(elem)[direction] + HelperFunctions.getOffset(document.documentElement)[direction]
        var running= 0;
        var intervalo = valor / tempo;
        var anim = setInterval(scrollto, 1);
        function scrollto(){
            if(running <= tempo){
                window.scrollBy(0, (intervalo*running));
            }else{

                clearInterval(anim);
            }
            running++;
        }               
    }
};