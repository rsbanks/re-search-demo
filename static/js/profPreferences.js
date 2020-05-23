// drag and drop functionality inspired by https://www.youtube.com/watch?v=jfYWwQrtzzY

var prof_preference_list = []

function setup() {
   // on close icon clicked (prof_preference)
   document.addEventListener('click', function(e) {
      if (e.target.id === 'closeIconProfPrefence') {
         const value = e.target.getAttribute('data-item');
         const index = prof_preference_list.indexOf(value);
         prof_preference_list =
          [...prof_preference_list.slice(0, index), ...prof_preference_list.slice(index+1)];
         addProfs();
      }
   })

   $("#preference-form").on("submit", function() {
      if (document.activeElement.id === 'profSubmit') {
         submitPreferences()
         return false;
      }
   });

   $("#cancelProfSubmit").on("click", function() {
         window.close()
   });

   $("#closeModal").on("click", function() {
      window.close()
   });

   $("#submit_preferences_form").on("click", function() {
      const draggables = document.querySelectorAll('.prof_preference')
      prefList = getPreferenceList(draggables)

      url = '/profPreferences?'
      url += 'first=' + prefList[0]
      url += '&second=' + prefList[1]
      url += '&third=' + prefList[2]
      url += '&fourth=' + prefList[3]
      window.open(url)
      return false
   });

   $("#closeProfLimitAlert").on("click", function() {
      $('#profLimitAlert').hide('fade');
      return false;
   });

   $("#submissionSuccessAlertClose").on("click", function() {
      $('#submissionSuccessAlert').hide('fade');
      return false;
   });
}

function addProfPreference(name){
   if (!prof_preference_list.includes(name) && prof_preference_list.length < 8) {
      if (prof_preference_list.length >= 4) {
         prof_preference_list.unshift(name);
         $('#profLimitAlert').show('fade');
      } else {
         prof_preference_list.unshift(name);
      }
   }
   addProfs();
}

function createProfPreference(name) {
    const div = document.createElement('div')
    div.setAttribute('class', 'prof_preference')
    div.setAttribute('draggable', 'true')
    div.setAttribute('data-item', name)
    const span = document.createElement('span')
    span.innerHTML = name;
    const closeIcon = document.createElement('i')
    closeIcon.setAttribute('class', 'material-icons')
    closeIcon.setAttribute('id', 'closeIconProfPrefence')
    closeIcon.setAttribute('data-item', name)
    closeIcon.innerHTML = 'close';

    div.appendChild(span);
    div.appendChild(closeIcon);
    
    return div;
 }

// clear profs
function reset_profs() {
    document.querySelectorAll('.prof_preference').forEach(function(prof) {
       prof.parentElement.removeChild(prof)
    })
 }

 function addProfs() {
    reset_profs();
    prof_preference_list.slice().reverse().forEach(function(profname) {
       const input = createProfPreference(profname);
       $('#profPreferencesDiv').append(input)
    })

    const draggables = document.querySelectorAll('.prof_preference')
    const container = document.querySelector('.profPreferencesDiv')

    draggables.forEach(draggable =>{
      draggable.addEventListener('dragstart', () => {
         draggable.classList.add('dragging')
      })
      draggable.addEventListener('dragend', () => {
         draggable.classList.remove('dragging');
      })
    })

    container.addEventListener('dragover',e  => {
       e.preventDefault()
       const afterElement = getDragAfterElement(container, e.clientY)
       const draggable = document.querySelector('.dragging')
       if (afterElement == null) {
         container.appendChild(draggable)
       } else {
          container.insertBefore(draggable, afterElement)
       }
    })
 }

 function getPreferenceList(draggables) {
   var prefList = ['', '', '', '']

   var i = 0
   draggables.forEach(draggable =>{
      if (i==4) {
         return prefList
      }
      prefList[i] = String(draggable.getAttribute('data-item'))
      i++
   })

   return prefList

 }

 function getDragAfterElement(container, y) {
    draggableElements = [...container.querySelectorAll('.prof_preference:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
       const box = child.getBoundingClientRect()
       const offset = y - box.top - box.height/2
       if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
       }
       else {
          return closest
       }
    }, {offset: Number.NEGATIVE_INFINITY}).element
 }

 function submitPreferences() {

    var Advisor1 = $('.firstAdvisorChoice select').val();
    if (Advisor1 === null) {
       Advisor1 = ''
    }
    var Advisor2 = $('.secondAdvisorChoice select').val()
    if (Advisor2 === null) {
      Advisor2 = ''
    } 
    var Advisor3 = $('.thirdAdvisorChoice select').val()
    if (Advisor3 === null) {
      Advisor3 = ''
    }
    var Advisor4 = $('.fourthAdvisorChoice select').val()
    if (Advisor4 === null) {
      Advisor4 = ''
    }

    var Advisor1Comments = $('#firstAdvisorChoiceComments').val()
    var Advisor2Comments = $('#secondAdvisorChoiceComments').val()
    var Advisor3Comments = $('#thirdAdvisorChoiceComments').val()
    var Advisor4Comments = $('#fourthAdvisorChoiceComments').val()

    var courseSelection = $('#preference-form input:radio:checked').val()

    var url = '/submitPreferences?'
    url += 'Advisor1=' + Advisor1
    url += '&Advisor2=' + Advisor2
    url += '&Advisor3=' + Advisor3
    url += '&Advisor4=' + Advisor4

    url += '&Advisor1Comments=' + Advisor1Comments
    url += '&Advisor2Comments=' + Advisor2Comments
    url += '&Advisor3Comments=' + Advisor3Comments
    url += '&Advisor4Comments=' + Advisor4Comments

    url += '&courseSelection=' + courseSelection

    var request = null

    if (request != null)
         request.abort();
         request = $.ajax(
      {
         type: "GET",
         url: url,
         success: handleSubmit
      }
   );
 }

 function handleSubmit(response) {

   if (response === "Successful Add") {
      $('#modal-body').html('Professor preferences successfully submitted!')
      $('#successModal').modal()
   } else if (response === "Successful Update"){
      $('#modal-body').html('Professor preferences successfully updated!')
      $('#successModal').modal()  
   }  else {
      $('#submissionFailureAlert').show('fade');    
   }
 }

 $('document').ready(setup);
