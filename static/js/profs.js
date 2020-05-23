function setup()
{
   $('#nameNetid').focus();
   $('#searchInput').on('input', getResults);

   // Do not refresh page when enter key is pressed
   $('#searchInput').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13') {
         event.preventDefault();
      }
  });

   let request = null

   // show all profs on load
   let url = '/searchResults'
   if (request != null)
      request.abort();
   request = $.ajax(
      {
         type: "GET",
         url: url,
         success: handleResponse
      }
   );

   // on enter key pressed in Research Area form
   $('#tagInput').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13') {
         label = strip_html_tags($('#newTagInput').val())
         if (label.length != 0) {
            if (!tags.includes(label)) {
               tags.push(label);
               addTags();
               getResults();
            }
            $('#newTagInput').val("");
         }
      }
  });

  // on close icon clicked (tag)
  document.addEventListener('click', function(e) {
   if (e.target.id === 'closeIcon') {
      const value = e.target.getAttribute('data-item');
      const index = tags.indexOf(value);
      tags = [...tags.slice(0, index), ...tags.slice(index+1)];
      addTags();
      getResults();
   }
})

}

function handleResponse(response)
{ 
   document.getElementById('results').innerHTML = response;
}

request = null

function getResults()
{   
   let name_netid = $('#nameNetid').val();
   let url = '/searchResults?nameNetid=' + name_netid

   if (tags.length != 0) {
      url += '&area=';
      tags.forEach(function(tag) {
         url += tag + ",";
      })
      url = url.slice(0, url.length-1);
   }

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

// Stripping tags from: https://www.w3resource.com/javascript-exercises/javascript-string-exercise-35.php

function strip_html_tags(str)
{
   if ((str===null) || (str===''))
       return false;
  else
   str = str.toString();
  return str.replace(/<[^>]*>/g, '');
}

var tags = [];

function createTag(label) {
   const div = document.createElement('div');
   div.setAttribute('class', 'tag');
   const span = document.createElement('span');
   span.innerHTML = label
   const closeIcon = document.createElement('i');
   closeIcon.setAttribute('class', 'material-icons');
   closeIcon.setAttribute('id', 'closeIcon')
   closeIcon.setAttribute('data-item', label)
   closeIcon.innerHTML = 'close';

   div.appendChild(span);
   div.appendChild(closeIcon);
   
   return div;
}

// clear tags
function reset() {
   document.querySelectorAll('.tag').forEach(function(tag) {
      tag.parentElement.removeChild(tag);
   })
}

function addTags() {
   reset();
   tags.slice().reverse().forEach(function(tag) {
      const input = createTag(tag);
      $('#tag-input-div').prepend(input);
   })
}

function collapse(id) {
   let panel = document.getElementById("panel-" + id)
   let img = document.getElementById("img-" + id)
   if (panel.style.maxHeight){
       panel.style.maxHeight = null;
       panel.style.marginBottom = null;
       img.src = "static/images/arrow_down.png"
   } else {
       panel.style.maxHeight = panel.scrollHeight + "px";
       panel.style.marginBottom = "1%";
       img.src = "static/images/arrow_up.png"
   }
}


$('document').ready(setup);