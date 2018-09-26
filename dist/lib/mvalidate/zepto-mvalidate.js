!function(factory){"function"==typeof define&&define.amd?define(["Zepto"],function(zepto){factory(zepto)}):"function"==typeof define&&define.cmd?define(["Zepto"],function(require,exports,moudles){factory(require("Zepto"))}):factory(Zepto)}(function($){var instance,type=['input:not([type]),input[type="color"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="email"],input[type="file"],input[type="hidden"],input[type="month"],input[type="number"],input[type="password"],input[type="range"],input[type="search"],input[type="tel"],input[type="text"],input[type="time"],input[type="url"],input[type="week"],textarea',"select",'input[type="checkbox"],input[type="radio"]'],allTypes=type.join(","),extend={},fieldTooltip=(instance=null,{show:function(text){if(!instance){var $container=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn">'+text+"</div></div></div>");$container.appendTo($("body")),instance=!0,setTimeout(function(){$container.remove(),instance=!1},1500)}}}),validateField=function(event,options){var log,$field=$(this),status={required:!0,conditional:!0,pattern:!0},errorTipFormat=$.fn.mvalidate.errorTipFormat,fieldValue=$.trim($field.val())||"",fieldValidate=$field.attr("data-validate"),validation=null!=fieldValidate?extend[fieldValidate]:{},fieldRequired=$field.attr("data-required"),fieldPattern=$field.attr("data-pattern")||("regexp"==$.type(validation.pattern)?validation.pattern:/(?:)/),fieldConditional=$field.attr("data-conditional")||validation.conditional,fieldDescription=$field.attr("data-descriptions")||validation.descriptions,fieldDescribedby=$field.attr("data-describedby")||validation.describedby;fieldDescription=$.isPlainObject(fieldDescription)?fieldDescription:options.descriptions[fieldDescription]||{},fieldRequired=""==fieldRequired||(fieldRequired||!!validation.required),"regexp"!=$.type(fieldPattern)&&(fieldPattern=RegExp(fieldPattern)),"true"===fieldRequired&&($field.is(type[0]+","+type[1])?0<!fieldValue.length&&(status.required=!1):$field.is(type[2])&&($field.is("[name]")?0==options.$form.find('[name="'+$field.prop("name")+'"]:checked').length&&(status.required=!1):status.required=field.is(":checked"))),$field.is(type[0])&&(fieldPattern.test(fieldValue)||(fieldRequired?status.pattern=!1:0<fieldValue.length&&(status.pattern=!1))),"undefined"!=fieldConditional&&($.isFunction(fieldConditional)?status.conditional=!!fieldConditional.call($field,fieldValue,options):options.conditional.hasOwnProperty(fieldConditional)&&!options.conditional[fieldConditional].call($field,fieldValue,options)&&(status.conditional=!1)),log=errorTipFormat(fieldDescription.valid),status.required?status.pattern?status.conditional||(log=errorTipFormat(fieldDescription.conditional)):log=errorTipFormat(fieldDescription.pattern):log=errorTipFormat(fieldDescription.required);var $describedShowElem=$('[id="'+fieldDescribedby+'"]');return 0<$describedShowElem.length&&2==options.type&&("keyup"!=event.type&&"change"!=event.type||$describedShowElem.children().length&&$.trim($describedShowElem.text()))&&($describedShowElem.html(log||""),function($field,status,options){if("radio"==$field.prop("type")||"checkbox"==$field.prop("type")){var $fields=options.$form.find('[name="'+$field.prop("name")+'"]');0<$fields.filter(":checked").length?$fields.removeClass("field-invalid"):$fields.addClass("field-invalid")}else status.required&&status.pattern&&status.conditional?$field.removeClass("field-invalid"):$field.addClass("field-invalid")}($field,status,options)),"function"==typeof validation.each&&validation.each.call($field,event,status,options),"function"==typeof options.eachField&&options.eachField.call($field,event,status,options),status.required&&status.pattern&&status.conditional?("function"==typeof validation.valid&&validation.valid.call($field,event,status,options),options.eachValidField.call($field,event,status,options)):(!options.firstInvalid&&options.firstInvalidFocus&&(options.firstInvalid=!0,$field.focus()),1==options.type&&fieldTooltip.show(log),"function"==typeof validation.invalid&&validation.invalid.call($field,event,status,options),"function"==typeof options.eachInvalidField&&options.eachInvalidField.call($field,event,status,options)),status};$.extend($,{mvalidateExtend:function(options){return $.extend(extend,options)}}),$.fn.mvalidate=function(options){var flag,defaults={type:1,validateInSubmit:!0,sendForm:!0,onKeyup:!1,onChange:!0,firstInvalidFocus:!0,conditional:{},descriptions:{},eachField:$.noop,eachValidField:$.noop,eachInvalidField:$.noop,valid:$.noop,invalid:$.noop,namespace:"mvalidate"},opts=$.extend(!0,defaults,options),namespace=opts.namespace;return opts.type=Number(opts.type),opts.firstInvalid=!1,flag=1!=opts.type,this.mvalidateDestroy().each(function(event){var $fields,$form=$(this);$form.is("form")&&((opts.$form=$form).data(namespace,{options:opts}),$fields=$form.find(allTypes),flag&&opts.onKeyup&&$fields.filter(type[0]).each(function(){$(this).on("keyup."+namespace,function(event){validateField.call(this,event,opts)})}),flag&&opts.onChange&&$fields.each(function(){$(this).is(type[1]+","+type[2])&&$(this).on("change."+namespace,function(event){validateField.call(this,event,opts)})}),opts.validateInSubmit&&$form.on("submit."+namespace,function(event){var formValid=!0;opts.firstInvalid=!1,$fields.each(function(){var status=validateField.call(this,event,opts);status.pattern&&status.conditional&&status.required||(formValid=!1)}),formValid?(opts.sendForm||event.preventDefault(),$.isFunction(opts.valid)&&opts.valid.call($form,event,opts)):(event.preventDefault(),event.stopImmediatePropagation(),$.isFunction(opts.invalid)&&opts.invalid.call($form,event,opts))}))})},$.fn.mvalidateDestroy=function(){var $form=$(this),dataValidate=$form.data("mvalidate");return dataValidate&&$form.is("form")&&$.isPlainObject(dataValidate)&&"string"==typeof dataValidate.options.namespace&&$form.removeData(name).find(allTypes).off("."+dataValidate.options.namespace),$form},$.fn.mvalidate.errorTipFormat=function(text){return'<div class="zvalid-resultformat">'+text+"</div>"}});