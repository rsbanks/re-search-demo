function setup() {
    $("#searchInputForm").on("submit", function() {
        getProf();
        return false;
    });

    $("#confirmDelete").on("click", function() {
        deleteProf();
        $('#deleteProfModal').modal('hide')
     });

     document.addEventListener('click', function(e) {
        if (e.target.id === 'removeIcon') {
           const netid = e.target.getAttribute('data-item');
           document.getElementById("deleteAdminModal").setAttribute("data-item", netid)
           $("#deleteAdminModalBody").html("Are you sure you want to delete the admin with netid '"
               + e.target.getAttribute("data-item") + "' ?")
            $("#deleteAdminModal").modal()
        }
     })

     $("#confirmDeleteAdmin").on("click", function() {
        const netid = document.getElementById("deleteAdminModal").getAttribute('data-item');
        removeAdmin(netid)
     });

     $('body').on('shown.bs.modal', '#addAdminModal', function () {
        $('input:visible:enabled:first', this).focus();
    })

}

function handleResponse(response)
{ 
    if (response === '') {
        document.getElementById('profResult').innerHTML = null;
        $('#addNewProfModalBody').html('No such professor.' +
        ' Would you like to create a professor with netid \'' + 
           $('#netidSearch').val() + '\' ?')
        $('#addNewProfModal').modal()

        $("#yesCreateProf").on("click", function() {
            createNewProf();
         });
    } 
    
    else {
        document.getElementById('profResult').innerHTML = response;
        
        $("#file").change(function(){
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function (e) {
                    $('#profImageDisplay').attr('src', e.target.result);
                }
                
                reader.readAsDataURL(this.files[0]);

                this.form.submit();

            }
        });

        $("#saveForm").on("submit", function() {
            if (document.activeElement.id == 'Save') {
                displayProf();
            } else if(document.activeElement.id == 'Cancel') {
                $('#netidSearch').focus();
                document.getElementById('profResult').innerHTML = null;
            } else if(document.activeElement.id == 'Delete') {
                $('#deleteProfModalBody').html('Are you sure you want to delete'  +
                ' the professor with netid \'' + $('#netidSearch').val() + '\' ?')
                $('#deleteProfModal').modal()
            }
                return false;
        });

    }

}

function handleResponseDisplay(response)
{ 
    $('#successProfUpdateModal').modal();
    document.getElementById('profResult').innerHTML = response;

    $("#editOtherForm").on("submit", function() {
        document.getElementById('profResult').innerHTML = null;
        $('#netidAlertSuccess').hide('fade');
        $('#netidSearch').focus();
        return false;
    });
}

function handleDelete() 
{
    $('#successProfDeleteModal').modal();
    document.getElementById('profResult').innerHTML = null;
}

function handleGetPreferences(response) 
{
   console.log("Download request recieved");
   download("preferences.csv", response);
}

