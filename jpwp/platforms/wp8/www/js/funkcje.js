function sort_ul(selector) {
    $(selector).children("li").sort(function(a, b) {
        var upA = $(a).text().toUpperCase();
        var upB = $(b).text().toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
    }).appendTo(selector);


	    $(selector+":visible").listview('refresh');
}

function grid2_maker(left,right){
	var grid=$('<div class=ui-grid-a></div>');
	if (typeof(left)=="object"){
		for (var i=0; i<left.length;i++){
			$(grid).append('<div class=ui-block-a>'+left[i]+'</div>');
			$(grid).append('<div class=ui-block-b>'+right[i]+'</div>');
		}
		return grid;
	} 
	else {
		$(grid).append('<div class=ui-block-a>'+left+'</div>');
		$(grid).append('<div class=ui-block-b>'+right+'</div>');
		return grid;
	}
	
}

//tak samo tylko 3-kolumnowe
function grid3_maker(left,mid,right){
	var grid=$('<div class=ui-grid-b></div>');
	if (typeof(left)=="object"){
		for (var i=0; i<left.length;i++){
			$(grid).append('<div class=ui-block-a>'+left[i]+'</div>');
			$(grid).append('<div class=ui-block-b>'+mid[i]+'</div>');
			$(grid).append('<div class=ui-block-c>'+right[i]+'</div>');
		}
		return grid;
	} 
	else {
		$(grid).append('<div class=ui-block-a>'+left+'</div>');
		$(grid).append('<div class=ui-block-b>'+mid+'</div>');
		$(grid).append('<div class=ui-block-c>'+right+'</div>');
		return grid;
	}
}

function gridsolo_maker(left){
	var grid=$('<div class=ui-grid-solo></div>');
	if (typeof(left)=="object"){
		for (var i=0; i<left.length;i++){
			$(grid).append('<div class=ui-block-a>'+left[i]+'</div>');
		}
		return grid;
	} 
	else {
		$(grid).append('<div class=ui-block-a>'+left+'</div>');
		return grid;
	}
	
}

// function wyslij_email(adres_email){
//             if (window.plugin) {
//                 window.plugin.email.isServiceAvailable(function (isAvailable) {
//                     if (isAvailable) {
//                         window.plugin.email.open({
//                             to: [adres_email],
//                             subject: 'Email testowy',
//                             body: 'To jest email testowy',
//                         });
//                     }
//                     else {
//                         alert("Funkcja niedostępna");
//                     }
//                 });
//             }
// }

// function wyslij_sms(numer){

//         var messageInfo = {
//             phoneNumber: numer,
//             textMessage: "Wpisz tekst wiadomości"
//         };

//         sms.sendMessage(messageInfo, function (message) {
//             console.log("success: " + message);
//         }, function (error) {
//             console.log("code: " + error.code + ", message: " + error.message);
//         });

// }

function podepnij_guziki(){
        $('a.wyslij-email').click(function () {
            var adres_email=$(this).attr('mail');
            if (window.plugin) {
                window.plugin.email.isServiceAvailable(function (isAvailable) {
                    if (isAvailable) {
                        window.plugin.email.open({
                            to: [adres_email],
                            subject: 'Email testowy',
                            body: 'To jest email testowy',
                        });
                    }
                    else {
                        alert("Funkcja niedostępna");
                    }
                });
            }
        });
    // guziki z klasą wyslij-sms będą wysyłały smsa (wow2!) na numer zadany w atrybucie numer (zaskoczenie!)
    $('a.wyslij-sms').click(function () {
        var numer = $(this).attr('numer');

        var messageInfo = {
            phoneNumber: numer,
            textMessage: "Wpisz tekst wiadomości"
        };

        sms.sendMessage(messageInfo, function (message) {
            console.log("success: " + message);
        }, function (error) {
            console.log("code: " + error.code + ", message: " + error.message);
        });
    });

}

