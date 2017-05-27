var templatesPath = "templates/";
var widgetsHandler = "ssi/widgets.php";

head.load(["libs/prototype.js", "libs/transparency.js", "libs/markdown.js", "libs/form.js", "libs/sortable.js", "libs/ifb.js"], function() {
	"use strict";
	loadTemplates(function(error) {
		console.log("Error: ", error);
	});
});

function loadTemplates(callbackOnError, parentTag) {
	"use strict";
	
	var loadTemplatesAgain = false;
	var values, i;
	
	if (parentTag === undefined) {
		values = $$(".template");
	} else {
		values = parentTag.select(".template");
	}

	for (i = 0; i < values.length; i += 1) {
		if (values[i].dataset["handled"] === undefined || values[i].dataset["handled"] == "false") {
			handleTemplateLoading(values[i], callbackOnError);
		}
	}
}

function handleTemplateLoading(tag, callbackOnError) {
	if (tag.dataset["template"] !== undefined) {
		new Ajax.Request(templatesPath + tag.dataset["template"], {
			method: "get",
			onFailure: callbackOnError,
			onSuccess: function(transport) {
				var response = transport.responseText || "";
				
				if (tag.dataset["template"].endsWith(".md")) {
					tag.innerHTML = markdown.toHTML(response);
				} else {
					tag.innerHTML = response;
				}

				if (tag.dataset["onload"] !== undefined) {
					eval(tag.dataset["onload"]);
				}

				handleWidgetLoading(tag, callbackOnError);
				loadTemplates(callbackOnError, tag);
				
				tag.dataset["handled"] = true;
			}
		});
	} else {
		handleWidgetLoading(tag, callbackOnError);
	}
}

function reloadWidgets(callbackOnError) {
	"use strict";
	
	var values = $$(".template");
	var i;
	
	for (i = 0; i < values.length; i++) {
		handleTemplateLoading(values[i], callbackOnError);
	}
}

function handleWidgetLoading(tag, callbackOnError) {
	if (tag.dataset["widget"] !== undefined) {
		params = {
			name: tag.dataset["widget"]
		};
	
		if (tag.dataset["widgetParams"] !== undefined) {
			eval(tag.dataset["widgetParams"]);
		}

		new Ajax.Request(widgetsHandler, {
			method: "post",
			parameters: params,
			onFailure: callbackOnError,
			onSuccess: function(transport) {
				var data = JSON.parse(transport.responseText);
				Transparency.render(tag, data);
				
				if (tag.dataset["widgetOnParse"] !== undefined) {
					eval(tag.dataset["widgetOnParse"]);
				}
			}
		});
		
		if (tag.dataset["onload"] !== undefined) {
			eval(tag.dataset["onload"]);
		}
	}
}

function reloadTemplate(container, to) {
    console.log("reloadTemplate");
    console.log(container);
    console.log(container.parentNode);
    
    if (to !== undefined) {
        container.dataset["template"] = to;
    }

    container.dataset["handled"] = false;
    container.innerHTML = "";

    loadTemplates(null, container.parentNode);
}
