$(document).ready(function(){
    $.support.cors = true;
	$.mobile.allowCrossDomainPages=true;	//jak potrzeba ładować zewnętrzne strony
	$.mobile.phonegapNavigationEnabled = true;
	// $.ajaxSetup({
	// 	timeout: 100000
	// });

    console.log("Document Ready");


    // guziki z klasą wyslij-email będą wysyłały email (wow!) na adres zawarty w atrybucie mail (niewiarygodne!) 
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

    sort_ul("#lista-pacjentow ul");


    // wczytuje listę pacjentów z serwera
	$(document).on("pageshow", "#lista-pacjentow", function () {
        $('#lista-pacjentow #filtr-listy').val('');
		$('#lista-pacjentow ul').children().hide();
    	$('#lista-pacjentow ul').children().remove();
    	$('#lista-pacjentow ul').append('<p style="text-align:center;">Wczytuję listę pacjentów...</p>');
    	$.getJSON('http://pluton.kt.agh.edu.pl/~pszulc/jpwp/get_pacjenci.php',
    		function(data){
    			$('#lista-pacjentow ul').children().remove();
    			if (data.err){
    				alert(data.err);
    			} else {
    				$.each(data,function(index,value){
    					var filter=value.nazwisko+" "+value.imie+" "+value.pesel;
    					var li=$('<li data-filtertext="'+filter+'"></li>');
                        //$(li).attr('id',value.id);
                        $(li).append($('<a href="#dane">' + value.nazwisko + ' ' + value.imie + '</a>').attr('pacjent-id', value.id));
                        $(li).attr('pacjent-id', value.id);
                        $(li).click(function(){
                            var id=$(this).attr('pacjent-id');
                            wyswietl_dane(id);
                        });
    					$('#lista-pacjentow ul').append(li);
    				});
    				$('#lista-pacjentow ul').show();
    				$('#lista-pacjentow ul').listview('refresh');
    			}
    		}
    	);//koniec tworzenia listy pacjentów

	});     

    $(document).on("pageshow", "#lista-krytyczna", function () {
        $.getJSON('http://pluton.kt.agh.edu.pl/~pszulc/jpwp/lista_krytyczna.php',
            function(data){
                $("#ul-krytyczna").html('');
                $.each(data,function(index,value){
                    var collapsible={};
                    collapsible=$('<li data-theme="c"><a href="#historia-badan" data-icon="alert" dataiconpos="left">'+value.nazwisko+" "+value.data+'</a></li>');
                    $(collapsible).attr('pacjent-id',value.id);
                    $(collapsible).click(function(){
                        var id=$(this).attr('pacjent-id');
                        wyswietl_dane(id);
                    });
                    $('#ul-krytyczna').append($(collapsible));

                });
                $("#ul-krytyczna").listview('refresh');
            }

        );
    }); 

    $('#dodaj-wynik-button').click(function(){
        //alert($("#dane").attr('pacjent-id'));
        var id=$("#dane").attr('pacjent-id');
        //$('#wpisz-wynik').attr('id',id);
        $("#wpisz-wynik-id").val(id);
        $.getJSON('http://pluton.kt.agh.edu.pl/~pszulc/jpwp/get_badania.php',
            function(data){
                $.each(data,function(index,value){
                    var option={};
                    option=$('<option value='+value.id+'>'+value.nazwa+" ["+value.jednostka+']</a></li>');
                    $('#wpisz-wynik-badanie').append($(option));
                });
            }

        );

    });

    $("#wpisz-wynik-badanie").change(function(){
        var tekst=$("#wpisz-wynik-badanie :selected").text();
        var jednostka=tekst.replace(/.*?\[/,"[");
         $('label[for="wpisz-wynik-wartosc"]').text("Wpisz wynik "+jednostka);
    });

    $('form#wpisz-wynik-form').on("submit",function(event){
        event.preventDefault();
        alert($("#wpisz-wynik-wartosc").val());
        $.post("http://pluton.kt.agh.edu.pl/~pszulc/jpwp/wpisz_wynik.php",
            {
            'wpisz-wynik-id':$("#wpisz-wynik-id").val(),
            'wpisz-wynik-badanie':$("#wpisz-wynik-badanie").val(),
            'wpisz-wynik-wartosc':$("#wpisz-wynik-wartosc").val()
            },
             function(data){
                if (data.err){alert(data.err);} else {
                    alert(data.sukces);
                }    
            },
            "json"  
        );
    });
        
    $('form#nowy-pacjent-form').on("submit",function(event){
        event.preventDefault();
        //alert($("#wpisz-wynik-wartosc").val());
        $.post("http://pluton.kt.agh.edu.pl/~pszulc/jpwp/nowy_pacjent.php",
            {
            'imie':$("#nowy-pacjent-imie").val(),
            'nazwisko':$("#nowy-pacjent-nazwisko").val(),
            'pesel':$("#nowy-pacjent-pesel").val(),
            'plec':$("#nowy-pacjent-plec").val(),
            'tel':$("#nowy-pacjent-tel").val(),
            'email':$("#nowy-pacjent-email").val()
            },
             function(data){
                if (data.err){alert(data.err);} else {
                    alert(data.sukces);
                }    
            },
            "json"  
        );
    });

    //  $(document).on("pageshow", "#wpisz-wynik", function () {
        
    // }); 
});