function wyswietl_dane(id){
	            $.getJSON('http://pluton.kt.agh.edu.pl/~pszulc/jpwp/get_pacjent_dane.php',
                {"id":id},
                function(response){
                    var data=response.dane;

                    var grid=gridsolo_maker(["Imię: "+data.imie,"Nazwisko: "+data.nazwisko,"PESEL: "+data.pesel,"Nr telefonu: "+data.tel,"Adres E-mail: "+data.email]);
                    $("#dane").attr('pacjent-id',data.id);
                    //alert($("#dane").attr('pacjent-id'));
                    $("#dane .ui-content").html(
                        $(grid)
                    );
                    var link1=$('<a class="wyslij-sms ui-btn ui-icon-comment ui-btn-icon-left" >Wyślij SMS</a>').attr('numer',data.tel);
                    var link2=$('<a class="wyslij-email ui-btn ui-icon-mail ui-btn-icon-left" >Wyślij E-Mail</a>').attr('mail',data.email);

                    $("#dane .ui-content").append(  $('<a class="ui-btn ui-icon-phone ui-btn-icon-left">Zadzwoń</a>').attr('href',"tel:"+data.tel) );                                 
                    $("#dane .ui-content").append( $(link1) );
                    $("#dane .ui-content").append( $(link2) );

                    podepnij_guziki();

                    var wyniki=response.badania;
                    //alert(JSON.stringify(data));
                    $("#lista-badan-pacjenta").html('');
                    if (wyniki){
                        $.each(wyniki,function(index,value){
                            var collapsible={};

                            if(parseFloat(value.wynik)>parseFloat(value.g_kryt) || parseFloat(value.wynik)<parseFloat(value.d_kryt) ){
                            	collapsible=$('<div data-role="collapsible" data-theme="c" data-collapsed-icon="alert" data-expanded-icon="alert"><h1>'+value.nazwa+'</h1></div>');
                                if(parseFloat(value.wynik)>parseFloat(value.g_kryt)){
                                    $(collapsible).append("<p>Wynik przekroczył górną wartość krytyczną "+value.g_kryt+value.jednostka+"</p>");
                                } else {
                                    $(collapsible).append("<p>Wynik przekroczył dolną wartość krytyczną "+value.d_kryt+value.jednostka+"</p>");   
                                }
                        	} else if (parseFloat(value.wynik)>parseFloat(value.g_alert) || parseFloat(value.wynik)<parseFloat(value.d_alert)) {
                        		//alert(value.wynik+" "+value.g_kryt+" "+value.d_kryt);
                            	collapsible=$('<div data-role="collapsible" data-theme="d" data-collapsed-icon="info" data-expanded-icon="info"><h1>'+value.nazwa+'</h1></div>');
                                if(parseFloat(value.wynik)>parseFloat(value.g_alert)){
                                    $(collapsible).append("<p>Wynik przekroczył górną wartość ostrzegawczą "+value.g_alert+value.jednostka+"</p>");
                                } else {
                                    $(collapsible).append("<p>Wynik przekroczył dolną wartość ostrzegawczą "+value.d_alert+value.jednostka+"</p>"); 
                                }
                        	} else {
                        		//alert(value.wynik+" "+value.g_kryt+" "+value.d_kryt);
                            	collapsible=$('<div data-role="collapsible" data-collapsed-icon="check" data-expanded-icon="check"><h1>'+value.nazwa+'</h1></div>');
                        	}

                        $(collapsible).append(grid2_maker(["Wynik:","Data:"],[value.wynik+value.jednostka,value.data]));
                            $("#lista-badan-pacjenta").append($(collapsible));
                        });
                    } else {
                    	$("#lista-badan-pacjenta").append('<p>Brak przeprowadzonych badań</p>');
                    };
                    $("#lista-badan-pacjenta").collapsibleset( "refresh" );
                    //alert(JSON.stringify(data));


                    $('#lista-pacjentow #filtr-listy').val(''); // wyczyść filtr
                }

            );

}