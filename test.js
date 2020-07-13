function encode(s){
    return s.split("-").map(function(a,b,c){
        return a.split(/(\w{4})/).filter(Boolean).map(function(aa,bb,cc){
            return  String.fromCharCode(parseInt(aa, 16))
        }).join("");
    }).join("|");
}


function decode(s){
    return s.split("|").map(function(a){
        return a.split("").map(function(aa){return String("0"+aa.charCodeAt(0).toString(16)).slice(-4) }).join("")
    }).join("-");
}



var guid = "0a0a8907-40b9-4e81-8c4d-d01af26efb78"; //36 chars
var encoded=encode(guid); //=== "ਊ複|䂹|亁|豍|퀚ﭸ"
var guid2=decode(encoded);

var tmp = encode('5bbcab5f9099fc012e63362b');
var tmp2 = decode(tmp);
console.log(JSON.stringify(tmp));
console.log(tmp2);
console.log(tmp2 == '5bbcab5f9099fc012e63362b');