<script>

    function parseJson(str){
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                return obj;
            } catch(e) {
                console.log('error：'+str+'!!!'+e);
                return str;
            }
        }
        return str;
    }

    function getDomText(css, DOM){
        let arr_str=css.split('::'),
            str_css=css,
            str_prop='';
        if(arr_str.length===2){
            str_css=arr_str[0];
            str_prop=arr_str[1];
        }
        let doc=DOM.querySelector(str_css);
        return {
            text(name=''){
                let str_default=name;
                if(doc) str_default=doc.innerText;
                if(str_prop && doc){
                    str_default=doc.getAttribute(str_prop);
                }
                return str_default;
            }
        }
    }

    function parseDom(string, isHtml=false){
        let objHtml=document.createElement('html'),
            objDiv=document.createElement('div'),
            find=function(){
                console.log(this);   
            };
        if(isHtml){
            objHtml.innerHTML=string;
            return objHtml;
        }else{
            objDiv.innerHTML=string;
            return objDiv;
        }
    }

    function getBody(content){
        const REG_BODY=/<body[^>]*>([\s\S]*)<\/body>/;
        let result = REG_BODY.exec(content);
        if(result && result.length === 2)
            return result[1];
        return content;
    }

    export default {
        getDomText,
        parseDom,
        parseJson
    }
</script>