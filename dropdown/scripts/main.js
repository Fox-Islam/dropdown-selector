//Create a pair of arrays containing the glyphs to be transcribed and the text to be displayed in the tooltip
var check = [];
var tool = [];

//Katakana characters
var katakanac = ["ア","イ","ウ","エ","オ","カ","キ","ク",
"ケ","コ","ガ","ギ","グ","ゲ","ゴ","サ","シ","ス","セ","ソ",
"ザ","ジ","ズ","ゼ","ゾ","タ","チ","ツ","テ","ト","ダ","ヂ",
"ヅ","デ","ド","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ",
"ホ","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ","マ",
"ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ",
"ワ","ヰ","ヱ","ヲ","ン","ャ","ュ","ョ","ァ","ィ","ゥ","ェ","ォ","ー","ッ"];
var katakanat = ["a","i","u","e","o","ka","ki","ku",
"ke","ko","ga","gi","gu","ge","go","sa","shi","su",
"se","so","za","ji","zu","ze","zo","ta","chi","tsu",
"te","to","da","ji","zu","de","do","na","ni","nu",
"ne","no","ha","hi","fu","he","ho","ba","bi","bu",
"be","bo","pa","pi","pu","pe","po","ma","mi","mu",
"me","mo","ya","yu","yo","ra","ri","ru","re","ro",
"wa","wi","we","o","n","ya","yu","yo","a","i","u",
"e","o","-","tsu"];
check = check.concat(katakanac);
tool = tool.concat(katakanat);

//Hiragana characters
var hiraganabasec = ["あ","い","う","え","お","か","き",
"く","け","こ","さ","し","す","せ","そ","た","ち","つ","て",
"と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま",
"み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ",
"わ","ゐ","ゑ","を","ん","が","ぎ","ぐ","げ","ご","ざ","じ",
"ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ",
"ぼ","ぱ","ぴ","ぷ","ぺ","ぽ","ゃ","ゅ","ょ","っ","ぁ","ぃ","ぅ","ぇ","ぉ","ゎ"];
var hiraganabaset = ["a","i","u","e","o","ka","ki",
"ku","ke","ko","sa","shi","su","se","so","ta","chi",
"tsu","te","to","na","ni","nu","ne","no","ha","hi",
"fu","he","ho","ma","mi","mu","me","mo","ya","yu",
"yo","ra","ri","ru","re","ro","wa","wi","we","wo",
"n","ga","gi","gu","ge","go","za","ji","zu","ze",
"zo","da","ji","zu","de","do","ba","bi","bu","be",
"bo","pa","pi","pu","pe","po","ya","yu","yo",
"tsu","a","i","u","e","o","wa"];
check = check.concat(hiraganabasec);
tool = tool.concat(hiraganabaset);

//Extra punctuation characters
//TODO add ["「","」","『",,"』",] which, for some reason, don't work
//TODO add ["ql","qr","qql","qqr"] to accompany ^
var punctuationc = ["、","。","…","・",
"〜","：","！","？","♪",
"【","】","［","］","（","）","｛","｝"];
var punctuationt = [",",".","..."," ",
"~",":","!","?","note",
"ll","lr","sl","sr","pl","pr", "cpl","cpr"];
check = check.concat(punctuationc);
tool = tool.concat(punctuationt);

//Initialise variables
var inputTextValue;             //contains text in the input field
var toCheck = 0;                //determines when to check for string matches
var position;                   //character position in input field immediately after '/'
var checkString;                //pulls string from input text to be checked for matches
var toBeReplaced;               //text string to be replaced in input field
var toReplaceWith;              //character to replace text string in input field
var numOfChoices = 0;           //number of available matching characters
var dropdownPos = 0;            //inc/dec when pressing up/down to scroll through choices

//Handle key presses 
window.onkeyup = keyup;
function keyup(e) {
    //Reading the input text
    inputTextValue = e.target.value;
  
    //Type '/' to start matching the following input to the list 
    if (e.keyCode == 191) {
        position = inputTextValue.length;
        toCheck = 1;
        dropdownPos = 0;
    };

    //Press backspace
    if (e.keyCode == 8){
        toCheck -= 2;
        dropdownPos = 0;
    };    
    
    //After '/' is typed
    if (toCheck > 0){
        $(".dropdown-content")[0].setAttribute("style","display:inline-block;");
        checkString = inputTextValue.substr(position,position+toCheck);
        toBeReplaced = "/" + checkString;
        
        resOfLookUp = stringLookup(checkString);
        numOfChoices = resOfLookUp.length
        
        if (dropdownPos > (numOfChoices - 1)){
            dropdownPos = 0;
        };
        toReplaceWith = resOfLookUp[dropdownPos];
        
        
        if (typeof(toReplaceWith) == 'undefined'){
            toReplaceWith = "";
            $(".dropdown-content").text(toReplaceWith);
        }else{
            var displayString = toReplaceWith + " (" + (dropdownPos+1) + " of " + numOfChoices + ")";
            $(".dropdown-content").text(displayString);
        }
        toCheck += 1;
    };
    
    //Press enter
    if (e.keyCode == 13){
        inputTextValue = inputTextValue.replace(new RegExp(toBeReplaced + '$'), toReplaceWith);
        e.target.value = inputTextValue;
        $(".dropdown-content")[0].setAttribute("style","display:none;");
        $("searchTxt").focus;
        toCheck = 0;
        dropdownPos = 0;
    };
  
    //When the post-'/' string gets too long don't bother with further lookup
    if (toCheck > 8){
        $(".dropdown-content")[0].setAttribute("style","display:none;");
        toCheck = 0;
        dropdownPos = 0;
    };
};

//Check if the typed string has any match in the list of pronunciations
function stringLookup(inputString){
    var values = [];
    if (inputString.length == 0){
        return values;
    };
    for(var j = 0;j < check.length; j++){
        if (inputString == tool[j].substr(0,inputString.length)){
            values = values.concat(check[j]);
        };
    };
    return values;
};


//Handle up and down key presses to iterate through choices
window.onkeydown = keydown;
function keydown(e){
      //Press up arrow
    if (e.keyCode == 38){
        toCheck -= 1;
        if (dropdownPos > 0){
            dropdownPos -= 1; 
        }else if (dropdownPos == 0){
            dropdownPos = numOfChoices - 1;
        };
    };

    //Press down arrow
    if (e.keyCode == 40){
        toCheck -= 1;
        if (dropdownPos < (numOfChoices - 1)){
            dropdownPos += 1;      
        }else if (dropdownPos == (numOfChoices - 1)){
            dropdownPos = 0;
        };
    };
};