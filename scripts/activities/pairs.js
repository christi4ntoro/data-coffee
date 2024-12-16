var y, ny, rotYINT;
var bc;
var c1, c2, cc1, cc2;
var numcarta;
var y1, y2;
var cinicial;
var indicefila, indicecolumna;
var arraya;
var arrayb;
var arrayc;
var arrayd;

$(function() {

    y = "", ny = 0;
    bc = false;
    c1 = "";
    c2 = "";
    cc1 = "";
    cc2 = "";
    numcarta = 0;
    y1 = "";
    y2 = "";
    cinicial = 0;
    arraya = [];
    arrayb = [];
    arrayc = [];
    arrayd = [];

    clearInterval(rotYINT);

    indicefila = $(".indicefila").children().size();
    indicecolumna = $(".indicecolumna").children().size();

    for (var i = 0; i <= (indicecolumna / 2) - 1; i++) {
        arraya[i] = String(i + 1);
        arrayb[i] = (i + 1) + 'a';
    };

    arrayc = arraya.concat(arrayb);
    arrayd = aleatorioDesorden(arrayc);

    $(".indicecolumna").children().each(function(i, e) {
        $(this).data('indice', arrayd[i]);
        $(this).attr('id', 'carta' + (i + 1));
        $(this).children().attr("src", "images/"+baseImg);
    });

    $('.carta').each(function() {
        this.addEventListener('click', eCarta)
    });
});

function eCarta(event) {

    y = document.getElementById($(this).attr('id'));
    clearInterval(rotYINT);

    $('.carta').each(function() {
    this.removeEventListener('click', eCarta)
    });

    $(this).removeClass('carta');
    $(this).addClass('cartai');

    y.removeEventListener('click', eCarta);

    if (numcarta == 0)
    {
    c1 = String($(this).data('indice')).substr(0, 1);
    cc1 = $(this);
    y1 = document.getElementById($(this).attr('id'));
    numcarta = 1;
    }
    else
    {
    c2 = String($(this).data('indice')).substr(0, 1);
    cc2 = $(this);
    y2 = document.getElementById($(this).attr('id'));
    numcarta = 2;
    }

    rotYINT = setInterval("startYRotate()", 1);
    event.preventDefault();
}

function startYRotate(elemento) {

    if (!bc)
        ny = ny + 1;
    else
        ny = ny - 1;

    y.style.transform = "rotateY(" + ny + "deg)";
    y.style.webkitTransform = "rotateY(" + ny + "deg)";
    y.style.OTransform = "rotateY(" + ny + "deg)";
    y.style.MozTransform = "rotateY(" + ny + "deg)";

    if (ny == 90) {
        bc = true;
        $(y).children().attr("src", "images/"+imgsPref+"" + $(y).data('indice') + ".svg");
        } if (ny == 0) {
        bc = false;
        clearInterval(rotYINT);
        if (numcarta == 1)
        $('.carta').each(function() {
        this.addEventListener('click', eCarta)
        });
        if (numcarta == 2) {

        if (c1 == c2) {
        cinicial += 1;

        if (cinicial < (indicecolumna / 2)) {

        main.audioPlay("#correct_sound");

        setTimeout(goodTime, 1500);

        function goodTime() {
        $("#bien").fadeTo("fast", 1);
        }

        }
        else {
        $("#final_feed").fadeTo("fast", 1);
        main.audioPlay("#correct_sound");
        $(".x-next").show();

        console.log("culminó parejas")

        }
        $('.carta').each(function() {
        this.addEventListener('click', eCarta)
        });
        } else {
        $(cc1).removeClass('cartai');
        $(cc1).addClass('carta');
        $(cc2).removeClass('cartai');
        $(cc2).addClass('carta');

        // $("#mal").fadeTo("fast", 1);
        //playAudio('sound-wrong');
        main.audioPlay("#incorrect_sound");

        setTimeout(badTime, 1500);

        function badTime() {
        rotYINT = setInterval("devuelveAnima()", 1);
        }                        
        }
        numcarta = 0;
        }
    }
}

function devuelveAnima()
{
if (!bc)
ny = ny + 1;
else
ny = ny - 1;

$(y1).css('transform', 'rotateY(' + ny + 'deg)');
$(y1).css('webkitTransform', 'rotateY(' + ny + 'deg)');
$(y1).css('OTransform', 'rotateY(' + ny + 'deg)');
$(y1).css('MozTransform', 'rotateY(' + ny + 'deg)');


y2.style.transform = "rotateY(" + ny + "deg)";
y2.style.webkitTransform = "rotateY(" + ny + "deg)";
y2.style.OTransform = "rotateY(" + ny + "deg)";
y2.style.MozTransform = "rotateY(" + ny + "deg)";

if (ny == 90) {
bc = true;
$(y1).children().attr("src", "images/"+baseImg);
$(y2).children().attr("src", "images/"+baseImg);
} if (ny == 0) {
bc = false;
$('.carta').each(function() {
this.addEventListener('click', eCarta)
});
clearInterval(rotYINT);
}
}

//////////////////////////////////////////////////////////////////////////////urly
function aleatorioDesorden(ar)
{
var arrAux = [];
var arrFin = [];
var aleatorio = 0;
for (var i = 0; i < ar.length; i++)
{
aleatorio = Math.ceil(ar.length * Math.random());
for (var j = 0; j <= i; j++)
{
while (aleatorio == arrAux[j])
{
j = 0;
aleatorio = Math.ceil(ar.length * Math.random());
}
}
arrAux[i] = aleatorio;
arrFin[aleatorio - 1] = ar[i];
}
return (arrFin);
}
