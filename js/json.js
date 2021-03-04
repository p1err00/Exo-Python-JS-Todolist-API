var card = document.getElementById("tableContent");
var modify = false;

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open("GET", "http://127.0.0.1:5000/todolist", true);
oReq.send();

function reqListener(){
    
    var json = JSON.parse(this.response);
    json.forEach(element => {
        card.innerHTML += "<tr id=\"row"+ element[0] +"\" class=\"rowRow\" >" +
                                "<td>" + element[0] + "</td>" +
                                "<td>" + element[1] + "</td>" +
                                "<td>" + element[2] + "</td>" +
                                "<td>" + element[3] + "</td>" +
                                "<td>" + 
                                "<input type=\"checkbox\" class=\"custom-control-input\" id=\"customCheck"+element[0]+"\" name=\"customCheck"+element[0]+"\" onchange=\"checkClick("+ element[0] +")\">"+
                                                                "<label class=\"custom-control-label\" for=\"customCheck"+element[0]+"\">Do</label>"+
                                "</td>" +
                                "<td><button name=\"update\" onclick=\"modifyTodo("+ element[0] +")\">Modify</button></td>" +
                                "<td><button name=\"delete\" onclick=\"deleteTodo("+ element[0] +")\">Delete</button></td>" +
                            "</tr>"
        card.style.background="#ffacac";
    });
}

function aze(){

    var json = this.response;
    var x = document.getElementById("row"+json[0]);

    //Load json table

    if(json[4] == 0){
        x.style.background = "#b6ffac";

        todo = {
            "title" : json[1],
            "desc" : json[2],
            "deadline" : json[3],
            "done" : 1
        }
            
    } else {
        x.style.background = "#ffacac";
        todo = {
            "title" : json[1],
            "desc" : json[2],
            "deadline" : json[3],
            "done" : 0
        }
    }

    //Send request
    var oReq = new XMLHttpRequest();
    oReq.open("PUT", "http://127.0.0.1:5000/todolist/"+json[0], true);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send(JSON.stringify(todo));
    
}

function checkClick(id){

    //Request to know if todo is done
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "http://127.0.0.1:5000/todolist/"+id, true);
    oReq.responseType = 'json';
    oReq.onload = aze;
    oReq.send();
      
}

function deleteTodo(id){
    var x = document.getElementById("row"+id);
    alert(id);
    var oReq = new XMLHttpRequest();
    oReq.open("DELETE", "http://127.0.0.1:5000/todolist/"+id, true);    
    oReq.send();
}


//Submit to add new todo
function changeSubmit(id){

    //Create table with value to parse it into json
    var id = document.getElementById("hiddenId").value;
    var title = document.getElementById("titleId").value;
    var desc = document.getElementById("descId").value;
    var deadline = document.getElementById("d").value + "." + document.getElementById("m").value + "." + document.getElementById("y").value;

    todo = {
        "title" : title,
        "desc" : desc,
        "deadline" : deadline,
        "done" : 0
    }
    if(modify == false){
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.open("POST", "http://127.0.0.1:5000/todolist/post", true);
        oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        oReq.send(JSON.stringify(todo));

        } else if (modify == true){

        //alert(this.response);
        //Send request
        var oReq = new XMLHttpRequest();
        oReq.open("PUT", "http://127.0.0.1:5000/todolist/"+id, true);
        oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        oReq.send(JSON.stringify(todo));
        modify = false;

    } else {
        alert(modify + " not declared");
    }

}

//If update button is clicked

function modifyTodo(id){
    if(id != 0){

        //Update request
        var oReq = new XMLHttpRequest();
        oReq.open("GET", "http://127.0.0.1:5000/todolist/"+id, true);
        oReq.responseType = 'json'
        oReq.onload = function (id){
            var json = this.response;
            modify = true;
;

            //Fill post container with todo value2
            document.getElementById("hiddenId").value = json[0];
            document.getElementById("titleId").value = json[1];
            document.getElementById("descId").value = json[2];
            document.getElementById("d").value = json[3][0] + json[3][1];
            document.getElementById("m").value = json[3][3] + json[3][4];
            document.getElementById("y").value = json[3][6] + json[3][7] + json[3][8] + json[3][9];
            
        };
        oReq.send();

    }
}



function changeSelect(id){
    alert(id);
    
}

function onLoadSelect(){

    //Fill select for UPDATE function
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "http://127.0.0.1:5000/todolist", true);
    oReq.responseType = 'json';
    oReq.onload = fillSelect;
    oReq.send();

}

function fillSelect(){

    var json = this.response;
    
    
}

