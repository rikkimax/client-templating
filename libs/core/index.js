var templatesPath = "templates/";
var widgetsHandler = "ssi/widgets.php";

head.load(["libs/prototype.js", "libs/transparency.js", "libs/markdown.js"], function() {
	"use strict";
	loadTemplates();
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
	
	for (i = 0; i < values.length; i++) {
		if (values[i].dataset["handled"] === undefined) {
			handleTemplateLoading(values[i], callbackOnError);
			values[i].dataset["handled"] = true;
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
				
				handleWidgetLoading(tag, callbackOnError);
				loadTemplates(callbackOnError, tag);
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
		values[i].dataset["handled"] = true;
	}
}

function handleWidgetLoading(tag, callbackOnError) {
	if (tag.dataset["widget"] !== undefined) {
		new Ajax.Request(widgetsHandler, {
			method: "post",
			parameters: {
				name: tag.dataset["widget"]
			},
			onFailure: callbackOnError,
			onSuccess: function(transport) {
				var data = JSON.parse(transport.responseText);
				Transparency.render(tag, data);
				
				if (tag.dataset["widgetOnParse"] !== undefined) {
					eval(tag.dataset["widgetOnParse"]);
				}
			}
		});
	}
}