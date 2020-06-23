var queryStr = window.location.search,
	currentRequestModify = 'api.php',
	forms = document.forms,     //search all forms
	formLength = forms.length,  //forms count
	i;

if(formLength > 0) {  //If there is at least one form
	for(i = 0; i < formLength; i++) {  
		var form = forms[i]; //current form
		form.action = currentRequestModify + queryStr; //set action
		if (name = form.name)
			name.required = true;  //set required

		if (phone = form.phone)
			phone.required = true;

		if (country = form.country)
			country.style.display = "none";
	}
}


// var queryStr = window.location.search;
// var currentRequestModify = window.location.pathname+'api.php';

// var action = currentRequestModify+queryStr

// var form1 = document.getElementById('form1');
// if (form1) {
// 	form1.setAttribute("action", action);
// 	form1.setAttribute("method", "post");
// 	form1.querySelector('input[name=phone]').required = true;
// 	form1.querySelector('input[name=name]').required = true;
// }

// var form2 = document.getElementById('form3');
// if (form2) {
// 	form2.setAttribute("action", action);
// 	form2.setAttribute("method", "post");
// 	form2.querySelector('input[name=name]').required = true;
// 	form2.querySelector('input[name=phone]').required = true;
// }

// var country_code_selector = document.getElementById("country_code_selector")
// if (country_code_selector) {
// 	country_code_selector.style.display = "none";
// }
// 	currentRequestModify = window.location.pathname.replace(/\/?([^/\\]+\.[^/\\]+)?$/,"/") + 'api.php',