function handleGetMatches(response) 
{
   console.log("Download request recieved");
   download("matches.csv", response);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

let request = null;

function getProf()
{   
   let netid = $('#netidSearch').val();
   let url = '/profinfo?netid=' + netid

   if (request != null)
      request.abort();
   request = $.ajax(
      {
         type: "GET",
         url: url,
         success: handleResponse
      }
   );
}

function displayProf()
{   
   let netid = $('#netid').val();
   let url = '/displayprof?netid=' + netid;
   url += '&title=' + $('#title').val()
   url += '&firstname=' + $('#firstname').val()
   url += '&lastname=' + $('#lastname').val()
   url += '&email=' + $('#email').val()
   url += '&phone=' + $('#phone').val()
   url += '&website=' + $('#website').val()
   url += '&rooms=' + $('#rooms').val()
   url += '&department=' + $('#department').val()
   url += '&areas=' + $('#areas').val()
   url += '&bio=' + $('#bio').val()
   url += '&image=' + $('#file').val()

   if (request != null)
      request.abort();
   request = $.ajax(
      {
         type: "GET",
         url: url,
        success: handleResponseDisplay
      }
   );
}

function deleteProf() 
{
    url = '/deleteprof?netid=' + $('#netid').val();
    if (request != null)
        request.abort();
    request = $.ajax(
        {
            type: "GET",
            url: url,
            success: handleDelete
        }
    );
}

function getPreferences() 
{
    url = '/getPreferences';
    if (request != null)
        request.abort();
    request = $.ajax(
        {
            type: "GET",
            url: url,
            success: handleGetPreferences
        }
    );
}

function getMatches() 
{
    url = '/getMatches';
    if (request != null)
        request.abort();
    request = $.ajax(
        {
            type: "GET",
            url: url,
            success: handleGetMatches
        }
    );
}

function handleGetAdmins(response) {
    const admins = response.split(",")

    // clear existing list first
    document.getElementById("manageAdminsDiv").innerHTML = null

    heading = document.createElement('h4')
    heading.innerHTML = "Current Admins"

    const ul = document.createElement('ul')
    ul.setAttribute("class", "list-group")
    ul.setAttribute("id", "adminsList")

    // one admin has to be uneditable
    const li = document.createElement('li')
    li.setAttribute("class", "list-group-item disabled")
    li.setAttribute("aria-disabled", "true")
    li.innerHTML = admins[0]
    ul.appendChild(li)

    for (i = 1; i < admins.length; i++) {
        const li = document.createElement('li')
        li.setAttribute("class", "list-group-item")
        li.innerHTML = admins[i]

        const removeIcon = document.createElement('span')
        removeIcon.setAttribute('class', 'material-icons')
        removeIcon.setAttribute('id', 'removeIcon')
        removeIcon.setAttribute('data-item', admins[i])
        removeIcon.innerHTML = 'remove_circle';

        li.appendChild(removeIcon)
        ul.appendChild(li)
    }

    addButton = document.createElement('button')
    addButton.setAttribute("type", "button")
    addButton.setAttribute("class", "list-group-item list-group-item-action active btn-secondary")
    addButton.setAttribute("data-toggle", "modal")
    addButton.setAttribute("data-target", "#addAdminModal")
    addButton.innerHTML = "Add Admin"
    ul.appendChild(addButton)

    document.getElementById("manageAdminsDiv").appendChild(heading)
    document.getElementById("manageAdminsDiv").appendChild(ul)
}

function viewAdmins ()
{      
    url = '/getAdmins'
    if (request != null)
    request.abort();
    request = $.ajax(
    {
        type: "GET",
        url: url,
        success: handleGetAdmins
    });

}

function handleAddNewAdmin(response) {
    error_statement = response

    if (error_statement === '') {
        $(addAdminSuccessModal).modal()
        viewAdmins()
    }
}

function addNewAdmin() {
    $(addAdminModal).modal('hide')
    netid = $("#newNetidInput").val()
    if (netid.length < 2 || netid.length > 8) {
        $("#invalidNetidModal").modal()
    } 
    else {
        url = '/addNewAdmin?netid=' + netid
        if (request != null)
        request.abort();
        request = $.ajax(
        {
            type: "GET",
            url: url,
            success: handleAddNewAdmin
        });
    }
}

function removeAdmin (netid)
{
    url = '/removeAdmin?netid=' + netid 
    if (request != null)
    request.abort();
    request = $.ajax(
    {
        type: "GET",
        url: url,
        success: handleRemoveAdmin
    });
}

function handleRemoveAdmin(response) {
    error_statement = response
    $("#deleteAdminModal").modal('hide')

    if (error_statement === '') {
        $("#deleteAdminSuccessModal").modal()
    }
    viewAdmins() 
}


function handleNewProf(response) {

    document.getElementById('profResult').innerHTML = response;

    $("#file").change(function(){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#profImageDisplay').attr('src', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);

            this.form.submit();
        }
    });

    $('#addNewProfModal').modal('hide')
    $('#newProfAddedModalBody').html('Professor \'' + $('#netidSearch').val() +
        '\' has been added. Please update their information below.'
     )
    $('#newProfAddedModal').modal()


    $("#saveForm").on("submit", function() {
        if (document.activeElement.id == 'Save') {
            displayProf();
        } else if(document.activeElement.id == 'Cancel') {
            $('#netidSearch').focus();
            document.getElementById('profResult').innerHTML = null;
        } else if(document.activeElement.id == 'Delete') {
            $('#deleteProfModalBody').html('Are you sure you want to delete'  +
            ' the professor with netid \'' + $('#netidSearch').val() + '\' ?')
            $('#deleteProfModal').modal()
        }
            return false;
    });

}


function createNewProf()
{   
   let netid = $('#netidSearch').val();
   let url = '/displayNewProf?netid=' + netid;
   url += '&title=' + ''
   url += '&firstname=' + ''
   url += '&lastname=' + ''
   url += '&email=' + ''
   url += '&phone=' + ''
   url += '&website=' + ''
   url += '&rooms=' + ''
   url += '&department=' + ''
   url += '&areas=' + ''
   url += '&bio=' + ''
   url += '&image=' + ''

   if (request != null)
      request.abort();
   request = $.ajax(
      {
         type: "GET",
         url: url,
        success: handleNewProf
      }
   );
}

$(document).ready(setup)