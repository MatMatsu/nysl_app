var app = new Vue({
  el: '#app',
  data: {
    entry: [],
    match: [],
    gameSchedule: [],
    meses: ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
    portrait: false,
    landscape: false
  },
  created() {
  	this.fetchData();
  },
  methods: {
    fetchData() {
    	let url = "https://spreadsheets.google.com/feeds/cells/1yJUf_ZGZ5_BMgVweTb4F_IOYdQ_keR-m9-NsgfZMdRA/1/public/full?alt=json";
    	let cacheKey = url;
			let cached = sessionStorage.getItem(cacheKey);

			if (cached !== null) { //SI LO ENCUENTRA EN LA CACHE, CARGA DESDE LOCAL
			  console.log("Fixture en cache");
			  this.entry = JSON.parse(cached).feed.entry;
			  this.fixture(this.entry);
			  this.schedule(this.entry);
			} else {
				fetch(url).then(response => {
				  if (response.ok) {
				  	response.clone().text().then(content => {
			        sessionStorage.setItem(cacheKey, content);
			      })
				  	//Si la respuesta es Ok devuelve la promesa "JSON"
				    return response.json(); 
				  }
				  // En caso de que haya un error con el servidor
				  throw new Error(response.statusText);
				}).then(values => {
					console.log("No esta fixture en cache");
			  	this.entry = values.feed.entry;
					//console.log(this.entry);
			  	this.fixture(this.entry);
			  	this.schedule(this.entry);
			  	// console.log(this.match);
				}).catch(function(error) {
			  	alert(error);
				});
			}
    },
    fixture(entry) {
    	let j = -1;

	    for (let i = 4; i < entry.length; i+=4) {
	    	if(entry[i-4].content.$t == entry[i].content.$t) {
		    	this.match[j].data[1] = new Object();
		    	this.match[j].data[1].equipos = entry[i+1].content.$t;
			    this.match[j].data[1].lugar = entry[i+2].content.$t;
			    this.match[j].data[1].hora = entry[i+3].content.$t;
		    } else {
		    	j++;
		    	this.match[j] = new Object();
		    	this.match[j].dia = entry[i].content.$t;
		    	this.match[j].data = [];
		    	this.match[j].data[0] = new Object();
		    	this.match[j].data[0].equipos = entry[i+1].content.$t;
			    this.match[j].data[0].lugar = entry[i+2].content.$t;
			    this.match[j].data[0].hora = entry[i+3].content.$t;
		    }
	    }
	    //console.log(this.match);
	    
	    for (let i = 0; i < this.match.length; i++) {
	    	this.match[i].diaLetras = this.meses[+this.match[i].dia.slice(0,2) - 1] + " " + this.match[i].dia.slice(3);
	    }
	    //console.log(this.indicador);

    },
    schedule(entry) {
    	let j = -1;
    	let k = 0;

    	for (let i = 4; i < entry.length; i+=4) {
    		if (entry[i].content.$t.slice(0,2) != entry[i-4].content.$t.slice(0,2)) {
    			j++;
    			k = 0;
    			this.gameSchedule[j] = new Object();
    			this.gameSchedule[j].mes = entry[i].content.$t.slice(0,2);
	    		this.gameSchedule[j].data = [];
    		} 
    		this.gameSchedule[j].data[k] = new Object();
    		this.gameSchedule[j].data[k].dia = entry[i].content.$t;
    		this.gameSchedule[j].data[k].equipos = entry[i+1].content.$t;
    		this.gameSchedule[j].data[k].lugar = entry[i+2].content.$t;
    		this.gameSchedule[j].data[k].hora = entry[i+3].content.$t;
    		k++;
    	}
    	//console.log(this.gameSchedule);

    	for (let i = 0; i < this.gameSchedule.length; i++) {
    		this.gameSchedule[i].mes = this.meses[this.gameSchedule[i].mes-1];
    	}
    	//console.log(this.gameSchedule);

    },
	  mapa_partido(event) {
	  	//console.log(event.target.parentNode.attributes[0].nodeValue);
	  	let mapa = ".map_portrait";
	  	if(event.target.parentNode.attributes.length>0 && event.target.parentNode.attributes[0].nodeValue.indexOf("apaisado")>=0) {
	  		mapa = ".map_landscape";
	  	}

	  	switch (event.target.textContent) {
	  		case "North":
	  			document.querySelector(mapa).setAttribute("src", "https://www.google.com/maps/d/embed?mid=1Zm1RoZefy2mbyjvOjQn2q-dE6OtMWqp8&ll=41.907096500000044%2C-87.6461883&z=16");
	  			break;
	  		case "South":
	  			document.querySelector(mapa).setAttribute("src", "https://www.google.com/maps/d/embed?mid=1Zm1RoZefy2mbyjvOjQn2q-dE6OtMWqp8&ll=41.91977680000003%2C-87.65136669999998&z=16");
	  			break;
	  		case "AJ Katzenmaier":
	  			document.querySelector(mapa).setAttribute("src", "https://www.google.com/maps/d/embed?mid=1Zm1RoZefy2mbyjvOjQn2q-dE6OtMWqp8&ll=41.90029240000002%2C-87.62905039999998&z=16");
	  			break;
	  		case "Greenbay":
	  			document.querySelector(mapa).setAttribute("src", "https://www.google.com/maps/d/embed?mid=1Zm1RoZefy2mbyjvOjQn2q-dE6OtMWqp8&ll=41.9138023%2C-87.6378393&z=16");
	  			break;
	  		case "Howard A Yeager":
	  			document.querySelector(mapa).setAttribute("src", "https://www.google.com/maps/d/embed?mid=1Zm1RoZefy2mbyjvOjQn2q-dE6OtMWqp8&ll=41.9232646%2C-87.6629259&z=16");
	  			break;
	  		case "Marjorie P Hart":
	  			document.querySelector(mapa).setAttribute("src", "https://www.google.com/maps/d/embed?mid=1Zm1RoZefy2mbyjvOjQn2q-dE6OtMWqp8&ll=41.929578299999996%2C-87.64589760000001&z=16");
	  			break;
	  		default:
	  			document.querySelector(mapa).setAttribute("src", "https://www.google.com/maps/d/embed?mid=1Zm1RoZefy2mbyjvOjQn2q-dE6OtMWqp8&z=13");
	  			break;
	  	}
	  	//console.log(event.path[1]);
	  }
  }
})