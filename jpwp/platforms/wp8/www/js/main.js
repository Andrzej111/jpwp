$(document).ready(function(){
    $.support.cors = true;
	$.mobile.allowCrossDomainPages=true;	//jak potrzeba ładować zewnętrzne strony
	$.mobile.phonegapNavigationEnabled = true;
	$.ajaxSetup({
		timeout: 100000
	});

    console.log("Document Ready");
    $('a.wyslij-email').click(function () {
        if (window.plugin) {
            window.plugin.email.isServiceAvailable(function (isAvailable) {
                if (isAvailable) {
                    window.plugin.email.open({
                        to: ['pawel_szulc@onet.pl'],
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

	$(document).on("pagebeforeshow", "#lista-pacjentow", function () {
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
    					$(li).append($('<a>'+value.nazwisko+' '+value.imie+'</a>').attr('id',value.id));
    					$('#lista-pacjentow ul').append(li);
    				});
    				$('#lista-pacjentow ul').show();//listview('refresh')
    				$('#lista-pacjentow ul').listview('refresh');
    			}
    		}
    	);
	});      
});