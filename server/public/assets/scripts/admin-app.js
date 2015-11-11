$(document).ready(function(){
    $("#search").submit(function(event){
        event.preventDefault();
        var values = {};

        $.each($(this).serializeArray(), function(i, field){
            values[field.name] = field.value;
        });

        //findMessages(values);
    });

    $("#addMessageForm").submit(addMessage);
    $("#messageContainer").on('click', '.delete', deleteMessage);

    getData();
});

function getData(){
    $.ajax({
        type: "GET",
        url: "/data",
        success: function(data){
            updateDOM(data);
        }
    });
}

function addMessage(){
    event.preventDefault();
    var values = {};

    $.each($(this).serializeArray(), function(i, field){
        values[field.name] = field.value;
    });

    $.ajax({
        type: "POST",
        url: "/data",
        data: values,
        success: function(){
            getData();
            clearTheForm();
        }
    });
}

function deleteMessage(){
    var deletedId = {"id" : $(this).data("id")};

    $.ajax({
        type: "DELETE",
        url: "/data",
        data: deletedId,
        success: function(data){
            getData();

        }
    })
}
function clearTheForm(){
    $('#enterMessage').val("");
    $('#enterFirstName').val("");
}

function updateDOM(data){
    $("#messageContainer").empty();

    for(var i = 0; i < data.length; i++){
        var el = "<div class='message-container well'>" +
            "<div class='button-container'><button class='delete btn btn-danger' data-id='" +
            data[i].id + "'>X</button></div>" +
            "<p class='message-name'>" + data[i].name + "</p>" +
            "<p class='message-body'>" + data[i].message + "</p>" +

            "</div>";
        $("#messageContainer").append(el);
    }
}
