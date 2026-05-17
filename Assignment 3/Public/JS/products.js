document.onload(function(){
  var headerInput = document.querySelector('header .search-bar input.search-input');
  var form = document.getElementById('filterForm');
  var formInput = form && form.querySelector('input[name="search"]');
  if(headerInput && form && formInput){
    headerInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        formInput.value = headerInput.value;
        form.submit();
      }
    });
  }
});