function retrieveJSON(){
	var url = 'localhost:3000/company';
	$.getJSON(url, function(data) {
        return data;
    });
}

populateCompanies = function(company){
	console.log(company);
	var list = document.getElementById('companyList');
	company.forEach(function(){
		var entry = document.createElement('li');
		entry.appendChild(document.createTextNode(company.company));
		list.appendChild(entry);
	}); 
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

